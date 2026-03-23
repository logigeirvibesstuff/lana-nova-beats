"use client";

import { useEffect, useState } from "react";

export function FirstPurchasePopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show once per session (closes if they leave and come back in same tab)
    const seen = sessionStorage.getItem("ug_popup_seen");
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClaim = () => {
    sessionStorage.setItem("ug_popup_seen", "1");
    setVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("ug_popup_seen", "1");
    setVisible(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("FIRSTBUY");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80" onClick={handleDismiss} />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0d] p-8 text-center shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="inline-block mb-4 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1 text-xs font-bold uppercase tracking-widest text-purple-400">
          Welcome
        </div>

        <h2 className="mb-2 text-4xl font-black uppercase tracking-tight text-white leading-none">
          GET 50% OFF
        </h2>
        <p className="mb-1 text-lg font-semibold text-purple-400 uppercase tracking-wide">
          Any Purchase
        </p>
        <p className="mb-5 text-sm text-gray-500">
          Use the code below at checkout to get 50% off your order.
        </p>

        {/* Code box */}
        <button
          onClick={handleCopy}
          className="w-full mb-5 flex items-center justify-between gap-3 rounded-xl border border-purple-500/40 bg-purple-500/10 px-5 py-3 group hover:border-purple-400 transition-colors"
        >
          <span className="text-xl font-black tracking-widest text-white">FIRSTBUY</span>
          <span className="text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
            {copied ? "✓ Copied!" : "Tap to copy"}
          </span>
        </button>

        <button
          onClick={handleClaim}
          className="w-full rounded-xl py-3 text-sm font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30 active:translate-y-0"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
        >
          Shop Now →
        </button>

        <p className="mt-3 text-[0.65rem] text-gray-700">
          For research and entertainment purposes only.
        </p>
      </div>
    </div>
  );
}
