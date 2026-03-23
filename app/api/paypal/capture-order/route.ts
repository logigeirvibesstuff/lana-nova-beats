import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { capturePayPalOrder } from "@/lib/paypal";
import { db } from "@/lib/db";
import { beats } from "@/data/beats";
import { licenseTiers } from "@/data/licenses";

interface CartItem {
  beatId: string;
  licenseId: string;
  unitAmount: number;
}

export async function POST(req: Request) {
  const { orderId, items } = (await req.json()) as {
    orderId: string;
    items: CartItem[];
  };

  if (!orderId || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Verify items — fall back gracefully if beat/license not found in static data
  const verifiedItems = items.map((item) => {
    const beat = beats.find((b) => b.id === item.beatId);
    const license = licenseTiers.find((l) => l.id === item.licenseId);
    return {
      beatId: item.beatId,
      licenseId: item.licenseId,
      unitAmount: license?.price ?? item.unitAmount,
      downloadUrl: beat?.downloadUrls?.[item.licenseId as keyof typeof beat.downloadUrls]
        ?? beat?.downloadUrl
        ?? null,
    };
  });

  if (!verifiedItems.length) {
    return NextResponse.json({ error: "Invalid items." }, { status: 400 });
  }

  const capture = await capturePayPalOrder(orderId);

  if (capture.status !== "COMPLETED") {
    return NextResponse.json({ error: "Payment not completed." }, { status: 400 });
  }

  const captureDetail = capture.purchase_units[0].payments.captures[0];
  const email = capture.payer?.email_address ?? "";
  const total = parseFloat(captureDetail.amount.value);
  const refCookie = (await cookies()).get("ref")?.value ?? null;

  const order = await db.order.create({
    data: {
      paymentId: capture.id,
      email,
      status: "PAID",
      total,
      referredBy: refCookie,
      items: {
        create: verifiedItems.map((item) => ({
          beatId: item.beatId,
          licenseId: item.licenseId,
          quantity: 1,
          unitAmount: item.unitAmount,
          downloadUrl: item.downloadUrl,
        })),
      },
    },
  });

  return NextResponse.json({ success: true, orderId: order.id, token: order.accessToken });
}
