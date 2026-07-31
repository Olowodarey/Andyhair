import { describe, expect, it } from "vitest";
import type { Product } from "@/data/products";
import { SITE } from "@/lib/site";
import { whatsappLink, whatsappOrderLink } from "@/lib/whatsapp";

describe("whatsappLink", () => {
  it("returns the bare wa.me link when no message is given", () => {
    expect(whatsappLink()).toBe(`https://wa.me/${SITE.whatsappNumber}`);
  });

  it("appends a URL-encoded message", () => {
    const link = whatsappLink("Hello there & welcome");
    expect(link).toBe(
      `https://wa.me/${SITE.whatsappNumber}?text=Hello%20there%20%26%20welcome`,
    );
  });

  it("round-trips the message through decodeURIComponent", () => {
    const message = "Line one\nLine two: ₦185,000";
    const url = new URL(whatsappLink(message));
    expect(url.searchParams.get("text")).toBe(message);
  });
});

describe("whatsappOrderLink", () => {
  const product: Product = {
    id: "abc",
    category: "Wigs",
    name: "Egg Curl 18″",
    detail: "HD lace, grade 12A",
    description: "A lovely wig.",
    lengths: [18],
    price: 185000,
  };

  it("builds a wa.me link to the shop number", () => {
    expect(whatsappOrderLink(product)).toContain(
      `https://wa.me/${SITE.whatsappNumber}?text=`,
    );
  });

  it("includes the site name, product name, detail and formatted price", () => {
    const url = new URL(whatsappOrderLink(product));
    const text = url.searchParams.get("text") ?? "";
    expect(text).toContain(SITE.name);
    expect(text).toContain(product.name);
    expect(text).toContain(product.detail);
    expect(text).toContain("₦185,000");
  });

  it("includes the product page link so WhatsApp shows a rich preview", () => {
    const url = new URL(whatsappOrderLink(product));
    const text = url.searchParams.get("text") ?? "";
    expect(text).toContain(`${SITE.url}/product/${product.id}`);
  });
});
