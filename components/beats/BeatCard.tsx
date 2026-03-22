"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { useCart } from "@/context/CartContext";
import { licenseTiers } from "@/data/licenses";
import type { Beat, LicenseTierId } from "@/types/beat";

interface BeatCardProps {
  beat: Beat;
  playlist?: Beat[];
}

export function BeatCard({ beat, playlist }: BeatCardProps) {
  const { currentBeatId, isPlaying, withVocals, togglePlay, toggleVocals } = useAudioPlayer();
  const { addItem } = useCart();
  const isThisPlaying = currentBeatId === beat.id && isPlaying;
  const isThisVocals = currentBeatId === beat.id && withVocals;
  const [showLicenses, setShowLicenses] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowLicenses(false);
      }
    }
    if (showLicenses) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showLicenses]);

  function handleAddToCart(licenseId: LicenseTierId) {
    addItem(beat, licenseId);
    setAddedId(licenseId);
    setTimeout(() => { setAddedId(null); setShowLicenses(false); }, 900);
  }

  return (
    <article className="relative aspect-square overflow-hidden rounded-2xl bg-black">
      {/* VHS base image */}
      <div
        className="absolute inset-10 rounded-xl"
        style={{
          backgroundImage: `url('${beat.coverImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "saturate(0.7) contrast(1.15) brightness(1.05) sepia(0.1) blur(0.6px)",
        }}
      />
      {/* Chromatic aberration — red channel shift */}
      <div className="absolute inset-10 rounded-xl" style={{ backgroundImage: `url('${beat.coverImage}')`, backgroundSize: "cover", backgroundPosition: "center top", filter: "saturate(0) contrast(1.2)", mixBlendMode: "screen", opacity: 0.15, transform: "translateX(3px)", }} />
      {/* Scanlines */}
      <div className="absolute inset-10 rounded-xl" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)", }} />
      {/* Purple tint */}
      <div className="absolute inset-10 rounded-xl" style={{ background: "rgba(100,0,200,0.28)", mixBlendMode: "screen" }} />
      {/* VHS color bleed */}
      <div className="absolute inset-10 rounded-xl" style={{ background: "linear-gradient(180deg, rgba(120,0,255,0.12) 0%, rgba(255,0,150,0.08) 100%)", mixBlendMode: "screen" }} />
      {/* Vignette — lighter */}
      <div className="absolute inset-10 rounded-xl" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(30,0,60,0.65) 100%)" }} />

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
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick add to cart */}
            <div className="relative pointer-events-auto z-30" ref={popoverRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowLicenses((v) => !v); }}
                className="group flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-lana-purple border border-white/20 hover:border-lana-purple transition-all hover:scale-110"
                aria-label="Add to cart"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lana-accent flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </span>
              </button>

              {showLicenses && (
                <div className="absolute top-9 right-0 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <p className="text-[0.6rem] uppercase tracking-widest text-gray-500 px-3 pt-3 pb-1">Choose license</p>
                  {licenseTiers.map((license) => (
                    <button
                      key={license.id}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(license.id as LicenseTierId); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-white/5 ${addedId === license.id ? "bg-lana-purple/30" : ""}`}
                    >
                      <div>
                        <p className="text-xs font-medium text-white">{license.name}</p>
                        <p className="text-[0.6rem] text-gray-500">{license.files}</p>
                      </div>
                      <span className={`text-xs font-bold ${addedId === license.id ? "text-green-400" : "text-lana-accent"}`}>
                        {addedId === license.id ? "✓ Added" : `$${license.price}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
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

