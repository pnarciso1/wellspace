-- Add a unique constraint to the user_id column in health_profiles
ALTER TABLE health_profiles ADD CONSTRAINT health_profiles_user_id_key UNIQUE (user_id);

