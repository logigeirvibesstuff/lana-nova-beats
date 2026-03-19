"use client";

import React, { Suspense } from "react";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { CartProvider } from "@/context/CartContext";
import { RefTracker } from "@/components/RefTracker";
import { FirstPurchasePopup } from "@/components/FirstPurchasePopup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AudioPlayerProvider>
      <CartProvider>
        <Suspense>
          <RefTracker />
        </Suspense>
        <FirstPurchasePopup />
        {children}
      </CartProvider>
    </AudioPlayerProvider>
  );
}

