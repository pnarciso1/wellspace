'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import type { Database } from 'wellspace/types/supabase'
import type { Medication } from '@/types/medications'

const medicationSchema = z.object({
  drug_name: z.string().min(1, 'Drug name is required'),
  indication: z.string().optional(),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  timing: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  stop_date: z.string().optional(),
  still_using: z.boolean().default(true),
  status: z.string().default('active'),
  notes: z.string().optional(),
  as_needed: z.boolean().default(false),
  gastroparesis_specific: z.boolean().default(false),
  symptom_target: z.array(z.string()).default([])
})

type MedicationFormValues = z.infer<typeof medicationSchema>

interface MedicationFormProps {
  onSuccess: (medicationData?: any, isEdit?: boolean) => void
  initialData?: Partial<MedicationFormValues>
  editingMedication?: Medication | null
}

export function MedicationForm({ onSuccess, initialData, editingMedication }: MedicationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Prepare initial data for editing
  const getInitialData = () => {
    if (editingMedication) {
      return {
        drug_name: editingMedication.drug_name || '',
        indication: editingMedication.indication || '',
        dosage: editingMedication.dosage || '',
        frequency: editingMedication.frequency || '',
        timing: editingMedication.timing || '',
        start_date: editingMedication.start_date ? format(new Date(editingMedication.start_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        stop_date: editingMedication.stop_date ? format(new Date(editingMedication.stop_date), 'yyyy-MM-dd') : '',
        still_using: editingMedication.still_using ?? true,
        status: editingMedication.status || 'active',
        notes: editingMedication.notes || '',
        as_needed: editingMedication.as_needed ?? false,
        gastroparesis_specific: editingMedication.gastroparesis_specific ?? false,
        symptom_target: editingMedication.symptom_target || [],
        ...initialData
      }
    }
    return {
      drug_name: '',
      indication: '',
      dosage: '',
      frequency: '',
      timing: '',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      stop_date: '',
      still_using: true,
      status: 'active',
      notes: '',
      as_needed: false,
      gastroparesis_specific: false,
      symptom_target: [],
      ...initialData
    }
  }

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: getInitialData()
  })

  // Reset form when editingMedication changes
  useEffect(() => {
    form.reset(getInitialData())
  }, [editingMedication])

  const onSubmit = async (data: MedicationFormValues) => {
    try {
      setIsLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Build medicationData with required fields
      const medicationData: any = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        updated_at: new Date().toISOString()
      }
      if (data.stop_date && data.stop_date !== '') {
        medicationData.stop_date = new Date(data.stop_date).toISOString()
      } else {
        delete medicationData.stop_date
      }

      if (editingMedication) {
        // Update existing medication
        const { error } = await supabase
          .from('medications')
          .update(medicationData)
          .eq('id', editingMedication.id)

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Medication updated successfully'
        })

        onSuccess(medicationData, true)
      } else {
        // Create new medication
        medicationData.user_id = user.id
        medicationData.created_at = new Date().toISOString()

        const { error } = await supabase
          .from('medications')
          .insert([medicationData])

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Medication added successfully'
        })

        onSuccess(medicationData, false)
      }
    } catch (error: any) {
      console.error('Error saving medication:', error, error?.message, error?.details)
      toast({
        title: 'Error',
        description: `Failed to ${editingMedication ? 'update' : 'add'} medication. Please try again.`,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="drug_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drug Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="indication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indication (Why are you taking this medication?)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="timing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timing (e.g., with meals, before bed)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stop_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stop Date (if applicable)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="still_using"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Still Using</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="as_needed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>As Needed</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gastroparesis_specific"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Gastroparesis-Specific Medication</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (editingMedication ? 'Updating...' : 'Adding...') : (editingMedication ? 'Update Medication' : 'Add Medication')}
        </Button>
      </form>
    </Form>
  )
}
