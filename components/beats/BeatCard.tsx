"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import type { Beat } from "@/types/beat";

interface BeatCardProps {
  beat: Beat;
  playlist?: Beat[];
}

export function BeatCard({ beat, playlist }: BeatCardProps) {
  const { currentBeatId, isPlaying, withVocals, togglePlay, toggleVocals } = useAudioPlayer();
  const isThisPlaying = currentBeatId === beat.id && isPlaying;
  const isThisVocals = currentBeatId === beat.id && withVocals;

  return (
    <article className="relative aspect-square overflow-hidden rounded-2xl bg-black">
      <div
        className="absolute inset-10 rounded-xl"
        style={{
          backgroundImage: `url('${beat.coverImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "saturate(1.3) contrast(1.15) brightness(0.85) blur(0.3px)"
        }}
      />
      {/* Color grade — orange/purple cinematic tint */}
      <div className="absolute inset-10 rounded-xl" style={{ background: "linear-gradient(160deg, rgba(180,60,0,0.18) 0%, rgba(60,0,120,0.22) 100%)", mixBlendMode: "multiply" }} />
      {/* Vignette */}
      <div className="absolute inset-10 rounded-xl" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
      {/* Film grain */}
      <div className="absolute inset-10 rounded-xl" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")", opacity: 0.35, mixBlendMode: "overlay" }} />

      {/* Centered play button */}
      <button
        onClick={() => togglePlay(beat, playlist)}
        className="absolute inset-0 flex items-center justify-center group z-10"
        aria-label={isThisPlaying ? "Pause" : "Play preview"}
      >
        <svg className="w-10 h-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          {isThisPlaying ? (
            <>
              <rect x="6" y="4" width="4" height="16" rx="2" />
              <rect x="14" y="4" width="4" height="16" rx="2" />
            </>
          ) : (
            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.68L9.54 5.98A1 1 0 0 0 8 6.82z" />
          )}
        </svg>
      </button>

      <div className="relative flex h-full flex-col justify-between p-4 pointer-events-none">
        {/* Top */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white line-clamp-1">{beat.title}</h3>
            <p className="mt-0.5 text-xs text-gray-300 line-clamp-1">{beat.genre}</p>
          </div>
          {beat.vocalsUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleVocals(beat); }}
              className={`text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border transition-colors shrink-0 pointer-events-auto z-20 relative ${
                isThisVocals
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/60 hover:border-white"
              }`}
            >
              VOCALS
            </button>
          )}
        </div>

        {/* Bottom */}
        <div className="space-y-2 pointer-events-auto">
          {beat.tags[0] && (
            <p className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-white/70">
              {beat.tags[0]} type beat
            </p>
          )}
          <div className="flex flex-wrap gap-1 mb-1">
            {beat.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[0.6rem] text-black">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-[0.7rem] text-gray-300">
            <div className="flex items-center gap-2">
              <span>{beat.bpm} BPM</span>
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <span>{beat.key}</span>
            </div>
            <span className="font-medium text-green-400">from ${beat.defaultPrice}</span>
          </div>
          <Link href={`/beats/${beat.slug}`} className="block relative z-20">
            <Button size="sm" className="w-full">View details</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

