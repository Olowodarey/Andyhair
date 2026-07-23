import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-espresso py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div>
          <p className="font-display text-lg text-ivory">
            Andy<span className="text-gold"> Hair</span> Ventures
          </p>
          <p className="mt-1 text-sm text-champagne/60">
            {SITE.address.street}, {SITE.address.city}, {SITE.address.state} ·{" "}
            {SITE.phones.join(" · ")}
          </p>
        </div>
        <p className="text-xs text-champagne/40">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
