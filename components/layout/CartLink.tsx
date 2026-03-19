"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartLink() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center gap-1.5 rounded-full font-medium text-xs px-3 py-1.5 bg-black/5 hover:bg-black/10 text-black border border-black/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lana-accent"
      aria-label={`Cart${count > 0 ? `, ${count} item${count !== 1 ? "s" : ""}` : ""}`}
    >
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-purple-600 px-1.5 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
