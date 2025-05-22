'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/lib/icons"
import { toast } from 'sonner'
import type { 
  GPACTQualityOfLifeFormProps,
  GPACTQualityOfLifeFormData
} from '@/types/gpact-doctor-visit'

type QOLMetricKey = Exclude<keyof GPACTQualityOfLifeFormData, 'record_id'>;
const QOL_METRICS: { key: QOLMetricKey, label: string }[] = [
  { key: 'work_impact', label: 'Impact on Work/School' },
  { key: 'household_impact', label: 'Impact on Household Activities' },
  { key: 'social_impact', label: 'Impact on Social Activities' },
  { key: 'exercise_impact', label: 'Impact on Exercise/Physical Activities' },
  { key: 'energy_level', label: 'Energy Level' },
  { key: 'sleep_quality', label: 'Sleep Quality' },
  { key: 'physical_comfort', label: 'Physical Comfort' },
  { key: 'mood_state', label: 'Mood' },
  { key: 'anxiety_level', label: 'Anxiety Level' },
  { key: 'stress_management', label: 'Stress Management' },
  { key: 'medication_effectiveness', label: 'Medication Effectiveness' },
  { key: 'side_effects_impact', label: 'Impact of Side Effects' },
  { key: 'treatment_satisfaction', label: 'Treatment Satisfaction' },
]

export function QualityOfLifeForm({ onSuccess, onCancel }: GPACTQualityOfLifeFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<GPACTQualityOfLifeFormData, 'record_id'>>({
    work_impact: 5,
    household_impact: 5,
    social_impact: 5,
    exercise_impact: 5,
    energy_level: 5,
    sleep_quality: 5,
    physical_comfort: 5,
    mood_state: 5,
    anxiety_level: 5,
    stress_management: 5,
    medication_effectiveness: 5,
    side_effects_impact: 5,
    treatment_satisfaction: 5,
    notes: ''
  })

  const handleSliderChange = (key: keyof GPACTQualityOfLifeFormData, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSuccess({ ...formData, record_id: '' }) // record_id will be injected by parent
      setFormData({
        work_impact: 5,
        household_impact: 5,
        social_impact: 5,
        exercise_impact: 5,
        energy_level: 5,
        sleep_quality: 5,
        physical_comfort: 5,
        mood_state: 5,
        anxiety_level: 5,
        stress_management: 5,
        medication_effectiveness: 5,
        side_effects_impact: 5,
        treatment_satisfaction: 5,
        notes: ''
      })
    } catch (error) {
      console.error('Error submitting quality of life assessment:', error)
      toast.error('Failed to save quality of life assessment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality of Life Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {QOL_METRICS.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label} (1-10)</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id={key}
                  min="1"
                  max="10"
                  value={formData[key]}
                  onChange={e => handleSliderChange(key, parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="w-8 text-center">
                  {formData[key]}
                </span>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional comments about your quality of life..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Icons.Activity className="mr-2 h-4 w-4 animate-spin" />
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
      </CardContent>
    </Card>
  )
} 