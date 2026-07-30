"use client";

import Link from "next/link";
import { categoryToSlug } from "@/data/products";
import { useShop } from "@/components/shop-context";
import { FilterTabs } from "@/components/filter-tabs";
import { ProductGrid } from "@/components/product-grid";

export function ShopSection() {
  const { filter, products } = useShop();

  const visible =
    filter === "All" ? products : products.filter((p) => p.category === filter);

  const viewAllHref =
    filter === "All" ? "/shop/all" : `/shop/${categoryToSlug(filter)}`;
  const viewAllLabel =
    filter === "All" ? "View all products" : `View all ${filter}`;

  return (
    <section id="shop" className="scroll-mt-20 bg-ivory py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            The Collection
          </p>
          <h2 className="mt-3 font-display text-3xl text-espresso sm:text-4xl">
            Shop luxury, straight from Aba
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-clay">
            Every piece is hand-inspected before it leaves our plaza. Tap a
            product for details, or order it straight away on WhatsApp.
          </p>
        </div>

        <div className="mt-8">
          <FilterTabs />
        </div>

        <div className="mt-10">
          <ProductGrid products={visible} />
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-2 rounded-full border border-espresso/15 bg-white px-7 py-3.5 text-sm font-semibold text-espresso shadow-sm transition hover:border-gold hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            {viewAllLabel}
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
