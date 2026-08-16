CREATE TABLE IF NOT EXISTS activity_log (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action      text NOT NULL,           -- 'invoice.created', 'expense.deleted', etc.
  entity_type text NOT NULL,           -- 'invoice', 'expense', 'customer'
  entity_id   uuid,
  metadata    jsonb DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_log'
    AND policyname = 'Users can view their own activity'
  ) THEN
    CREATE POLICY "Users can view their own activity"
      ON activity_log FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_log'
    AND policyname = 'Users can insert their own activity'
  ) THEN
    CREATE POLICY "Users can insert their own activity"
      ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_activity_log_user_created
  ON activity_log (user_id, created_at DESC);
