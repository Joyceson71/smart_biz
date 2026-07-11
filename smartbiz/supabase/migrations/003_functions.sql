-- ============================================================
-- SmartBiz Migration 003: PostgreSQL Functions & Triggers
-- Business logic implemented at the database level for performance
-- ============================================================

-- ── update_invoice_status Trigger ─────────────────────────────────────────────
-- Auto-marks invoices as 'overdue' when due_date has passed and amount_due > 0

CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When a payment is made, update invoice amount_paid and recalculate status
  IF TG_TABLE_NAME = 'payments' THEN
    UPDATE invoices
    SET
      amount_paid = (
        SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id
      ),
      status = CASE
        WHEN (total_amount - (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id)) <= 0
          THEN 'paid'::invoice_status
        WHEN (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id) > 0
          THEN 'partial'::invoice_status
        ELSE status
      END
    WHERE id = NEW.invoice_id;
    RETURN NEW;
  END IF;

  -- Overdue check on invoice update
  IF TG_TABLE_NAME = 'invoices' THEN
    IF NEW.due_date < CURRENT_DATE
       AND NEW.amount_paid < NEW.total_amount
       AND NEW.status NOT IN ('paid', 'cancelled', 'draft')
    THEN
      NEW.status = 'overdue';
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: payment insert/delete → update invoice payment status
CREATE TRIGGER on_payment_change
  AFTER INSERT OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_invoice_status();

-- Trigger: invoice update → check overdue
CREATE TRIGGER on_invoice_update
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoice_status();

-- Scheduled job (pg_cron) for overdue detection — run daily at midnight
-- Note: requires pg_cron extension (available in Supabase)
-- SELECT cron.schedule('check-overdue-invoices', '0 0 * * *', $$
--   UPDATE invoices
--   SET status = 'overdue'
--   WHERE due_date < CURRENT_DATE
--     AND amount_due > 0
--     AND status NOT IN ('paid', 'cancelled', 'draft', 'overdue');
-- $$);

-- ── generate_invoice_number ───────────────────────────────────────────────────
-- Atomically increments sequence and returns next invoice number

CREATE OR REPLACE FUNCTION generate_invoice_number(p_org_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_prefix        TEXT;
  v_current       INTEGER;
  v_padding       INTEGER;
  v_reset_period  TEXT;
  v_last_reset    TIMESTAMPTZ;
  v_should_reset  BOOLEAN := FALSE;
  v_new_number    INTEGER;
  v_result        TEXT;
BEGIN
  -- Get or create sequence record
  INSERT INTO invoice_sequence (organization_id, prefix, current_number, padding, reset_period)
  VALUES (p_org_id, 'INV', 0, 4, 'yearly')
  ON CONFLICT (organization_id) DO NOTHING;

  -- Lock the row for atomic increment
  SELECT prefix, current_number, padding, reset_period::TEXT, last_reset_at
  INTO v_prefix, v_current, v_padding, v_reset_period, v_last_reset
  FROM invoice_sequence
  WHERE organization_id = p_org_id
  FOR UPDATE;

  -- Check if reset is needed
  IF v_reset_period = 'yearly' THEN
    v_should_reset := (
      v_last_reset IS NULL OR
      EXTRACT(YEAR FROM v_last_reset) < EXTRACT(YEAR FROM NOW())
    );
  ELSIF v_reset_period = 'monthly' THEN
    v_should_reset := (
      v_last_reset IS NULL OR
      (EXTRACT(YEAR FROM v_last_reset) * 12 + EXTRACT(MONTH FROM v_last_reset)) <
      (EXTRACT(YEAR FROM NOW()) * 12 + EXTRACT(MONTH FROM NOW()))
    );
  END IF;

  IF v_should_reset THEN
    v_new_number := 1;
    UPDATE invoice_sequence
    SET current_number = 1, last_reset_at = NOW()
    WHERE organization_id = p_org_id;
  ELSE
    v_new_number := v_current + 1;
    UPDATE invoice_sequence
    SET current_number = v_new_number
    WHERE organization_id = p_org_id;
  END IF;

  -- Format: PREFIX-0001
  v_result := v_prefix || '-' || LPAD(v_new_number::TEXT, v_padding, '0');
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── get_dashboard_stats ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_dashboard_stats(
  p_org_id    UUID,
  p_start_date DATE,
  p_end_date   DATE
)
RETURNS TABLE (
  total_revenue       NUMERIC,
  total_expenses      NUMERIC,
  net_profit          NUMERIC,
  outstanding_ar      NUMERIC,
  overdue_amount      NUMERIC,
  invoice_count       BIGINT,
  paid_invoice_count  BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Total revenue from paid/partial sale invoices in period
    COALESCE((
      SELECT SUM(amount_paid)
      FROM invoices
      WHERE organization_id = p_org_id
        AND type = 'sale'
        AND status IN ('paid', 'partial', 'sent', 'viewed')
        AND issue_date BETWEEN p_start_date AND p_end_date
    ), 0) AS total_revenue,

    -- Total expenses in period
    COALESCE((
      SELECT SUM(amount)
      FROM expenses
      WHERE organization_id = p_org_id
        AND expense_date BETWEEN p_start_date AND p_end_date
    ), 0) AS total_expenses,

    -- Net profit
    COALESCE((
      SELECT SUM(amount_paid)
      FROM invoices
      WHERE organization_id = p_org_id
        AND type = 'sale'
        AND issue_date BETWEEN p_start_date AND p_end_date
    ), 0) -
    COALESCE((
      SELECT SUM(amount)
      FROM expenses
      WHERE organization_id = p_org_id
        AND expense_date BETWEEN p_start_date AND p_end_date
    ), 0) AS net_profit,

    -- Outstanding AR (amount_due on active sale invoices)
    COALESCE((
      SELECT SUM(amount_due)
      FROM invoices
      WHERE organization_id = p_org_id
        AND type = 'sale'
        AND status IN ('sent', 'viewed', 'partial')
    ), 0) AS outstanding_ar,

    -- Overdue amount
    COALESCE((
      SELECT SUM(amount_due)
      FROM invoices
      WHERE organization_id = p_org_id
        AND type = 'sale'
        AND status = 'overdue'
    ), 0) AS overdue_amount,

    -- Invoice count in period
    COALESCE((
      SELECT COUNT(*)
      FROM invoices
      WHERE organization_id = p_org_id
        AND issue_date BETWEEN p_start_date AND p_end_date
    ), 0) AS invoice_count,

    -- Paid invoice count
    COALESCE((
      SELECT COUNT(*)
      FROM invoices
      WHERE organization_id = p_org_id
        AND status = 'paid'
        AND issue_date BETWEEN p_start_date AND p_end_date
    ), 0) AS paid_invoice_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── get_cash_flow_forecast ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_cash_flow_forecast(
  p_org_id UUID,
  p_days   INTEGER DEFAULT 30
)
RETURNS TABLE (
  forecast_date   DATE,
  cash_in         NUMERIC,
  cash_out        NUMERIC,
  running_balance NUMERIC
) AS $$
DECLARE
  v_balance NUMERIC;
BEGIN
  -- Starting balance: sum of all received payments - all paid purchase invoices
  SELECT
    COALESCE(SUM(CASE WHEN i.type = 'sale' THEN p.amount ELSE -p.amount END), 0)
  INTO v_balance
  FROM payments p
  JOIN invoices i ON i.id = p.invoice_id
  WHERE i.organization_id = p_org_id;

  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE,
      CURRENT_DATE + (p_days - 1)::INTEGER,
      '1 day'::interval
    )::DATE AS d
  ),
  daily_in AS (
    SELECT due_date AS d, SUM(amount_due) AS total
    FROM invoices
    WHERE organization_id = p_org_id
      AND type = 'sale'
      AND status IN ('sent', 'viewed', 'partial', 'overdue')
      AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + (p_days - 1)
    GROUP BY due_date
  ),
  daily_out AS (
    SELECT due_date AS d, SUM(amount_due) AS total
    FROM invoices
    WHERE organization_id = p_org_id
      AND type = 'purchase'
      AND status IN ('sent', 'viewed', 'partial', 'overdue')
      AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + (p_days - 1)
    GROUP BY due_date
  )
  SELECT
    ds.d AS forecast_date,
    COALESCE(di.total, 0) AS cash_in,
    COALESCE(do2.total, 0) AS cash_out,
    v_balance + SUM(COALESCE(di.total, 0) - COALESCE(do2.total, 0))
      OVER (ORDER BY ds.d) AS running_balance
  FROM date_series ds
  LEFT JOIN daily_in  di  ON di.d  = ds.d
  LEFT JOIN daily_out do2 ON do2.d = ds.d
  ORDER BY ds.d;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── get_top_customers ─────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_top_customers(
  p_org_id UUID,
  p_limit  INTEGER DEFAULT 5,
  p_period TEXT DEFAULT 'this_month'  -- 'this_month' | 'this_quarter' | 'this_year' | 'all_time'
)
RETURNS TABLE (
  customer_id    UUID,
  customer_name  TEXT,
  total_revenue  NUMERIC,
  invoice_count  BIGINT,
  avg_days_to_pay NUMERIC
) AS $$
DECLARE
  v_start_date DATE;
BEGIN
  v_start_date := CASE p_period
    WHEN 'this_month'   THEN DATE_TRUNC('month', CURRENT_DATE)::DATE
    WHEN 'this_quarter' THEN DATE_TRUNC('quarter', CURRENT_DATE)::DATE
    WHEN 'this_year'    THEN DATE_TRUNC('year', CURRENT_DATE)::DATE
    ELSE '1900-01-01'::DATE
  END;

  RETURN QUERY
  SELECT
    c.id AS customer_id,
    c.name AS customer_name,
    COALESCE(SUM(i.amount_paid), 0) AS total_revenue,
    COUNT(i.id) AS invoice_count,
    COALESCE(AVG(
      CASE WHEN i.status = 'paid'
        THEN (SELECT MAX(payment_date) FROM payments WHERE invoice_id = i.id) - i.issue_date
        ELSE NULL
      END
    ), 0) AS avg_days_to_pay
  FROM customers c
  LEFT JOIN invoices i ON i.customer_id = c.id
    AND i.organization_id = p_org_id
    AND i.type = 'sale'
    AND i.issue_date >= v_start_date
  WHERE c.organization_id = p_org_id
    AND c.is_active = TRUE
  GROUP BY c.id, c.name
  ORDER BY total_revenue DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── search_global ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION search_global(
  p_org_id UUID,
  p_query  TEXT
)
RETURNS TABLE (
  result_type TEXT,
  id          UUID,
  title       TEXT,
  subtitle    TEXT,
  url         TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Search customers
  SELECT 'customer'::TEXT, c.id, c.name,
    COALESCE(c.email, c.phone, 'Customer'),
    ('/customers/' || c.id)::TEXT
  FROM customers c
  WHERE c.organization_id = p_org_id
    AND (
      c.name ILIKE '%' || p_query || '%'
      OR c.email ILIKE '%' || p_query || '%'
      OR c.phone ILIKE '%' || p_query || '%'
      OR c.gst_number ILIKE '%' || p_query || '%'
    )
  LIMIT 5

  UNION ALL

  -- Search vendors
  SELECT 'vendor'::TEXT, v.id, v.name,
    COALESCE(v.email, v.phone, 'Vendor'),
    ('/vendors/' || v.id)::TEXT
  FROM vendors v
  WHERE v.organization_id = p_org_id
    AND (
      v.name ILIKE '%' || p_query || '%'
      OR v.email ILIKE '%' || p_query || '%'
    )
  LIMIT 5

  UNION ALL

  -- Search invoices
  SELECT 'invoice'::TEXT, i.id, i.invoice_number,
    COALESCE(c.name, v.name, 'Invoice') || ' — ' || i.total_amount::TEXT,
    ('/invoices/' || i.id)::TEXT
  FROM invoices i
  LEFT JOIN customers c ON c.id = i.customer_id
  LEFT JOIN vendors   v ON v.id = i.vendor_id
  WHERE i.organization_id = p_org_id
    AND (
      i.invoice_number ILIKE '%' || p_query || '%'
      OR c.name ILIKE '%' || p_query || '%'
      OR v.name ILIKE '%' || p_query || '%'
    )
  LIMIT 5

  ORDER BY title
  LIMIT 15;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
