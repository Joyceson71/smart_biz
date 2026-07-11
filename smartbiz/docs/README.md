# SmartBiz — MSME Idea Hackathon 6.0

SmartBiz is an AI-powered business management platform purpose-built for Micro, Small & Medium Enterprises (MSMEs) in India and emerging markets. It bridges the gap for small businesses by replacing 5-7 disconnected tools (spreadsheets, WhatsApp, manual ledgers) with one intelligent platform.

## Features

- **OCR Invoice Scanning**: Upload PDF/Images to automatically extract vendor, amount, date, and tax details using OCR.
- **AI Business Assistant**: Ask questions in plain English (e.g., "Show my top expenses this month") and get contextual answers.
- **Cash Flow Forecast**: 30-day projection of cash inflows and outflows.
- **GST-Ready**: Tracks Indian GST numbers and tax amounts.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Owner, Admin, Accountant, and Viewer.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui
- **State**: Zustand (global), TanStack Query (server state)
- **Database & Auth**: Supabase (PostgreSQL), Supabase Auth
- **ORM**: Drizzle ORM
- **AI & OCR**: OpenAI SDK, OCR.space API

## Local Development Setup

1. **Clone & Install Dependencies**
   ```bash
   git clone <repo>
   cd smartbiz
   pnpm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in the values:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (for AI Assistant)
   - `OCR_SPACE_API_KEY` (for Invoice OCR)

3. **Database Setup**
   Ensure your Supabase project is running.
   ```bash
   pnpm drizzle-kit push
   ```
   *Note: Ensure you run the SQL migrations in `supabase/migrations/` sequentially in your Supabase SQL Editor to apply RLS, functions, and seed data.*

4. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` to view the app.

## Hackathon Demo Mode
For the hackathon, you can run the app without API keys by relying on the built-in mocks (e.g., the AI route and OCR route will return static mock data if keys are absent).
