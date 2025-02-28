"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import type { SymptomType } from '@/app/(authenticated)/dashboard/mgpp/tools/doctor-visit/types'

interface DoctorVisitFormProps {
  onSuccess: () => void
}

export function DoctorVisitForm({ onSuccess }: DoctorVisitFormProps) {
  const [loading, setLoading] = useState(false)
  const [symptomType, setSymptomType] = useState<SymptomType>('speech')
  const [intensity, setIntensity] = useState<number>(1)
  const [notes, setNotes] = useState('')

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('doctor_visit_symptoms')
        .insert([
          {
            user_id: user.id,
            symptom_type: symptomType,
            intensity,
            notes,
            is_present: true
          }
        ])

      if (error) throw error

      toast.success('Symptom recorded successfully')
      onSuccess()
    } catch (error) {
      console.error('Error recording symptom:', error)
      toast.error('Failed to record symptom')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Symptom Type</Label>
            <RadioGroup
              value={symptomType}
              onValueChange={(value: string) => setSymptomType(value as SymptomType)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="speech" id="speech" />
                  <Label htmlFor="speech">Speech</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vision" id="vision" />
                  <Label htmlFor="vision">Vision</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="breathing" id="breathing" />
                  <Label htmlFor="breathing">Breathing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="swallowing" id="swallowing" />
                  <Label htmlFor="swallowing">Swallowing</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Intensity (1-10)</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-4">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Recording...' : 'Record Symptom'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
