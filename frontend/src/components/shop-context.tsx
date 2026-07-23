"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Category } from "@/data/products";

export type Filter = Category | "All";

interface ShopContextValue {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  /** Set the filter and smooth-scroll the shop section into view. */
  browseCategory: (filter: Filter) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<Filter>("All");

  const browseCategory = useCallback((next: Filter) => {
    setFilter(next);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById("shop")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  return (
    <ShopContext.Provider value={{ filter, setFilter, browseCategory }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within a ShopProvider");
  return ctx;
}
