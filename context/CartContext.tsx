"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Beat, CartItem, LicenseTierId } from "@/types/beat";
import { getLicenseById } from "@/data/licenses";

const VALID_CODES = ["BUY2GET1", "FIFTYBEAT"];

interface CartContextValue {
  items: CartItem[];
  addItem: (beat: Beat, licenseTierId: LicenseTierId) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  promoCode: string | null;
  promoError: string | null;
  promoDescription: string | null;
  applyPromo: (code: string) => void;
  removePromo: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getAutoDiscount(items: CartItem[]): number {
  const byLicense: Record<string, number[]> = {};
  for (const item of items) {
    if (!byLicense[item.licenseTierId]) byLicense[item.licenseTierId] = [];
    for (let i = 0; i < item.quantity; i++) {
      byLicense[item.licenseTierId].push(item.unitAmount);
    }
  }
  let disc = 0;
  for (const prices of Object.values(byLicense)) {
    if (prices.length >= 3) {
      disc += [...prices].sort((a, b) => a - b)[0];
    }
  }
  return disc;
}

function hasThreeSameLicense(items: CartItem[]): boolean {
  const byLicense: Record<string, number> = {};
  for (const item of items) {
    byLicense[item.licenseTierId] = (byLicense[item.licenseTierId] || 0) + item.quantity;
  }
  return Object.values(byLicense).some((c) => c >= 3);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const addItem = (beat: Beat, licenseTierId: LicenseTierId) => {
    const license = getLicenseById(licenseTierId);
    if (!license) return;
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.beatId === beat.id && item.licenseTierId === licenseTierId
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `${beat.id}:${license.id}`,
          beatId: beat.id,
          licenseTierId: license.id,
          quantity: 1,
          unitAmount: license.price,
          currency: "usd",
          beatTitle: beat.title,
          licenseName: license.name,
          coverImage: beat.coverImage,
        },
      ];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);

  const applyPromo = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (VALID_CODES.includes(upper)) {
      setPromoCode(upper);
      setPromoError(null);
    } else {
      setPromoError("Invalid promo code.");
    }
  };

  const removePromo = () => {
    setPromoCode(null);
    setPromoError(null);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0),
    [items]
  );

  const isAuto = hasThreeSameLicense(items);
  const promoActive = !!promoCode || isAuto;
  const autoDiscount = isAuto ? getAutoDiscount(items) : 0;
  const discount = useMemo(() => {
    if (promoCode === "FIFTYBEAT") return autoDiscount + (subtotal - autoDiscount) * 0.5;
    if (promoCode === "BUY2GET1" || isAuto) return autoDiscount;
    return 0;
  }, [items, promoCode, isAuto, autoDiscount, subtotal]);
  const total = subtotal - discount;
  const currency = items[0]?.currency ?? "usd";

  const promoDescription = promoCode === "FIFTYBEAT"
    ? "50% Off — applied"
    : isAuto
      ? "Buy 2 Get 1 Free — auto-applied"
      : promoCode === "BUY2GET1"
        ? "Buy 2 Get 1 Free — BUY2GET1 applied"
        : null;

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, clearCart,
        subtotal, discount, total, currency,
        promoCode, promoError, promoDescription,
        applyPromo, removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
