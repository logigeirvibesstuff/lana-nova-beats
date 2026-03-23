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
          <div className="md:w-2/5 flex gap-3">
            <Link href="/beats" className="flex-1 relative overflow-hidden rounded-2xl min-h-[160px] no-underline" style={{background: "linear-gradient(135deg, #ffe0c3 0%, #f5d0fe 50%, #c4b5fd 100%)"}}>
              <div className="relative h-full flex flex-col justify-between p-5">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-purple-700 font-bold">🔥 Limited offer</p>
                <p className="font-black leading-none text-purple-900" style={{fontSize: "2.6rem", fontFamily: "bebas neue, bebas, impact, sans-serif", letterSpacing: "-0.5px"}}>Buy 2<br />Get 1<br />Free</p>
                <div>
                  <p className="text-xs text-purple-800 font-medium mb-3">On all licenses. Cheapest beat free. No code needed.</p>
                  <span className="inline-block bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold px-4 py-2 rounded-full">Shop now →</span>
                </div>
              </div>
            </Link>
            <a href="/account" className="flex-1 relative overflow-hidden rounded-2xl min-h-[160px]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/affiliate-bg.jpg')" }} />
              <div className="absolute inset-0 bg-black/55" />
              <div className="relative h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                <p className="text-[0.55rem] uppercase tracking-[0.2em] text-white">Affiliate program</p>
                <p className="text-white text-sm font-bold leading-tight">Get paid to share.</p>
                <p className="text-white text-[0.65rem]">Earn 50% commission on every sale.</p>
                <span className="bg-green-500 text-white text-[0.6rem] font-bold px-3 py-1 rounded-full mt-1">Start earning</span>
              </div>
            </a>
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
      <section className="border-t border-black/10 border-dashed pt-6 pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Having trouble with something?</h2>
            <p className="text-sm text-gray-600">Our team will look at it immediately.</p>
          </div>
          <a
            href="mailto:loyiibeats@gmail.com"
            className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
          >
            loyiibeats@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}

