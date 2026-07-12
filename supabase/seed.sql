-- Seed Data for SmartBiz MSME Platform
-- This script safely inserts mock customers and invoices.
-- It assigns them to the FIRST user found in the auth.users table so you don't have to manually hardcode UUIDs.

DO $$
DECLARE
    first_user_id UUID;
    customer_1_id UUID := gen_random_uuid();
    customer_2_id UUID := gen_random_uuid();
    customer_3_id UUID := gen_random_uuid();
BEGIN
    -- Get the first user ID from auth.users (the account you just registered!)
    SELECT id INTO first_user_id FROM auth.users LIMIT 1;

    -- If no user exists, exit gracefully
    IF first_user_id IS NULL THEN
        RAISE NOTICE 'No user found in auth.users. Please register an account first before seeding data.';
        RETURN;
    END IF;

    -- Insert Mock Customers
    INSERT INTO public.customers (id, user_id, first_name, last_name, email, phone, status)
    VALUES 
        (customer_1_id, first_user_id, 'Acme', 'Corp', 'billing@acmecorp.com', '+1-555-0100', 'Active'),
        (customer_2_id, first_user_id, 'Global', 'Tech', 'accounts@globaltech.io', '+1-555-0200', 'Active'),
        (customer_3_id, first_user_id, 'Stark', 'Industries', 'tony@stark.com', '+1-555-0300', 'Inactive')
    ON CONFLICT DO NOTHING;

    -- Insert Mock Invoices
    INSERT INTO public.invoices (user_id, customer_id, invoice_number, amount, status, due_date)
    VALUES 
        (first_user_id, customer_1_id, 'INV-2026-001', 4500.00, 'Paid', CURRENT_DATE - INTERVAL '5 days'),
        (first_user_id, customer_1_id, 'INV-2026-002', 1250.50, 'Pending', CURRENT_DATE + INTERVAL '10 days'),
        (first_user_id, customer_2_id, 'INV-2026-003', 8900.00, 'Overdue', CURRENT_DATE - INTERVAL '15 days'),
        (first_user_id, customer_3_id, 'INV-2026-004', 25000.00, 'Paid', CURRENT_DATE - INTERVAL '30 days')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Seed data successfully inserted for user: %', first_user_id;
END
$$;
