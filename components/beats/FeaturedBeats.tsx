import { db } from "@/lib/db";
import { BeatCard } from "./BeatCard";

export async function FeaturedBeats() {
  const beats = await db.beat.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (beats.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {beats.map((beat) => (
        <BeatCard key={beat.id} beat={beat as any} />
      ))}
    </div>
  );
}
