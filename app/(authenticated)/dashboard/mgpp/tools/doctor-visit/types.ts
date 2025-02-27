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

// Intensity scales for each symptom
export const SYMPTOM_INTENSITY_SCALES = {
  speech: [
    { value: 'normal', label: 'Normal (1)' },
    { value: 'intermittent', label: 'Intermittent slurring or nasal speech (2)' },
    { value: 'moderate', label: 'Moderate slurring or nasal speech (3)' },
    { value: 'constant', label: 'Constant slurring or nasal speech (4)' },
    { value: 'difficult', label: 'Speech difficult to understand (5)' }
  ],
  vision: [
    { value: 'normal', label: 'Normal vision (1)' },
    { value: 'intermittent', label: 'Intermittent double vision (2)' },
    { value: 'moderate', label: 'Moderate double vision (3)' },
    { value: 'constant', label: 'Constant double vision (4)' },
    { value: 'severe', label: 'Severe double vision affecting daily activities (5)' }
  ],
  breathing: [
    { value: 'normal', label: 'Normal breathing (1)' },
    { value: 'mild', label: 'Mild shortness of breath (2)' },
    { value: 'moderate', label: 'Moderate difficulty breathing (3)' },
    { value: 'constant', label: 'Constant difficulty breathing (4)' },
    { value: 'severe', label: 'Severe difficulty breathing (5)' }
  ],
  swallowing: [
    { value: 'normal', label: 'Normal swallowing (1)' },
    { value: 'mild', label: 'Occasional difficulty (2)' },
    { value: 'moderate', label: 'Regular difficulty (3)' },
    { value: 'constant', label: 'Constant difficulty (4)' },
    { value: 'severe', label: 'Severe difficulty swallowing (5)' }
  ],
  eyelid: [
    { value: 'normal', label: 'Normal eyelid function (1)' },
    { value: 'mild', label: 'Mild drooping (2)' },
    { value: 'moderate', label: 'Moderate drooping (3)' },
    { value: 'constant', label: 'Constant drooping (4)' },
    { value: 'severe', label: 'Severe drooping blocking vision (5)' }
  ],
  expression: [
    { value: 'normal', label: 'Normal facial expression (1)' },
    { value: 'mild', label: 'Mild weakness (2)' },
    { value: 'moderate', label: 'Moderate weakness (3)' },
    { value: 'constant', label: 'Constant weakness (4)' },
    { value: 'severe', label: 'Severe weakness (5)' }
  ],
  muscle_weakness: [
    { value: 'normal', label: 'Normal strength (1)' },
    { value: 'mild', label: 'Mild weakness (2)' },
    { value: 'moderate', label: 'Moderate weakness (3)' },
    { value: 'constant', label: 'Constant weakness (4)' },
    { value: 'severe', label: 'Severe weakness (5)' }
  ]
} as const

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
export interface Treatment {
  type: TreatmentType
  notes?: string
}

export interface SymptomData {
  id: string
  created_at: string
  updated_at: string
  record_id: string
  symptom_type: SymptomType
  frequency: FrequencyType
  intensity: number
  treatments: TreatmentType[]
  treatment_notes?: string | null
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
