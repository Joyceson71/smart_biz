-- ============================================================
-- SmartBiz Migration 001: Initial Schema
-- Run after enabling UUID extension in Supabase
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- For full-text search

-- ── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE org_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'accountant', 'viewer');
CREATE TYPE invoice_type AS ENUM ('sale', 'purchase');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'upi', 'cheque', 'card', 'other');
CREATE TYPE discount_type AS ENUM ('percent', 'fixed');
CREATE TYPE notification_type AS ENUM ('invoice_due', 'payment_received', 'ocr_complete', 'report_ready', 'system');
CREATE TYPE reset_period AS ENUM ('never', 'yearly', 'monthly');

-- ── Organizations ─────────────────────────────────────────────────────────────

CREATE TABLE organizations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  logo_url          TEXT,
  gst_number        TEXT,
  pan_number        TEXT,
  address           JSONB,
  currency          TEXT NOT NULL DEFAULT 'INR',
  fiscal_year_start INTEGER NOT NULL DEFAULT 4,
  timezone          TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  plan              org_plan NOT NULL DEFAULT 'free',
  plan_expires_at   TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Users ─────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email                 TEXT NOT NULL UNIQUE,
  full_name             TEXT,
  avatar_url            TEXT,
  role                  user_role NOT NULL DEFAULT 'viewer',
  phone                 TEXT,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  last_seen_at          TIMESTAMPTZ,
  onboarding_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Customers ─────────────────────────────────────────────────────────────────

CREATE TABLE customers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  email               TEXT,
  phone               TEXT,
  gst_number          TEXT,
  pan_number          TEXT,
  billing_address     JSONB,
  shipping_address    JSONB,
  payment_terms_days  INTEGER NOT NULL DEFAULT 30,
  credit_limit        NUMERIC(15,2),
  notes               TEXT,
  tags                TEXT[],
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Vendors ───────────────────────────────────────────────────────────────────

CREATE TABLE vendors (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  email               TEXT,
  phone               TEXT,
  gst_number          TEXT,
  pan_number          TEXT,
  address             JSONB,
  payment_terms_days  INTEGER NOT NULL DEFAULT 30,
  notes               TEXT,
  tags                TEXT[],
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Invoice Sequence ──────────────────────────────────────────────────────────

CREATE TABLE invoice_sequence (
  organization_id  UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  prefix           TEXT NOT NULL DEFAULT 'INV',
  current_number   INTEGER NOT NULL DEFAULT 0,
  padding          INTEGER NOT NULL DEFAULT 4,
  reset_period     reset_period NOT NULL DEFAULT 'yearly',
  last_reset_at    TIMESTAMPTZ
);

-- ── Invoices ──────────────────────────────────────────────────────────────────

CREATE TABLE invoices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number    TEXT NOT NULL,
  type              invoice_type NOT NULL,
  status            invoice_status NOT NULL DEFAULT 'draft',
  customer_id       UUID REFERENCES customers(id) ON DELETE SET NULL,
  vendor_id         UUID REFERENCES vendors(id) ON DELETE SET NULL,
  issue_date        DATE NOT NULL,
  due_date          DATE NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'INR',
  subtotal          NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount_type     discount_type,
  discount_value    NUMERIC(15,2) DEFAULT 0,
  tax_amount        NUMERIC(15,2) DEFAULT 0,
  total_amount      NUMERIC(15,2) NOT NULL DEFAULT 0,
  amount_paid       NUMERIC(15,2) NOT NULL DEFAULT 0,
  amount_due        NUMERIC(15,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
  notes             TEXT,
  terms             TEXT,
  file_url          TEXT,
  ocr_raw_data      JSONB,
  ocr_confidence    NUMERIC(5,2),
  is_ocr_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, invoice_number)
);

-- ── Invoice Line Items ────────────────────────────────────────────────────────

CREATE TABLE invoice_line_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id       UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description      TEXT NOT NULL,
  quantity         NUMERIC(10,3) NOT NULL DEFAULT 1,
  unit             TEXT,
  unit_price       NUMERIC(15,2) NOT NULL,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  tax_rate         NUMERIC(5,2) DEFAULT 0,
  tax_amount       NUMERIC(15,2),
  total_amount     NUMERIC(15,2) NOT NULL,
  sort_order       INTEGER NOT NULL DEFAULT 0
);

-- ── Payments ──────────────────────────────────────────────────────────────────

CREATE TABLE payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_id       UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount           NUMERIC(15,2) NOT NULL,
  payment_date     DATE NOT NULL,
  payment_method   payment_method NOT NULL,
  reference_number TEXT,
  notes            TEXT,
  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Expenses ──────────────────────────────────────────────────────────────────

CREATE TABLE expenses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category          TEXT NOT NULL,
  description       TEXT NOT NULL,
  amount            NUMERIC(15,2) NOT NULL,
  expense_date      DATE NOT NULL,
  payment_method    payment_method NOT NULL,
  vendor_id         UUID REFERENCES vendors(id) ON DELETE SET NULL,
  receipt_url       TEXT,
  is_reimbursable   BOOLEAN NOT NULL DEFAULT FALSE,
  is_billable       BOOLEAN NOT NULL DEFAULT FALSE,
  customer_id       UUID REFERENCES customers(id) ON DELETE SET NULL,
  tags              TEXT[],
  notes             TEXT,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Notifications ─────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type             notification_type NOT NULL,
  title            TEXT NOT NULL,
  body             TEXT NOT NULL,
  action_url       TEXT,
  is_read          BOOLEAN NOT NULL DEFAULT FALSE,
  metadata         JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Audit Logs ────────────────────────────────────────────────────────────────

CREATE TABLE audit_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  action           TEXT NOT NULL,
  resource_type    TEXT NOT NULL,
  resource_id      UUID,
  old_values       JSONB,
  new_values       JSONB,
  ip_address       TEXT,
  user_agent       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX idx_invoices_org_status   ON invoices(organization_id, status);
CREATE INDEX idx_invoices_org_due_date ON invoices(organization_id, due_date);
CREATE INDEX idx_invoices_org_type     ON invoices(organization_id, type);
CREATE INDEX idx_invoices_customer     ON invoices(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX idx_payments_invoice      ON payments(invoice_id);
CREATE INDEX idx_expenses_org_date     ON expenses(organization_id, expense_date);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_audit_logs_org        ON audit_logs(organization_id, created_at DESC);
CREATE INDEX idx_customers_org         ON customers(organization_id, is_active);

-- Full text search indexes
CREATE INDEX idx_customers_search  ON customers USING GIN (to_tsvector('english', name || ' ' || COALESCE(email, '')));
CREATE INDEX idx_vendors_search    ON vendors   USING GIN (to_tsvector('english', name || ' ' || COALESCE(email, '')));
CREATE INDEX idx_invoices_search   ON invoices  USING GIN (to_tsvector('english', invoice_number || ' ' || COALESCE(notes, '')));

-- ── updated_at Triggers ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'organizations','users','customers','vendors','invoices','expenses'
  ] LOOP
    EXECUTE format('
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
    ', t);
  END LOOP;
END $$;
