<p align="center">
  <img src="frontend/public/logo-source.png" alt="Andy Hair Ventures" width="540">
</p>

<h1 align="center">Andy Hair Ventures</h1>

<p align="center">
  A luxury hair catalogue & storefront for a real vendor in Aba, Nigeria —
  browse the collection, view product detail, and order in one tap over WhatsApp.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-TypeORM-4169E1?logo=postgresql&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white">
  <img alt="Tests" src="https://img.shields.io/badge/tests-68_passing-brightgreen?logo=vitest&logoColor=white">
</p>

---

## Overview

**Andy Hair Ventures** is a production website for a luxury hair vendor at Micro
Plaza, Eyimba, Aba — raw human hair, HD lace wigs, braiding attachments and
extensions.

The business runs on WhatsApp, so the site has **no checkout**: every "Order"
action deep-links to WhatsApp with a pre-filled message (product, spec, price).
The catalogue itself is fully dynamic — the owner adds, edits, prices and
photographs stock through a password-protected **`/admin`** dashboard, and
changes go live instantly with no redeploy.

Built as a **single Next.js 16 App-Router app** designed for serverless
deployment on Vercel.

> **Live demo:** _add your deployed URL here_

## Features

**Storefront**
- Editorial hero, category quick-links, and a filterable product grid
- Product detail in an accessible modal — focus trapping, `Escape`/backdrop
  close, body-scroll lock, and mobile **Back-button** dismissal via the History API
- Automatic discount math — an old price renders a strikethrough, a `−X%` card
  badge, and a "Save X%" chip, all computed from the two numbers
- Dedicated, SEO-friendly category pages (`/shop/<category>`)
- One-tap WhatsApp ordering with a pre-filled, product-specific message
- Fully responsive, with `prefers-reduced-motion` respected on the animated hero

**Admin (`/admin`)**
- JWT-authenticated dashboard (login → add product with photo → delete)
- Image uploads to object storage with type/size validation
- Server-side input validation on every write

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React Server Components) |
| Language | TypeScript (`strict`) |
| Styling | Tailwind CSS v4 with a custom design-token theme |
| Fonts | Fraunces (display) + Jost (body) via `next/font` |
| Database | PostgreSQL (Neon / serverless) via **TypeORM** |
| Image storage | Vercel Blob (object storage + CDN) |
| Auth | JWT (HS256) with `jose` |
| Testing | Vitest + Testing Library (jsdom & node) |
| Hosting | Vercel (serverless functions) |

## Architecture highlights

A few decisions worth calling out — they're the parts I'd walk an interviewer through:

- **Serverless-first data layer.** Vercel functions have no writable disk, so
  product photos live in **Vercel Blob** (CDN-served) and the DB is a pooled
  serverless Postgres. Server Components query the data layer directly — no
  internal self-`fetch`.

- **TypeORM `EntitySchema`, not decorator entities.** Turbopack minifies class
  names and duplicates modules across the route-handler and SSR bundles, which
  breaks decorator-based entities (`No metadata for "h"`). Schema-based entities
  keyed by a stable string name resolve identically from every bundle — a subtle
  bundler/ORM interaction that took real debugging to pin down.

- **Strict server/client boundary.** Client-safe types and helpers live apart
  from the server-only data layer, so interactive components never accidentally
  pull TypeORM or `fs` into the browser bundle. Pages are `force-dynamic` so the
  owner's admin edits appear immediately.

- **Zero-dependency validation & auth.** Request validation is hand-rolled
  (no class-validator) and admin sessions are signed JWTs — small, auditable, and
  dependency-light.

- **Design system in tokens.** Brand colours (`espresso`, `gold`, `champagne`, …)
  and typography are defined once as Tailwind theme tokens and reused everywhere,
  including the SVG favicon/logo pipeline.

## Testing

A **68-test Vitest suite** covers both the UI and the server layer:

- **Server:** input validation (create + patch), JWT auth (sign/verify, expiry,
  tampering), HTTP helpers, and the full product CRUD service — with the database
  and blob storage mocked, so it runs anywhere with no Postgres or tokens.
- **UI:** currency/discount formatting, WhatsApp link building, category
  slug mapping, and component behaviour (price tag, and the product modal's four
  close paths including Back-button/`popstate`).

```bash
cd frontend
pnpm test          # run once
pnpm test:watch    # watch mode
```

## Getting started

```bash
cd frontend
pnpm install
cp .env.example .env    # then fill in the values below
pnpm dev               # http://localhost:3000
```

Local development can point at a local Postgres (via the discrete
`DB_HOST`/`DB_PORT`/… vars) instead of a full `DATABASE_URL`.

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (`DATABASE_SSL=true` for Neon) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (injected by Vercel; `vercel env pull` locally) |
| `ADMIN_PASSWORD` | Password for the `/admin` login |
| `JWT_SECRET` | Secret used to sign admin session tokens |

### Scripts (run inside `frontend/`)

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Run the Vitest suite |
| `npx tsc --noEmit` | Type-check |

## Deployment (Vercel)

1. Import the repo and set the project **Root Directory** to `frontend`.
2. **Storage → Postgres** (Neon) to inject `DATABASE_URL`; set `DATABASE_SSL=true`.
3. **Storage → Blob** to inject `BLOB_READ_WRITE_TOKEN`.
4. Set `ADMIN_PASSWORD` and a strong `JWT_SECRET`.
5. Deploy — TypeORM creates the table on first request.

## Project structure

```
frontend/
├── src/
│   ├── app/            # App Router: pages, layout, /admin, API route handlers
│   ├── components/     # UI (server & client components)
│   ├── data/           # client-safe types + category helpers
│   ├── lib/            # site constants, formatting, WhatsApp links
│   └── server/         # server-only: DB, TypeORM schema, services, auth, uploads
└── public/             # logo & brand assets
```

---

<p align="center"><sub>Built by Olowodarey · Aba, Nigeria</sub></p>
