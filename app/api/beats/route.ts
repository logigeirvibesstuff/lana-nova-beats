import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const beats = await db.beat.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(beats);
}
