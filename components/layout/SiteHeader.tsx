import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CartLink } from "@/components/layout/CartLink";
import { AuthButtons } from "@/components/layout/AuthButtons";

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="page-container grid h-16 grid-cols-3 items-center">
        {/* Left — nav links */}
        <nav className="hidden items-center gap-6 text-sm text-gray-800 sm:flex">
          <Link href="/beats" className="transition hover:text-black hover:underline hover:underline-offset-4">
            Beats
          </Link>
          <Link href="/licenses" className="transition hover:text-black hover:underline hover:underline-offset-4">
            Licenses
          </Link>
          <Link href="/about" className="transition hover:text-black hover:underline hover:underline-offset-4">
            About
          </Link>
        </nav>

        {/* Center — logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="flex items-center gap-2 font-[family-name:var(--font-bebas)] text-4xl tracking-widest text-black">
              Unleashed Gems
            </span>
            <span className="text-[0.65rem] font-semibold tracking-[0.25em] uppercase bg-gradient-to-r from-lana-purple to-lana-accent-soft bg-clip-text text-transparent">
              Premium Type Beats
            </span>
          </Link>
        </div>

        {/* Right — cart + CTA */}
        <div className="flex items-center justify-end gap-2">
          <CartLink />
          <AuthButtons />
          <Link href="/beats">
            <Button size="md" className="font-bebas text-lg tracking-widest shadow-[0_0_18px_rgba(91,33,255,0.7)]">Browse Beats</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

