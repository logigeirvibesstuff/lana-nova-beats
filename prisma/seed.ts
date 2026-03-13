import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Seed licenses
  await db.license.upsert({
    where: { id: "basic" },
    update: {},
    create: {
      id: "basic",
      name: "Basic Lease",
      description: "Best for early demos, small releases, and testing ideas.",
      usageSummary: "Up to 50,000 streams, non-exclusive, 1 music video.",
      priceMultiplier: 1.0,
    },
  });

  await db.license.upsert({
    where: { id: "premium" },
    update: {},
    create: {
      id: "premium",
      name: "Premium Lease",
      description: "For serious independent releases and growing fanbases.",
      usageSummary: "Up to 500,000 streams, multiple music videos.",
      priceMultiplier: 1.8,
    },
  });

  await db.license.upsert({
    where: { id: "exclusive" },
    update: {},
    create: {
      id: "exclusive",
      name: "Exclusive Rights",
      description: "One-time purchase, beat removed from catalog.",
      usageSummary: "Unlimited streams, full commercial rights.",
      priceMultiplier: 6.0,
    },
  });

  // Seed beats
  const beatsData = [
    {
      id: "midnight-city-lights",
      slug: "midnight-city-lights",
      title: "Midnight City Lights",
      bpm: 140,
      key: "F# minor",
      genre: "Trap / R&B",
      moods: ["moody", "atmospheric", "cinematic"],
      coverImage: "/covers/midnight-city-lights.jpg",
      previewUrl: "/audio/midnight-city-lights.mp3",
      defaultPrice: 39,
      tags: ["drake", "future", "weeknd"],
      featured: true,
    },
    {
      id: "neon-echoes",
      slug: "neon-echoes",
      title: "Neon Echoes",
      bpm: 150,
      key: "D minor",
      genre: "Trap",
      moods: ["dark", "energetic"],
      coverImage: "/covers/neon-echoes.jpg",
      previewUrl: "/audio/neon-echoes.mp3",
      defaultPrice: 35,
      tags: ["gunna", "lil baby"],
      featured: true,
    },
    {
      id: "glass-hearts",
      slug: "glass-hearts",
      title: "Glass Hearts",
      bpm: 130,
      key: "A minor",
      genre: "R&B",
      moods: ["emotional", "melancholic"],
      coverImage: "/covers/glass-hearts.jpg",
      previewUrl: "/audio/glass-hearts.mp3",
      defaultPrice: 49,
      tags: ["sza", "summer walker"],
      featured: false,
    },
    {
      id: "cold-moon",
      slug: "cold-moon",
      title: "Cold Moon",
      bpm: 165,
      key: "G minor",
      genre: "Drill",
      moods: ["aggressive", "dramatic"],
      coverImage: "/covers/cold-moon.jpg",
      previewUrl: "/audio/cold-moon.mp3",
      defaultPrice: 45,
      tags: ["uk drill"],
      featured: false,
    },
  ];

  for (const beat of beatsData) {
    await db.beat.upsert({
      where: { id: beat.id },
      update: {},
      create: {
        ...beat,
        defaultPrice: beat.defaultPrice,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
