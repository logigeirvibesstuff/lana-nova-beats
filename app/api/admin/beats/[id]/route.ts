import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId || userId.trim() !== process.env.ADMIN_USER_ID?.trim()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { basic, premium, unlimited, exclusive } = body;

  const beat = await db.beat.update({
    where: { id: params.id },
    data: {
      downloadUrls: { basic, premium, unlimited, exclusive },
    },
  });

  return NextResponse.json(beat);
}
