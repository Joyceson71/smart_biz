# SmartBiz OS — Deployment Guide

## Prerequisites

- Node.js 20+
- A Supabase project (free tier works)
- OpenAI API key (`gpt-4o-mini` access)
- OCR.space API key (free tier: 500 pages/month)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values. See `.env.example` for descriptions.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `OCRSPACE_API_KEY`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

Run all SQL migrations in order via the Supabase Dashboard SQL Editor:

```
supabase/migrations/00001_init.sql
supabase/migrations/00002_products_employees.sql
supabase/migrations/00003_advanced_inventory_invoicing.sql
```

All migrations are **idempotent** — safe to re-run. See `supabase/MIGRATIONS.md` for rules.

## Vercel Deployment

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Set environment variables in the Vercel dashboard (same as `.env.local`).
4. Deploy. The build command is `next build --turbopack`.

> **Important:** Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel's environment variables — these are required at build time.

## Vercel Supabase Auth Callback

In your Supabase project → Authentication → URL Configuration, add:

```
https://your-vercel-domain.vercel.app/api/auth/callback
```

as an allowed redirect URL for OAuth to work.

## Running Tests

```bash
# Unit tests (Vitest)
npm test

# E2E tests (Playwright) — requires running dev server
npm run dev &
npm run test:e2e
```

## Build Verification

```bash
npm run build
```

Must exit with code 0. Fix any TypeScript or ESLint errors before deploying.
