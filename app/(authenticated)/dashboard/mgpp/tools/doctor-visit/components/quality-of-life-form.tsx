'use client'

import * as React from 'react'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from '@/lib/icons'
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

  const renderRadioGroup = (field: keyof QualityOfLifeFormData, label: string, icon: React.ReactNode) => (
    <div className="border rounded-md p-4 bg-card shadow-sm">
      <Label className="text-base font-medium flex items-center mb-3">
        {icon}
        {label}
      </Label>
      <RadioGroup
        value={formData[field]}
        onValueChange={handleValueChange(field)}
        className="grid gap-2"
      >
        {IMPACT_LEVELS.map((level) => (
          <div 
            key={level.value} 
            className={`flex items-start space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors ${
              formData[field] === level.value ? 'bg-primary/5 border-primary/30 shadow-sm' : ''
            }`}
          >
            <RadioGroupItem value={level.value} id={`${field}-${level.value}`} className="mt-1" />
            <Label htmlFor={`${field}-${level.value}`} className="cursor-pointer">
              <span className="font-medium">{level.label}</span>
              <span className="block text-sm text-muted-foreground mt-1">
                {level.description}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack} className="shadow-sm">
          <Icons.ChevronLeft className="h-4 w-4 mr-2" />
          Back to Symptoms
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <Card className="shadow-md border-muted/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Icons.Activity className="h-5 w-5 mr-2 text-primary" />
                Daily Activities Impact
              </CardTitle>
              <CardDescription>
                How does your condition affect your ability to perform daily activities?
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 pt-0">
              {renderRadioGroup('work_impact', 'Work/School Impact', 
                <Icons.FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('household_impact', 'Household Activities', 
                <Icons.User className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('social_impact', 'Social Activities', 
                <Icons.Users className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('exercise_impact', 'Exercise & Physical Activities', 
                <Icons.Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border-muted/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Icons.Heart className="h-5 w-5 mr-2 text-primary" />
                Physical & Emotional Wellbeing
              </CardTitle>
              <CardDescription>
                How does your condition affect your physical and emotional state?
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 pt-0">
              {renderRadioGroup('energy_level', 'Energy Level', 
                <Icons.Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('sleep_quality', 'Sleep Quality', 
                <Icons.Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('physical_comfort', 'Physical Comfort', 
                <Icons.Check className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('mood_state', 'Mood State', 
                <Icons.Star className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('anxiety_level', 'Anxiety Level', 
                <Icons.AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('stress_management', 'Stress Management', 
                <Icons.Menu className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border-muted/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Icons.CheckCircle className="h-5 w-5 mr-2 text-primary" />
                Treatment Experience
              </CardTitle>
              <CardDescription>
                How effective is your current treatment and how does it affect you?
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 pt-0">
              {renderRadioGroup('medication_effectiveness', 'Medication Effectiveness', 
                <Icons.CheckCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('side_effects_impact', 'Side Effects Impact', 
                <Icons.XCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {renderRadioGroup('treatment_satisfaction', 'Overall Treatment Satisfaction', 
                <Icons.Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border-muted/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Icons.FileText className="h-5 w-5 mr-2 text-primary" />
                Additional Notes
              </CardTitle>
              <CardDescription>
                Any other information you'd like to share about your quality of life
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional comments about your quality of life..."
                className="min-h-[150px] resize-y"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="min-w-[100px]"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[150px] shadow-sm"
          >
            {loading ? (
              <>
                <Icons.Menu className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icons.Check className="mr-2 h-4 w-4" />
                Save Assessment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
