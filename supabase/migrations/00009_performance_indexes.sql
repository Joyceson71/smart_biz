-- 00009_performance_indexes.sql
-- Add missing indexes on foreign keys to optimize RLS and JOIN queries

-- Core Tables
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers (user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices (user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices (customer_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products (user_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees (user_id);
CREATE INDEX IF NOT EXISTS idx_employees_parent_id ON public.employees (parent_id);

-- Advanced Inventory & Invoicing
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories (user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers (user_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_user_id ON public.warehouses (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments (invoice_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_user_id ON public.inventory_transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON public.inventory_transactions (product_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_user_id ON public.invoice_line_items (user_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON public.invoice_line_items (invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_product_id ON public.invoice_line_items (product_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products (supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_warehouse_id ON public.products (warehouse_id);

-- Other Tables
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses (user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON public.vendors (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log (user_id);
