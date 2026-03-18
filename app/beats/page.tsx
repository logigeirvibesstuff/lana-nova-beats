import { db } from "@/lib/db";
import { BeatsPageClient } from "./BeatsPageClient";

export default async function BeatsPage() {
  const beats = await db.beat.findMany({ orderBy: { createdAt: "desc" } });
  return <BeatsPageClient beats={beats as any} />;
}
