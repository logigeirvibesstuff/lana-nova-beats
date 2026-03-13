"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { CartItem, LicenseTierId } from "@/types/beat";
import { getBeatBySlug } from "@/data/beats";
import { getLicenseById } from "@/data/licenses";

interface CartContextValue {
  items: CartItem[];
  addItem: (beatSlug: string, licenseTierId: LicenseTierId) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  currency: string;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (beatSlug: string, licenseTierId: LicenseTierId) => {
    const beat = getBeatBySlug(beatSlug);
    const license = getLicenseById(licenseTierId);

    if (!beat || !license) {
      return;
    }

    const unitAmount = license.price;

    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.beatId === beat.id && item.licenseTierId === licenseTierId
      );

      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const id = `${beat.id}:${license.id}`;

      return [
        ...prev,
        {
          id,
          beatId: beat.id,
          licenseTierId: license.id,
          quantity: 1,
          unitAmount,
          currency: "usd",
          beatTitle: beat.title,
          licenseName: license.name,
          coverImage: beat.coverImage
        }
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.unitAmount * item.quantity,
        0
      ),
    [items]
  );

  const currency = items[0]?.currency ?? "usd";

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, subtotal, currency }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

