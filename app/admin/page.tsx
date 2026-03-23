import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminBeatForm } from "./AdminBeatForm";
import { BeatLinkEditor } from "./BeatLinkEditor";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId || userId.trim() !== process.env.ADMIN_USER_ID?.trim()) {
    redirect("/");
  }

  const [orders, itemStats, allBeats] = await Promise.all([
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { items: true },
    }),
    db.beat.findMany({ select: { id: true, title: true, slug: true, downloadUrls: true }, orderBy: { createdAt: "desc" } }),
    db.orderItem.groupBy({
      by: ["beatId", "licenseId"],
      _count: { id: true },
      _sum: { unitAmount: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  const paidOrders = orders.filter((o) => o.status === "PAID" || o.status === "FULFILLED");
  const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = paidOrders.length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const thisMonth = paidOrders.filter((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthRevenue = thisMonth.reduce((s, o) => s + Number(o.total), 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Sales overview and order management.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: fmt(totalRevenue) },
          { label: "This Month", value: fmt(monthRevenue) },
          { label: "Total Orders", value: totalOrders },
          { label: "Pending", value: pendingOrders },
        ].map((stat) => (
          <div key={stat.label} className="card-surface p-5">
            <p className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">No orders yet.</td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{order.email}</td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length} beat{order.items.length !== 1 ? "s" : ""}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{fmt(Number(order.total))}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      order.status === "PAID" || order.status === "FULFILLED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Beats */}
      {itemStats.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Top Selling Beats</h2>
          <div className="card-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Beat ID</th>
                  <th className="px-4 py-3">License</th>
                  <th className="px-4 py-3">Sales</th>
                  <th className="px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {itemStats.map((s) => (
                  <tr key={`${s.beatId}-${s.licenseId}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{s.beatId}</td>
                    <td className="px-4 py-3 text-gray-700 capitalize">{s.licenseId}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{s._count.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{fmt(Number(s._sum.unitAmount ?? 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Beat Link Editor */}
      <div className="space-y-3 border-t border-black/10 pt-8">
        <h2 className="text-base font-semibold text-gray-900">Edit Download Links</h2>
        <p className="text-xs text-gray-500">Click a beat to expand and edit its Google Drive links per license.</p>
        <BeatLinkEditor beats={allBeats as any} />
      </div>

      {/* Add Beat */}
      <div className="space-y-3 border-t border-black/10 pt-8">
        <h2 className="text-base font-semibold text-gray-900">Add New Beat</h2>
        <div className="card-surface p-6">
          <AdminBeatForm />
        </div>
      </div>
    </div>
  );
}
