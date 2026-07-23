import Link from "next/link";
import { CATEGORIES, categoryToSlug } from "@/data/products";

const TABS = [
  { slug: "all", label: "All" },
  ...CATEGORIES.map((category) => ({
    slug: categoryToSlug(category),
    label: category,
  })),
];

/** Category switcher for the shop pages. `activeSlug` is "all" or a category slug. */
export function CategoryNav({ activeSlug }: { activeSlug: string }) {
  return (
    <nav
      aria-label="Product categories"
      className="flex flex-wrap justify-center gap-2"
    >
      {TABS.map((tab) => {
        const active = tab.slug === activeSlug;
        return (
          <Link
            key={tab.slug}
            href={`/shop/${tab.slug}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
              active
                ? "bg-espresso text-ivory shadow-sm"
                : "bg-white text-clay ring-1 ring-champagne hover:text-espresso hover:ring-gold/60"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
