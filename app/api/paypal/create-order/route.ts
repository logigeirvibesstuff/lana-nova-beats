import { NextResponse } from "next/server";
import { beats } from "@/data/beats";
import { licenseTiers } from "@/data/licenses";
import { createPayPalOrder } from "@/lib/paypal";
import type { LicenseTierId } from "@/types/beat";

interface IncomingItem {
  beatId: string;
  licenseTierId: LicenseTierId;
  quantity: number;
}

export async function POST(req: Request) {
  const body = (await req.json()) as { items?: IncomingItem[] };

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
    return NextResponse.json({ error: "Cart is empty or invalid." }, { status: 400 });
  }

  const validatedItems = body.items
    .map((item) => {
      const beat = beats.find((b) => b.id === item.beatId);
      const license = licenseTiers.find((l) => l.id === item.licenseTierId);
      if (!beat || !license) return null;

      return {
        beatId: beat.id,
        licenseId: license.id,
        name: `${beat.title} – ${license.name}`,
        amount: license.price,
        unitAmount: license.price,
      };
    })
    .filter(Boolean) as {
    beatId: string;
    licenseId: string;
    name: string;
    amount: number;
    unitAmount: number;
  }[];

  if (!validatedItems.length) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
  }

  try {
    const order = await createPayPalOrder(validatedItems);
    return NextResponse.json({
      orderId: order.id,
      items: validatedItems.map(({ beatId, licenseId, unitAmount }) => ({
        beatId,
        licenseId,
        unitAmount,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Unable to create PayPal order." }, { status: 500 });
  }
}
