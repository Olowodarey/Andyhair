# Andy Hair Ventures — web app

The Next.js application for Andy Hair Ventures. See the
[root README](../README.md) for the full project overview, architecture notes,
and deployment guide.

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URL, ADMIN_PASSWORD, JWT_SECRET, …
pnpm dev               # http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest suite |
| `pnpm test:watch` | Vitest in watch mode |
| `npx tsc --noEmit` | Type-check |
