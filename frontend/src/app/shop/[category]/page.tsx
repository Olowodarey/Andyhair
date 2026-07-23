import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  categoryToSlug,
  getProducts,
  slugToCategory,
} from "@/data/products";
import { SITE } from "@/lib/site";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product-grid";

type Params = { category: string };

/** Pre-render the "all" page plus one page per category at build time. */
export function generateStaticParams(): Params[] {
  return [
    { category: "all" },
    ...CATEGORIES.map((category) => ({ category: categoryToSlug(category) })),
  ];
}

/** Resolve a slug to its display title, or null if the slug is invalid. */
function resolveTitle(slug: string): string | null {
  if (slug === "all") return "All products";
  return slugToCategory(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const title = resolveTitle(category);
  if (!title) return {};
  return {
    title,
    description: `Browse ${title.toLowerCase()} from ${SITE.name} — ${SITE.description}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const title = resolveTitle(category);
  if (!title) notFound();

  const resolvedCategory = category === "all" ? null : slugToCategory(category);
  const products = resolvedCategory
    ? getProducts().filter((p) => p.category === resolvedCategory)
    : getProducts();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="flex-1">
        <header className="relative overflow-hidden bg-espresso pb-14 pt-32 sm:pb-16 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso/40 via-transparent to-espresso" />
          <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              {category === "all" ? "The full collection" : "Category"}
            </p>
            <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-champagne/70">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"} available
            </p>
          </div>
        </header>

        <section className="bg-ivory py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <CategoryNav activeSlug={category} />

            <div className="mt-10">
              <ProductGrid products={products} />
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/#shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-clay transition hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory rounded-full px-3 py-1.5"
              >
                <span aria-hidden>←</span> Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
