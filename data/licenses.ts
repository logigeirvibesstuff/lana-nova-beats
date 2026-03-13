import type { LicenseTier } from "@/types/beat";

export const licenseTiers: LicenseTier[] = [
  {
    id: "basic",
    name: "Basic Lease",
    description: "Best for early demos and small releases.",
    usageSummary: "Up to 50,000 streams, non-exclusive, 1 music video.",
    price: 19.99,
    files: "MP3"
  },
  {
    id: "premium",
    name: "Premium Lease",
    description: "For serious independent releases and growing fanbases.",
    usageSummary: "Up to 500,000 streams, multiple music videos.",
    price: 39.99,
    files: "MP3 + WAV"
  },
  {
    id: "unlimited",
    name: "Unlimited Lease",
    description: "For major releases with unlimited distribution.",
    usageSummary: "Unlimited streams, unlimited music videos, radio.",
    price: 199,
    files: "MP3 + WAV + Trackout Stems"
  },
  {
    id: "exclusive",
    name: "Exclusive Rights",
    description: "One-time purchase — beat removed from catalog.",
    usageSummary: "Full exclusive ownership, unlimited commercial rights.",
    price: 799,
    files: "MP3 + WAV + Trackout Stems"
  }
];

export function getLicenseById(id: string) {
  return licenseTiers.find((tier) => tier.id === id);
}
