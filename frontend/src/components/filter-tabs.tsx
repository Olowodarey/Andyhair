"use client";

import { CATEGORIES } from "@/data/products";
import { useShop, type Filter } from "@/components/shop-context";

const TABS: Filter[] = ["All", ...CATEGORIES];

export function FilterTabs() {
  const { filter, setFilter } = useShop();

  return (
    <div
      role="tablist"
      aria-label="Filter products by category"
      className="flex flex-wrap justify-center gap-2"
    >
      {TABS.map((tab) => {
        const active = filter === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setFilter(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
              active
                ? "bg-espresso text-ivory shadow-sm"
                : "bg-white text-clay ring-1 ring-champagne hover:text-espresso hover:ring-gold/60"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
