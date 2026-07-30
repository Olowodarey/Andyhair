import { CATEGORIES, type Category } from "@/data/products";

/** Validated fields for creating/replacing a product. */
export interface ProductInput {
  category: Category;
  name: string;
  detail: string;
  description: string;
  lengths: number[];
  price: number;
  oldPrice: number | null;
  badge: "New" | null;
}

export class ValidationError extends Error {}

function str(v: unknown, field: string, max: number): string {
  if (typeof v !== "string" || v.trim() === "") {
    throw new ValidationError(`${field} is required`);
  }
  const value = v.trim();
  if (value.length > max) {
    throw new ValidationError(`${field} must be ${max} characters or fewer`);
  }
  return value;
}

function intAtLeast(v: unknown, field: string, min: number): number {
  if (typeof v !== "number" || !Number.isInteger(v) || v < min) {
    throw new ValidationError(`${field} must be a whole number ≥ ${min}`);
  }
  return v;
}

function category(v: unknown): Category {
  if (!CATEGORIES.includes(v as Category)) {
    throw new ValidationError(`category must be one of: ${CATEGORIES.join(", ")}`);
  }
  return v as Category;
}

function lengths(v: unknown): number[] {
  if (
    !Array.isArray(v) ||
    v.length === 0 ||
    !v.every((n) => typeof n === "number" && Number.isInteger(n) && n > 0)
  ) {
    throw new ValidationError("lengths must be a non-empty list of positive whole numbers");
  }
  return v as number[];
}

function optionalPrice(v: unknown, field: string): number | null {
  if (v === undefined || v === null || v === "") return null;
  return intAtLeast(v, field, 0);
}

function badge(v: unknown): "New" | null {
  if (v === undefined || v === null || v === "") return null;
  if (v !== "New") throw new ValidationError('badge may only be "New"');
  return "New";
}

/** Validate a full product payload (POST). Throws ValidationError on failure. */
export function parseProductInput(body: unknown): ProductInput {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    category: category(b.category),
    name: str(b.name, "name", 120),
    detail: str(b.detail, "detail", 200),
    description: str(b.description, "description", 4000),
    lengths: lengths(b.lengths),
    price: intAtLeast(b.price, "price", 0),
    oldPrice: optionalPrice(b.oldPrice, "oldPrice"),
    badge: badge(b.badge),
  };
}

/** Validate a partial product payload (PATCH). Only provided keys are checked. */
export function parseProductPatch(body: unknown): Partial<ProductInput> {
  const b = (body ?? {}) as Record<string, unknown>;
  const patch: Partial<ProductInput> = {};
  if ("category" in b) patch.category = category(b.category);
  if ("name" in b) patch.name = str(b.name, "name", 120);
  if ("detail" in b) patch.detail = str(b.detail, "detail", 200);
  if ("description" in b) patch.description = str(b.description, "description", 4000);
  if ("lengths" in b) patch.lengths = lengths(b.lengths);
  if ("price" in b) patch.price = intAtLeast(b.price, "price", 0);
  if ("oldPrice" in b) patch.oldPrice = optionalPrice(b.oldPrice, "oldPrice");
  if ("badge" in b) patch.badge = badge(b.badge);
  return patch;
}
