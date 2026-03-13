import Link from "next/link";
import { db } from "@/lib/db";
import { beats } from "@/data/beats";
import { licenseTiers } from "@/data/licenses";
import { Button } from "@/components/ui/Button";

interface SuccessPageProps {
  searchParams: { orderId?: string; token?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId, token } = searchParams;

  let order = null;
  if (orderId && token) {
    order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    // Validate token — prevents order snooping
    if (order && order.accessToken !== token) {
      order = null;
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-400">
          Payment successful
        </p>
        <h1 className="section-title">Thank you for your purchase</h1>
        <p className="section-subtitle">
          Your beats are ready. Download them below.
        </p>
      </header>

      {order ? (
        <div className="space-y-4">
          <div className="card-surface p-5 space-y-1 text-sm text-gray-300">
            <p><span className="text-gray-500">Email:</span> {order.email}</p>
            <p><span className="text-gray-500">Order ID:</span> {order.id}</p>
            <p><span className="text-gray-500">Total:</span> ${Number(order.total).toFixed(2)}</p>
          </div>

          <div className="card-surface divide-y divide-white/5">
            {order.items.map((item) => {
              const beat = beats.find((b) => b.id === item.beatId);
              const license = licenseTiers.find((l) => l.id === item.licenseId);
              return (
                <div key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{beat?.title ?? item.beatId}</p>
                    <p className="text-xs text-gray-300">{license?.name ?? item.licenseId}</p>
                    <p className="text-[0.7rem] text-gray-500">{license?.usageSummary}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-green-400">${Number(item.unitAmount).toFixed(2)}</p>
                    {item.downloadUrl ? (
                      <a href={item.downloadUrl} download>
                        <Button size="sm">Download</Button>
                      </a>
                    ) : (
                      <Button size="sm" disabled>Coming soon</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-500">
            Save this page URL or your order ID in case you need to access your files again.
          </p>
        </div>
      ) : (
        <div className="card-surface p-5 text-sm text-gray-300">
          <p>Payment received. Check your email for confirmation.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/beats">
          <Button size="sm">Browse more beats</Button>
        </Link>
        <Link href="/">
          <Button variant="secondary" size="sm">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
