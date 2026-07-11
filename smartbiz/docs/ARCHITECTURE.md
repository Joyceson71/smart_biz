# System Architecture

## Overview
SmartBiz uses a modern, serverless architecture optimized for rapid development and infinite scale. It leverages Next.js App Router for server-rendered UI, Supabase for backend-as-a-service, and external APIs for AI and OCR capabilities.

## High-Level Architecture
1. **Client Layer (Next.js)**
   - **App Router**: Handles routing and Server Components.
   - **Zustand**: Manages client-side global state (UI state, Auth state).
   - **TanStack Query**: Manages asynchronous state and caching.
   - **shadcn/ui + Tailwind v4**: Provides a robust, accessible design system.

2. **API Layer (Next.js Route Handlers)**
   - `/api/ai/query`: Handles streaming requests to OpenAI. Injects user context (org ID, role) securely.
   - `/api/ocr/extract`: Coordinates file upload to Supabase Storage and calls OCR.space API.

3. **Data Layer (Supabase + PostgreSQL)**
   - **Authentication**: Supabase Auth (JWTs synced to cookies via `@supabase/ssr`).
   - **Database**: PostgreSQL with 11 core tables.
   - **ORM**: Drizzle ORM for type-safe schema definitions and migrations.
   - **Row Level Security (RLS)**: Enforces multi-tenancy. Every query is scoped to `organization_id = auth.uid()->org_id`.

## Security Model
- **Multi-tenancy**: Strict database-level isolation via RLS. Data leakage between organizations is impossible at the DB level.
- **RBAC**: Handled in Next.js middleware and DB RLS policies.
- **Edge Security**: Sensitive API keys (OpenAI, OCR) are strictly server-side.

## Diagram
\`\`\`mermaid
graph TD
    Client[Next.js Client] --> API[Next.js API Routes]
    Client --> ServerComponents[Next.js Server Components]
    ServerComponents --> Supabase[Supabase PostgreSQL]
    API --> OpenAI[OpenAI API]
    API --> OCR[OCR.space API]
    API --> SupabaseStorage[Supabase Storage]
\`\`\`
