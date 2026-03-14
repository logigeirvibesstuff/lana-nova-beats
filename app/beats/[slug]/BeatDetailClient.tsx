"use client";

import { useState } from "react";
import type { Beat, LicenseTier, LicenseTierId } from "@/types/beat";
import { licenseTiers } from "@/data/licenses";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

interface BeatDetailClientProps {
  beat: Beat;
}

export function BeatDetailClient({ beat }: BeatDetailClientProps) {
  const { addItem } = useCart();
  const { currentBeatId, isPlaying, togglePlay } = useAudioPlayer();
  const isThisPlaying = currentBeatId === beat.id && isPlaying;
  const [selectedLicenseId, setSelectedLicenseId] =
    useState<LicenseTierId>("basic");

  const computePrice = (license: LicenseTier) => license.price;

  const handleAddToCart = () => {
    addItem(beat.slug, selectedLicenseId);
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/2">
          <div
            className="relative aspect-square overflow-hidden rounded-2xl"
            style={{ backgroundImage: `url('${beat.coverImage}')`, backgroundSize: "cover", backgroundPosition: "center top" }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <button
              onClick={() => togglePlay(beat)}
              className="absolute inset-0 flex items-center justify-center group z-10"
              aria-label={isThisPlaying ? "Pause" : "Play preview"}
            >
              <svg className="w-14 h-14 text-white drop-shadow-lg group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
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
            <div className="relative flex h-full flex-col justify-between p-6 pointer-events-none">
              <div className="space-y-2">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/60">Unleashed Gems Beat</p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">{beat.title}</h1>
                <p className="text-sm text-gray-300">{beat.genre}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-200">
                <div className="flex items-center gap-3">
                  <span>{beat.bpm} BPM</span>
                  <span className="h-1 w-1 rounded-full bg-gray-500" />
                  <span>{beat.key}</span>
                </div>
                <div className="flex flex-wrap gap-1 text-[0.65rem]">
                  {beat.moods.map((mood) => (
                    <span key={mood} className="rounded-full bg-white/10 px-2 py-0.5">{mood}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="md:w-1/2">
          <div className="card-surface p-5 space-y-4">
            <h2 className="text-lg font-semibold">Choose a license</h2>
            <p className="text-xs text-gray-600">
              Pick the license that matches your release plans. You can upgrade
              later by contacting Unleashed Gems.
            </p>
            <div className="space-y-3">
              {licenseTiers.map((license) => {
                const isExclusiveContact = license.id === "exclusive" && beat.exclusiveContact;
                const price = computePrice(license);
                const isSelected = selectedLicenseId === license.id;
                if (isExclusiveContact) {
                  return (
                    <a
                      key={license.id}
                      href={`mailto:${beat.exclusiveContact}`}
                      className="block w-full rounded-2xl border-2 border-gray-200 bg-white p-3 text-left text-sm hover:border-purple-400 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">{license.name}</p>
                          <p className="text-xs text-gray-600">{license.usageSummary}</p>
                          <p className="text-xs text-purple-500 font-medium mt-0.5">{license.files}</p>
                        </div>
                        <p className="text-sm font-semibold text-purple-600 whitespace-nowrap">Contact us</p>
                      </div>
                    </a>
                  );
                }
                return (
                  <button
                    key={license.id}
                    type="button"
                    onClick={() => setSelectedLicenseId(license.id)}
                    className={`w-full rounded-2xl border-2 p-3 text-left text-sm transition ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 shadow-[0_0_12px_rgba(147,51,234,0.2)]"
                        : "border-gray-200 bg-white hover:border-purple-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{license.name}</p>
                        <p className="text-xs text-gray-600">{license.usageSummary}</p>
                        <p className="text-xs text-purple-500 font-medium mt-0.5">{license.files}</p>
                      </div>
                      <p className="text-sm font-semibold text-purple-600">${price}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {beat.exclusiveContact && selectedLicenseId === "exclusive" ? (
              <a href={`mailto:${beat.exclusiveContact}`} className="block w-full">
                <Button className="w-full" size="lg">
                  Contact us for Exclusive Rights
                </Button>
              </a>
            ) : (
              <Button className="w-full" size="lg" onClick={handleAddToCart}>
                Add to cart
              </Button>
            )}
            <p className="text-[0.7rem] text-gray-500">
              By purchasing, you agree to the Unleashed Gems license terms
              outlined on the Licenses page.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

