"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    bg: "/beat-bg.webp",
    label: "New drop",
    heading: "Dark. Moody. Cinematic.",
    sub: "Trap & R&B beats built for serious artists.",
    cta: { text: "Browse beats", href: "/beats" },
  },
  {
    bg: "/affiliate-bg.jpg",
    label: "Affiliate program",
    heading: "Get paid to share.",
    sub: "Earn 50% commission on every sale through your link.",
    cta: { text: "Start earning", href: "/account", green: true },
  },
  {
    bg: "/banner-2.webp",
    label: "Drake type beats",
    heading: "Industry-ready sound.",
    sub: "Clean mixes. Flexible licenses. Instant delivery.",
    cta: { text: "View catalog", href: "/beats" },
  },
  {
    bg: "/banner-3.jpg",
    label: "Licensing",
    heading: "Own your music fully.",
    sub: "Exclusive rights available. Artist-friendly terms.",
    cta: { text: "See licenses", href: "/licenses" },
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setFading(false);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-2xl mb-8">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url('${slide.bg}')`, opacity: fading ? 0 : 1 }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div
        className="relative h-full flex items-center justify-between px-8 sm:px-12 transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">{slide.label}</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">{slide.heading}</h2>
          <p className="text-sm text-gray-300 max-w-md">{slide.sub}</p>
        </div>
        <Link
          href={slide.cta.href}
          className={`shrink-0 text-white text-xl font-bebas tracking-widest px-10 py-4 rounded-full transition ${"green" in slide.cta && slide.cta.green ? "bg-green-600 hover:bg-green-500 shadow-[0_0_18px_rgba(22,163,74,0.7)]" : "bg-lana-purple hover:bg-lana-accent shadow-[0_0_18px_rgba(91,33,255,0.7)]"}`}
        >
          {slide.cta.text}
        </Link>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-8 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 500); }}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
