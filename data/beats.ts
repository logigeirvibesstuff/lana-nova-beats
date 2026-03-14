import type { Beat } from "@/types/beat";

export const beats: Beat[] = [];

export function getBeatBySlug(slug: string) {
  return beats.find((beat) => beat.slug === slug);
}
