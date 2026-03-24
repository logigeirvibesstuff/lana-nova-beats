"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const {
    items, removeItem, clearCart,
    subtotal, discount, total, currency,
    promoCode, promoError, promoDescription,
    applyPromo, removePromo,
  } = useCart();
  const [codeInput, setCodeInput] = useState("");

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount);

  const hasItems = items.length > 0;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-800">Cart</p>
        <h1 className="section-title">Your cart</h1>
        <p className="section-subtitle">Review your selected beats and licenses before heading to checkout.</p>
      </header>

      {!hasItems ? (
        <div className="card-surface p-6 text-sm text-gray-700">
          <p>Your cart is empty.</p>
          <Link href="/beats" className="mt-3 inline-flex">
            <Button size="sm">Browse beats</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="card-surface divide-y divide-white/5">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.coverImage} alt={item.beatTitle} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.beatTitle}</p>
                    <p className="text-xs text-gray-500">{item.licenseName}</p>
                    <p className="mt-1 text-[0.7rem] text-gray-500">Qty {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <p className="font-semibold">{formatMoney(item.unitAmount * item.quantity)}</p>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo code */}
          <div className="card-surface p-4 space-y-3">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-700 font-medium">Promo code</p>
            {promoCode ? (
              <div className="flex items-center justify-between">
                <span className="text-green-600 text-sm font-semibold">✓ {promoDescription}</span>
                <button onClick={removePromo} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Remove</button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo(codeInput)}
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 transition-colors bg-white"
                  />
                  <Button size="sm" onClick={() => applyPromo(codeInput)}>Apply</Button>
                </div>
                {promoDescription && (
                  <p className="text-green-600 text-xs font-semibold">✓ {promoDescription}</p>
                )}
              </>
            )}
            {promoError && <p className="text-xs text-red-500">{promoError}</p>}
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700 space-y-1">
              <p>Subtotal: <span className="font-semibold text-gray-900">{formatMoney(subtotal)}</span></p>
              {discount > 0 && (
                <p className="text-green-600 font-semibold">Discount: −{formatMoney(discount)}</p>
              )}
              <p className="font-bold text-gray-900 text-base">Total: {formatMoney(total)}</p>
              <p className="text-[0.7rem] text-gray-500">Taxes and fees are calculated at checkout.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" size="sm" onClick={clearCart}>Clear cart</Button>
              <Link href="/checkout">
                <Button size="md">Proceed to checkout</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
