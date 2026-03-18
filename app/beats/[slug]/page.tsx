import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BeatDetailClient } from "./BeatDetailClient";

export default async function BeatPage({ params }: { params: { slug: string } }) {
  const beat = await db.beat.findUnique({ where: { slug: params.slug } });

  if (!beat) notFound();

  const serialized = { ...beat, defaultPrice: Number(beat.defaultPrice), createdAt: beat.createdAt.toISOString(), updatedAt: beat.updatedAt.toISOString() };
  return <BeatDetailClient beat={serialized as any} />;
}
