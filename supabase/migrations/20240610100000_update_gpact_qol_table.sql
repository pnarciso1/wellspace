-- Migration: Update GPACT QOL table to support new metrics (does NOT affect MGPP)
-- Only affects gpact_doctor_visit_quality_of_life

ALTER TABLE gpact_doctor_visit_quality_of_life
  ADD COLUMN IF NOT EXISTS work_impact INTEGER CHECK (work_impact >= 1 AND work_impact <= 10),
  ADD COLUMN IF NOT EXISTS household_impact INTEGER CHECK (household_impact >= 1 AND household_impact <= 10),
  ADD COLUMN IF NOT EXISTS social_impact INTEGER CHECK (social_impact >= 1 AND social_impact <= 10),
  ADD COLUMN IF NOT EXISTS exercise_impact INTEGER CHECK (exercise_impact >= 1 AND exercise_impact <= 10),
  ADD COLUMN IF NOT EXISTS energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  ADD COLUMN IF NOT EXISTS sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  ADD COLUMN IF NOT EXISTS physical_comfort INTEGER CHECK (physical_comfort >= 1 AND physical_comfort <= 10),
  ADD COLUMN IF NOT EXISTS mood_state INTEGER CHECK (mood_state >= 1 AND mood_state <= 10),
  ADD COLUMN IF NOT EXISTS anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  ADD COLUMN IF NOT EXISTS stress_management INTEGER CHECK (stress_management >= 1 AND stress_management <= 10),
  ADD COLUMN IF NOT EXISTS medication_effectiveness INTEGER CHECK (medication_effectiveness >= 1 AND medication_effectiveness <= 10),
  ADD COLUMN IF NOT EXISTS side_effects_impact INTEGER CHECK (side_effects_impact >= 1 AND side_effects_impact <= 10),
  ADD COLUMN IF NOT EXISTS treatment_satisfaction INTEGER CHECK (treatment_satisfaction >= 1 AND treatment_satisfaction <= 10);

-- Optionally, drop old columns if they are no longer needed:
-- ALTER TABLE gpact_doctor_visit_quality_of_life DROP COLUMN IF EXISTS physical_impact;
-- ALTER TABLE gpact_doctor_visit_quality_of_life DROP COLUMN IF EXISTS emotional_impact;
-- ALTER TABLE gpact_doctor_visit_quality_of_life DROP COLUMN IF EXISTS daily_activities_impact;
-- ALTER TABLE gpact_doctor_visit_quality_of_life DROP COLUMN IF EXISTS sleep_impact; 