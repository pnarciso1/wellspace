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

export type TimeOfDay = 
  | 'morning'
  | 'afternoon'
  | 'evening'

// Treatment definitions
export const TREATMENT_OPTIONS = [
  { value: 'medication', label: 'Medication' },
  { value: 'physical_therapy', label: 'Physical Therapy' },
  { value: 'rest', label: 'Rest' },
  { value: 'lifestyle_changes', label: 'Lifestyle Changes' },
  { value: 'none', label: 'None of the Above' }
] as const

// Medical terminology definitions with contextual questions
export const SYMPTOM_DEFINITIONS = {
  speech: {
    medical_term: 'DYSARTHRIA',
    description: 'Difficulty speaking',
    etymology: 'DYS = difficulty + ARTHRIA = to speak',
    example: 'Slurred or nasal speech',
    context_questions: [
      'My speech becomes unclear or slurred',
      'Others have difficulty understanding me',
      'I need to repeat myself often',
      'My voice becomes nasal',
      'Speaking requires extra effort'
    ]
  },
  vision: {
    medical_term: 'DIPLOPIA',
    description: 'Double vision',
    etymology: 'DI = double + OPIA = vision',
    example: 'Seeing two images of a single object',
    context_questions: [
      'I see double images',
      'My vision is blurry',
      'Reading is difficult',
      'Watching screens is challenging',
      'My vision worsens with fatigue'
    ]
  },
  breathing: {
    medical_term: 'DYSPNEA',
    description: 'Difficulty breathing',
    etymology: 'DYS = difficulty + PNEA = breathing',
    example: 'Shortness of breath',
    context_questions: [
      'I feel short of breath',
      'Breathing requires more effort',
      'I need to sit up to breathe better',
      'Physical activity makes breathing harder',
      'I experience breathlessness at rest'
    ]
  },
  swallowing: {
    medical_term: 'DYSPHAGIA',
    description: 'Difficulty swallowing',
    etymology: 'DYS = difficulty + PHAGIA = to eat/swallow',
    example: 'Food or liquids going down the wrong way',
    context_questions: [
      'I have difficulty swallowing food',
      'Liquids go down the wrong way',
      'I cough or choke while eating',
      'Food gets stuck in my throat',
      'Eating takes longer than usual'
    ]
  },
  eyelid: {
    medical_term: 'PTOSIS',
    description: 'Drooping eyelid',
    etymology: 'PTOSIS = falling/drooping',
    example: 'Upper eyelid drooping over the eye',
    context_questions: [
      'My eyelid(s) droop',
      'I need to tilt my head back to see',
      'My eyelids feel heavy',
      'The drooping worsens throughout the day',
      'Both eyes are affected'
    ]
  },
  expression: {
    medical_term: 'FACIAL WEAKNESS',
    description: 'Reduced facial muscle strength',
    etymology: 'Weakness of facial muscles',
    example: 'Difficulty smiling or making expressions',
    context_questions: [
      'I have difficulty smiling',
      'My face feels stiff',
      'Expressing emotions is difficult',
      'One side is more affected',
      'Others notice my reduced expressions'
    ]
  },
  muscle_weakness: {
    medical_term: 'GENERALIZED WEAKNESS',
    description: 'Overall muscle weakness',
    etymology: 'Reduced muscle strength',
    example: 'Difficulty with physical activities',
    context_questions: [
      'I experience general fatigue',
      'Certain muscle groups are weaker',
      'Activities require more effort',
      'Weakness increases with activity',
      'I need frequent rest periods'
    ]
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
  context: string[]
  time_patterns: TimeOfDay[]
  triggers: {
    hasTrigggers: boolean
    description?: string
  }
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
