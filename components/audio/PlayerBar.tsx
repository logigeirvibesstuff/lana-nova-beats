"use client";

import Image from "next/image";
import Link from "next/link";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const { currentBeat, isPlaying, currentTime, duration, togglePlay, seek, playNext, playPrev } = useAudioPlayer();

  if (!currentBeat) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-white/10">
      {/* Progress bar */}
      <div
        className="relative h-1 w-full cursor-pointer bg-white/10 group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          seek(ratio * duration);
        }}
      >
        <div
          className="h-full bg-purple-500 transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Main bar */}
      <div className="flex items-center gap-4 px-4 py-2">
        {/* Cover + info */}
        <div className="flex items-center gap-3 w-64 min-w-0">
          <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-white/10">
            <Image
              src={currentBeat.coverImage}
              alt={currentBeat.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentBeat.title}</p>
            <p className="text-xs text-gray-400">{currentBeat.bpm} BPM · {currentBeat.genre}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex items-center justify-center gap-6">
          <span className="text-xs text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</span>

          <button onClick={playPrev} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={() => togglePlay(currentBeat)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.68L9.54 5.98A1 1 0 0 0 8 6.82z" />
              </svg>
            )}
          </button>

          <button onClick={playNext} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zm8.5-6v6H17V6h-2.5v6z" />
            </svg>
          </button>

        </div>

        {/* Price button */}
        <div className="w-64 flex justify-end">
          <Link href={`/beats/${currentBeat.slug}`}>
            <button className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              from ${currentBeat.defaultPrice}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
