"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function RefTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      fetch(`/api/ref?ref=${ref}`);
    }
  }, [searchParams]);

  return null;
}
