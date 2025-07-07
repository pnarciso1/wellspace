-- Add static medication fields to medication_history for future-proofing
ALTER TABLE medication_history
  ADD COLUMN drug_name text,
  ADD COLUMN indication text,
  ADD COLUMN timing text,
  ADD COLUMN gastroparesis_specific boolean,
  ADD COLUMN as_needed boolean,
  ADD COLUMN symptom_target text[];