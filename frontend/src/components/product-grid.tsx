"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";

/**
 * Renders a responsive product grid and owns the "open product detail" modal
 * state. Shared by the homepage shop section and the category pages.
 */
export function ProductGrid({
  products,
  emptyMessage = "No products in this category yet. Check back soon.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={setSelected}
          />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-10 text-center text-clay">{emptyMessage}</p>
      )}

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
