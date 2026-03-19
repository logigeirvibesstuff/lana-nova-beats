"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CartLink } from "@/components/layout/CartLink";
import { AuthButtons } from "@/components/layout/AuthButtons";

const navLinks = [
  { href: "/beats", label: "Beats" },
  { href: "/licenses", label: "Licenses" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-black/10 bg-white/90 backdrop-blur-md relative z-40">
      <div className="page-container grid h-16 grid-cols-3 items-center">
        {/* Left — nav (desktop) / hamburger (mobile) */}
        <div className="flex items-center">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm text-gray-800 sm:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-black hover:underline hover:underline-offset-4">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 -ml-2 text-gray-700 hover:text-black transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Center — logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex flex-col items-center leading-none" onClick={() => setMenuOpen(false)}>
            <span className="font-[family-name:var(--font-bebas)] text-3xl sm:text-4xl tracking-widest text-black">
              Unleashed Gems
            </span>
            <span className="text-[0.6rem] font-semibold tracking-[0.25em] uppercase bg-gradient-to-r from-lana-purple to-lana-accent-soft bg-clip-text text-transparent">
              Premium Type Beats
            </span>
          </Link>
        </div>

        {/* Right — cart + auth + CTA */}
        <div className="flex items-center justify-end gap-2">
          <CartLink />
          <AuthButtons />
          <Link href="/beats" className="hidden sm:block">
            <Button size="md" className="font-bebas text-lg tracking-widest shadow-[0_0_18px_rgba(91,33,255,0.7)]">
              Browse Beats
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-black/10 bg-white/95 backdrop-blur-md">
          <nav className="page-container flex flex-col py-3 gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-2 py-3 text-base font-medium text-gray-800 hover:text-black border-b border-black/5 last:border-0 transition"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/beats" onClick={() => setMenuOpen(false)} className="mt-2">
              <Button size="md" className="w-full font-bebas text-lg tracking-widest shadow-[0_0_18px_rgba(91,33,255,0.7)]">
                Browse Beats
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
