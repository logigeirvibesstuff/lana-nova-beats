"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartLink() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="relative hidden sm:inline-flex items-center justify-center rounded-full font-medium text-xs px-3 py-1.5 bg-black/5 hover:bg-black/10 text-black border border-black/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lana-accent"
    >
      Cart
      {count > 0 && (
        <span className="ml-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-purple-600 px-1.5 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
