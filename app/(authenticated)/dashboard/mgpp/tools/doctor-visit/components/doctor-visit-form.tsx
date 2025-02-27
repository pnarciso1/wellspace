'use client'

import * as React from 'react'
import { useState } from 'react'
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
import type { 
  SymptomType, 
  FrequencyType,
  SymptomData,
  TreatmentType
} from '../types'

interface DoctorVisitFormProps {
  recordId: string
  onSuccess: (symptom: SymptomData) => void
  onCancel: () => void
}

export function DoctorVisitForm({ recordId, onSuccess, onCancel }: DoctorVisitFormProps) {
  const [loading, setLoading] = useState(false)
  const [symptomType, setSymptomType] = useState<SymptomType>('speech')
  const [frequency, setFrequency] = useState<FrequencyType>('sometimes')
  const [intensity, setIntensity] = useState<number>(1)
  const [treatments, setTreatments] = useState<TreatmentType[]>([])
  const [notes, setNotes] = useState('')

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const symptomData = {
        record_id: recordId,
        symptom_type: symptomType,
        frequency: frequency,
        intensity: intensity,
        treatments: treatments,
        notes: notes || null
      }

      const { data, error } = await supabase
        .from('doctor_visit_symptoms')
        .insert([symptomData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error('No data returned from insert')
      }

      toast.success('Symptom recorded successfully')
      onSuccess(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save symptom'
      console.error('Error saving symptom:', message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Symptom</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Select Symptom Type</Label>
            <RadioGroup
              value={symptomType}
              onValueChange={(value: string) => setSymptomType(value as SymptomType)}
              className="grid grid-cols-2 gap-4"
            >
              {Object.entries(SYMPTOM_DEFINITIONS).map(([key, def]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="font-normal">
                    {def.medical_term}
                    <span className="block text-sm text-muted-foreground">
                      {def.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Frequency</Label>
            <RadioGroup
              value={frequency}
              onValueChange={(value: string) => setFrequency(value as FrequencyType)}
              className="grid gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sometimes" id="sometimes" />
                <Label htmlFor="sometimes">Sometimes, but not daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily_not_constant" id="daily" />
                <Label htmlFor="daily">Daily, but not constant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="constant" id="constant" />
                <Label htmlFor="constant">Constant</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Intensity (1-5)</Label>
            <RadioGroup
              value={intensity.toString()}
              onValueChange={(value: string) => setIntensity(parseInt(value))}
              className="grid gap-2"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.toString()} id={`intensity-${level}`} />
                  <Label htmlFor={`intensity-${level}`}>
                    Level {level} - {level === 1 ? 'Mild' : level === 5 ? 'Severe' : 'Moderate'}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Current Treatments (select all that apply)</Label>
            <div className="grid gap-2">
              {TREATMENT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`treatment-${option.value}`}
                    checked={treatments.includes(option.value as TreatmentType)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTreatments(prev => [...prev, option.value as TreatmentType])
                      } else {
                        setTreatments(prev => prev.filter(t => t !== option.value))
                      }
                    }}
                  />
                  <Label htmlFor={`treatment-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Additional Notes</Label>
            <textarea
              className="w-full p-2 border rounded"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about this symptom..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Symptom'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
