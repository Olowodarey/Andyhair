import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryToSlug } from "@/data/products";
import { discountPercent } from "@/lib/format";
import { SITE } from "@/lib/site";
import { whatsappOrderLink } from "@/lib/whatsapp";
import { getProduct } from "@/server/products-service";
import { Navbar } from "@/components/navbar";
import { PriceTag } from "@/components/price-tag";
import { VisitSection } from "@/components/visit-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

type Params = { id: string };

// DB-backed and should reflect admin changes immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };

  const description = `${product.detail}. ${product.description}`.slice(0, 160);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: `${product.name} · ${SITE.name}`,
      description,
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Dark band so the absolute navbar stays legible. */}
        <div className="bg-espresso pt-24 sm:pt-28" />

        <section className="bg-ivory py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-clay">
              <Link href="/#shop" className="hover:text-espresso">
                Shop
              </Link>
              <span aria-hidden>/</span>
              <Link
                href={`/shop/${categoryToSlug(product.category)}`}
                className="hover:text-espresso"
              >
                {product.category}
              </Link>
              <span aria-hidden>/</span>
              <span className="text-espresso">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-cocoa via-espresso to-cocoa ring-1 ring-champagne">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 512px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-champagne/60">
                      Photo coming soon
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  {product.category}
                </p>
                <h1 className="mt-2 font-display text-3xl text-espresso sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-2 text-clay">{product.detail}</p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <PriceTag
                    price={product.price}
                    oldPrice={product.oldPrice}
                    size="lg"
                  />
                  {product.oldPrice !== undefined && (
                    <span className="rounded-full bg-discount/10 px-3 py-1 text-xs font-semibold text-discount">
                      Save {discountPercent(product.price, product.oldPrice)}%
                    </span>
                  )}
                </div>

                <p className="mt-6 text-sm leading-relaxed text-espresso/80">
                  {product.description}
                </p>

                <div className="mt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
                    Available lengths
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {product.lengths.map((length) => (
                      <li
                        key={length}
                        className="rounded-full bg-champagne px-3 py-1 text-xs font-medium text-espresso"
                      >
                        {length}&Prime;
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={whatsappOrderLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-espresso transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                >
                  <WhatsAppIcon className="size-4" />
                  Order this on WhatsApp
                </a>

                <Link
                  href="/#shop"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-clay transition hover:text-espresso"
                >
                  <span aria-hidden>←</span> Back to shop
                </Link>
              </div>
            </div>
          </div>
        </section>

        <VisitSection />
      </main>

      <WhatsAppButton />
    </div>
  );
}
