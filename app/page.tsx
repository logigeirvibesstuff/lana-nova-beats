import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FeaturedBeats } from "@/components/beats/FeaturedBeats";
import { HeroBanner } from "@/components/home/HeroBanner";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HeroBanner />

      <section className="pt-4 pb-4">
        {/* Original two-column content */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="md:w-3/5 space-y-6">
            <Badge variant="soft">New · Unleashed Gems Beat Store</Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
              Industry-ready{" "}
              <span className="bg-gradient-to-r from-lana-accent to-lana-accent-soft bg-clip-text text-transparent">
                type beats
              </span>{" "}
              for serious artists.
            </h2>
            <p className="max-w-xl text-sm sm:text-base text-gray-800">
              Browse carefully crafted Unleashed Gems style beats with clean mixes,
              flexible licenses, and instant delivery after purchase.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/beats">
                <Button size="lg">Browse all beats</Button>
              </Link>
              <Link href="/licenses">
                <Button variant="secondary" size="lg">
                  View license options
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lana-accent" />
                WAV + MP3 delivery
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lana-accent" />
                Clear, artist-friendly terms
              </div>
            </div>
          </div>
          <div className="md:w-2/5">
            <div className="card-surface relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(124,44,255,0.18),_transparent_55%)]" />
              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-800">
                  Sonic signature
                </p>
                <p className="text-sm text-gray-700">
                  Dark, moody, and melodic trap and R&B beats with lush
                  textures and punchy low-end, tailored for modern vocal
                  production.
                </p>
                <p className="text-xs text-gray-700">
                  Perfect for artists who want a cinematic, emotional sound
                  without sacrificing knock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 pb-6 border-t border-black/10 border-dashed">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="section-title">Featured beats</h2>
              <p className="section-subtitle">
                A small selection of recent Unleashed Gems instrumentals. Browse the
                full catalog to hear more.
              </p>
            </div>
            <Link href="/beats" className="mt-2 md:mt-0">
              <Button variant="secondary" size="sm">
                View full catalog
              </Button>
            </Link>
          </div>
          <FeaturedBeats />
        </div>
      </section>
    </div>
  );
}

