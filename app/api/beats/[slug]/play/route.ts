import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(_req: Request, { params }: { params: { slug: string } }) {
  try {
    await db.beat.update({
      where: { slug: params.slug },
      data: { plays: { increment: 1 } },
    });
  } catch {
    // Silently ignore — don't break playback if tracking fails
  }
  return NextResponse.json({ ok: true });
}
