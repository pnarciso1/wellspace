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
  work_impact: z.string().min(1, "Please rate your work impact"),
  household_impact: z.string().min(1, "Please rate your household impact"),
  social_impact: z.string().min(1, "Please rate your social impact"),
  exercise_impact: z.string().min(1, "Please rate your exercise impact"),
  energy_level: z.string().min(1, "Please rate your energy level"),
  notes: z.string().optional(),
})

const ratingLevels = [
  { value: "1", label: "Very Poor" },
  { value: "2", label: "Poor" },
  { value: "3", label: "Fair" },
  { value: "4", label: "Good" },
  { value: "5", label: "Excellent" },
]

interface QualityOfLifeFormProps {
  recordId: string
  onComplete: () => void
  onBack: () => void
}

export function QualityOfLifeForm({ recordId, onComplete, onBack }: QualityOfLifeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      work_impact: "",
      household_impact: "",
      social_impact: "",
      exercise_impact: "",
      energy_level: "",
      notes: "",
    },
  })

  useEffect(() => {
    const loadExistingData = async () => {
      if (!recordId) return

      try {
        const { data, error } = await supabase
          .from('doctor_visit_quality_of_life')
          .select('*')
          .eq('record_id', recordId)
          .single()

        if (error && error.code !== 'PGRST116') throw error
        
        if (data) {
          form.reset({
            work_impact: String(data.work_impact || ""),
            household_impact: String(data.household_impact || ""),
            social_impact: String(data.social_impact || ""),
            exercise_impact: String(data.exercise_impact || ""),
            energy_level: String(data.energy_level || ""),
            notes: data.notes || "",
          })
        }
      } catch (error) {
        console.error('Error loading quality of life data:', error)
        toast({
          title: "Error",
          description: "Failed to load existing data",
          variant: "destructive",
        })
      }
    }

    loadExistingData()
  }, [recordId, form, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const { data, error } = await supabase
        .from('doctor_visit_quality_of_life')
        .upsert({
          record_id: recordId,
          work_impact: parseInt(form.getValues('work_impact')),
          household_impact: parseInt(form.getValues('household_impact')),
          social_impact: parseInt(form.getValues('social_impact')),
          exercise_impact: parseInt(form.getValues('exercise_impact')),
          energy_level: parseInt(form.getValues('energy_level')),
          notes: form.getValues('notes') || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      onComplete()
    } catch (error) {
      console.error('Error submitting quality of life:', error)
      toast({
        title: "Error",
        description: "Failed to save quality of life assessment",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quality of Life Assessment</h3>
          <p className="text-muted-foreground">
            Please rate different aspects of your quality of life over the past week.
          </p>
        </div>

        <FormField
          control={form.control}
          name="work_impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Impact</FormLabel>
              <FormDescription>
                How would you rate MG's impact on your work activities?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ratingLevels.map((level) => (
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
              <FormLabel>Household Impact</FormLabel>
              <FormDescription>
                How would you rate MG's impact on your household activities?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ratingLevels.map((level) => (
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
              <FormLabel>Social Impact</FormLabel>
              <FormDescription>
                How would you rate MG's impact on your social activities?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ratingLevels.map((level) => (
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
          name="exercise_impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Impact</FormLabel>
              <FormDescription>
                How would you rate MG's impact on your exercise activities?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ratingLevels.map((level) => (
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
          name="energy_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Energy Level</FormLabel>
              <FormDescription>
                How would you rate your overall energy level?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ratingLevels.map((level) => (
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
                Please provide any additional comments about your quality of life.
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about your quality of life"
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
            {isLoading ? "Saving..." : "Complete Assessment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
