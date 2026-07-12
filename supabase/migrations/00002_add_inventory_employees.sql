-- Add 3D coordinates to existing tables
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS pos_x DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pos_y DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pos_z DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ltv DECIMAL(12,2) DEFAULT 0;

ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS pos_x DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pos_y DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pos_z DECIMAL(10,2) DEFAULT 0;

-- Create products (Inventory) table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Healthy',
    pos_x DECIMAL(10,2) DEFAULT 0,
    pos_y DECIMAL(10,2) DEFAULT 0,
    pos_z DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create employees (Organization) table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    productivity DECIMAL(4,2) DEFAULT 1.0,
    parent_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    pos_x DECIMAL(10,2) DEFAULT 0,
    pos_y DECIMAL(10,2) DEFAULT 0,
    pos_z DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Products Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own products') THEN
        CREATE POLICY "Users can view their own products" ON public.products FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own products') THEN
        CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own products') THEN
        CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own products') THEN
        CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Employees Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own employees') THEN
        CREATE POLICY "Users can view their own employees" ON public.employees FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own employees') THEN
        CREATE POLICY "Users can insert their own employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own employees') THEN
        CREATE POLICY "Users can update their own employees" ON public.employees FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own employees') THEN
        CREATE POLICY "Users can delete their own employees" ON public.employees FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;
END
$$;
