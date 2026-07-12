-- Insert Mock Data into Supabase
-- WARNING: Replace 'your-auth-user-id' with an actual auth.users ID from your Supabase Auth table.
-- If you run this directly in the SQL Editor without setting a valid user_id, it will fail due to the foreign key constraint.

DO $$
DECLARE
    uid UUID := '00000000-0000-0000-0000-000000000000'; -- Replace with your actual user ID
    ceo_id UUID;
    cto_id UUID;
    cmo_id UUID;
    customer_id_1 UUID;
BEGIN
    -- Check if user exists (fallback to avoid breaking if running in empty DB)
    IF EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
        SELECT id INTO uid FROM auth.users LIMIT 1;
    END IF;

    -- 1. Insert Customers
    INSERT INTO public.customers (user_id, first_name, last_name, email, phone, status, ltv, pos_x, pos_y, pos_z)
    VALUES 
        (uid, 'Liam', 'Johnson', 'liam@example.com', '+1 555-1234', 'Active', 4250, 0, 0, 0),
        (uid, 'Emma', 'Williams', 'emma@example.com', '+1 555-9876', 'Active', 1200, 2.5, 1.5, -2),
        (uid, 'Noah', 'Brown', 'noah@example.com', '+1 555-4567', 'Inactive', 450, -2, -1, -3),
        (uid, 'Olivia', 'Davis', 'olivia@example.com', '+1 555-2345', 'Active', 8890, -3, 2, 1)
    RETURNING id INTO customer_id_1;

    -- 2. Insert Invoices
    INSERT INTO public.invoices (user_id, customer_id, invoice_number, amount, status, due_date, pos_x, pos_y, pos_z)
    VALUES
        (uid, customer_id_1, 'INV-001', 250.00, 'Paid', '2026-07-10', -4, 2, -2),
        (uid, customer_id_1, 'INV-002', 1200.00, 'Pending', '2026-07-11', -2, 0, 0),
        (uid, customer_id_1, 'INV-003', 450.00, 'Overdue', '2026-07-05', 0, 2, 2);

    -- 3. Insert Products (Inventory)
    INSERT INTO public.products (user_id, name, sku, stock, status, pos_x, pos_y, pos_z)
    VALUES
        (uid, 'Premium Widget A', 'WGT-001', 145, 'Healthy', -3, 0, -2),
        (uid, 'Standard Gizmo', 'GZM-102', 12, 'Low', 0, 0, -2),
        (uid, 'Enterprise Server Rack', 'SRV-X9', 4, 'Critical', 3, 0, -2),
        (uid, 'Optical Switch', 'OPT-44', 89, 'Healthy', -3, 0, 2);

    -- 4. Insert Employees (Organization)
    INSERT INTO public.employees (user_id, name, role, department, productivity, pos_x, pos_y, pos_z)
    VALUES (uid, 'Sarah Connor', 'CEO', 'Executive', 0.95, 0, 4, 0) RETURNING id INTO ceo_id;

    INSERT INTO public.employees (user_id, name, role, department, productivity, parent_id, pos_x, pos_y, pos_z)
    VALUES (uid, 'John Smith', 'CTO', 'Engineering', 0.88, ceo_id, -4, 1, 0) RETURNING id INTO cto_id;

    INSERT INTO public.employees (user_id, name, role, department, productivity, parent_id, pos_x, pos_y, pos_z)
    VALUES (uid, 'Emily Chen', 'CMO', 'Marketing', 0.92, ceo_id, 4, 1, 0) RETURNING id INTO cmo_id;

    INSERT INTO public.employees (user_id, name, role, department, productivity, parent_id, pos_x, pos_y, pos_z)
    VALUES 
        (uid, 'Alice Wang', 'Senior Dev', 'Engineering', 0.98, cto_id, -6, -2, 2),
        (uid, 'Bob Martin', 'Backend Dev', 'Engineering', 0.75, cto_id, -4, -2, -2),
        (uid, 'Diana Prince', 'Growth Lead', 'Marketing', 0.91, cmo_id, 2, -2, 2);

END
$$;
