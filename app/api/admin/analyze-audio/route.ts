import { NextRequest, NextResponse } from "next/server";
import * as mm from "music-metadata";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await mm.parseBuffer(buffer, file.type || "audio/mpeg");

    const bpm = metadata.common.bpm ?? null;
    const key = metadata.common.key ?? null;

    return NextResponse.json({ bpm, key });
  } catch (e) {
    return NextResponse.json({ error: "Failed to analyze audio" }, { status: 500 });
  }
}
