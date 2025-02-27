'use client'

import * as React from 'react'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface QualityOfLifeFormProps {
  recordId: string
  onComplete: () => void
  onBack: () => void
}

const IMPACT_LEVELS = [
  { value: '1', label: 'Minimal Impact', description: 'No significant effect on daily life' },
  { value: '2', label: 'Mild Impact', description: 'Occasionally affects daily activities' },
  { value: '3', label: 'Moderate Impact', description: 'Regularly affects daily activities' },
  { value: '4', label: 'Significant Impact', description: 'Frequently limits daily activities' },
  { value: '5', label: 'Severe Impact', description: 'Severely limits daily activities' }
]

const QUALITY_OF_LIFE_QUESTIONS = [
  {
    id: 'work_impact',
    label: 'Impact on Work/School Activities',
    description: 'How much do your symptoms affect your ability to work or study?'
  },
  {
    id: 'household_impact',
    label: 'Impact on Household Activities',
    description: 'How much do your symptoms affect your ability to perform household tasks?'
  },
  {
    id: 'social_impact',
    label: 'Impact on Social Activities',
    description: 'How much do your symptoms affect your social life and relationships?'
  },
  {
    id: 'exercise_impact',
    label: 'Impact on Physical Activities',
    description: 'How much do your symptoms affect your ability to exercise or be physically active?'
  },
  {
    id: 'energy_level',
    label: 'Energy Level',
    description: 'How would you rate your overall energy level?'
  },
  {
    id: 'sleep_quality',
    label: 'Sleep Quality',
    description: 'How would you rate your sleep quality?'
  },
  {
    id: 'physical_comfort',
    label: 'Physical Comfort',
    description: 'How would you rate your overall physical comfort?'
  },
  {
    id: 'mood_state',
    label: 'Mood',
    description: 'How would you rate your overall mood?'
  },
  {
    id: 'anxiety_level',
    label: 'Anxiety Level',
    description: 'How would you rate your anxiety related to your condition?'
  },
  {
    id: 'stress_management',
    label: 'Stress Management',
    description: 'How well are you able to manage stress?'
  },
  {
    id: 'medication_effectiveness',
    label: 'Medication Effectiveness',
    description: 'How effective do you feel your current medications are?'
  },
  {
    id: 'side_effects_impact',
    label: 'Medication Side Effects',
    description: 'How much do medication side effects impact your daily life?'
  },
  {
    id: 'treatment_satisfaction',
    label: 'Treatment Satisfaction',
    description: 'How satisfied are you with your overall treatment plan?'
  }
]

export function QualityOfLifeForm({ recordId, onComplete, onBack }: QualityOfLifeFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({
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
        ...Object.keys(formData).reduce((acc, key) => ({
          ...acc,
          [key]: key === 'notes' ? formData[key] : parseInt(formData[key])
        }), {})
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

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
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
            {QUALITY_OF_LIFE_QUESTIONS.map((question) => (
              <div key={question.id} className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">{question.label}</Label>
                  <p className="text-sm text-muted-foreground">{question.description}</p>
                </div>
                <RadioGroup
                  value={formData[question.id]}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, [question.id]: value }))
                  }
                  className="grid gap-2"
                >
                  {IMPACT_LEVELS.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.value} id={`${question.id}-${level.value}`} />
                      <Label htmlFor={`${question.id}-${level.value}`} className="font-normal">
                        Level {level.value} - {level.label}
                        <span className="block text-sm text-muted-foreground">
                          {level.description}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

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
