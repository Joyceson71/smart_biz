-- 00010_rls_performance.sql
-- Optimizes RLS policies by wrapping auth.uid() in a scalar subquery.
-- This forces PostgreSQL to evaluate the function once per query instead of once per row,
-- resulting in 5-10x faster queries on large tables.

-- ==========================================
-- 1. CUSTOMERS
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;

CREATE POLICY "Users can view their own customers" ON public.customers FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own customers" ON public.customers FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own customers" ON public.customers FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 2. INVOICES
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;

CREATE POLICY "Users can view their own invoices" ON public.invoices FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own invoices" ON public.invoices FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own invoices" ON public.invoices FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 3. PRODUCTS
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

CREATE POLICY "Users can view their own products" ON public.products FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 4. EMPLOYEES
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own employees" ON public.employees;
DROP POLICY IF EXISTS "Users can insert their own employees" ON public.employees;
DROP POLICY IF EXISTS "Users can update their own employees" ON public.employees;
DROP POLICY IF EXISTS "Users can delete their own employees" ON public.employees;

CREATE POLICY "Users can view their own employees" ON public.employees FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own employees" ON public.employees FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own employees" ON public.employees FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 5. CATEGORIES
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

CREATE POLICY "Users can view their own categories" ON public.categories FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 6. SUPPLIERS
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can insert their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can update their own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can delete their own suppliers" ON public.suppliers;

CREATE POLICY "Users can view their own suppliers" ON public.suppliers FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own suppliers" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own suppliers" ON public.suppliers FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own suppliers" ON public.suppliers FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 7. WAREHOUSES
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own warehouses" ON public.warehouses;
DROP POLICY IF EXISTS "Users can insert their own warehouses" ON public.warehouses;
DROP POLICY IF EXISTS "Users can update their own warehouses" ON public.warehouses;
DROP POLICY IF EXISTS "Users can delete their own warehouses" ON public.warehouses;

CREATE POLICY "Users can view their own warehouses" ON public.warehouses FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own warehouses" ON public.warehouses FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own warehouses" ON public.warehouses FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own warehouses" ON public.warehouses FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 8. PAYMENTS
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can update their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can delete their own payments" ON public.payments;

CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own payments" ON public.payments FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own payments" ON public.payments FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 9. INVENTORY TRANSACTIONS
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own inventory transactions" ON public.inventory_transactions;
DROP POLICY IF EXISTS "Users can insert their own inventory transactions" ON public.inventory_transactions;
DROP POLICY IF EXISTS "Users can update their own inventory transactions" ON public.inventory_transactions;
DROP POLICY IF EXISTS "Users can delete their own inventory transactions" ON public.inventory_transactions;

CREATE POLICY "Users can view their own inventory transactions" ON public.inventory_transactions FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own inventory transactions" ON public.inventory_transactions FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own inventory transactions" ON public.inventory_transactions FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own inventory transactions" ON public.inventory_transactions FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 10. EXPENSES
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;

CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own expenses" ON public.expenses FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own expenses" ON public.expenses FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 11. VENDORS
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own vendors" ON public.vendors;
DROP POLICY IF EXISTS "Users can insert their own vendors" ON public.vendors;
DROP POLICY IF EXISTS "Users can update their own vendors" ON public.vendors;
DROP POLICY IF EXISTS "Users can delete their own vendors" ON public.vendors;

CREATE POLICY "Users can view their own vendors" ON public.vendors FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own vendors" ON public.vendors FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own vendors" ON public.vendors FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own vendors" ON public.vendors FOR DELETE TO authenticated USING (user_id = (select auth.uid()));


-- ==========================================
-- 12. ACTIVITY LOG
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.activity_log;
DROP POLICY IF EXISTS "Users can insert their own activity logs" ON public.activity_log;
DROP POLICY IF EXISTS "Users can update their own activity logs" ON public.activity_log;
DROP POLICY IF EXISTS "Users can delete their own activity logs" ON public.activity_log;

CREATE POLICY "Users can view their own activity logs" ON public.activity_log FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert their own activity logs" ON public.activity_log FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update their own activity logs" ON public.activity_log FOR UPDATE USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete their own activity logs" ON public.activity_log FOR DELETE USING (user_id = (select auth.uid()));


-- ==========================================
-- 13. INVOICE ITEMS / LINE ITEMS
-- ==========================================

-- For invoice_items (from 00003_advanced_inventory_invoicing.sql)
DROP POLICY IF EXISTS "Users can view their own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can insert their own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can update their own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can delete their own invoice items" ON public.invoice_items;

CREATE POLICY "Users can view their own invoice items" ON public.invoice_items FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = (select auth.uid())));
CREATE POLICY "Users can insert their own invoice items" ON public.invoice_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = (select auth.uid())));
CREATE POLICY "Users can update their own invoice items" ON public.invoice_items FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = (select auth.uid())));
CREATE POLICY "Users can delete their own invoice items" ON public.invoice_items FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = (select auth.uid())));


-- For invoice_line_items (from 00004_invoice_line_items_rls.sql)
DROP POLICY IF EXISTS "Users can view their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can insert their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can update their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can delete their own invoice line items" ON public.invoice_line_items;

CREATE POLICY "Users can view their own invoice line items" ON public.invoice_line_items FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = (select auth.uid())));
CREATE POLICY "Users can insert their own invoice line items" ON public.invoice_line_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = (select auth.uid())));
CREATE POLICY "Users can update their own invoice line items" ON public.invoice_line_items FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = (select auth.uid())));
CREATE POLICY "Users can delete their own invoice line items" ON public.invoice_line_items FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_line_items.invoice_id AND user_id = (select auth.uid())));
