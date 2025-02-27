export interface Medication {
  id: string;
  health_record_id: string;
  drug_name: string;
  indication?: string;
  dosage: string;
  frequency: string;
  timing?: string;
  start_date: Date;
  stop_date?: Date;
  still_using?: boolean;
  status?: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
  as_needed?: boolean;
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
