"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const LINKS = [
  { href: "/#shop", label: "Shop" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#visit", label: "Visit" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6"
      >
        <Link
          href="/"
          className="font-display text-lg text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
        >
          Andy<span className="text-gold"> Hair</span> Ventures
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-champagne/90 transition hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappLink(`Hello ${SITE.name}! I'd like to place an order.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-espresso transition hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
          >
            Order Now
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-10 items-center justify-center rounded-full text-ivory transition hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
            {open ? (
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="mx-4 rounded-2xl bg-cocoa/95 p-4 shadow-xl ring-1 ring-gold/20 backdrop-blur md:hidden"
        >
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-champagne transition hover:bg-espresso/60 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappLink(
                `Hello ${SITE.name}! I'd like to place an order.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-espresso transition hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
