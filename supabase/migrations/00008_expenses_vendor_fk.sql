-- supabase/migrations/00008_expenses_vendor_fk.sql
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS vendor_id uuid REFERENCES vendors(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_expenses_vendor_id ON expenses (vendor_id);
