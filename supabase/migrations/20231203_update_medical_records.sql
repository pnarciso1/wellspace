-- Start transaction
BEGIN;

-- Drop existing medical_records table if it exists
DROP TABLE IF EXISTS public.medical_records;

-- First, ensure the auth schema and users table exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.schemata 
        WHERE schema_name = 'auth'
    ) THEN
        CREATE SCHEMA IF NOT EXISTS auth;
    END IF;
END $$;

-- Create medical_records table without foreign key initially
CREATE TABLE public.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    record_type TEXT,
    UNIQUE(user_id, file_path)
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.medical_records TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Enable RLS
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own medical records" ON public.medical_records;

-- Create policy
CREATE POLICY "Users can manage their own medical records"
    ON public.medical_records
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON public.medical_records(user_id);

-- Set up storage bucket
DO $$ 
BEGIN
    -- Create bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('medical_records', 'medical_records', false)
    ON CONFLICT (id) DO NOTHING;

    -- Grant access to authenticated users
    GRANT ALL ON storage.objects TO authenticated;
    GRANT ALL ON storage.buckets TO authenticated;
END $$;

-- Drop existing storage policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can upload their own medical records" ON storage.objects;
    DROP POLICY IF EXISTS "Users can read their own medical records" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own medical records" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Create storage policies
CREATE POLICY "Users can upload their own medical records"
    ON storage.objects 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (bucket_id = 'medical_records');

CREATE POLICY "Users can read their own medical records"
    ON storage.objects 
    FOR SELECT 
    TO authenticated 
    USING (bucket_id = 'medical_records');

CREATE POLICY "Users can delete their own medical records"
    ON storage.objects 
    FOR DELETE 
    TO authenticated 
    USING (bucket_id = 'medical_records');

COMMIT;

