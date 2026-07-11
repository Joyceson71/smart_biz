# Deployment Guide

SmartBiz is designed to be deployed seamlessly on Vercel (Frontend + API) and Supabase (Database + Auth).

## 1. Supabase Deployment (Backend)
1. Create a new project on [Supabase](https://supabase.com/).
2. In the Supabase SQL Editor, run the migration scripts found in `supabase/migrations/` in this order:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_functions.sql`
   - `004_seed_data.sql` (Only if you want demo data)
3. Go to **Storage** and create a public bucket named `invoices`.
4. Obtain your Project URL and Anon Key from Settings -> API.

## 2. Vercel Deployment (Frontend)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Configure the following Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `OCR_SPACE_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g., `https://smartbiz-demo.vercel.app`)
4. Deploy!

## 3. Post-Deployment Checks
- Register a test user.
- Verify that the Dashboard loads (calls `get_dashboard_stats`).
- Test the OCR upload flow (requires `OCR_SPACE_API_KEY`).
- Test the AI Assistant (requires `OPENAI_API_KEY`).
