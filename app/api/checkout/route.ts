import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { beats } from "@/data/beats";
import { licenseTiers } from "@/data/licenses";
import { getStripePriceId, STRIPE_CURRENCY } from "@/data/stripeProducts";
import type { LicenseTierId } from "@/types/beat";

interface IncomingItem {
  beatId: string;
  licenseTierId: LicenseTierId;
  quantity: number;
}

export async function POST(req: Request) {
  const body = (await req.json()) as { items?: IncomingItem[] };

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty or invalid." },
      { status: 400 }
    );
  }

  const validatedItems = body.items
    .map((item) => {
      const beat = beats.find((b) => b.id === item.beatId);
      const license = licenseTiers.find((l) => l.id === item.licenseTierId);
      if (!beat || !license) {
        return null;
      }

      const quantity = Math.max(1, item.quantity || 1);
      const unitAmount = Math.round(
        license.price * 100
      );
      const stripePriceId = getStripePriceId(beat.id, license.id);

      return {
        beat,
        license,
        quantity,
        unitAmount,
        stripePriceId
      };
    })
    .filter(Boolean) as {
    beat: (typeof beats)[number];
    license: (typeof licenseTiers)[number];
    quantity: number;
    unitAmount: number;
    stripePriceId?: string;
  }[];

  if (!validatedItems.length) {
    return NextResponse.json(
      { error: "No valid items in cart." },
      { status: 400 }
    );
  }

  const lineItems = validatedItems.map((item) => {
    if (item.stripePriceId) {
      return {
        price: item.stripePriceId,
        quantity: item.quantity
      };
    }

    return {
      price_data: {
        currency: STRIPE_CURRENCY,
        unit_amount: item.unitAmount,
        product_data: {
          name: `${item.beat.title} – ${item.license.name}`,
          metadata: {
            beatId: item.beat.id,
            licenseTierId: item.license.id
          }
        }
      },
      quantity: item.quantity
    };
  });

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "";

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Unable to create Stripe Checkout session." },
      { status: 500 }
    );
  }
}

