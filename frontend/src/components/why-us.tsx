const REASONS = [
  {
    title: "100% human & raw hair",
    body: "Every bundle and unit is hand-inspected — no blends, no surprises. What you order is what arrives.",
  },
  {
    title: "Aba vendor pricing",
    body: "We sell from the source at Micro Plaza, Eyimba — so you get true wholesale-friendly prices, retail welcome.",
  },
  {
    title: "Nationwide delivery",
    body: "Same-day dispatch within Aba and swift, tracked delivery to every state in Nigeria.",
  },
  {
    title: "WhatsApp-first ordering",
    body: "No carts, no forms. Message us what you want and we confirm availability, price and delivery in minutes.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="scroll-mt-20 bg-champagne/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Why Andy Hair
          </p>
          <h2 className="mt-3 font-display text-3xl text-espresso sm:text-4xl">
            Loved by stylists. Trusted by queens.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <div
              key={reason.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-champagne"
            >
              <p className="font-display text-3xl italic text-gold">
                0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-lg text-espresso">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-clay">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
