-- Update health_profiles table to store imperial measurements
ALTER TABLE health_profiles
DROP COLUMN IF EXISTS height,
DROP COLUMN IF EXISTS weight;

ALTER TABLE health_profiles
ADD COLUMN height_feet NUMERIC,
ADD COLUMN height_inches NUMERIC,
ADD COLUMN weight_lbs NUMERIC;
