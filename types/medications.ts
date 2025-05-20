export interface Medication {
  id: string;
  health_record_id: string;
  drug_name: string;
  indication?: string | null;
  dosage: string;
  frequency: string;
  timing?: string | null;
  start_date: string;
  stop_date?: string | null;
  still_using: boolean;
  status: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  as_needed: boolean;
  gastroparesis_specific: boolean;
  symptom_target: string[];
}

export type MedicationStatus = 'active' | 'discontinued' | 'completed';

export interface MedicationFormData {
  drug_name: string;
  indication?: string;
  dosage: string;
  frequency: string;
  timing?: string;
  start_date: Date;
  stop_date?: Date | null;
  still_using: boolean;
  notes?: string;
  as_needed?: boolean;
}

export interface MedicationFilters {
  status?: MedicationStatus;
  startDate?: Date;
  endDate?: Date;
}
