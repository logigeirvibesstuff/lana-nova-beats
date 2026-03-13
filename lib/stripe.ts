import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
  }

  stripeClient = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20"
  });

  return stripeClient;
}


