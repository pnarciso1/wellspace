// Basic type definitions
export type CategoryType = 'all' | SymptomType

export type SymptomType = 
  | 'speech'
  | 'vision'
  | 'breathing'
  | 'swallowing'
  | 'eyelid'
  | 'expression'
  | 'muscle_weakness'

export type FrequencyType = 
  | 'sometimes'
  | 'daily_not_constant'
  | 'constant'

export type TreatmentType =
  | 'medication'
  | 'physical_therapy'
  | 'rest'
  | 'lifestyle_changes'
  | 'none'

// Treatment definitions
export const TREATMENT_OPTIONS = [
  { value: 'medication', label: 'Medication' },
  { value: 'physical_therapy', label: 'Physical Therapy' },
  { value: 'rest', label: 'Rest' },
  { value: 'lifestyle_changes', label: 'Lifestyle Changes' },
  { value: 'none', label: 'None of the Above' }
] as const

// Medical terminology definitions
export const SYMPTOM_DEFINITIONS = {
  speech: {
    medical_term: 'DYSARTHRIA',
    description: 'Difficulty speaking',
    etymology: 'DYS = difficulty + ARTHRIA = to speak',
    example: 'Slurred or nasal speech'
  },
  vision: {
    medical_term: 'DIPLOPIA',
    description: 'Double vision',
    etymology: 'DI = double + OPIA = vision',
    example: 'Seeing two images of a single object'
  },
  breathing: {
    medical_term: 'DYSPNEA',
    description: 'Difficulty breathing',
    etymology: 'DYS = difficulty + PNEA = breathing',
    example: 'Shortness of breath'
  },
  swallowing: {
    medical_term: 'DYSPHAGIA',
    description: 'Difficulty swallowing',
    etymology: 'DYS = difficulty + PHAGIA = to eat/swallow',
    example: 'Food or liquids going down the wrong way'
  },
  eyelid: {
    medical_term: 'PTOSIS',
    description: 'Drooping eyelid',
    etymology: 'PTOSIS = falling/drooping',
    example: 'Upper eyelid drooping over the eye'
  },
  expression: {
    medical_term: 'FACIAL WEAKNESS',
    description: 'Reduced facial muscle strength',
    etymology: 'Weakness of facial muscles',
    example: 'Difficulty smiling or making expressions'
  },
  muscle_weakness: {
    medical_term: 'GENERALIZED WEAKNESS',
    description: 'Overall muscle weakness',
    etymology: 'Reduced muscle strength',
    example: 'Difficulty with physical activities'
  }
} as const

// Data structure interfaces
export interface SymptomData {
  id: string
  created_at: string
  updated_at: string
  record_id: string
  symptom_type: SymptomType
  frequency: FrequencyType
  intensity: number
  treatments: TreatmentType[]
  notes: string | null
}

export interface DoctorVisitRecord {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  address: string | null
  state: string | null
  zip_code: string | null
  birth_year: string | null
  years_with_mg: string | null
  quality_of_life?: QualityOfLife | null
}

export interface QualityOfLife {
  id: string
  created_at: string
  updated_at: string
  record_id: string
  work_impact: number
  household_impact: number
  social_impact: number
  exercise_impact: number
  energy_level: number
  sleep_quality: number
  physical_comfort: number
  mood_state: number
  anxiety_level: number
  stress_management: number
  medication_effectiveness: number
  side_effects_impact: number
  treatment_satisfaction: number
  notes: string | null
}
