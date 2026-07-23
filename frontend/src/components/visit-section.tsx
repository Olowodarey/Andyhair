import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function VisitSection() {
  return (
    <section
      id="visit"
      className="relative scroll-mt-20 overflow-hidden bg-espresso py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Visit or call us
            </p>
            <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
              Come touch the{" "}
              <em className="bg-gradient-to-r from-gold to-gold-light bg-clip-text italic text-transparent">
                quality
              </em>{" "}
              yourself.
            </h2>
            <p className="mt-4 max-w-md text-champagne/80">
              Prefer to see and feel before you buy? Stop by the plaza — we
              love visitors. Or call us and we&apos;ll walk you through the
              current stock.
            </p>
            <a
              href={whatsappLink(
                `Hello ${SITE.name}! I'd like directions to your shop.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-espresso transition hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
            >
              Message us on WhatsApp
            </a>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-cocoa p-6 ring-1 ring-gold/20 sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                Our shop
              </dt>
              <dd className="mt-2 font-display text-lg text-ivory">
                {SITE.address.street}, {SITE.address.city},{" "}
                {SITE.address.state}
              </dd>
            </div>
            {SITE.phones.map((phone) => (
              <div
                key={phone}
                className="rounded-2xl bg-cocoa p-6 ring-1 ring-gold/20"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Call / WhatsApp
                </dt>
                <dd className="mt-2">
                  <a
                    href={`tel:+234${phone.replace(/\s/g, "").slice(1)}`}
                    className="font-display text-lg text-ivory transition hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                  >
                    {phone}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
