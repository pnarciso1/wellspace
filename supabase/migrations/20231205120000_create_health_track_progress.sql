-- Create health_track_progress table
CREATE TABLE public.health_track_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  progress JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, track_id)
);

-- Enable Row Level Security
ALTER TABLE public.health_track_progress ENABLE ROW LEVEL SECURITY;

-- Create policy for health_track_progress
CREATE POLICY "Users can manage their own health track progress"
ON public.health_track_progress
FOR ALL USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at column
CREATE TRIGGER update_health_track_progress_updated_at
BEFORE UPDATE ON public.health_track_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

