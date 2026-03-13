"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import dynamic from "next/dynamic";

const PayPalScriptProvider = dynamic(
  () => import("@paypal/react-paypal-js").then((m) => m.PayPalScriptProvider),
  { ssr: false }
);
const PayPalButtons = dynamic(
  () => import("@paypal/react-paypal-js").then((m) => m.PayPalButtons),
  { ssr: false }
);

export default function CheckoutPage() {
  const { items, subtotal, currency, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const orderItemsRef = useRef<{ beatId: string; licenseId: string; unitAmount: number }[]>([]);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);

  const hasItems = items.length > 0;

  useEffect(() => {
    if (!hasItems) {
      router.replace("/cart");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
      }}
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            Checkout
          </p>
          <h1 className="section-title">Review & pay</h1>
          <p className="section-subtitle">
            Confirm your beats and licenses, then complete payment below.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="card-surface divide-y divide-white/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{item.beatTitle}</p>
                  <p className="text-xs text-gray-300">{item.licenseName}</p>
                  <p className="mt-1 text-[0.7rem] text-gray-500">
                    Quantity {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatMoney(item.unitAmount * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <aside className="card-surface flex flex-col gap-5 p-5 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Subtotal</span>
                <span className="font-semibold text-white">
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400" role="alert">
                {error}
              </p>
            )}

            <PayPalButtons
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
              createOrder={async () => {
                setError(null);
                const res = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    items: items.map((item) => ({
                      beatId: item.beatId,
                      licenseTierId: item.licenseTierId,
                      quantity: item.quantity,
                    })),
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Order creation failed.");
                orderItemsRef.current = data.items;
                return data.orderId;
              }}
              onApprove={async (data) => {
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: data.orderID, items: orderItemsRef.current }),
                });
                const result = await res.json();
                if (!res.ok) {
                  setError(result.error || "Payment capture failed.");
                  return;
                }
                router.push(`/success?orderId=${result.orderId}&token=${result.token}`);
                clearCart();
              }}
              onError={() => {
                setError("Payment failed. Please try again.");
              }}
            />

            <p className="text-[0.65rem] text-gray-500">
              Pay securely with PayPal or debit/credit card. No PayPal account required.
            </p>
          </aside>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
