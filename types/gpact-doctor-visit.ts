import { Database } from './supabase'

// Database types
export type GPACTDoctorVisitRecord = Database['public']['Tables']['gpact_doctor_visit_records']['Row']
export type GPACTDoctorVisitSymptom = Database['public']['Tables']['gpact_doctor_visit_symptoms']['Row']
export type GPACTDoctorVisitQualityOfLife = Database['public']['Tables']['gpact_doctor_visit_quality_of_life']['Row']

// Enum types
export type GPACTSymptomType =
  | 'fatigue'
  | 'pain'
  | 'weakness'
  | 'numbness'
  | 'tingling'
  | 'balance'
  | 'vision'
  | 'speech'
  | 'swallowing'
  | 'breathing'
  | 'bowel'
  | 'bladder'
  | 'sexual'
  | 'cognitive'
  | 'emotional'
  | 'sleep'
  | 'other'
  | 'dizziness'
  | 'bloated_stomach'
  | 'anxiety'
  | 'loss_of_appetite'
  | 'constipation'
  | 'dehydration'
  | 'feeling_full_long_after_eating'
  | 'depression'
  | 'indigestion'
  | 'feeling_full_very_quickly'
  | 'vomiting'
  | 'upper_abdominal_pain'
  | 'belching'
  | 'blood_sugar_fluctuations'
  | 'weight_loss'
  | 'malnutrition'
  | 'nausea'
  | 'heartburn'
  | 'regurgitation'
  | 'weight_gain'

export type GPACTSymptomFrequency =
  | 'never'
  | 'rarely'
  | 'sometimes'
  | 'often'
  | 'always'

export type GPACTSymptomIntensity =
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'very_severe'

// Component types
export interface GPACTDoctorVisitFormProps {
  onSuccess: (data: GPACTSymptomFormData) => Promise<void>
  onCancel?: () => void
}

export interface GPACTDoctorVisitTimelineProps {
  records: (GPACTDoctorVisitRecord & {
    symptoms?: GPACTDoctorVisitSymptom[]
  })[]
  onSelect: (record: GPACTDoctorVisitRecord) => void
}

export interface GPACTQualityOfLifeFormProps {
  onSuccess: (data: GPACTQualityOfLifeFormData) => Promise<void>
  onCancel?: () => void
}

// Form state types
export interface GPACTSymptomFormData {
  record_id: string
  symptom_type: GPACTSymptomType
  frequency: GPACTSymptomFrequency
  intensity: GPACTSymptomIntensity
  treatments: string[]
  context: string[]
  time_patterns: Record<string, boolean>
  triggers: {
    hasTriggers: boolean
    description?: string
  }
  affected_areas: string[]
  notes: string
  symptom_start_date: string
  symptom_changes: string[]
}

export interface GPACTQualityOfLifeFormData {
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
  notes: string
}

// Display types
export interface GPACTSymptomDisplay {
  label: string
  description: string
  icon: string
}

// Constants
export const GPACT_SYMPTOM_DISPLAYS: Record<GPACTSymptomType, GPACTSymptomDisplay> = {
  fatigue: { label: 'Fatigue', description: 'Feeling tired or lacking energy', icon: 'Activity' },
  pain: { label: 'Pain', description: 'Physical discomfort or aching', icon: 'Heart' },
  weakness: { label: 'Weakness', description: 'Muscle weakness', icon: 'Activity' },
  numbness: { label: 'Numbness', description: 'Loss of sensation', icon: 'AlertCircle' },
  tingling: { label: 'Tingling', description: 'Pins and needles sensation', icon: 'AlertCircle' },
  balance: { label: 'Balance Issues', description: 'Problems with balance', icon: 'Activity' },
  vision: { label: 'Vision Changes', description: 'Changes in vision', icon: 'User' },
  speech: { label: 'Speech Changes', description: 'Difficulty speaking', icon: 'User' },
  swallowing: { label: 'Swallowing Issues', description: 'Difficulty swallowing', icon: 'User' },
  breathing: { label: 'Breathing Issues', description: 'Difficulty breathing', icon: 'AlertCircle' },
  bowel: { label: 'Bowel Issues', description: 'Problems with bowel movements', icon: 'AlertCircle' },
  bladder: { label: 'Bladder Issues', description: 'Problems with urination', icon: 'AlertCircle' },
  sexual: { label: 'Sexual Dysfunction', description: 'Sexual health issues', icon: 'User' },
  cognitive: { label: 'Cognitive Changes', description: 'Changes in thinking or memory', icon: 'AlertCircle' },
  emotional: { label: 'Emotional Changes', description: 'Changes in mood or emotions', icon: 'Heart' },
  sleep: { label: 'Sleep Disturbance', description: 'Problems with sleep', icon: 'Calendar' },
  other: { label: 'Other', description: 'Other symptoms not listed', icon: 'XCircle' },
  dizziness: { label: 'Dizziness', description: 'Feeling lightheaded or unsteady', icon: 'AlertCircle' },
  bloated_stomach: { label: 'Bloated Stomach', description: 'Abdominal bloating', icon: 'AlertCircle' },
  anxiety: { label: 'Anxiety', description: 'Feeling worried or nervous', icon: 'Heart' },
  loss_of_appetite: { label: 'Loss of Appetite', description: 'Reduced desire to eat', icon: 'CheckCircle' },
  constipation: { label: 'Constipation', description: 'Difficulty passing stool', icon: 'AlertCircle' },
  dehydration: { label: 'Dehydration', description: 'Lack of fluids', icon: 'AlertCircle' },
  feeling_full_long_after_eating: { label: 'Feeling Full Long After Eating', description: 'Prolonged fullness after meals', icon: 'CheckCircle' },
  depression: { label: 'Depression', description: 'Feeling sad or down', icon: 'MessageSquare' },
  indigestion: { label: 'Indigestion', description: 'Digestive discomfort', icon: 'AlertCircle' },
  feeling_full_very_quickly: { label: 'Feeling Full Very Quickly', description: 'Early satiety', icon: 'CheckCircle' },
  vomiting: { label: 'Vomiting', description: 'Throwing up', icon: 'AlertCircle' },
  upper_abdominal_pain: { label: 'Upper Abdominal Pain', description: 'Pain in upper abdomen', icon: 'AlertCircle' },
  belching: { label: 'Belching', description: 'Frequent burping', icon: 'AlertCircle' },
  blood_sugar_fluctuations: { label: 'Blood Sugar Fluctuations', description: 'Changes in blood sugar levels', icon: 'AlertCircle' },
  weight_loss: { label: 'Weight Loss', description: 'Unintentional weight loss', icon: 'AlertCircle' },
  malnutrition: { label: 'Malnutrition', description: 'Lack of proper nutrition', icon: 'AlertCircle' },
  nausea: { label: 'Nausea', description: 'Feeling sick to your stomach', icon: 'AlertCircle' },
  heartburn: { label: 'Heartburn', description: 'Burning sensation in chest', icon: 'AlertCircle' },
  regurgitation: { label: 'Regurgitation', description: 'Food or liquid coming back up', icon: 'AlertCircle' },
  weight_gain: { label: 'Weight Gain', description: 'Unintentional weight gain', icon: 'AlertCircle' },
}

export interface GPACTSymptomCategoryFilterProps {
  selectedCategories: GPACTSymptomType[]
  onCategoryChange: (category: GPACTSymptomType) => void
} 