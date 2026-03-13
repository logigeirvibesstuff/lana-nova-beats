"use client";

import { useState } from "react";

export function PayoutButton({ amount }: { amount: number }) {
  const [open, setOpen] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!paypalEmail.includes("@")) {
      setError("Enter a valid PayPal email.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/payouts/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paypalEmail, amount }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
        Payout request submitted! We&apos;ll send <strong>${amount.toFixed(2)}</strong> to your PayPal soon.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        You have <strong className="text-purple-600">${amount.toFixed(2)}</strong> available for payout.
      </p>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          Request Payout via PayPal
        </button>
      ) : (
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Your PayPal email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={loading}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Submitting..." : `Request $${amount.toFixed(2)}`}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
