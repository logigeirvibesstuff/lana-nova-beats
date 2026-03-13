"use client";

import { useMemo, useState } from "react";
import { beats } from "@/data/beats";
import {
  BeatFilters,
  type BeatFilterState
} from "@/components/beats/BeatFilters";
import { BeatGrid } from "@/components/beats/BeatGrid";
import { Button } from "@/components/ui/Button";

const defaultFilters: BeatFilterState = {
  search: "",
  genre: "",
  mood: "",
  minBpm: 0,
  maxBpm: 999
};

const PAGE_SIZE = 8;

const ARTIST_CATEGORIES = [
  { label: "Drake type beats", tag: "drake" },
  { label: "Sabrina Carpenter type beats", tag: "sabrina carpenter" },
  { label: "Bryson Tiller type beats", tag: "bryson tiller" },
  { label: "Kanye West type beats", tag: "kanye west" },
  { label: "Unleashed Gems authentic beats", tag: "" },
];

export default function BeatsPage() {
  const [filters, setFilters] = useState<BeatFilterState>(defaultFilters);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredBeats = useMemo(() => {
    setPage(1);
    return beats.filter((beat) => {
      if (filters.genre && beat.genre !== filters.genre) return false;
      if (filters.mood && !beat.moods.includes(filters.mood)) return false;
      if (filters.minBpm && beat.bpm < filters.minBpm) return false;
      if (filters.maxBpm && beat.bpm > filters.maxBpm) return false;
      if (activeCategory) {
        if (!beat.tags.join(" ").toLowerCase().includes(activeCategory.toLowerCase())) return false;
      }
      if (filters.search) {
        const haystack = (beat.title + " " + beat.genre + " " + beat.moods.join(" ") + " " + beat.tags.join(" ")).toLowerCase().trim();
        if (!haystack.includes(filters.search.toLowerCase().trim())) return false;
      }
      return true;
    });
  }, [filters, activeCategory]);

  const totalPages = Math.ceil(filteredBeats.length / PAGE_SIZE);
  const pageBeats = filteredBeats.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-800">
          Catalog
        </p>
        <h1 className="section-title">Beat catalog</h1>
        <p className="section-subtitle">
          Filter by genre, mood, and BPM to find the perfect beat for your next record.
        </p>
      </header>
      {/* Artist categories */}
      <div className="flex flex-wrap gap-2">
        {ARTIST_CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => {
              setActiveCategory(activeCategory === cat.tag ? null : cat.tag);
              setPage(1);
            }}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              activeCategory === cat.tag
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <BeatFilters filters={filters} onChange={setFilters} beats={beats} />
      <BeatGrid beats={pageBeats} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="secondary" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-gray-700">{page} / {totalPages}</span>
          <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

