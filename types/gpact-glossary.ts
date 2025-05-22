export type GlossaryTermType =
  | 'Condition'
  | 'Finding'
  | 'Physiology'
  | 'Anatomy'
  | 'Sub-type'
  | 'Test'
  | 'Test/Procedure'
  | 'Drug class'
  | 'Prescription prokinetic'
  | 'Restricted prokinetic'
  | 'Investigational prokinetic'
  | 'Off-label prokinetic'
  | 'Prescription anti-nausea'
  | 'Prescription'
  | 'OTC/herbal'
  | 'Procedure'
  | 'Device'
  | 'Device/Procedure'
  | 'Symptom'
  | 'Complication'

export interface GlossaryTerm {
  id: string
  term: string
  type: GlossaryTermType
  plain_language_meaning: string
  created_at: string
  updated_at: string
} 