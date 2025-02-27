'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from '@/types/database'

interface MedicationFormProps {
  onSuccess?: () => void
}

export function MedicationForm({ onSuccess }: MedicationFormProps) {
  const [drug_name, setDrugName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const validateAndGetHealthRecord = async () => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) return { error: 'Please sign in to add medications' }

      // First check MGPP enrollment and access
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('mgpp_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (enrollmentError || !enrollment) {
        return { error: 'Please enroll in the MGPP program first' }
      }

      if (!enrollment.medication_log_unlocked) {
        return { error: 'Please complete the required steps to unlock the medication log' }
      }

      // Then get or create health record
      const { data: healthRecord, error: healthRecordError } = await supabase
        .from('health_records')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (healthRecordError && healthRecordError.code !== 'PGRST116') {
        console.error('Health record error:', healthRecordError)
        throw healthRecordError
      }

      if (!healthRecord) {
        // Create new health record
        const { data: newHealthRecord, error: createError } = await supabase
          .from('health_records')
          .insert([{ user_id: user.id }])
          .select()
          .single()

        if (createError) throw createError
        return { healthRecordId: newHealthRecord.id }
      }

      return { healthRecordId: healthRecord.id }
    } catch (error) {
      console.error('Validation error:', error)
      return { error: 'Error validating health record' }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      const validation = await validateAndGetHealthRecord()
      if ('error' in validation) {
        toast({
          title: "Error",
          description: validation.error,
          variant: "destructive"
        })
        return
      }

      const { healthRecordId } = validation

      const { error: insertError } = await supabase
        .from('medications')
        .insert([{
          health_record_id: healthRecordId,
          drug_name,
          dosage,
          frequency,
          notes,
          start_date: new Date().toISOString(),
          still_using: true,
          status: 'active'
        }])

      if (insertError) throw insertError

      toast({
        title: "Success",
        description: "Medication added successfully"
      })

      router.refresh()
      setDrugName('')
      setDosage('')
      setFrequency('')
      setNotes('')
      onSuccess?.()
    } catch (error) {
      console.error('Error adding medication:', error)
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="drug_name">Medication Name</Label>
        <Input
          id="drug_name"
          value={drug_name}
          onChange={(e) => setDrugName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="dosage">Dosage</Label>
        <Input
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Input
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-32"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Medication'}
      </Button>
    </form>
  )
}
