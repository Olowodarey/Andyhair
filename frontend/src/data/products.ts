export const CATEGORIES = [
  "Attachments",
  "Luxury Hair",
  "Wigs",
  "Extensions",
] as const;

export type Category = (typeof CATEGORIES)[number];

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
  /** Path under /public. Omit to show the "Photo coming soon" placeholder. */
  image?: string;
  badge?: "New";
}

/**
 * Product catalogue. This module is the single source of truth the UI reads
 * from — to swap in a CMS or Google Sheet later, keep the `Product` shape and
 * reimplement `getProducts()` (and update callers to await it if it becomes
 * async). No component should import product data from anywhere else.
 */
const products: Product[] = [
  {
    id: "raw-vietnamese-bone-straight",
    category: "Luxury Hair",
    name: "Raw Vietnamese Bone Straight",
    detail: "12A grade · Double drawn · Full & flat",
    description:
      "Single-donor raw Vietnamese hair, silky bone straight from root to tip. Double drawn for fullness at the ends, takes dye and heat beautifully, and lasts years with proper care.",
    lengths: [16, 18, 20, 22, 24, 26, 28, 30],
    price: 185000,
    oldPrice: 220000,
  },
  {
    id: "cambodian-deep-wave",
    category: "Luxury Hair",
    name: "Cambodian Deep Wave Bundles",
    detail: "10A grade · Natural lustre · 3-bundle deal",
    description:
      "Deep, springy waves with the natural low lustre Cambodian hair is loved for. Holds its pattern wash after wash. Sold as a three-bundle deal — enough for a full sew-in.",
    lengths: [14, 16, 18, 20, 22, 24],
    price: 145000,
    badge: "New",
  },
  {
    id: "glueless-body-wave-wig",
    category: "Wigs",
    name: "Glueless Body Wave Wig",
    detail: "13×4 HD lace · 200% density · Pre-plucked",
    description:
      "Beginner-friendly glueless unit on invisible HD lace with a pre-plucked hairline and bleached knots. 200% density body wave that moves like it grew from your scalp.",
    lengths: [18, 20, 22, 24, 26],
    price: 240000,
    oldPrice: 280000,
  },
  {
    id: "pixie-cut-fringe-wig",
    category: "Wigs",
    name: "Pixie Cut Fringe Wig",
    detail: "Machine-made · Human hair · Ready to wear",
    description:
      "A sassy, low-maintenance pixie with a soft fringe. 100% human hair, machine-made cap for everyday durability — throw it on and go.",
    lengths: [8, 10],
    price: 95000,
    badge: "New",
  },
  {
    id: "xpression-braiding-attachment",
    category: "Attachments",
    name: "X-Pression Braiding Attachment",
    detail: "Pre-stretched · Hot-water set · 3 packs",
    description:
      "Salon-favourite pre-stretched braiding fibre — lightweight, tangle-free, and kind to your scalp. Three packs per bundle, perfect for knotless braids and twists.",
    lengths: [50],
    price: 4500,
  },
  {
    id: "ombre-kanekalon-attachment",
    category: "Attachments",
    name: "Ombré Kanekalon Attachment",
    detail: "Two-tone blend · Soft yaki texture",
    description:
      "Silky kanekalon fibre in rich two-tone ombré blends. Soft yaki texture that braids smoothly and photographs beautifully.",
    lengths: [48],
    price: 6000,
    oldPrice: 7500,
  },
  {
    id: "clip-in-silky-straight",
    category: "Extensions",
    name: "Clip-In Silky Straight Set",
    detail: "7-piece set · 120g · Seamless wefts",
    description:
      "Instant length and volume with zero commitment. Seven seamless clip-in wefts in silky straight human hair — snap them in for the event, out before bed.",
    lengths: [16, 18, 20, 22],
    price: 65000,
  },
  {
    id: "tape-in-luxe-extensions",
    category: "Extensions",
    name: "Tape-In Luxe Extensions",
    detail: "40 pieces · Invisible bonds · Remy hair",
    description:
      "Featherlight tape-ins with invisible bonds that lie completely flat. Full remy cuticle-aligned hair — reusable up to three installs with proper care.",
    lengths: [14, 16, 18, 20, 22],
    price: 85000,
    oldPrice: 100000,
  },
];

/** Read the full catalogue. Swap this implementation to change data sources. */
export function getProducts(): Product[] {
  return products;
}

/** URL slug for a category, e.g. "Luxury Hair" -> "luxury-hair". */
export function categoryToSlug(category: Category): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

/** Resolve a URL slug back to a category, or null if it matches none. */
export function slugToCategory(slug: string): Category | null {
  return CATEGORIES.find((c) => categoryToSlug(c) === slug) ?? null;
}
