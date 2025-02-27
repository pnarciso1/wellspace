'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

type Question = {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'scale' | 'text'
  options: {
    scale?: string[]
    options?: string[]
  }
  order_number: number
}

export default function PreAssessment() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Record<string, string | string[]>>({})
  const [loading, setLoading] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data } = await supabase
          .from('mgpp_assessment_questions')
          .select('*')
          .eq('assessment_type', 'pre')
          .order('order_number', { ascending: true })

        if (data) {
          setQuestions(data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load assessment questions.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  const handleResponse = (questionId: string, response: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setShowConfirmModal(false)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data: enrollment } = await supabase
        .from('mgpp_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!enrollment) throw new Error('No enrollment found')

      await supabase
        .from('mgpp_enrollments')
        .update({
          pre_assessment_completed: true,
          current_step: 2
        })
        .eq('id', enrollment.id)

      for (const [questionId, response] of Object.entries(responses)) {
        await supabase
          .from('mgpp_assessment_responses')
          .insert({
            user_id: user.id,
            enrollment_id: enrollment.id,
            question_id: questionId,
            assessment_type: 'pre',
            response: Array.isArray(response) ? response.join(',') : response
          })
      }

      toast({
        title: "Success!",
        description: "Assessment completed successfully."
      })

      router.push('/dashboard/mgpp')

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div>Loading assessment...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Pre-Program Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-4 pb-6 border-b last:border-0">
              <div className="text-sm text-gray-500">
                Question {index + 1} of {questions.length}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{question.question_text}</h3>
                {question.question_type === 'scale' && (
                  <RadioGroup
                    value={responses[question.id] as string || ''}
                    onValueChange={(value: string) => handleResponse(question.id, value)}
                  >
                    {question.options.scale?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                        <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {question.question_type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {question.options.options?.map((option) => (
                      <div key={option} className="flex items-start space-x-2">
                        <Checkbox
                          id={`${question.id}-${option}`}
                          checked={Array.isArray(responses[question.id])
                            ? (responses[question.id] as string[]).includes(option)
                            : false}
                          onCheckedChange={(checked: boolean) => {
                            const currentResponses = Array.isArray(responses[question.id])
                              ? responses[question.id] as string[]
                              : []
                            if (checked) {
                              handleResponse(question.id, [...currentResponses, option])
                            } else {
                              handleResponse(
                                question.id,
                                currentResponses.filter(r => r !== option)
                              )
                            }
                          }}
                        />
                        <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="pt-6">
            <Button 
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={() => setShowConfirmModal(true)}
            >
              Submit Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assessment</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your assessment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowConfirmModal(false)}
              className="bg-gray-100 text-gray-900 border-2 border-gray-300 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="mr-2">Submitting...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const dynamic = 'force-dynamic'
