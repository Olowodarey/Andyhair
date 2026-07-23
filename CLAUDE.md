# Andy Hair Ventures — Project Guide

## Overview

Marketing + catalogue website for **Andy Hair Ventures**, a luxury hair vendor at
Micro Plaza, Eyimba, Aba, Abia State, Nigeria. There is no checkout — every
"order" action opens WhatsApp (`wa.me/2347063001996`) with a pre-filled message.

Monorepo:

- `frontend/` — Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4, pnpm. **The website lives here.**
- `backend/` — NestJS scaffold, currently untouched/unused by the site.

Commands (run inside `frontend/`): `pnpm dev` · `pnpm build` · `pnpm lint` · `npx tsc --noEmit`

**Version control is handled by the owner — never run git commit/push or stage files.**

## Design system

Fonts (next/font, loaded in `src/app/layout.tsx`): **Fraunces** (`font-display`,
headings, italic gold accents) + **Jost** (`font-sans`, body).

Tokens defined in `frontend/src/app/globals.css` under `@theme` (usable as
`bg-espresso`, `text-gold`, etc.):

| Token | Hex | Use |
|---|---|---|
| `espresso` | #1B110C | dark backgrounds (hero, visit, footer) |
| `cocoa` | #2A1A12 | card gradients on dark, panels |
| `ivory` | #FAF4EB | light section background, text on dark |
| `champagne` | #EAD9C2 | soft accents, rings, muted text on dark |
| `gold` | #C6913C | primary accent, eyebrows, CTAs |
| `gold-light` | #E3B96A | gradient partner for gold, hovers |
| `clay` | #8A5A38 | muted body text on light |
| `discount` | #B3312B | discount badges/chips |
| `whatsapp` | #25D366 | WhatsApp buttons/icons |

Aesthetic rules: gold gradient italic text = `bg-gradient-to-r from-gold
to-gold-light bg-clip-text italic text-transparent` inside an `<em>`; pill
buttons (`rounded-full`); cards `rounded-2xl`; eyebrow labels = uppercase,
`tracking-[0.18em]`–`[0.3em]`, gold, semibold, tiny. The hero strand animation
is the `.strand-path` class (stroke-dashoffset keyframes in `globals.css`),
disabled under `prefers-reduced-motion`.

## Architecture & component map

All site code in `frontend/src/`; `@/*` maps to `./src/*`.

- `app/layout.tsx` — fonts, metadata (OG/Twitter, metadataBase placeholder `andyhairventures.ng` — swap when the real domain exists)
- `app/page.tsx` — assembles the homepage; holds the JSON-LD `Store` schema
- `app/shop/[category]/page.tsx` — category listing pages, statically generated (SSG) for `all` + each category slug; `notFound()` on unknown slug; has its own `generateMetadata`
- `data/products.ts` — `Product` interface, `CATEGORIES`, seed catalogue, `getProducts()`, `categoryToSlug()` / `slugToCategory()`
- `lib/site.ts` — name, address, phones, WhatsApp number (single source for contact info)
- `lib/whatsapp.ts` — `whatsappLink(message?)`, `whatsappOrderLink(product)`
- `lib/format.ts` — `formatNaira()`, `discountPercent()`

Components (`components/`, kebab-case files, named exports):

| Component | Client? | Role |
|---|---|---|
| `navbar` | ✔ | absolute-over-hero header, mobile hamburger menu |
| `hero` | – | headline, CTAs, hosts `strand-svg` |
| `strand-svg` | – | decorative animated gold curves (pathLength=1 + `.strand-path`) |
| `shop-context` | ✔ | `ShopProvider`/`useShop`: filter state + `browseCategory()` (sets filter, smooth-scrolls to `#shop`) |
| `category-cards` | ✔ | 4 quick-link cards, call `browseCategory` |
| `shop-section` | ✔ | homepage shop: filter tabs + grid + "View all" link to the category page |
| `filter-tabs` | ✔ | All/Attachments/Luxury Hair/Wigs/Extensions pills (in-page filter, `useShop`) |
| `category-nav` | – | `Link`-based category tabs used on `/shop/[category]` pages |
| `product-grid` | ✔ | shared grid + product-detail modal state; used by `shop-section` and category pages |
| `product-card` | ✔ | image or "Photo coming soon" placeholder, badges, price, Order link; card click opens modal |
| `product-modal` | ✔ | dialog: description, length chips, Save %, WhatsApp CTA. Escape/backdrop closes, focus restored, body scroll locked |
| `price-tag`, `discount-badge` | – | price + strikethrough; red −X% pill (auto-computed) |
| `why-us`, `visit-section`, `footer`, `whatsapp-icon` | – | static sections |
| `whatsapp-button` | – | floating FAB — **currently disabled** (non-clickable, see below) |

Client boundary: only interactive components carry `"use client"`; everything
else is a server component. `CategoryCards` + `ShopSection` share state via
`ShopProvider` wrapped around them in `page.tsx`.

### Routes & category pages

- `/` — homepage (single scroll page). The shop section filters in-page via
  `useShop` and has a **"View all"** button that links to the matching category
  page (`/shop/all` when the "All" tab is active, else `/shop/<slug>`).
- `/shop/<slug>` — dedicated category pages, where `<slug>` is `all` or a
  category slug (`luxury-hair`, `wigs`, `attachments`, `extensions`). Fully SSG
  (`generateStaticParams`), dark header band so the absolute navbar stays
  readable, `CategoryNav` to switch categories, "Back to home" link. Unknown
  slugs `notFound()` (404).
- Category slugs come from `categoryToSlug()` / `slugToCategory()` in
  `data/products.ts` — the single source for the name↔slug mapping.
- All internal navigation uses `next/link` (`Link`) — navbar links + logo, the
  hero "Shop the collection" CTA, "View all", `CategoryNav`, "Back to home".
  Anchors point to `/#shop` etc. so they work from category pages too. Only
  external links (`wa.me`, `tel:`) remain plain `<a>` tags.

### WhatsApp button (disabled)

The floating WhatsApp FAB (`components/whatsapp-button.tsx`) is intentionally
**disabled** — rendered as a dimmed, non-interactive, non-focusable `<div>`
(`cursor-not-allowed`, no `href`) until WhatsApp chat goes live. To re-enable,
restore the anchor with `href={whatsappLink(...)}` (see the comment in the file).
Note: the in-card "Order", modal "Order this on WhatsApp", hero, and nav "Order
Now" links are **still active** — only the floating FAB was disabled.

## How to add / edit products & discounts

Edit `frontend/src/data/products.ts` only — the UI derives everything:

- **Add a product**: append an object with unique `id` (kebab-case), a
  `category` from `CATEGORIES`, `name`, `detail` (short spec line), longer
  `description`, `lengths` (inches), `price` (Naira, plain number).
- **Discount**: set `oldPrice` higher than `price`. The red "−X%" card badge,
  strikethrough, and modal "Save X%" chip are all computed automatically.
  Remove `oldPrice` to end the sale.
- **"New" badge**: set `badge: "New"`.
- **Photo**: put the file in `frontend/public/` and set `image: "/file.jpg"`
  (rendered with next/image; omit for the cocoa "Photo coming soon" placeholder).
- **Swap to CMS/Sheet later**: keep the `Product` shape and reimplement
  `getProducts()`; components only consume that function.

## Decisions made & why

- **Modal over intercepted route** for product detail: catalogue is client-side
  static data, filtering is client state — a modal avoids server round-trips and
  keeps scroll/filter state intact.
- **React context (`ShopProvider`)** instead of prop drilling or URL params:
  the hero category cards and the shop section are sibling trees that share
  filter state; context keeps each component single-responsibility.
- **`site.ts` constants**: phone numbers/address appear in nav, hero, visit,
  footer, JSON-LD and WhatsApp messages — one edit point.
- **All seed products have no `image`** so the placeholder path is exercised;
  real photos slot in via the `image` field.
- **Fully static output** (`next build` prerenders everything) — cheap to host
  anywhere.
- Restructured the create-next-app `app/` into `src/app/` and pointed
  `@/*` → `./src/*` to match the `src/data` + `src/lib` layout.

## Current status / next steps

**Status (2026-07-23):** Site complete and verified — `tsc --noEmit`, `eslint`,
`next build` all clean; dev server renders with badges, filters, modal, JSON-LD
and WhatsApp links confirmed in output HTML. Nothing committed (owner handles git).

Update (2026-07-23): Added dedicated category pages at `/shop/<slug>` (SSG) with
"View all" links from the homepage shop section, plus a `CategoryNav` switcher;
verified all five pages return 200 and an invalid slug returns 404. Floating
WhatsApp FAB disabled (non-clickable) per request; other order links remain live.

Next steps (open):

- Replace placeholder product photos with real photography (`public/` + `image` field).
- Add a real OG image (`app/opengraph-image.png`) and favicon/brand mark.
- Swap `metadataBase`/JSON-LD `url` placeholder domain for the real one on launch.
- Decide what the NestJS `backend/` is for (orders? inventory?) — currently unused.
- Optional: wire products to a Google Sheet/CMS via `getProducts()`.
