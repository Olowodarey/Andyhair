export const CATEGORIES = [
  "Attachments",
  "Luxury Hair",
  "Wigs",
  "Extensions",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Product shape shared across the app. This is the serializable form the UI
 * consumes — the server maps DB rows (see `src/server/products-service.ts`) to
 * this shape, and the `/api/products` route returns it. Client-safe: this
 * module must not import anything server-only (TypeORM, fs, etc.).
 */
export interface Product {
  id: string;
  category: Category;
  name: string;
  /** Short spec line shown under the name, e.g. grade and texture. */
  detail: string;
  description: string;
  /** Available lengths in inches. */
  lengths: number[];
  /** Price in Naira. */
  price: number;
  /** Previous price in Naira — presence marks the product as discounted. */
  oldPrice?: number;
  /** Public photo URL (Vercel Blob CDN). Omit to show the placeholder. */
  image?: string;
  badge?: "New";
}

/** URL slug for a category, e.g. "Luxury Hair" -> "luxury-hair". */
export function categoryToSlug(category: Category): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

/** Resolve a URL slug back to a category, or null if it matches none. */
export function slugToCategory(slug: string): Category | null {
  return CATEGORIES.find((c) => categoryToSlug(c) === slug) ?? null;
}
