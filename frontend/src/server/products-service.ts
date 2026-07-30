import type { Repository } from "typeorm";
import type { Product } from "@/data/products";
import { getDataSource } from "./db";
import { PRODUCT_ENTITY, type ProductRow } from "./product.schema";
import { deleteUpload } from "./uploads";
import type { ProductInput } from "./validation";

/** Map a DB row to the clean, serializable shape the UI consumes. */
function toProduct(e: ProductRow): Product {
  return {
    id: e.id,
    category: e.category,
    name: e.name,
    detail: e.detail,
    description: e.description,
    lengths: e.lengths,
    price: e.price,
    oldPrice: e.oldPrice ?? undefined,
    image: e.imageUrl ?? undefined,
    badge: e.badge === "New" ? "New" : undefined,
  };
}

async function repo(): Promise<Repository<ProductRow>> {
  // Look up by the stable string name so it works across every Next bundle.
  return (await getDataSource()).getRepository<ProductRow>(PRODUCT_ENTITY);
}

/** Newest first — matches how the owner adds stock. */
export async function listProducts(): Promise<Product[]> {
  const rows = await (await repo()).find({ order: { createdAt: "DESC" } });
  return rows.map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const row = await (await repo()).findOne({ where: { id } });
  return row ? toProduct(row) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const r = await repo();
  const entity = r.create({ ...input, imageUrl: null });
  return toProduct(await r.save(entity));
}

export async function updateProduct(
  id: string,
  patch: Partial<ProductInput>,
): Promise<Product | null> {
  const r = await repo();
  const row = await r.findOne({ where: { id } });
  if (!row) return null;
  Object.assign(row, patch);
  return toProduct(await r.save(row));
}

export async function deleteProduct(id: string): Promise<boolean> {
  const r = await repo();
  const row = await r.findOne({ where: { id } });
  if (!row) return false;
  await deleteUpload(row.imageUrl);
  await r.remove(row);
  return true;
}

/** Attach a freshly uploaded photo, discarding the previous blob if any. */
export async function setProductImage(
  id: string,
  url: string,
): Promise<Product | null> {
  const r = await repo();
  const row = await r.findOne({ where: { id } });
  if (!row) return null;
  await deleteUpload(row.imageUrl);
  row.imageUrl = url;
  return toProduct(await r.save(row));
}
