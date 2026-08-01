import Link from "next/link";
import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { StrandSvg } from "@/components/strand-svg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-espresso">
      <StrandSvg className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso/40 via-transparent to-espresso/60" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-24 pt-32 text-center sm:px-6 sm:pb-32 sm:pt-40">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Aba · Abia State · Nigeria
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-ivory sm:text-6xl">
          Luxury hair that{" "}
          <em className="bg-gradient-to-r from-gold to-gold-light bg-clip-text italic text-transparent">
            moves
          </em>{" "}
          like it&apos;s yours.
        </h1>
        <p className="mt-6 max-w-xl text-base text-champagne/80 sm:text-lg">
          Raw bundles, HD lace wigs, attachments and extensions, hand-picked
          in {SITE.address.city} and delivered nationwide. Order in two taps on
          WhatsApp.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/#shop"
            className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-espresso transition hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
          >
            Shop the collection
          </Link>
          <a
            href={whatsappLink(
              `Hello ${SITE.name}! I'd like to make an enquiry.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-champagne/40 px-7 py-3.5 text-sm font-semibold text-champagne transition hover:border-gold hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
