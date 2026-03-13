import { Input } from "@/components/ui/Input";
import type { Beat } from "@/types/beat";

export interface BeatFilterState {
  search: string;
  genre: string;
  mood: string;
  minBpm: number;
  maxBpm: number;
}

interface BeatFiltersProps {
  filters: BeatFilterState;
  onChange: (next: BeatFilterState) => void;
  beats: Beat[];
}

export function BeatFilters({ filters, onChange, beats }: BeatFiltersProps) {
  const genres = Array.from(new Set(beats.map((b) => b.genre))).sort();
  const moods = Array.from(new Set(beats.flatMap((b) => b.moods))).sort();

  const handleChange = (partial: Partial<BeatFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <div className="card-surface mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex-1 space-y-2">
        <label className="text-xs font-medium text-gray-300">
          Search
          <Input
            className="mt-1"
            placeholder="Search by title, tag, or mood"
            value={filters.search}
            onChange={(e) => handleChange({ search: e.target.value })}
          />
        </label>
      </div>
      <div className="flex flex-1 flex-wrap gap-3 text-xs">
        <label className="flex min-w-[120px] flex-1 flex-col">
          <span className="font-medium text-gray-300">Genre</span>
          <select
            className="mt-1 h-9 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-foreground"
            value={filters.genre}
            onChange={(e) => handleChange({ genre: e.target.value })}
          >
            <option value="">All</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[120px] flex-1 flex-col">
          <span className="font-medium text-gray-300">Mood</span>
          <select
            className="mt-1 h-9 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-foreground"
            value={filters.mood}
            onChange={(e) => handleChange({ mood: e.target.value })}
          >
            <option value="">All</option>
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
        </label>
        <div className="flex min-w-[150px] flex-1 items-end gap-2">
          <label className="flex flex-1 flex-col">
            <span className="font-medium text-gray-300">Min BPM</span>
            <Input
              className="mt-1"
              type="number"
              min={60}
              max={220}
              value={filters.minBpm}
              onChange={(e) =>
                handleChange({ minBpm: Number(e.target.value || 0) })
              }
            />
          </label>
          <label className="flex flex-1 flex-col">
            <span className="font-medium text-gray-300">Max BPM</span>
            <Input
              className="mt-1"
              type="number"
              min={60}
              max={220}
              value={filters.maxBpm}
              onChange={(e) =>
                handleChange({ maxBpm: Number(e.target.value || 999) })
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}

