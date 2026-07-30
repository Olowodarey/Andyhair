import { EntitySchema } from "typeorm";
import type { Category } from "@/data/products";

/**
 * Database row shape for a product. Persisted fields only — the UI-facing
 * `Product` type (in `@/data/products`) is derived from this in the service.
 */
export interface ProductRow {
  id: string;
  category: Category;
  name: string;
  detail: string;
  description: string;
  lengths: number[];
  price: number;
  oldPrice: number | null;
  /** Public Vercel Blob URL of the photo, or null. */
  imageUrl: string | null;
  badge: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Stable entity name — used for repository lookups by string. */
export const PRODUCT_ENTITY = "Product";

/**
 * Schema-based entity (not decorator-based). Next's SWC bundler minifies class
 * names and duplicates modules across the route-handler and SSR page bundles,
 * which breaks decorator entities (metadata is keyed by class identity/name).
 * EntitySchema keys metadata by the explicit string `name`, so repository
 * lookups by `PRODUCT_ENTITY` work identically from every bundle.
 */
export const ProductSchema = new EntitySchema<ProductRow>({
  name: PRODUCT_ENTITY,
  tableName: "products",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    category: { type: "varchar", length: 32 },
    name: { type: "varchar", length: 120 },
    detail: { type: "varchar", length: 200 },
    description: { type: "text" },
    lengths: { type: "int", array: true, default: () => "'{}'" },
    price: { type: "int" },
    oldPrice: { type: "int", nullable: true },
    imageUrl: { type: "varchar", length: 512, nullable: true },
    badge: { type: "varchar", length: 16, nullable: true },
    createdAt: { type: "timestamp with time zone", createDate: true },
    updatedAt: { type: "timestamp with time zone", updateDate: true },
  },
});
