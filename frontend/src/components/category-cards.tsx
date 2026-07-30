"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, categoryToSlug } from "@/data/products";
import { useShop } from "@/components/shop-context";

export function CategoryCards() {
  const { products } = useShop();

  return (
    <section aria-label="Shop by category" className="bg-ivory">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const inCategory = products.filter((p) => p.category === category);
            // Use a product photo from this category as the card background;
            // fall back to the dark gradient when none has a photo yet.
            const bg = inCategory.find((p) => p.image)?.image;
            return (
              <Link
                key={category}
                href={`/shop/${categoryToSlug(category)}`}
                className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl p-6 text-left shadow-sm ring-1 ring-cocoa transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-gold/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {bg ? (
                  <>
                    <Image
                      src={bg}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    {/* Dark overlay keeps the gold/ivory text readable. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/20" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-cocoa to-espresso" />
                )}

                <div className="relative z-10">
                  <h3 className="font-display text-xl text-ivory">
                    {category}
                  </h3>
                  <p className="mt-1 text-sm text-champagne/80">
                    View our variety of {category}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-light transition group-hover:gap-2">
                    View more
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
