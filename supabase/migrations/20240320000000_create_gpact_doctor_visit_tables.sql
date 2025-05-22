-- Start transaction
BEGIN;

-- Create enum types for GPACT symptoms
CREATE TYPE gpact_symptom_type AS ENUM (
  'fatigue',
  'pain',
  'weakness',
  'numbness',
  'tingling',
  'balance',
  'vision',
  'speech',
  'swallowing',
  'breathing',
  'bowel',
  'bladder',
  'sexual',
  'cognitive',
  'emotional',
  'sleep',
  'other'
);

CREATE TYPE gpact_symptom_frequency AS ENUM (
  'never',
  'rarely',
  'sometimes',
  'often',
  'always'
);

CREATE TYPE gpact_symptom_intensity AS ENUM (
  'mild',
  'moderate',
  'severe',
  'very_severe'
);

-- Create the main doctor visit records table
CREATE TABLE IF NOT EXISTS gpact_doctor_visit_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  doctor_name TEXT,
  visit_reason TEXT,
  diagnosis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create the symptoms table
CREATE TABLE IF NOT EXISTS gpact_doctor_visit_symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES gpact_doctor_visit_records(id) ON DELETE CASCADE,
  symptom_type gpact_symptom_type NOT NULL,
  is_present BOOLEAN DEFAULT true,
  frequency gpact_symptom_frequency,
  intensity gpact_symptom_intensity,
  treatments TEXT[] DEFAULT '{}',
  context TEXT[] DEFAULT '{}',
  time_patterns JSONB DEFAULT '{}',
  triggers JSONB DEFAULT '{}',
  affected_areas TEXT[] DEFAULT '{}',
  notes TEXT,
  symptom_start_date DATE,
  symptom_changes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_record
    FOREIGN KEY(record_id) 
    REFERENCES gpact_doctor_visit_records(id)
    ON DELETE CASCADE
);

-- Create the quality of life assessment table
CREATE TABLE IF NOT EXISTS gpact_doctor_visit_quality_of_life (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES gpact_doctor_visit_records(id) ON DELETE CASCADE,
  physical_impact INTEGER CHECK (physical_impact >= 0 AND physical_impact <= 10),
  emotional_impact INTEGER CHECK (emotional_impact >= 0 AND emotional_impact <= 10),
  social_impact INTEGER CHECK (social_impact >= 0 AND social_impact <= 10),
  work_impact INTEGER CHECK (work_impact >= 0 AND work_impact <= 10),
  overall_impact INTEGER CHECK (overall_impact >= 0 AND overall_impact <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_record
    FOREIGN KEY(record_id) 
    REFERENCES gpact_doctor_visit_records(id)
    ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gpact_visit_records_user_id ON gpact_doctor_visit_records(user_id);
CREATE INDEX IF NOT EXISTS idx_gpact_visit_records_visit_date ON gpact_doctor_visit_records(visit_date);
CREATE INDEX IF NOT EXISTS idx_gpact_visit_symptoms_record_id ON gpact_doctor_visit_symptoms(record_id);
CREATE INDEX IF NOT EXISTS idx_gpact_visit_symptoms_type ON gpact_doctor_visit_symptoms(symptom_type);
CREATE INDEX IF NOT EXISTS idx_gpact_visit_qol_record_id ON gpact_doctor_visit_quality_of_life(record_id);

-- Enable Row Level Security
ALTER TABLE gpact_doctor_visit_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpact_doctor_visit_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpact_doctor_visit_quality_of_life ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own visit records"
ON gpact_doctor_visit_records
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own symptoms"
ON gpact_doctor_visit_symptoms
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM gpact_doctor_visit_records
    WHERE id = gpact_doctor_visit_symptoms.record_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own quality of life assessments"
ON gpact_doctor_visit_quality_of_life
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM gpact_doctor_visit_records
    WHERE id = gpact_doctor_visit_quality_of_life.record_id
    AND user_id = auth.uid()
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_gpact_visit_records_updated_at
    BEFORE UPDATE ON gpact_doctor_visit_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gpact_visit_symptoms_updated_at
    BEFORE UPDATE ON gpact_doctor_visit_symptoms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gpact_visit_qol_updated_at
    BEFORE UPDATE ON gpact_doctor_visit_quality_of_life
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT; 