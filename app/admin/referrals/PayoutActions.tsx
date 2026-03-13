"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PayoutActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"paid" | "reject" | null>(null);

  async function act(action: "paid" | "reject") {
    setLoading(action);
    await fetch(`/api/admin/payouts/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2 justify-end mt-2">
      <button
        onClick={() => act("paid")}
        disabled={loading !== null}
        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading === "paid" ? "..." : "Mark as Paid"}
      </button>
      <button
        onClick={() => act("reject")}
        disabled={loading !== null}
        className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
      >
        {loading === "reject" ? "..." : "Reject"}
      </button>
    </div>
  );
}
