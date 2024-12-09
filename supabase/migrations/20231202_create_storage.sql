-- Enable storage
INSERT INTO storage.buckets (id, name)
VALUES ('medical_records', 'medical_records')
ON CONFLICT DO NOTHING;

-- Drop policies individually (more explicit approach)
DROP POLICY IF EXISTS "Users can upload their own medical records" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own medical records" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own medical records" ON storage.objects;

-- Additional safety: Drop any policy containing 'medical records' in its name
DO $$ 
DECLARE 
    pol record;
BEGIN
    FOR pol IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname LIKE '%medical records%'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Create policies
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

