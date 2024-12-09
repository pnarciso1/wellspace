-- Check if table exists and drop if it does
DROP TABLE IF EXISTS medical_records;

-- Create medical_records table with proper foreign key constraint
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  record_type TEXT,
  CONSTRAINT medical_records_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE,
  UNIQUE(user_id, file_path)
);

-- Enable RLS
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own medical records"
ON medical_records
FOR ALL USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_medical_records_user_id ON medical_records(user_id);

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('medical_records', 'medical_records')
  ON CONFLICT DO NOTHING;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own medical records" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own medical records" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own medical records" ON storage.objects;

-- Set up storage policies
CREATE POLICY "Users can upload their own medical records"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'medical_records');

CREATE POLICY "Users can read their own medical records"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'medical_records');

CREATE POLICY "Users can delete their own medical records"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'medical_records');