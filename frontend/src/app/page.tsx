import { SITE } from "@/lib/site";
import { listProducts } from "@/server/products-service";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ShopByCategory } from "@/components/shop-by-category";
import { VisitSection } from "@/components/visit-section";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

// Catalogue is DB-backed and should reflect admin changes immediately.
export const dynamic = "force-dynamic";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE.name,
  description: SITE.description,
  telephone: "+2347063001996",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.state,
    addressCountry: "NG",
  },
  url: "https://andyhairventures.ng",
  priceRange: "₦₦",
  currenciesAccepted: "NGN",
};

export default async function Home() {
  const products = await listProducts();

  return (
    <div id="top" className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ShopByCategory products={products} />
        <VisitSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
