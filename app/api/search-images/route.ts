import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ error: "No query" }, { status: 400 });

  try {
    // Get DuckDuckGo search token
    const tokenRes = await axios.get(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 10000,
    });

    const vqdMatch = tokenRes.data.match(/vqd=([\d-]+)/);
    if (!vqdMatch) throw new Error("Could not get DDG token");
    const vqd = vqdMatch[1];

    const ddgHeaders = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://duckduckgo.com/",
    };

    // Fetch multiple pages in parallel
    const offsets = [0, 100, 200, 400];
    const pages = await Promise.allSettled(
      offsets.map((s) =>
        axios.get("https://duckduckgo.com/i.js", {
          params: { q: query, o: "json", p: "1", vqd, f: ",,,,,", l: "us-en", s },
          headers: ddgHeaders,
          timeout: 10000,
        })
      )
    );

    const allResults = pages.flatMap((p) =>
      p.status === "fulfilled" ? (p.value.data.results ?? []) : []
    );

    const seen = new Set<string>();
    const photos = allResults
      .filter((r: { image: string }) => {
        if (seen.has(r.image)) return false;
        seen.add(r.image);
        return true;
      })
      .map((r: { image: string; thumbnail: string; title: string }, i: number) => ({
        id: String(i),
        thumb: r.thumbnail,
        regular: r.image,
        full: r.image,
        alt: r.title,
        credit: "",
      }));

    return NextResponse.json({ photos });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Search failed";
    console.error("Image search error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
