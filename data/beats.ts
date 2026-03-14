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
  ,{
    id: "in-the-highrise",
    slug: "in-the-highrise",
    title: "In The Highrise",
    bpm: 90,
    key: "G minor",
    genre: "R&B",
    moods: ["rnb", "vibes", "smooth"],
    coverImage: "/covers/in-the-highrise.jpg",
    previewUrl: "/audio/in-the-highrise.mp3",
    defaultPrice: 19.99,
    tags: ["drake", "bryson tiller"],
    createdAt: "2026-03-14T00:00:00.000Z",
    featured: true,
    downloadUrls: {
      basic: "https://drive.google.com/drive/folders/1YfEY-bhZYRcK_mT2fHeF7fpZfK-0EPq-",
      premium: "https://drive.google.com/drive/folders/1eKyrL16NIcVX-2SKYKU9YmfVDiT3juKW",
      unlimited: "https://drive.google.com/drive/folders/1q0iGVSc69lGMQXbOuX-54Q4Q-0HLOph8",
      exclusive: "https://drive.google.com/drive/folders/18OSksNKPma1PwzbXTRWK820CiEmqLeMa"
    }
  }
];

export function getBeatBySlug(slug: string) {
  return beats.find((beat) => beat.slug === slug);
}
