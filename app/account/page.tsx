import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CopyButton } from "./CopyButton";
import { PayoutButton } from "./PayoutButton";

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [referredOrders, pendingPayout] = await Promise.all([
    db.order.findMany({
      where: { referredBy: userId, status: "PAID" },
      include: { items: { include: { beat: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.payoutRequest.findFirst({
      where: { affiliateId: userId, status: "PENDING" },
    }),
  ]);

  const totalEarned = referredOrders.reduce(
    (sum, order) => sum + Number(order.total) * 0.5,
    0
  );

  const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL}?ref=${userId}`;
  const PAYOUT_THRESHOLD = 10;
  const canRequestPayout = totalEarned >= PAYOUT_THRESHOLD && !pendingPayout;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Affiliate Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Earn 50% commission on every sale through your link.</p>
      </header>

      {/* Referral link */}
      <div className="card-surface p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Your referral link</p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            defaultValue={referralLink}
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
          />
          <CopyButton text={referralLink} />
        </div>
        <p className="text-xs text-gray-400">Share this link. Anyone who buys through it earns you 50% commission.</p>
      </div>

      {/* Earnings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-surface p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total earned</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">${totalEarned.toFixed(2)}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Sales referred</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{referredOrders.length}</p>
        </div>
      </div>

      {/* Payout section */}
      <div className="card-surface p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Payout</p>
        {pendingPayout ? (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            Payout request of <strong>${Number(pendingPayout.amount).toFixed(2)}</strong> to{" "}
            <strong>{pendingPayout.paypalEmail}</strong> is pending. We&apos;ll process it soon.
          </div>
        ) : totalEarned < PAYOUT_THRESHOLD ? (
          <p className="text-sm text-gray-500">
            Minimum payout is ${PAYOUT_THRESHOLD}. You have ${totalEarned.toFixed(2)} — keep sharing!
          </p>
        ) : (
          <PayoutButton amount={totalEarned} />
        )}
      </div>

      {/* Sales list */}
      {referredOrders.length > 0 && (
        <div className="card-surface divide-y divide-gray-100">
          <p className="text-sm font-semibold text-gray-900 px-4 pt-4">Referred sales</p>
          {referredOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">{order.email}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-400">
                  {order.items.map((i) => i.beat.title).join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</p>
                <p className="text-xs text-purple-600">+${(Number(order.total) * 0.5).toFixed(2)} commission</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
