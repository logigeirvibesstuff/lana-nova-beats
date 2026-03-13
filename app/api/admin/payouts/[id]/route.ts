import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId || userId !== ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await req.json(); // "paid" or "reject"

  const status = action === "paid" ? "PAID" : "REJECTED";
  const payout = await db.payoutRequest.update({
    where: { id: params.id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, payout });
}
