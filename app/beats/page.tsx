import { db } from "@/lib/db";
import { BeatsPageClient } from "./BeatsPageClient";

export default async function BeatsPage() {
  const raw = await db.beat.findMany({ orderBy: { createdAt: "desc" } });
  const beats = raw.map((b) => ({ ...b, defaultPrice: Number(b.defaultPrice), createdAt: b.createdAt.toISOString(), updatedAt: b.updatedAt.toISOString() }));
  return <BeatsPageClient beats={beats as any} />;
}
