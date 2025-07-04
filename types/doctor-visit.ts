// Mock database types since they don't exist in the Database type
export interface DbDoctorVisitRecord {
  id: string;
  user_id: string;
  visit_date: string;
  doctor_name: string;
  visit_reason: string;
  diagnosis: string;
  created_at: string;
  updated_at: string;
}

export interface DbDoctorVisitSymptom {
  id: string;
  record_id: string;
  symptom_type: string;
  is_present: boolean;
  frequency?: string;
  intensity?: number;
  treatments: string[];
  context: string[];
  triggers: string[];
  time_patterns: Record<string, boolean>;
  affected_areas: string[];
  notes?: string;
  symptom_start_date?: string;
  symptom_changes: string[];
  created_at: string;
  updated_at: string;
}

export interface DbDoctorVisitImpact {
  id: string;
  record_id: string;
  daily_activities: Record<string, string>;
  work_impact?: string;
  social_impact?: string;
  emotional_impact?: string;
  overall_wellbeing?: number;
  fatigue_level?: number;
  stress_level?: number;
  sleep_quality?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbDoctorVisitHistory {
  id: string;
  record_id: string;
  visit_type: string;
  primary_concerns: string[];
  medication_changes: Record<string, string[]>;
  treatment_plan?: string;
  next_visit_date?: string;
  notes?: string;
  created_at: string;
}

export type SymptomType = 
  | 'speech'
  | 'swallowing'
  | 'breathing'
  | 'vision'
  | 'eyelid'
  | 'expression'
  | 'muscle_weakness'

export type Frequency = 
  | 'SOMETIMES'
  | 'DAILY'
  | 'CONSTANT';

export type VisitType = 
  | 'Regular'
  | 'Emergency'
  | 'Follow-up';

export interface DoctorVisitRecord extends DbDoctorVisitRecord {
  symptoms?: Symptom[];
  impact?: VisitImpact;
  history?: VisitHistory;
}

export interface Symptom extends DbDoctorVisitSymptom {
  id: string;
  record_id: string;
  created_at: string;
  updated_at: string;
  symptom_type: SymptomType;
  is_present: boolean;
  frequency?: string;
  intensity?: number;
  treatments: string[];
  context: string[];
  triggers: string[];
  time_patterns: {
    morning?: boolean;
    afternoon?: boolean;
    evening?: boolean;
    night?: boolean;
  };
  affected_areas: string[];
  notes?: string;
  symptom_start_date?: string;
  symptom_changes: string[];
}

export interface VisitImpact extends DbDoctorVisitImpact {
  id: string;
  record_id: string;
  created_at: string;
  updated_at: string;
  daily_activities: {
    work?: string;
    household?: string;
    social?: string;
    other?: string;
  };
  work_impact?: string;
  social_impact?: string;
  emotional_impact?: string;
  overall_wellbeing?: number;
  fatigue_level?: number;
  stress_level?: number;
  sleep_quality?: number;
  notes?: string;
}

export interface VisitHistory extends DbDoctorVisitHistory {
  id: string;
  record_id: string;
  created_at: string;
  visit_type: VisitType;
  primary_concerns: string[];
  medication_changes: {
    added?: string[];
    removed?: string[];
    modified?: string[];
  };
  treatment_plan?: string;
  next_visit_date?: string;
  notes?: string;
}

export interface VisitTimelineEvent {
  id: string;
  symptom_type: SymptomType;
  intensity: number;
  frequency: string;
  treatments: string[];
  context: string[];
  time_patterns: string[];
  created_at: string;
}

export interface SymptomCategory {
  id: SymptomType;
  label: string;
  description: string;
  relatedTerms?: string[];
}

export interface DoctorVisitFormState {
  currentStep: string;
  symptoms: Record<SymptomType, Symptom>;
  impact: VisitImpact;
  history: VisitHistory;
}

// Timeline specific types (following medication-timeline.tsx pattern)
export interface TimelineProps {
  events: VisitTimelineEvent[];
  onRangeChange?: (start: Date, end: Date) => void;
}

// Category filter specific types (following category-filter.tsx pattern)
export interface CategoryFilterProps {
  selectedCategory: SymptomType | 'all';
  onCategoryChange: (category: SymptomType | 'all') => void;
}
