'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner'
import { 
  SYMPTOM_DEFINITIONS,
  TREATMENT_OPTIONS 
} from '../types'
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Menu, Calendar, Activity, CheckCircle, Heart, AlertCircle, FileText, Plus } from 'lucide-react'
import type { 
  SymptomType, 
  FrequencyType,
  SymptomData,
  TreatmentType,
  TimeOfDay,
  DoctorVisitRecord,
  QualityOfLife
} from '../types'
import { ClinicalOverview } from './clinical-overview'

interface DoctorVisitFormProps {
  recordId: string
  onSuccess: (symptom: SymptomFormData) => void
  onCancel: () => void
}

interface SymptomFormData {
  record_id: string;
  symptom_type: SymptomType;
  frequency: FrequencyType;
  intensity: number;
  treatments: TreatmentType[];
  context: string[];
  time_patterns: TimeOfDay[];
  triggers: { hasTrigggers: boolean; description?: string };
  notes: string;
  created_at: string;
}

export function DoctorVisitForm({ recordId, onSuccess, onCancel }: DoctorVisitFormProps) {
  const [loading, setLoading] = useState(false)
  const [symptomType, setSymptomType] = useState<SymptomType>('speech')
  const [frequency, setFrequency] = useState<FrequencyType>('sometimes')
  const [intensity, setIntensity] = useState<number>(1)
  const [treatments, setTreatments] = useState<TreatmentType[]>([])
  const [context, setContext] = useState<string[]>([])
  const [timePatterns, setTimePatterns] = useState<TimeOfDay[]>([])
  const [triggers, setTriggers] = useState<{ hasTrigggers: boolean; description?: string }>({
    hasTrigggers: false
  })
  const [notes, setNotes] = useState('')
  const [showClinicalOverview, setShowClinicalOverview] = useState(false)
  const [record, setRecord] = useState<DoctorVisitRecord | null>(null)
  const [symptoms, setSymptoms] = useState<SymptomData[]>([])
  const [qualityOfLife, setQualityOfLife] = useState<QualityOfLife | null>(null)
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])

  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      // Fetch record
      const { data: recordData, error: recordError } = await supabase
        .from('doctor_visit_records')
        .select('*')
        .eq('id', recordId)
        .single()

      if (recordError) {
        console.error('Error fetching record:', recordError)
        return
      }

      setRecord(recordData)

      // Fetch symptoms
      const { data: symptomsData, error: symptomsError } = await supabase
        .from('doctor_visit_symptoms')
        .select('*')
        .eq('record_id', recordId)
        .order('created_at', { ascending: true })

      if (symptomsError) {
        console.error('Error fetching symptoms:', symptomsError)
        return
      }

      setSymptoms(symptomsData)

      // Fetch quality of life assessment
      const { data: qolData, error: qolError } = await supabase
        .from('doctor_visit_quality_of_life')
        .select('*')
        .eq('record_id', recordId)
        .single()

      if (qolError && qolError.code !== 'PGRST116') { // Ignore not found error
        console.error('Error fetching quality of life:', qolError)
        return
      }

      setQualityOfLife(qolData)
    }

    fetchData()
  }, [recordId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const symptomData: SymptomFormData = {
        record_id: recordId,
        symptom_type: symptomType,
        frequency,
        intensity,
        treatments,
        context,
        time_patterns: timePatterns,
        triggers,
        notes,
        created_at: new Date(date).toISOString()
      }

      console.log('Submitting symptom data:', symptomData);
      
      // Pass the data to parent component
      onSuccess(symptomData)
      
      // Reset form
      setSymptomType('speech')
      setFrequency('sometimes')
      setIntensity(1)
      setTreatments([])
      setContext([])
      setTimePatterns([])
      setTriggers({ hasTrigggers: false })
      setNotes('')
      setDate(new Date().toISOString().split('T')[0])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save symptom'
      console.error('Error preparing symptom data:', message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (showClinicalOverview && record) {
    return (
      <ClinicalOverview
        record={record}
        symptoms={symptoms}
        qualityOfLife={qualityOfLife}
        onBack={() => setShowClinicalOverview(false)}
      />
    )
  }

  return (
    <Card className="shadow-md border-muted/60">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="flex items-center text-lg">
          <Plus className="h-5 w-5 mr-2 text-primary" />
          Record Symptom
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <Menu className="h-4 w-4 mr-2 text-muted-foreground" />
              Select Symptom Type
            </Label>
            <RadioGroup
              value={symptomType}
              onValueChange={(value: string) => {
                setSymptomType(value as SymptomType)
                setContext([]) // Reset context when symptom type changes
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {Object.entries(SYMPTOM_DEFINITIONS).map(([key, def]) => (
                <div 
                  key={key} 
                  className={`flex items-start space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
                    symptomType === key ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
                  }`}
                >
                  <RadioGroupItem value={key} id={key} className="mt-1" />
                  <Label htmlFor={key} className="font-medium cursor-pointer">
                    {def.medical_term}
                    <span className="block text-sm text-muted-foreground mt-1">
                      {def.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              Frequency
            </Label>
            <RadioGroup
              value={frequency}
              onValueChange={(value: string) => setFrequency(value as FrequencyType)}
              className="grid gap-3"
            >
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
                  frequency === 'sometimes' ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
                }`}
              >
                <RadioGroupItem value="sometimes" id="sometimes" />
                <Label htmlFor="sometimes" className="cursor-pointer">Sometimes, but not daily</Label>
              </div>
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
                  frequency === 'daily_not_constant' ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
                }`}
              >
                <RadioGroupItem value="daily_not_constant" id="daily" />
                <Label htmlFor="daily" className="cursor-pointer">Daily, but not constant</Label>
              </div>
              <div 
                className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
                  frequency === 'constant' ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
                }`}
              >
                <RadioGroupItem value="constant" id="constant" />
                <Label htmlFor="constant" className="cursor-pointer">Constant</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              Intensity (1-5)
            </Label>
            <RadioGroup
              value={intensity.toString()}
              onValueChange={(value: string) => setIntensity(parseInt(value))}
              className="grid gap-3"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <div 
                  key={level} 
                  className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
                    intensity === level ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
                  }`}
                >
                  <RadioGroupItem value={level.toString()} id={`intensity-${level}`} />
                  <Label htmlFor={`intensity-${level}`} className="cursor-pointer">
                    Level {level} - {level === 1 ? 'Mild' : level === 5 ? 'Severe' : 'Moderate'}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              Context: Please check any that apply
            </Label>
            <div className="grid gap-3">
              {SYMPTOM_DEFINITIONS[symptomType].context_questions.map((question, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
                    context.includes(question) ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
                  }`}
                >
                  <Checkbox
                    id={`context-${index}`}
                    checked={context.includes(question)}
                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                      if (checked === true) {
                        setContext(prev => [...prev, question])
                      } else {
                        setContext(prev => prev.filter(c => c !== question))
                      }
                    }}
                  />
                  <Label htmlFor={`context-${index}`} className="cursor-pointer">{question}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              Time Patterns: When is this symptom most noticeable?
            </Label>
            <div className="grid gap-3">
              {[
                { value: 'morning', label: 'Beginning of my day' },
                { value: 'afternoon', label: 'Middle of my day' },
                { value: 'evening', label: 'End of my day' }
              ].map((time) => (
                <div 
                  key={time.value} 
                  className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
                    timePatterns.includes(time.value as TimeOfDay) ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
                  }`}
                >
                  <Checkbox
                    id={`time-${time.value}`}
                    checked={timePatterns.includes(time.value as TimeOfDay)}
                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                      if (checked === true) {
                        setTimePatterns(prev => [...prev, time.value as TimeOfDay])
                      } else {
                        setTimePatterns(prev => prev.filter(t => t !== time.value))
                      }
                    }}
                  />
                  <Label htmlFor={`time-${time.value}`} className="cursor-pointer">{time.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
              Current Treatments (select all that apply)
            </Label>
            <div className="grid gap-3">
              {TREATMENT_OPTIONS.map((option) => (
                <div 
                  key={option.value} 
                  className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
                    treatments.includes(option.value as TreatmentType) ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
                  }`}
                >
                  <Checkbox
                    id={`treatment-${option.value}`}
                    checked={treatments.includes(option.value as TreatmentType)}
                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                      if (checked === true) {
                        setTreatments(prev => [...prev, option.value as TreatmentType])
                      } else {
                        setTreatments(prev => prev.filter(t => t !== option.value))
                      }
                    }}
                  />
                  <Label htmlFor={`treatment-${option.value}`} className="cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              Triggers
            </Label>
            <RadioGroup
              value={triggers.hasTrigggers ? "yes" : "no"}
              onValueChange={(value: string) => {
                setTriggers(prev => ({
                  ...prev,
                  hasTrigggers: value === "yes",
                  description: value === "no" ? undefined : prev.description
                }))
              }}
              className="grid gap-3"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="yes" id="triggers-yes" />
                <Label htmlFor="triggers-yes">This symptom has specific triggers or aggravating factors</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="no" id="triggers-no" />
                <Label htmlFor="triggers-no">No specific triggers identified</Label>
              </div>
            </RadioGroup>
            {triggers.hasTrigggers && (
              <textarea
                className="w-full p-3 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={triggers.description || ''}
                onChange={(e) => setTriggers(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe what triggers or aggravates this symptom..."
              />
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              Additional Notes
            </Label>
            <textarea
              className="w-full p-3 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about this symptom..."
            />
          </div>

          <div className="space-y-2">
            <Label>Date of Symptom</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px] shadow-sm"
            >
              {loading ? "Saving..." : "Save Symptom"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
