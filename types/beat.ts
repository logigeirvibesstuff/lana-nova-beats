export type LicenseTierId = "basic" | "premium" | "unlimited" | "exclusive";

export interface LicenseTier {
  id: LicenseTierId;
  name: string;
  description: string;
  usageSummary: string;
  price: number;
  files: string;
}

export interface Beat {
  id: string;
  slug: string;
  title: string;
  bpm: number;
  key: string;
  genre: string;
  moods: string[];
  coverImage: string;
  previewUrl: string;
  vocalsUrl?: string;
  defaultPrice: number;
  tags: string[];
  createdAt: string;
  featured?: boolean;
  downloadUrl?: string;
  downloadUrls?: {
    basic?: string;
    premium?: string;
    unlimited?: string;
    exclusive?: string;
  };
}

export interface CartItem {
  id: string;
  beatId: string;
  licenseTierId: LicenseTierId;
  quantity: number;
  unitAmount: number;
  currency: string;
  beatTitle: string;
  licenseName: string;
  coverImage: string;
}

