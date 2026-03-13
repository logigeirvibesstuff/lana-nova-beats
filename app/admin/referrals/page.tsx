import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PayoutActions } from "./PayoutActions";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID?.trim();

export default async function AdminReferralsPage() {
  const { userId } = await auth();
  if (!userId || userId.trim() !== ADMIN_USER_ID) redirect("/");

  // All referred PAID orders grouped by affiliate
  const referredOrders = await db.order.findMany({
    where: { referredBy: { not: null }, status: "PAID" },
    include: { items: { include: { beat: true } } },
    orderBy: { createdAt: "desc" },
  });

  // All payout requests
  const payoutRequests = await db.payoutRequest.findMany({
    orderBy: { requestedAt: "desc" },
  });

  // Group orders by affiliateId
  const affiliateMap = new Map<string, typeof referredOrders>();
  for (const order of referredOrders) {
    const key = order.referredBy!;
    if (!affiliateMap.has(key)) affiliateMap.set(key, []);
    affiliateMap.get(key)!.push(order);
  }

  const affiliates = Array.from(affiliateMap.entries()).map(([affiliateId, orders]) => {
    const totalEarned = orders.reduce((sum, o) => sum + Number(o.total) * 0.5, 0);
    const requests = payoutRequests.filter((r) => r.affiliateId === affiliateId);
    const pending = requests.find((r) => r.status === "PENDING");
    return { affiliateId, orders, totalEarned, requests, pending };
  });

  // Also show requests from affiliates with no orders (edge case)
  const pendingOnly = payoutRequests.filter(
    (r) => r.status === "PENDING" && !affiliateMap.has(r.affiliateId)
  );

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10 px-4">
      <h1 className="text-2xl font-semibold text-gray-900">Admin — Referrals & Payouts</h1>

      {affiliates.length === 0 && pendingOnly.length === 0 && (
        <p className="text-gray-500 text-sm">No referral activity yet.</p>
      )}

      {affiliates.map(({ affiliateId, orders, totalEarned, requests, pending }) => (
        <div key={affiliateId} className="card-surface divide-y divide-gray-100">
          {/* Affiliate header */}
          <div className="flex items-start justify-between p-5">
            <div>
              <p className="text-xs text-gray-400 font-mono">{affiliateId}</p>
              <p className="text-lg font-bold text-purple-600 mt-1">${totalEarned.toFixed(2)} earned</p>
              <p className="text-sm text-gray-500">{orders.length} sale{orders.length !== 1 ? "s" : ""} referred</p>
            </div>
            {pending && (
              <div className="text-right space-y-1">
                <span className="inline-block rounded-full bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 font-medium">
                  Payout requested
                </span>
                <p className="text-sm font-semibold text-gray-900">${Number(pending.amount).toFixed(2)}</p>
                <p className="text-xs text-gray-500">{pending.paypalEmail}</p>
                <PayoutActions id={pending.id} />
              </div>
            )}
          </div>

          {/* Orders */}
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">{order.email}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-400">{order.items.map((i) => i.beat.title).join(", ")}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</p>
                <p className="text-xs text-purple-600">+${(Number(order.total) * 0.5).toFixed(2)}</p>
              </div>
            </div>
          ))}

          {/* Past payout history */}
          {requests.filter((r) => r.status !== "PENDING").length > 0 && (
            <div className="px-5 py-3">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Payout history</p>
              {requests
                .filter((r) => r.status !== "PENDING")
                .map((r) => (
                  <div key={r.id} className="flex justify-between text-xs text-gray-500 py-1">
                    <span>{new Date(r.requestedAt).toLocaleDateString()} — {r.paypalEmail}</span>
                    <span className={r.status === "PAID" ? "text-green-600 font-medium" : "text-red-500"}>
                      {r.status === "PAID" ? `Paid $${Number(r.amount).toFixed(2)}` : "Rejected"}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
