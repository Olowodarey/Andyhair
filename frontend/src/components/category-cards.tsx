"use client";

import { CATEGORIES, getProducts, type Category } from "@/data/products";
import { useShop } from "@/components/shop-context";

const CATEGORY_BLURBS: Record<Category, string> = {
  Attachments: "Braiding fibre for knotless, twists & more",
  "Luxury Hair": "Raw & virgin bundles that last for years",
  Wigs: "HD lace units, glueless & ready to wear",
  Extensions: "Clip-ins & tape-ins for instant length",
};

export function CategoryCards() {
  const { browseCategory } = useShop();
  const products = getProducts();

  return (
    <section aria-label="Shop by category" className="bg-ivory">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const count = products.filter(
              (p) => p.category === category,
            ).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => browseCategory(category)}
                className="group rounded-2xl bg-gradient-to-br from-cocoa to-espresso p-6 text-left shadow-sm ring-1 ring-cocoa transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-gold/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {count} {count === 1 ? "style" : "styles"}
                </p>
                <h3 className="mt-2 font-display text-xl text-ivory">
                  {category}
                </h3>
                <p className="mt-1 text-sm text-champagne/70">
                  {CATEGORY_BLURBS[category]}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-light transition group-hover:gap-2">
                  Shop now
                  <span aria-hidden>→</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
