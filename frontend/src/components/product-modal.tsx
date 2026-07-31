"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { discountPercent } from "@/lib/format";
import { whatsappOrderLink } from "@/lib/whatsapp";
import { PriceTag } from "@/components/price-tag";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    // Push a history entry so the device/browser Back button closes the modal
    // instead of navigating away from the page.
    window.history.pushState({ modal: true }, "");
    let closedByBack = false;

    const onPopState = () => {
      closedByBack = true;
      onClose();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      // If we closed via a button/Escape/backdrop, pop the history entry we
      // added so Back doesn't leave a dead step. If Back itself closed us, the
      // entry is already gone.
      if (!closedByBack) window.history.back();
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <button
        type="button"
        aria-label="Close product details"
        onClick={onClose}
        className="absolute inset-0 bg-espresso/70 backdrop-blur-sm"
      />
      <div className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-ivory shadow-2xl">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-gradient-to-br from-cocoa via-espresso to-cocoa">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) calc(100vw - 24px), 512px"
              className="object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-cocoa via-espresso to-cocoa">
              <span className="text-xs uppercase tracking-[0.2em] text-champagne/60">
                Photo coming soon
              </span>
            </div>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-espresso/60 text-ivory backdrop-blur transition hover:bg-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-4">
              <path
                d="m5 5 10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              {product.category}
            </p>
            <h2
              id="product-modal-title"
              className="mt-1 font-display text-2xl text-espresso"
            >
              {product.name}
            </h2>
            <p className="mt-1 text-sm text-clay">{product.detail}</p>
          </div>

          <p className="text-sm leading-relaxed text-espresso/80">
            {product.description}
          </p>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
              Available lengths
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {product.lengths.map((length) => (
                <li
                  key={length}
                  className="rounded-full bg-champagne px-3 py-1 text-xs font-medium text-espresso"
                >
                  {length}&Prime;
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PriceTag price={product.price} oldPrice={product.oldPrice} size="lg" />
            {product.oldPrice !== undefined && (
              <span className="rounded-full bg-discount/10 px-3 py-1 text-xs font-semibold text-discount">
                Save {discountPercent(product.price, product.oldPrice)}%
              </span>
            )}
          </div>

          <a
            href={whatsappOrderLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-espresso transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            <WhatsAppIcon className="size-4" />
            Order this on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
