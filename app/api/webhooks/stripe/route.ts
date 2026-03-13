import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email ?? "";
  const stripeId = session.id;
  const total = (session.amount_total ?? 0) / 100;

  // Retrieve line items to build order items
  const stripe = getStripeClient();
  const lineItems = await stripe.checkout.sessions.listLineItems(stripeId, {
    expand: ["data.price.product"],
  });

  await db.order.create({
    data: {
      paymentId: stripeId,
      email,
      status: "PAID",
      total,
      items: {
        create: lineItems.data.map((item) => {
          const product = item.price?.product as Stripe.Product | undefined;
          const beatId = product?.metadata?.beatId ?? "";
          const licenseId = product?.metadata?.licenseTierId ?? "basic";
          return {
            beatId,
            licenseId,
            quantity: item.quantity ?? 1,
            unitAmount: (item.price?.unit_amount ?? 0) / 100,
          };
        }),
      },
    },
  });
}
