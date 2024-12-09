-- Start transaction
BEGIN;

-- Ensure the medical_records table exists and has the correct structure
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  record_type TEXT,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Add NOT NULL constraints and default values where appropriate
ALTER TABLE medical_records
  ALTER COLUMN file_type SET NOT NULL,
  ALTER COLUMN file_name SET NOT NULL,
  ALTER COLUMN file_path SET NOT NULL,
  ALTER COLUMN file_size SET NOT NULL,
  ALTER COLUMN upload_date SET DEFAULT CURRENT_TIMESTAMP;

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON medical_records(user_id);

-- Ensure RLS is enabled
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Recreate the RLS policy to ensure it's correct
DROP POLICY IF EXISTS "Users can manage their own medical records" ON medical_records;
CREATE POLICY "Users can manage their own medical records"
ON medical_records
FOR ALL
USING (auth.uid() = user_id);

COMMIT;

