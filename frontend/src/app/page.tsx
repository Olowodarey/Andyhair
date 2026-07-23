import { SITE } from "@/lib/site";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ShopProvider } from "@/components/shop-context";
import { CategoryCards } from "@/components/category-cards";
import { ShopSection } from "@/components/shop-section";
import { WhyUs } from "@/components/why-us";
import { VisitSection } from "@/components/visit-section";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

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

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ShopProvider>
          <CategoryCards />
          <ShopSection />
        </ShopProvider>
        <WhyUs />
        <VisitSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
