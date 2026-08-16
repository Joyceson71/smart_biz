-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Active',
    balance DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Users can view their own vendors'
    ) THEN
        CREATE POLICY "Users can view their own vendors" ON vendors FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Users can insert their own vendors'
    ) THEN
        CREATE POLICY "Users can insert their own vendors" ON vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Users can update their own vendors'
    ) THEN
        CREATE POLICY "Users can update their own vendors" ON vendors FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Users can delete their own vendors'
    ) THEN
        CREATE POLICY "Users can delete their own vendors" ON vendors FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
