"use client";

import { createContext, useContext, useState } from "react";
import type { Category, Product } from "@/data/products";

export type Filter = Category | "All";

interface ShopContextValue {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  /** Catalogue fetched on the server and passed down for client filtering. */
  products: Product[];
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  const [filter, setFilter] = useState<Filter>("All");

  return (
    <ShopContext.Provider value={{ filter, setFilter, products }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within a ShopProvider");
  return ctx;
}
