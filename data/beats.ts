import type { Beat } from "@/types/beat";

export const beats: Beat[] = [
  {
    id: "in-my-thoughts",
    slug: "in-my-thoughts",
    title: "In My Thoughts",
    bpm: 90,
    key: "A# minor",
    genre: "R&B",
    moods: ["rnb", "vibes", "smooth"],
    coverImage: "/covers/in-my-thoughts.jpg",
    previewUrl: "/audio/in-my-thoughts.mp3",
    defaultPrice: 19.99,
    tags: ["drake"],
    createdAt: "2026-03-14T00:00:00.000Z",
    featured: true,
    downloadUrls: {
      basic: "https://drive.google.com/uc?id=1R7sE195h5ndArwuoh3eFjaVE-gyscohR&export=download",
      premium: "https://drive.google.com/drive/folders/10tn2t7DAW0NREjmHr6HnjSjKps7ikCZF",
      unlimited: "https://drive.google.com/drive/folders/1ST0zaTrch5KvGB9C5uxkSYxG8oSmW4tb",
      exclusive: "https://drive.google.com/drive/folders/155ubneOJA9CxL2kTmgp437cCTSdX7q21"
    }
  }
];

export function getBeatBySlug(slug: string) {
  return beats.find((beat) => beat.slug === slug);
}
