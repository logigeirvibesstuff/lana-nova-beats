"use client";

import { beats } from "@/data/beats";
import { BeatCard } from "./BeatCard";

const featuredBeats = beats.filter((b) => b.featured);

export function FeaturedBeats() {
  if (featuredBeats.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {featuredBeats.slice(0, 6).map((beat) => (
        <BeatCard key={beat.id} beat={beat} />
      ))}
    </div>
  );
}
