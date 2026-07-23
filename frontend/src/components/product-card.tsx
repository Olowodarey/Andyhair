"use client";

import Image from "next/image";
import type { Product } from "@/data/products";
import { whatsappOrderLink } from "@/lib/whatsapp";
import { DiscountBadge } from "@/components/discount-badge";
import { PriceTag } from "@/components/price-tag";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-champagne transition hover:shadow-lg hover:ring-gold/60">
      <div className="relative aspect-[4/5] overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cocoa via-espresso to-cocoa">
            <span className="text-xs uppercase tracking-[0.2em] text-champagne/60">
              Photo coming soon
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.oldPrice !== undefined && (
            <DiscountBadge price={product.price} oldPrice={product.oldPrice} />
          )}
          {product.badge && (
            <span className="inline-flex items-center rounded-full bg-gold px-2.5 py-1 text-xs font-semibold tracking-wide text-espresso">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {product.category}
        </p>
        <h3 className="font-display text-lg leading-snug text-espresso">
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="text-left after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-gold"
          >
            {product.name}
          </button>
        </h3>
        <p className="text-sm text-clay">{product.detail}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <PriceTag price={product.price} oldPrice={product.oldPrice} />
          <a
            href={whatsappOrderLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${product.name} on WhatsApp`}
            className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-espresso px-3.5 py-2 text-xs font-semibold text-ivory transition hover:bg-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <WhatsAppIcon className="size-3.5 text-whatsapp" />
            Order
          </a>
        </div>
      </div>
    </article>
  );
}
