import { NextResponse } from "next/server";
import { beats } from "@/data/beats";
import { licenseTiers } from "@/data/licenses";
import { createPayPalOrder } from "@/lib/paypal";
import { db } from "@/lib/db";
import type { LicenseTierId } from "@/types/beat";

interface IncomingItem {
  beatId: string;
  licenseTierId: LicenseTierId;
  quantity: number;
}

const FIRST_PURCHASE_DISCOUNT = 0.5; // 50% off

export async function POST(req: Request) {
  const body = (await req.json()) as { items?: IncomingItem[]; applyFirstDiscount?: boolean };

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

  // Apply first-purchase discount if requested
  // We verify there are no prior completed orders in the DB at capture time,
  // but we apply it now since we don't have the email yet.
  let discountApplied = false;
  let finalItems = validatedItems;

  if (body.applyFirstDiscount) {
    discountApplied = true;
    finalItems = validatedItems.map((item) => ({
      ...item,
      amount: parseFloat((item.amount * (1 - FIRST_PURCHASE_DISCOUNT)).toFixed(2)),
      unitAmount: parseFloat((item.unitAmount * (1 - FIRST_PURCHASE_DISCOUNT)).toFixed(2)),
      name: `${item.name} (50% off)`,
    }));
  }

  try {
    const order = await createPayPalOrder(finalItems);
    return NextResponse.json({
      orderId: order.id,
      discountApplied,
      items: finalItems.map(({ beatId, licenseId, unitAmount }) => ({
        beatId,
        licenseId,
        unitAmount,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Unable to create PayPal order." }, { status: 500 });
  }
}
