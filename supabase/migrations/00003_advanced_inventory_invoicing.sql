-- Add advanced tables for Enterprise Inventory & Invoicing

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    gst_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Warehouses
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Alter Products (Inventory)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS barcode TEXT,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS selling_price DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS max_stock INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'pcs',
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Alter Invoices
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_address TEXT,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Invoice Items
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    gst_pct DECIMAL(5,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    method TEXT NOT NULL,
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inventory Transactions (Stock Movements)
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT'
    quantity INTEGER NOT NULL,
    reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure existing tables have user_id if they were created earlier without it
ALTER TABLE IF EXISTS public.categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS public.suppliers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS public.warehouses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS public.payments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS public.inventory_transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Categories Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own categories') THEN
        CREATE POLICY "Users can view their own categories" ON public.categories FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Suppliers Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own suppliers') THEN
        CREATE POLICY "Users can view their own suppliers" ON public.suppliers FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own suppliers" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own suppliers" ON public.suppliers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own suppliers" ON public.suppliers FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Warehouses Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own warehouses') THEN
        CREATE POLICY "Users can view their own warehouses" ON public.warehouses FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own warehouses" ON public.warehouses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own warehouses" ON public.warehouses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own warehouses" ON public.warehouses FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Invoice Items Policies (Users can view items if they own the invoice)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own invoice items') THEN
        CREATE POLICY "Users can view their own invoice items" ON public.invoice_items FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = auth.uid())
        );
        CREATE POLICY "Users can insert their own invoice items" ON public.invoice_items FOR INSERT TO authenticated WITH CHECK (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = auth.uid())
        );
        CREATE POLICY "Users can update their own invoice items" ON public.invoice_items FOR UPDATE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = auth.uid())
        ) WITH CHECK (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = auth.uid())
        );
        CREATE POLICY "Users can delete their own invoice items" ON public.invoice_items FOR DELETE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = auth.uid())
        );
    END IF;
END
$$;

-- Payments Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own payments') THEN
        CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own payments" ON public.payments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own payments" ON public.payments FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Inventory Transactions Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own inventory transactions') THEN
        CREATE POLICY "Users can view their own inventory transactions" ON public.inventory_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own inventory transactions" ON public.inventory_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own inventory transactions" ON public.inventory_transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own inventory transactions" ON public.inventory_transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END
$$;
