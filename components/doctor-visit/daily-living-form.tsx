'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  work_impact: z.string().min(1, "Please select an impact level"),
  household_impact: z.string().min(1, "Please select an impact level"),
  social_impact: z.string().min(1, "Please select an impact level"),
  notes: z.string().optional(),
})

const impactLevels = [
  { value: "none", label: "No Impact" },
  { value: "mild", label: "Mild Impact" },
  { value: "moderate", label: "Moderate Impact" },
  { value: "severe", label: "Severe Impact" },
  { value: "unable", label: "Unable to Perform" },
]

interface DailyLivingFormProps {
  recordId: string
  onComplete: () => void
  onBack: () => void
}

export function DailyLivingForm({ recordId, onComplete, onBack }: DailyLivingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      work_impact: "",
      household_impact: "",
      social_impact: "",
      notes: "",
    },
  })

  // Load existing data if any
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data, error } = await supabase
          .from('doctor_visit_daily_living')
          .select('*')
          .eq('record_id', recordId)
          .single()

        if (error && error.code !== 'PGRST116') throw error
        
        if (data) {
          form.reset({
            work_impact: data.work_impact,
            household_impact: data.household_impact,
            social_impact: data.social_impact,
            notes: data.notes || "",
          })
        }
      } catch (error) {
        console.error('Error loading daily living data:', error)
      }
    }

    loadExistingData()
  }, [recordId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Check if record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('doctor_visit_daily_living')
        .select('id')
        .eq('record_id', recordId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('doctor_visit_daily_living')
          .update(values)
          .eq('record_id', recordId)

        if (updateError) throw updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('doctor_visit_daily_living')
          .insert([{
            record_id: recordId,
            ...values,
          }])

        if (insertError) throw insertError
      }

      // Update the record's current step
      const { error: updateError } = await supabase
        .from('doctor_visit_records')
        .update({ 
          current_step: 'quality_of_life',
          updated_at: new Date().toISOString(),
        })
        .eq('id', recordId)

      if (updateError) throw updateError

      toast({
        title: "Success",
        description: "Daily living information saved successfully",
      })
      
      onComplete()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to save daily living information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Daily Living Impact</h3>
          <p className="text-muted-foreground">
            Please indicate how MG symptoms impact your daily activities.
          </p>
        </div>

        <FormField
          control={form.control}
          name="work_impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact on Work/School Activities</FormLabel>
              <FormDescription>
                How do your MG symptoms affect your ability to work or study?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {impactLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="household_impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact on Household Activities</FormLabel>
              <FormDescription>
                How do your MG symptoms affect your ability to perform household tasks?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {impactLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact on Social Activities</FormLabel>
              <FormDescription>
                How do your MG symptoms affect your social life and relationships?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {impactLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormDescription>
                Please provide any additional details about how MG affects your daily life.
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about daily living impacts"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
