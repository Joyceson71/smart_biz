-- ============================================================
-- SmartBiz Migration 002: Row Level Security Policies
-- Enforces multi-tenant data isolation at the database level
-- ============================================================

-- Helper function: get current user's organization_id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Organizations ─────────────────────────────────────────────────────────────

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organizations_select" ON organizations
  FOR SELECT USING (id = get_user_org_id());

CREATE POLICY "organizations_update_owner_only" ON organizations
  FOR UPDATE USING (
    id = get_user_org_id()
    AND get_user_role() = 'owner'
  );

-- ── Users ─────────────────────────────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_org_isolation" ON users
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "users_insert_owner_admin" ON users
  FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin')
  );

CREATE POLICY "users_update_self_or_admin" ON users
  FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND (id = auth.uid() OR get_user_role() IN ('owner', 'admin'))
  );

CREATE POLICY "users_delete_owner_only" ON users
  FOR DELETE USING (
    organization_id = get_user_org_id()
    AND get_user_role() = 'owner'
    AND id != auth.uid()  -- Cannot delete yourself
  );

-- ── Customers ─────────────────────────────────────────────────────────────────

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_org_isolation" ON customers
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "customers_insert" ON customers
  FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "customers_update" ON customers
  FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "customers_delete" ON customers
  FOR DELETE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin')
  );

-- ── Vendors ───────────────────────────────────────────────────────────────────

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vendors_org_isolation" ON vendors
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "vendors_insert" ON vendors
  FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "vendors_update" ON vendors
  FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "vendors_delete" ON vendors
  FOR DELETE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin')
  );

-- ── Invoices ──────────────────────────────────────────────────────────────────

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_org_isolation" ON invoices
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "invoices_insert" ON invoices
  FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "invoices_update" ON invoices
  FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "invoices_delete" ON invoices
  FOR DELETE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin')
  );

-- ── Invoice Line Items ────────────────────────────────────────────────────────

ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_line_items_via_invoice" ON invoice_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_line_items.invoice_id
        AND invoices.organization_id = get_user_org_id()
    )
  );

CREATE POLICY "invoice_line_items_insert" ON invoice_line_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_line_items.invoice_id
        AND invoices.organization_id = get_user_org_id()
    )
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "invoice_line_items_update" ON invoice_line_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_line_items.invoice_id
        AND invoices.organization_id = get_user_org_id()
    )
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "invoice_line_items_delete" ON invoice_line_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_line_items.invoice_id
        AND invoices.organization_id = get_user_org_id()
    )
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

-- ── Payments ──────────────────────────────────────────────────────────────────

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_org_isolation" ON payments
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "payments_insert" ON payments
  FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "payments_delete" ON payments
  FOR DELETE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin')
  );

-- ── Expenses ──────────────────────────────────────────────────────────────────

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expenses_org_isolation" ON expenses
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "expenses_insert" ON expenses
  FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "expenses_update" ON expenses
  FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin', 'accountant')
  );

CREATE POLICY "expenses_delete" ON expenses
  FOR DELETE USING (
    organization_id = get_user_org_id()
    AND get_user_role() IN ('owner', 'admin')
  );

-- ── Notifications ─────────────────────────────────────────────────────────────

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own_user" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_mark_read" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ── Audit Logs ────────────────────────────────────────────────────────────────

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_org_read" ON audit_logs
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "audit_logs_insert_only" ON audit_logs
  FOR INSERT WITH CHECK (organization_id = get_user_org_id());

-- Nobody can UPDATE or DELETE audit logs (no policies = denied)

-- ── Invoice Sequence ──────────────────────────────────────────────────────────

ALTER TABLE invoice_sequence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_sequence_org" ON invoice_sequence
  FOR ALL USING (organization_id = get_user_org_id());
