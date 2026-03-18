import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const beat = await db.beat.findUnique({ where: { slug: params.slug } });
  if (!beat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(beat);
}
