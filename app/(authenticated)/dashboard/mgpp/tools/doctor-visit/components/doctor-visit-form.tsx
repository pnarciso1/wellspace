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
import { Icons } from '@/lib/icons'
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
      if (!frequency) {
        throw new Error('Please select a frequency');
      }

      const symptomData = {
        record_id: recordId,
        symptom_type: symptomType,
        frequency: frequency,
        intensity: intensity || 1,
        treatments: treatments,
        notes: notes || null
      }

      console.log('Submitting symptom data:', symptomData);

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
      
      setSymptomType('speech')
      setFrequency('sometimes')
      setIntensity(1)
      setTreatments([])
      setNotes('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save symptom'
      console.error('Error saving symptom:', message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-md border-muted/60">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="flex items-center text-lg">
          <Icons.Plus className="h-5 w-5 mr-2 text-primary" />
          Record Symptom
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center">
              <Icons.Menu className="h-4 w-4 mr-2 text-muted-foreground" />
              Select Symptom Type
            </Label>
            <RadioGroup
              value={symptomType}
              onValueChange={(value: string) => setSymptomType(value as SymptomType)}
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
              <Icons.Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
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
              <Icons.Activity className="h-4 w-4 mr-2 text-muted-foreground" />
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
              <Icons.Heart className="h-4 w-4 mr-2 text-muted-foreground" />
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
              <Icons.FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              Additional Notes
            </Label>
            <textarea
              className="w-full p-3 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about this symptom..."
            />
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
              {loading ? (
                <>
                  <Icons.Menu className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icons.Check className="mr-2 h-4 w-4" />
                  Save Symptom
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
