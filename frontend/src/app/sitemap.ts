import type { MetadataRoute } from "next";
import { CATEGORIES, categoryToSlug } from "@/data/products";
import { listProducts } from "@/server/products-service";

export const dynamic = "force-dynamic";

const BASE = "https://andyhair.xyz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/shop/all`, changeFrequency: "weekly", priority: 0.8 },
    ...CATEGORIES.map((category) => ({
      url: `${BASE}/shop/${categoryToSlug(category)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/product/${p.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
