import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (userId !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const title = formData.get("title") as string;
  const bpm = parseInt(formData.get("bpm") as string);
  const key = formData.get("key") as string;
  const genre = formData.get("genre") as string;
  const moods = (formData.get("moods") as string).split(",").map(s => s.trim()).filter(Boolean);
  const tags = (formData.get("tags") as string).split(",").map(s => s.trim()).filter(Boolean);
  const priceBasic = parseFloat(formData.get("priceBasic") as string);
  const pricePremium = parseFloat(formData.get("pricePremium") as string) || null;
  const priceUnlimited = parseFloat(formData.get("priceUnlimited") as string) || null;
  const priceExclusive = parseFloat(formData.get("priceExclusive") as string) || null;
  const defaultPrice = priceBasic;
  const prices = { basic: priceBasic, premium: pricePremium, unlimited: priceUnlimited, exclusive: priceExclusive };
  const featured = formData.get("featured") === "true";

  const downloadUrls = {
    basic: formData.get("basic") as string || undefined,
    premium: formData.get("premium") as string || undefined,
    unlimited: formData.get("unlimited") as string || undefined,
    exclusive: formData.get("exclusive") as string || undefined,
  };

  const coverFile = formData.get("coverImage") as File | null;
  const audioFile = formData.get("previewUrl") as File | null;

  if (!coverFile || !audioFile || !title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [coverImage, previewUrl] = await Promise.all([
    uploadToCloudinary(coverFile, "covers"),
    uploadToCloudinary(audioFile, "audio"),
  ]);

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const beat = await db.beat.create({
    data: {
      slug,
      title,
      bpm,
      key,
      genre,
      moods,
      tags,
      defaultPrice,
      prices,
      featured,
      coverImage,
      previewUrl,
      downloadUrls,
    },
  });

  return NextResponse.json(beat);
}
