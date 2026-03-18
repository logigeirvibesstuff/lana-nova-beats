import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BeatDetailClient } from "./BeatDetailClient";

export default async function BeatPage({ params }: { params: { slug: string } }) {
  const beat = await db.beat.findUnique({ where: { slug: params.slug } });

  if (!beat) notFound();

  return <BeatDetailClient beat={beat as any} />;
}
