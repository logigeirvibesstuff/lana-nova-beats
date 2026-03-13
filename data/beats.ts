import type { Beat } from "@/types/beat";

export const beats: Beat[] = [
  {
    id: "2-sides-of-3am",
    slug: "2-sides-of-3am",
    title: "2 Sides of 3AM",
    bpm: 90,
    key: "A minor",
    genre: "R&B",
    moods: ["chill", "smooth", "emotional"],
    coverImage: "/covers/2-sides-of-3am.jpg",
    previewUrl: "/audio/2-sides-of-3am.wav",
    defaultPrice: 19.99,
    tags: ["drake", "weeknd", "bryson tiller"],
    createdAt: "2026-03-10T00:00:00.000Z",
    featured: true,
    downloadUrl: "https://drive.google.com/uc?export=download&id=1K0_Ohi8rKqsG1ZrdHlM-fbkr51RO1Nms"
  },
  {
    id: "late-checkout",
    slug: "late-checkout",
    title: "Late Checkout",
    bpm: 140,
    key: "F minor",
    genre: "Rap / Hip-Hop",
    moods: ["dark", "aggressive", "cinematic"],
    coverImage: "/covers/late-checkout.jpg",
    previewUrl: "/audio/late-checkout.mp3",
    defaultPrice: 19.99,
    tags: ["drake", "bryson tiller"],
    createdAt: "2026-03-11T00:00:00.000Z",
    featured: true,
    downloadUrl: "https://drive.google.com/uc?export=download&id=1PAZttDGfBAziaC-K1ySrFK3VXMKJCmVH"
  },
  {
    id: "condo-lights",
    slug: "condo-lights",
    title: "Condo Lights",
    bpm: 90,
    key: "A# minor",
    genre: "R&B",
    moods: ["rnb", "vibes", "smooth"],
    coverImage: "/covers/condo-lights.jpg",
    previewUrl: "/audio/condo-lights.mp3",
    defaultPrice: 19.99,
    tags: ["drake", "bryson tiller", "weeknd"],
    createdAt: "2026-03-11T00:00:00.000Z",
    featured: true,
    downloadUrls: {
      basic: "https://drive.google.com/uc?export=download&id=16h9TNy0CRKpxPaLw8xTkExAPlJbEEvAp",
      premium: "https://drive.google.com/uc?export=download&id=1E2FkvfSINnuZSdeWHUbIFu-EhS1Djwz_",
      unlimited: "https://drive.google.com/drive/folders/112ONYWwia9UfZ0GtjMPQQKnrLsLNOu90",
      exclusive: "https://drive.google.com/drive/folders/112ONYWwia9UfZ0GtjMPQQKnrLsLNOu90"
    }
  }
];

export function getBeatBySlug(slug: string) {
  return beats.find((beat) => beat.slug === slug);
}
