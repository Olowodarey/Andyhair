"use client";

import Link from "next/link";
import {
  CATEGORIES,
  categoryToSlug,
  type Product,
} from "@/data/products";
import { ProductRail } from "@/components/product-rail";

/** How many products to load into each category's scroll rail. */
const PREVIEW = 10;

export function ShopByCategory({ products }: { products: Product[] }) {
  const sections = CATEGORIES.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  })).filter((s) => s.items.length > 0);

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

        {sections.length === 0 ? (
          <p className="mt-12 text-center text-clay">
            Products coming soon. Check back shortly.
          </p>
        ) : (
          <div className="mt-14 space-y-16">
            {sections.map(({ category, items }) => {
              const href = `/shop/${categoryToSlug(category)}`;
              return (
                <div key={category}>
                  <div className="flex items-end justify-between gap-4 border-b border-espresso/10 pb-3">
                    <h3 className="font-display text-2xl text-espresso">
                      {category}
                    </h3>
                    <Link
                      href={href}
                      className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-clay transition hover:text-espresso"
                    >
                      View more
                      <span aria-hidden>→</span>
                    </Link>
                  </div>

                  <div className="mt-6">
                    <ProductRail products={items.slice(0, PREVIEW)} />
                  </div>

                  {items.length > 2 && (
                    <div className="mt-6 flex justify-center">
                      <Link
                        href={href}
                        className="group inline-flex items-center gap-2 rounded-full border border-espresso/15 bg-white px-6 py-3 text-sm font-semibold text-espresso shadow-sm transition hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                      >
                        View more {category}
                        <span
                          aria-hidden
                          className="transition group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
