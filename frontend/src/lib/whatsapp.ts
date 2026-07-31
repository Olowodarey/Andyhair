import type { Product } from "@/data/products";
import { formatNaira } from "@/lib/format";
import { SITE } from "@/lib/site";

/** wa.me link with an optional URL-encoded pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** wa.me link pre-filled with an order message for a product. */
export function whatsappOrderLink(product: Product): string {
  const message = [
    `Hello ${SITE.name}! I'd like to order:`,
    "",
    `${product.name}`,
    `${product.detail}`,
    `Price: ${formatNaira(product.price)}`,
    "",
    // The product-page link unfurls into a rich preview (with the product
    // photo) in the WhatsApp chat once the message is sent.
    `${SITE.url}/product/${product.id}`,
  ].join("\n");
  return whatsappLink(message);
}
