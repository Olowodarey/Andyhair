"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";

/**
 * Horizontally-scrollable row of products (~2 visible on mobile, swipe for more).
 * Keeps homepage category sections compact. Owns the product-detail modal, like
 * ProductGrid. The full `/shop/[category]` pages use the vertical grid instead.
 */
export function ProductRail({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-5 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[44%] shrink-0 snap-start sm:w-56 md:w-60"
          >
            <ProductCard product={product} onSelect={setSelected} />
          </div>
        ))}
      </div>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
