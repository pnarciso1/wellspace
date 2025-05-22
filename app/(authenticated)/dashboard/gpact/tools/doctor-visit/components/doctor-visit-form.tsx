'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/lib/icons"
import { toast } from 'sonner'
import type { 
  GPACTDoctorVisitFormProps,
  GPACTSymptomType,
  GPACTSymptomFrequency,
  GPACTSymptomIntensity,
  GPACTSymptomFormData
} from '@/types/gpact-doctor-visit'

// Import the symptom displays as a value, not a type
import { GPACT_SYMPTOM_DISPLAYS } from '@/types/gpact-doctor-visit'

export function DoctorVisitForm({ onSuccess, onCancel }: GPACTDoctorVisitFormProps) {
  const [loading, setLoading] = useState(false)
  const [symptomType, setSymptomType] = useState<GPACTSymptomType>('fatigue')
  const [frequency, setFrequency] = useState<GPACTSymptomFrequency>('sometimes')
  const [intensity, setIntensity] = useState<GPACTSymptomIntensity>('mild')
  const [treatments, setTreatments] = useState<string[]>([])
  const [context, setContext] = useState<string[]>([])
  const [timePatterns, setTimePatterns] = useState<Record<string, boolean>>({
    morning: false,
    afternoon: false,
    evening: false,
    night: false
  })
  const [triggers, setTriggers] = useState<{ hasTriggers: boolean; description?: string }>({
    hasTriggers: false
  })
  const [affectedAreas, setAffectedAreas] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [symptomStartDate, setSymptomStartDate] = useState<string>('')
  const [symptomChanges, setSymptomChanges] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const symptomData: GPACTSymptomFormData = {
        record_id: '', // This will be set by the parent component
        symptom_type: symptomType,
        frequency,
        intensity,
        treatments: Array.isArray(treatments) ? treatments : [],
        context: Array.isArray(context) ? context : [],
        time_patterns: timePatterns,
        triggers,
        affected_areas: Array.isArray(affectedAreas) ? affectedAreas : [],
        notes,
        symptom_start_date: symptomStartDate,
        symptom_changes: Array.isArray(symptomChanges) ? symptomChanges : []
      }

      await onSuccess(symptomData)

      // Reset form
      setSymptomType('fatigue')
      setFrequency('sometimes')
      setIntensity('mild')
      setTreatments([])
      setContext([])
      setTimePatterns({
        morning: false,
        afternoon: false,
        evening: false,
        night: false
      })
      setTriggers({ hasTriggers: false })
      setAffectedAreas([])
      setNotes('')
      setSymptomStartDate('')
      setSymptomChanges([])
    } catch (error) {
      console.error('Error submitting symptom:', error)
      toast.error('Failed to save symptom')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="symptom-type">Symptom Type</Label>
          <Select
            value={symptomType}
            onValueChange={(value: GPACTSymptomType) => setSymptomType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a symptom" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(GPACT_SYMPTOM_DISPLAYS).map(([type, display]) => (
                <SelectItem key={type} value={type as GPACTSymptomType}>
                  <div className="flex items-center gap-2">
                    {display.icon === 'Activity' && <Icons.Activity className="h-4 w-4" />}
                    {display.icon === 'Heart' && <Icons.Heart className="h-4 w-4" />}
                    {display.icon === 'AlertCircle' && <Icons.AlertCircle className="h-4 w-4" />}
                    {display.icon === 'User' && <Icons.User className="h-4 w-4" />}
                    {display.icon === 'MessageSquare' && <Icons.MessageSquare className="h-4 w-4" />}
                    {display.icon === 'Calendar' && <Icons.Calendar className="h-4 w-4" />}
                    {display.icon === 'CheckCircle' && <Icons.CheckCircle className="h-4 w-4" />}
                    {display.icon === 'XCircle' && <Icons.XCircle className="h-4 w-4" />}
                    {display.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(value: GPACTSymptomFrequency) => setFrequency(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
              <SelectItem value="sometimes">Sometimes</SelectItem>
              <SelectItem value="often">Often</SelectItem>
              <SelectItem value="always">Always</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="intensity">Intensity</Label>
          <Select
            value={intensity}
            onValueChange={(value: GPACTSymptomIntensity) => setIntensity(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select intensity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
              <SelectItem value="very_severe">Very Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Time Patterns</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(timePatterns).map(([time, checked]) => (
              <div key={time} className="flex items-center space-x-2">
                <Checkbox
                  id={`time-${time}`}
                  checked={checked}
                  onCheckedChange={(checked: boolean) => 
                    setTimePatterns(prev => ({ ...prev, [time]: checked }))
                  }
                />
                <Label htmlFor={`time-${time}`} className="capitalize">
                  {time}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about your symptom..."
          />
        </div>

        <div>
          <Label htmlFor="start-date">When did this symptom start?</Label>
          <Input
            id="start-date"
            type="date"
            value={symptomStartDate}
            onChange={(e) => setSymptomStartDate(e.target.value)}
          />
        </div>
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
              Save Symptom
            </>
          )}
        </Button>
      </div>
    </form>
  )
} 