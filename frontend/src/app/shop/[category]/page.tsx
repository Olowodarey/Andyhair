import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  categoryToSlug,
  slugToCategory,
} from "@/data/products";
import { listProducts } from "@/server/products-service";
import { SITE } from "@/lib/site";
import { Navbar } from "@/components/navbar";
import { VisitSection } from "@/components/visit-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product-grid";

type Params = { category: string };
type Search = { page?: string };

/** Products shown per page on the category listing. */
const PAGE_SIZE = 12;

// Catalogue is DB-backed and should reflect admin changes immediately.
export const dynamic = "force-dynamic";

/** Known category slugs (used for valid-path hints; pages render per request). */
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
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { category } = await params;
  const title = resolveTitle(category);
  if (!title) notFound();

  const resolvedCategory = category === "all" ? null : slugToCategory(category);
  const all = await listProducts();
  const products = resolvedCategory
    ? all.filter((p) => p.category === resolvedCategory)
    : all;

  // Pagination — clamp the requested page into range.
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const { page: pageParam } = await searchParams;
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = products.slice(start, start + PAGE_SIZE);

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
              <ProductGrid products={pageItems} />
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
              >
                <PageLink
                  slug={category}
                  page={page - 1}
                  disabled={page <= 1}
                  label="← Prev"
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <PageLink
                    key={n}
                    slug={category}
                    page={n}
                    label={String(n)}
                    active={n === page}
                  />
                ))}
                <PageLink
                  slug={category}
                  page={page + 1}
                  disabled={page >= totalPages}
                  label="Next →"
                />
              </nav>
            )}

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

        <VisitSection />
      </main>

      <WhatsAppButton />
    </div>
  );
}

/** A single pagination control — a link, or a dimmed span when disabled. */
function PageLink({
  slug,
  page,
  label,
  active,
  disabled,
}: {
  slug: string;
  page: number;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const base =
    "inline-flex min-w-9 items-center justify-center rounded-full px-3 py-1.5 text-sm font-semibold transition";
  if (disabled) {
    return (
      <span className={`${base} cursor-not-allowed text-clay/40`}>{label}</span>
    );
  }
  if (active) {
    return (
      <span className={`${base} bg-espresso text-ivory`} aria-current="page">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`/shop/${slug}?page=${page}`}
      className={`${base} text-espresso ring-1 ring-espresso/15 hover:border-gold hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold`}
    >
      {label}
    </Link>
  );
}
