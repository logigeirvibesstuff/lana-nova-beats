import type { LicenseTierId } from "@/types/beat";

export const STRIPE_CURRENCY = "usd";

// Map of beatId:licenseTierId -> Stripe price ID.
// Replace placeholder values with real price IDs from your Stripe dashboard.
// When a key is missing, the API uses price_data (dynamic) instead.
const priceMap: Record<string, string | undefined> = {
  "midnight-city-lights:basic": undefined,
  "midnight-city-lights:premium": undefined,
  "midnight-city-lights:exclusive": undefined,
  "neon-echoes:basic": undefined,
  "neon-echoes:premium": undefined,
  "neon-echoes:exclusive": undefined,
  "glass-hearts:basic": undefined,
  "glass-hearts:premium": undefined,
  "glass-hearts:exclusive": undefined,
  "cold-moon:basic": undefined,
  "cold-moon:premium": undefined,
  "cold-moon:exclusive": undefined
};

export function getStripePriceId(beatId: string, licenseTierId: LicenseTierId) {
  return priceMap[`${beatId}:${licenseTierId}`];
}

