# SmartBiz OS — Architecture

## Overview

SmartBiz OS is a Next.js 15 (App Router) application targeting Indian MSMEs. It provides Inventory Management, Invoice Management, Customer CRM, and an AI command centre — all within a macOS-inspired visual shell.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Animation | Framer Motion 12 |
| 3D | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Database | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth (email/password + OAuth) |
| AI | Vercel AI SDK (`ai@7`), OpenAI `gpt-4o-mini` |
| OCR | OCR.space API |
| State | Zustand (window manager store) |
| Tables | TanStack Table v8 |
| Forms | React Hook Form + Zod |
| Testing | Vitest (unit), Playwright (e2e) |

## Data Model

The app uses a **flat single-owner model**: every table has a `user_id UUID` column that references `auth.users(id)`. There are no organizations, teams, or multi-tenant schemas.

All database access goes through the **Supabase JavaScript client** (`@supabase/ssr`). There is no ORM.

### Tables

```
auth.users                   — Supabase managed
├── customers                — user CRM records
├── invoices                 — billing documents
│   └── invoice_items        — line items per invoice
├── products                 — inventory items
│   ├── categories           — product categories
│   ├── suppliers            — supplier records
│   └── warehouses           — warehouse/location records
├── employees                — employee records
├── payments                 — payment records against invoices
└── inventory_transactions   — stock movement log (IN/OUT/ADJUSTMENT)
```

All tables have Row Level Security (RLS) enabled with `SELECT/INSERT/UPDATE/DELETE` policies scoped to `auth.uid() = user_id`.

### 3D Position Columns (Tech Debt)

The tables `customers`, `products`, `invoices`, and `employees` carry `pos_x`, `pos_y`, `pos_z FLOAT` columns. These are used exclusively by the spatial 3D visualization (Three.js scenes). 

**This is a design compromise** — position data for a UI visualization layer does not belong in the same row as business data. It should be moved to a separate `spatial_positions` join table in a future refactor. This is tracked as tech debt.

## Auth Architecture

Authentication uses two layers (defense-in-depth):

1. **Middleware (`src/lib/supabase/middleware.ts`)**: Default-deny — every path not in the public allow-list redirects to `/login` before the request reaches any route handler. The public allow-list lives in `src/lib/auth/path-utils.ts` and is the single source of truth.

2. **Layout (`src/app/(dashboard)/layout.tsx`)**: Server Component that independently verifies the session via `supabase.auth.getUser()` and redirects to `/login` if no user is found. Acts as the second line of defense if middleware is ever misconfigured.

## API Routes

All API routes are in `src/app/api/`. They derive the authenticated user from `supabase.auth.getUser()` server-side. Client-supplied `user_id` values in request bodies are always ignored.

See `docs/API.md` for the full endpoint reference.

## Migrations

SQL migrations live in `supabase/migrations/`. They are applied manually via the Supabase Dashboard SQL Editor or a migration runner script. All migrations are idempotent (no `DROP TABLE`, use `CREATE TABLE IF NOT EXISTS` and `DO $$ IF NOT EXISTS $$` blocks). See `supabase/MIGRATIONS.md` for the full rule set.

## 3D Visual Shell

The macOS-style OS shell (draggable windows, Dock, background) is implemented in `src/components/os/`. The window manager state is handled by Zustand in `src/store/useWindowStore.ts`.

All Three.js scenes are dynamically imported with `ssr: false` to prevent hydration crashes, since WebGL requires browser APIs unavailable during server-side rendering.
