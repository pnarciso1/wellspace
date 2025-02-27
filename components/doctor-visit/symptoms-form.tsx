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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  dysarthria: z.enum(['yes', 'no'], {
    required_error: "Please select yes or no",
  }),
  dysarthria_severity: z.string().optional(),
  
  dysphagia: z.enum(['yes', 'no'], {
    required_error: "Please select yes or no",
  }),
  dysphagia_severity: z.string().optional(),
  
  dyspnea: z.enum(['yes', 'no'], {
    required_error: "Please select yes or no",
  }),
  dyspnea_severity: z.string().optional(),
  
  notes: z.string().optional(),
})

const severityLevels = [
  { value: "1", label: "Very Mild" },
  { value: "2", label: "Mild" },
  { value: "3", label: "Moderate" },
  { value: "4", label: "Severe" },
  { value: "5", label: "Very Severe" },
]

interface SymptomsFormProps {
  recordId: string
  onComplete: () => void
  onBack: () => void
}

export function SymptomsForm({ recordId, onComplete, onBack }: SymptomsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dysarthria: undefined,
      dysphagia: undefined,
      dyspnea: undefined,
      dysarthria_severity: undefined,
      dysphagia_severity: undefined,
      dyspnea_severity: undefined,
      notes: "",
    },
  })

  // Load existing data if any
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data, error } = await supabase
          .from('doctor_visit_symptoms')
          .select('*')
          .eq('record_id', recordId)
          .single()

        if (error && error.code !== 'PGRST116') throw error
        
        if (data) {
          form.reset({
            dysarthria: data.dysarthria ? 'yes' : 'no',
            dysphagia: data.dysphagia ? 'yes' : 'no',
            dyspnea: data.dyspnea ? 'yes' : 'no',
            dysarthria_severity: data.dysarthria_severity ? String(data.dysarthria_severity) : undefined,
            dysphagia_severity: data.dysphagia_severity ? String(data.dysphagia_severity) : undefined,
            dyspnea_severity: data.dyspnea_severity ? String(data.dyspnea_severity) : undefined,
            notes: data.notes || "",
          })
        }
      } catch (error) {
        console.error('Error loading symptoms data:', error)
      }
    }

    loadExistingData()
  }, [recordId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      const symptomsData = {
        record_id: recordId,
        dysarthria: values.dysarthria === 'yes',
        dysphagia: values.dysphagia === 'yes',
        dyspnea: values.dyspnea === 'yes',
        dysarthria_severity: values.dysarthria === 'yes' ? parseInt(values.dysarthria_severity || '0') : null,
        dysphagia_severity: values.dysphagia === 'yes' ? parseInt(values.dysphagia_severity || '0') : null,
        dyspnea_severity: values.dyspnea === 'yes' ? parseInt(values.dyspnea_severity || '0') : null,
        notes: values.notes,
      }

      // Check if record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('doctor_visit_symptoms')
        .select('id')
        .eq('record_id', recordId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('doctor_visit_symptoms')
          .update(symptomsData)
          .eq('record_id', recordId)

        if (updateError) throw updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('doctor_visit_symptoms')
          .insert([symptomsData])

        if (insertError) throw insertError
      }

      // Update the record's current step
      const { error: updateError } = await supabase
        .from('doctor_visit_records')
        .update({ 
          current_step: 'daily_living',
          updated_at: new Date().toISOString(),
        })
        .eq('id', recordId)

      if (updateError) throw updateError

      toast({
        title: "Success",
        description: "Symptoms information saved successfully",
      })
      
      onComplete()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to save symptoms. Please try again.",
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
          <h3 className="text-lg font-semibold">Symptoms of Myasthenia Gravis</h3>
          <p className="text-muted-foreground">
            The following questions are about common MG symptoms. Please indicate if you experience any of these.
          </p>
        </div>

        {/* Dysarthria Section */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dysarthria"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Difficulty Talking - DYSARTHRIA</FormLabel>
                <FormDescription>
                  DYS = difficulty + ARTHRIA = articulation
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('dysarthria') === 'yes' && (
            <FormField
              control={form.control}
              name="dysarthria_severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity of Difficulty Talking</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {severityLevels.map((level) => (
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
          )}
        </div>

        {/* Dysphagia Section */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dysphagia"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Difficulty Chewing - DYSPHAGIA</FormLabel>
                <FormDescription>
                  DYS = difficulty + PHAGIA = to eat
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('dysphagia') === 'yes' && (
            <FormField
              control={form.control}
              name="dysphagia_severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity of Difficulty Chewing</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {severityLevels.map((level) => (
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
          )}
        </div>

        {/* Dyspnea Section */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dyspnea"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Difficulty Breathing - DYSPNEA</FormLabel>
                <FormDescription>
                  DYS = difficult + PNEA = breath
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('dyspnea') === 'yes' && (
            <FormField
              control={form.control}
              name="dyspnea_severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity of Difficulty Breathing</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {severityLevels.map((level) => (
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
          )}
        </div>

        {/* Notes Section */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about your symptoms"
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
