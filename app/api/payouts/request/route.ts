import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  paypalEmail: z.string().email(),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { paypalEmail, amount } = parsed.data;

  // Verify the amount matches actual earnings (don't trust client)
  const referredOrders = await db.order.findMany({
    where: { referredBy: userId, status: "PAID" },
  });
  const actualEarned = referredOrders.reduce(
    (sum, order) => sum + Number(order.total) * 0.5,
    0
  );

  if (amount > actualEarned + 0.01) {
    return NextResponse.json({ error: "Amount exceeds earnings" }, { status: 400 });
  }

  // Check for existing pending request
  const existing = await db.payoutRequest.findFirst({
    where: { affiliateId: userId, status: "PENDING" },
  });
  if (existing) {
    return NextResponse.json({ error: "You already have a pending payout request" }, { status: 400 });
  }

  const payout = await db.payoutRequest.create({
    data: { affiliateId: userId, paypalEmail, amount },
  });

  return NextResponse.json({ success: true, id: payout.id });
}
