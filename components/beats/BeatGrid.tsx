import type { Beat } from "@/types/beat";
import { BeatCard } from "./BeatCard";

interface BeatGridProps {
  beats: Beat[];
}

export function BeatGrid({ beats }: BeatGridProps) {
  if (!beats.length) {
    return (
      <div className="card-surface p-6 text-sm text-gray-300">
        No beats match your filters yet. Try clearing search or adjusting BPM.
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {beats.map((beat) => (
        <BeatCard key={beat.id} beat={beat} />
      ))}
    </div>
  );
}

