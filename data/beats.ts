import type { Beat } from "@/types/beat";

export const beats: Beat[] = [
  {
    id: "in-my-thoughts",
    slug: "in-my-thoughts",
    title: "In My Thoughts",
    bpm: 90,
    key: "Unknown",
    genre: "R&B",
    moods: ["rnb", "vibes", "smooth"],
    coverImage: "/covers/in-my-thoughts.jpg",
    previewUrl: "https://drive.google.com/uc?id=1FQkzoAIvos3DYL7ip3q1g-zVEWIk7SqW&export=download",
    defaultPrice: 19.99,
    tags: ["drake"],
    createdAt: "2026-03-14T00:00:00.000Z",
    featured: true,
    downloadUrls: {
      basic: "https://drive.google.com/uc?id=1FQkzoAIvos3DYL7ip3q1g-zVEWIk7SqW&export=download",
      premium: "https://drive.google.com/uc?id=1R7sE195h5ndArwuoh3eFjaVE-gyscohR&export=download",
      unlimited: "https://drive.google.com/uc?id=1a1Ysr2JFAYeKicyaTcogabRUvu9x_Jpv&export=download",
      exclusive: "https://drive.google.com/drive/folders/181OSFKG9r-kt1wDAUmLyfic8E4xsOKTs"
    }
  }
];

export function getBeatBySlug(slug: string) {
  return beats.find((beat) => beat.slug === slug);
}
