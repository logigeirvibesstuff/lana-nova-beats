import { notFound } from "next/navigation";
import { beats, getBeatBySlug } from "@/data/beats";
import { BeatDetailClient } from "./BeatDetailClient";

interface BeatPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return beats.map((beat) => ({ slug: beat.slug }));
}

export default function BeatPage({ params }: BeatPageProps) {
  const beat = getBeatBySlug(params.slug);

  if (!beat) {
    notFound();
  }

  return <BeatDetailClient beat={beat} />;
}

