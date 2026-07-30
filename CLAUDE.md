# Andy Hair Ventures — Project Guide

## Overview

Marketing + catalogue website for **Andy Hair Ventures**, a luxury hair vendor at
Micro Plaza, Eyimba, Aba, Abia State, Nigeria. There is no checkout — every
"order" action opens WhatsApp (`wa.me/2347063001996`) with a pre-filled message.

**Single Next.js app** (everything lives in `frontend/`):

- `frontend/` — Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4, pnpm.
- The catalogue is stored in **PostgreSQL via TypeORM** (Neon / Vercel Postgres);
  product photos are stored in **Vercel Blob** (object storage + CDN). The owner
  manages products through an **`/admin`** page backed by Next.js Route Handlers
  under `src/app/api/`.
- **Deploy target: Vercel** (serverless — no writable disk, hence Blob for photos
  and a pooled serverless Postgres).
- There is **no separate backend service** — an earlier NestJS scaffold was removed
  and its CRUD/auth/upload logic consolidated into this app. Recover the old NestJS
  backend from git history if ever needed.

Commands (run inside `frontend/`): `pnpm dev` · `pnpm build` · `pnpm lint` · `npx tsc --noEmit`

Env (see `frontend/.env.example`): `DATABASE_URL` (+ `DATABASE_SSL=true` for Neon),
optional `DATABASE_SCHEMA` / `DB_POOL_SIZE`, `BLOB_READ_WRITE_TOKEN` (Vercel injects
it once a Blob store is linked), `ADMIN_PASSWORD`, `JWT_SECRET`. Local dev can use
discrete `DB_HOST`/`DB_PORT`/`DB_USERNAME`/`DB_PASSWORD`/`DB_NAME` instead of
`DATABASE_URL`, and `vercel env pull` to get the Blob token.

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
- `data/products.ts` — **client-safe** `Product` interface, `CATEGORIES`, `categoryToSlug()` / `slugToCategory()`. No server imports (no TypeORM/fs) so client components can import it.
- `server/` — **server-only** data layer (never import from client components):
  - `product.schema.ts` — TypeORM `EntitySchema` (`ProductSchema`, `ProductRow`, `PRODUCT_ENTITY = "Product"`). Schema-based, **not decorators**: Turbopack minifies class names and duplicates modules across the route-handler and SSR bundles, which breaks decorator entities (`EntityMetadataNotFoundError: No metadata for "h"`). EntitySchema keys metadata by the explicit string name, and the service looks up the repo via `getRepository("Product")`, so it works from every bundle.
  - `db.ts` — `getDataSource()`, a `globalThis`-cached Postgres `DataSource` (`synchronize: true`; imports `reflect-metadata`).
  - `products-service.ts` — `listProducts / getProduct / createProduct / updateProduct / deleteProduct / setProductImage`; maps `ProductRow` → the clean `Product` (null→undefined; `imageUrl` passthrough). **Server components call these directly** (no self-fetch).
  - `uploads.ts` — `saveUpload` (validates type/size, `put()` to Vercel Blob, returns public URL) / `deleteUpload` (`del()` by URL). Requires `BLOB_READ_WRITE_TOKEN`.
  - `auth.ts` — `checkPassword`, `signAdminToken` + `isAdmin(request)` (JWT via `jose`, HS256, 7-day).
  - `validation.ts` — hand-rolled `parseProductInput` / `parseProductPatch` (no class-validator). `http.ts` — `unauthorized/notFound/badRequest` helpers.
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
  category slug (`luxury-hair`, `wigs`, `attachments`, `extensions`).
  `generateStaticParams` lists the valid slugs but the page is `force-dynamic`
  (DB-backed), dark header band so the absolute navbar stays readable,
  `CategoryNav` to switch categories, "Back to home" link. Unknown slugs
  `notFound()` (404).
- `/admin` — owner product management (login + add-with-photo + delete). A server
  wrapper sets `robots: noindex`; the UI is the `AdminDashboard` client component
  talking to the same-origin `/api/*` routes. The homepage is also
  `force-dynamic` so admin changes appear immediately.
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

Products live in Postgres and are managed by the owner through the **`/admin`**
page — no code edits needed:

- **Log in** at `/admin` with `ADMIN_PASSWORD`. The JWT is kept in `localStorage`.
- **Add a product**: fill the form (category, name, detail, description, lengths
  as comma-separated inches, price, optional old price for a discount, optional
  photo, optional "New" badge) and submit.
- **Discount**: set an old price higher than price → the red "−X%" card badge,
  strikethrough, and modal "Save X%" chip are all computed automatically.
- **Photo**: uploaded via the form to Vercel Blob; the product stores the public
  Blob URL. Omit for the cocoa "Photo coming soon" placeholder.
- **Remove**: the product list on `/admin` has a Delete button (also deletes the
  photo file).

API surface (`src/app/api/`, Node runtime, `force-dynamic`): `GET /api/products`
and `GET /api/products/[id]` are public; `POST/PATCH/DELETE /api/products[/[id]]`
and `POST /api/products/[id]/image` require the admin bearer token;
`POST /api/auth/login` mints it. Photos are served directly from the Vercel Blob
CDN (no serving route). The admin page (`components/admin-dashboard.tsx`) is a
client component talking to these same-origin routes.

**Data flow:** server components (`page.tsx`, `shop/[category]/page.tsx`) call
`listProducts()` directly and pass the array into `ShopProvider` as a prop;
client components (`category-cards`, `shop-section`) read it from `useShop()`.

## Decisions made & why

- **Modal over intercepted route** for product detail: catalogue is client-side
  static data, filtering is client state — a modal avoids server round-trips and
  keeps scroll/filter state intact.
- **React context (`ShopProvider`)** instead of prop drilling or URL params:
  the hero category cards and the shop section are sibling trees that share
  filter state; context keeps each component single-responsibility.
- **`site.ts` constants**: phone numbers/address appear in nav, hero, visit,
  footer, JSON-LD and WhatsApp messages — one edit point.
- **TypeORM `EntitySchema` over decorator entities** — decorators break under
  Turbopack (class-name minification + module duplication across bundles); the
  schema + string-name repo lookup is bundle-agnostic. See `server/product.schema.ts`.
- **DB-backed + `force-dynamic`** (not static) so the owner's admin changes are
  live instantly. `synchronize: true` (single tiny table, no migrations).
- **Photos in Vercel Blob**, not `public/` or disk — they're user-uploaded at
  runtime and Vercel is serverless (no writable/persistent disk). Blob URLs are
  stored on the product and served from Blob's CDN.
- **Consolidated into one Next.js app** (dropped the NestJS backend) — one deploy,
  one domain, no CORS, cheaper to host for a shop this small.
- Restructured the create-next-app `app/` into `src/app/` and pointed
  `@/*` → `./src/*` to match the `src/data` + `src/lib` + `src/server` layout.

## Current status / next steps

**Status (2026-07-30):** Consolidated into one Next.js app with a Postgres +
TypeORM data layer, `/admin` management page, Vercel Blob image uploads, and JWT
admin auth. `tsc --noEmit`, `eslint`, `next build` all clean (no warnings).
Smoke-tested against a local Postgres: login/guard/validation/create/SSR
render/discount/delete all pass. The Blob upload path is typed against `@vercel/blob`
but only runs where `BLOB_READ_WRITE_TOKEN` exists (Vercel, or `vercel env pull`
locally). NestJS `backend/` removed. Nothing committed (owner handles git).

Deploy on Vercel: (1) import the repo, set the project **Root Directory** to
`frontend`; (2) Storage tab → add **Postgres** (Neon) → injects `DATABASE_URL`, and
set `DATABASE_SSL=true`; (3) Storage tab → add a **Blob** store → injects
`BLOB_READ_WRITE_TOKEN`; (4) set `ADMIN_PASSWORD` + a strong `JWT_SECRET`; (5) deploy
— TypeORM auto-creates the table on first request.

Next steps (open):

- Add real product photos + catalogue via `/admin` (the 3 photos in `assets/` are
  real stock: reddish deep-wave wig, "Kinky Curly 18″", "Egg Curl 18″").
- Add a real OG image (`app/opengraph-image.png`) and favicon/brand mark.
- Swap `metadataBase`/JSON-LD `url` placeholder domain for the real one on launch.
- Re-enable the floating WhatsApp FAB when chat goes live.
