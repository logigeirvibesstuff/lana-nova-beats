import { NextResponse } from "next/server";
import { beats as staticBeats } from "@/data/beats";
import { licenseTiers } from "@/data/licenses";
import { createPayPalOrder } from "@/lib/paypal";
import { db } from "@/lib/db";
import type { LicenseTierId } from "@/types/beat";

interface IncomingItem {
  beatId: string;
  licenseTierId: LicenseTierId;
  quantity: number;
}

export async function POST(req: Request) {
  const body = (await req.json()) as { items?: IncomingItem[]; cartTotal?: number };

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
    return NextResponse.json({ error: "Cart is empty or invalid." }, { status: 400 });
  }

  // Look up any beats not in static file from the DB
  const beatIds = body.items.map((i) => i.beatId);
  const missingIds = beatIds.filter((id) => !staticBeats.find((b) => b.id === id));
  const dbBeats = missingIds.length > 0
    ? await db.beat.findMany({ where: { id: { in: missingIds } } })
    : [];

  const validatedItems = body.items.map((item) => {
    const beat = staticBeats.find((b) => b.id === item.beatId)
      ?? dbBeats.find((b) => b.id === item.beatId) as any;
    const license = licenseTiers.find((l) => l.id === item.licenseTierId);
    if (!beat || !license) return null;
    return {
      beatId: beat.id,
      licenseId: license.id,
      name: `${beat.title} – ${license.name}`,
      unitAmount: license.price,
    };
  }).filter(Boolean) as { beatId: string; licenseId: string; name: string; unitAmount: number }[];

  if (!validatedItems.length) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
  }

  const subtotal = validatedItems.reduce((s, i) => s + i.unitAmount, 0);
  const cartTotal = typeof body.cartTotal === "number"
    ? Math.min(Math.max(body.cartTotal, 1), subtotal)
    : subtotal;

  let distributed = 0;
  const finalItems = validatedItems.map((item, i) => {
    const isLast = i === validatedItems.length - 1;
    const amount = isLast
      ? parseFloat((cartTotal - distributed).toFixed(2))
      : parseFloat(((item.unitAmount / subtotal) * cartTotal).toFixed(2));
    distributed += amount;
    return { ...item, amount };
  });

  try {
    const order = await createPayPalOrder(finalItems);
    return NextResponse.json({
      orderId: order.id,
      items: finalItems.map(({ beatId, licenseId, amount }) => ({
        beatId,
        licenseId,
        unitAmount: amount,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Unable to create PayPal order." }, { status: 500 });
  }
}
