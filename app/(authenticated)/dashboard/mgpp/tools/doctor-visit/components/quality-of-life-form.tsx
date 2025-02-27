'use client'

import * as React from 'react'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

interface QualityOfLifeFormProps {
  recordId: string
  onComplete: () => void
  onBack: () => void
}

interface QualityOfLifeFormData {
  work_impact: string
  household_impact: string
  social_impact: string
  exercise_impact: string
  energy_level: string
  sleep_quality: string
  physical_comfort: string
  mood_state: string
  anxiety_level: string
  stress_management: string
  medication_effectiveness: string
  side_effects_impact: string
  treatment_satisfaction: string
  notes: string
}

const IMPACT_LEVELS = [
  { value: '1', label: 'Minimal Impact', description: 'No significant effect on daily life' },
  { value: '2', label: 'Mild Impact', description: 'Occasionally affects daily activities' },
  { value: '3', label: 'Moderate Impact', description: 'Regularly affects daily activities' },
  { value: '4', label: 'Significant Impact', description: 'Frequently limits daily activities' },
  { value: '5', label: 'Severe Impact', description: 'Severely limits daily activities' }
] as const

export function QualityOfLifeForm({ recordId, onComplete, onBack }: QualityOfLifeFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<QualityOfLifeFormData>({
    work_impact: '3',
    household_impact: '3',
    social_impact: '3',
    exercise_impact: '3',
    energy_level: '3',
    sleep_quality: '3',
    physical_comfort: '3',
    mood_state: '3',
    anxiety_level: '3',
    stress_management: '3',
    medication_effectiveness: '3',
    side_effects_impact: '3',
    treatment_satisfaction: '3',
    notes: ''
  })

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSubmit = {
        record_id: recordId,
        ...Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [
            key,
            key === 'notes' ? value : parseInt(value)
          ])
        )
      }

      const { data, error } = await supabase
        .from('doctor_visit_quality_of_life')
        .insert([dataToSubmit])
        .select()
        .single()

      if (error) throw error

      toast.success('Quality of life assessment saved')
      onComplete()
    } catch (error) {
      console.error('Error saving quality of life:', error)
      toast.error('Failed to save assessment')
    } finally {
      setLoading(false)
    }
  }

  const handleValueChange = (field: keyof QualityOfLifeFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Symptoms
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality of Life Assessment</CardTitle>
          <CardDescription>
            Please rate how your condition affects different aspects of your daily life
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">Impact on Daily Activities</Label>
              </div>
              <div className="grid gap-6">
                <div>
                  <Label>Work/School Impact</Label>
                  <RadioGroup
                    value={formData.work_impact}
                    onValueChange={handleValueChange('work_impact')}
                    className="grid gap-2 mt-2"
                  >
                    {IMPACT_LEVELS.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={level.value} id={`work-${level.value}`} />
                        <Label htmlFor={`work-${level.value}`} className="font-normal">
                          {level.label}
                          <span className="block text-sm text-muted-foreground">
                            {level.description}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Household Activities</Label>
                  <RadioGroup
                    value={formData.household_impact}
                    onValueChange={handleValueChange('household_impact')}
                    className="grid gap-2 mt-2"
                  >
                    {IMPACT_LEVELS.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={level.value} id={`household-${level.value}`} />
                        <Label htmlFor={`household-${level.value}`} className="font-normal">
                          {level.label}
                          <span className="block text-sm text-muted-foreground">
                            {level.description}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Add similar RadioGroup components for other aspects */}
                {/* ... */}

              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                className="w-full min-h-[100px] p-2 border rounded"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional comments about your quality of life..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Assessment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
