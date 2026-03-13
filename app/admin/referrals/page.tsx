import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PayoutActions } from "./PayoutActions";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID?.trim();

export default async function AdminReferralsPage() {
  const { userId } = await auth();
  if (!userId || userId.trim() !== ADMIN_USER_ID) redirect("/");

  const [referredOrders, payoutRequests, allOrders] = await Promise.all([
    db.order.findMany({
      where: { referredBy: { not: null }, status: "PAID" },
      include: { items: { include: { beat: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.payoutRequest.findMany({ orderBy: { requestedAt: "desc" } }),
    db.order.findMany({
      where: { status: "PAID" },
      include: { items: { include: { beat: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Group referred orders by affiliateId
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

  const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12 px-4">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-surface p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{allOrders.length}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Affiliates</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{affiliates.length}</p>
        </div>
      </div>

      {/* All Orders */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Orders</h2>
        {allOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="card-surface divide-y divide-gray-100">
            {allOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{order.email}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">{order.items.map((i) => i.beat.title).join(", ")}</p>
                  {order.referredBy && (
                    <p className="text-xs text-purple-500">Referred by: {order.referredBy}</p>
                  )}
                </div>
                <p className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referrals & Payouts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Referrals & Payouts</h2>
        {affiliates.length === 0 ? (
          <p className="text-sm text-gray-500">No referral activity yet.</p>
        ) : (
          <div className="space-y-6">
            {affiliates.map(({ affiliateId, orders, totalEarned, requests, pending }) => (
              <div key={affiliateId} className="card-surface divide-y divide-gray-100">
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

                {requests.filter((r) => r.status !== "PENDING").length > 0 && (
                  <div className="px-5 py-3">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Payout history</p>
                    {requests.filter((r) => r.status !== "PENDING").map((r) => (
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
        )}
      </div>
    </div>
  );
}
