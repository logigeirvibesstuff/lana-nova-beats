"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ug_first_discount";

export function FirstPurchasePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadyClaimed = localStorage.getItem(STORAGE_KEY);
    if (!alreadyClaimed) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClaim = () => {
    localStorage.setItem(STORAGE_KEY, "eligible");
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0d] p-8 text-center shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Badge */}
        <div className="inline-block mb-4 rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-400">
          Limited Time
        </div>

        {/* Headline */}
        <h2 className="mb-2 text-4xl font-black uppercase tracking-tight text-white leading-none">
          GET 50% OFF
        </h2>
        <p className="mb-1 text-lg font-semibold text-orange-400 uppercase tracking-wide">
          Your First Purchase
        </p>
        <p className="mb-6 text-sm text-gray-500">
          Discount is automatically applied at checkout. One time only.
        </p>

        {/* CTA */}
        <button
          onClick={handleClaim}
          className="w-full rounded-xl py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 active:translate-y-0"
          style={{ background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" }}
        >
          Claim My 50% Off
        </button>

        <p className="mt-3 text-[0.65rem] text-gray-700">
          For research and entertainment purposes only.
        </p>
      </div>
    </div>
  );
}
