-- Migration: 00005_expenses.sql
-- Creates the expenses table with full RLS

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'expenses') THEN
        CREATE TABLE public.expenses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            merchant TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'General',
            amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
            date DATE NOT NULL DEFAULT CURRENT_DATE,
            status TEXT NOT NULL DEFAULT 'Pending',
            notes TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

        -- Policies
        CREATE POLICY "Users can view their own expenses"
            ON public.expenses FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own expenses"
            ON public.expenses FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own expenses"
            ON public.expenses FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own expenses"
            ON public.expenses FOR DELETE
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;
END
$$;
