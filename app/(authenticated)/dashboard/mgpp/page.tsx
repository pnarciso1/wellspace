'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { default as NextLink } from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function MGPPPage() {
  const router = useRouter()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    preAssessmentCompleted: false,
    videoCompleted: false,
    currentStep: 1,
    glossaryUnlocked: false,
    medicationLogUnlocked: false,
    doctorVisitUnlocked: false,
    postAssessmentUnlocked: false
  })
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const checkEnrollment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: enrollment } = await supabase
        .from('mgpp_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (enrollment) {
        setIsEnrolled(true)
        setEnrollmentStatus({
          preAssessmentCompleted: enrollment.pre_assessment_completed,
          videoCompleted: enrollment.video_completed,
          currentStep: enrollment.current_step,
          glossaryUnlocked: enrollment.glossary_unlocked,
          medicationLogUnlocked: enrollment.medication_log_unlocked,
          doctorVisitUnlocked: enrollment.doctor_visit_unlocked,
          postAssessmentUnlocked: enrollment.post_assessment_unlocked
        })
      } else {
        setIsEnrolled(false)
      }
    } catch (error) {
      console.error('Error checking enrollment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('mgpp_enrollments')
        .insert([{
          user_id: user.id,
          current_step: 1,
          pre_assessment_completed: false,
          video_completed: false,
          glossary_unlocked: false,
          medication_log_unlocked: false,
          doctor_visit_unlocked: false,
          post_assessment_unlocked: false,
          enrolled_at: new Date().toISOString()
        }])

      setIsEnrolled(true)
      toast({
        title: "Successfully Enrolled",
        description: "Welcome to the MGPP Program!"
      })
    } catch (error) {
      console.error('Error enrolling:', error)
      toast({
        title: "Error",
        description: "Failed to enroll in program. Please try again.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    checkEnrollment()
    window.addEventListener('focus', checkEnrollment)
    return () => window.removeEventListener('focus', checkEnrollment)
  }, [])

  const programSteps = [
    {
      id: 1,
      title: "Pre-Pilot Assessment",
      description: "Begin with an initial assessment to help us understand your current knowledge and experience with MG care.",
      status: enrollmentStatus.preAssessmentCompleted ? 'completed' : 'available',
      link: '/dashboard/mgpp/assessment/pre'
    },
    {
      id: 2,
      title: "Program Introduction Video",
      description: "Learn about the program through our comprehensive overview video.",
      status: enrollmentStatus.preAssessmentCompleted ? (enrollmentStatus.videoCompleted ? 'completed' : 'available') : 'locked',
      link: '/dashboard/mgpp/video'
    },
    {
      id: 3,
      title: "Healthcare Terms Glossary",
      description: "Access our comprehensive glossary of MG-related healthcare terms with AI-powered chat assistance.",
      status: enrollmentStatus.glossaryUnlocked ? 'available' : 'locked',
      link: '/dashboard/mgpp/tools/glossary'
    },
    {
      id: 4,
      title: "Medication Log",
      description: "Track and manage your Myasthenia Gravis medications with our interactive logging tool.",
      status: enrollmentStatus.medicationLogUnlocked ? 'available' : 'locked',
      link: '/dashboard/mgpp/tools/medications'  // Updated to correct plural form
    },
    {
      id: 5,
      title: "Doctor Visit Preparation",
      description: "Prepare effectively for your medical appointments with our structured preparation guide.",
      status: enrollmentStatus.doctorVisitUnlocked ? 'available' : 'locked',
      link: '/dashboard/mgpp/tools/doctor-visit'
    },
    {
      id: 6,
      title: "Post-Pilot Assessment",
      description: "Complete a final assessment to measure your progress and provide program feedback.",
      status: enrollmentStatus.postAssessmentUnlocked ? 'available' : 'locked',
      link: '/dashboard/mgpp/assessment/post'
    }
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isEnrolled) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to the MGPP Program</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Join our comprehensive program designed to support your Myasthenia Gravis journey.</p>
            <Button onClick={handleEnroll}>Enroll in Program</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle>
            <span className="block text-4xl font-bold">Myasthenia Gravis</span>
            <span className="block text-primary">Patient Pilot Program</span>
          </CardTitle>
          <p className="mt-3 text-xl text-gray-500">
            An innovative, patient-centered program empowering individuals living with Myasthenia Gravis.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programSteps.map((step) => (
          <Card key={step.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">{step.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${step.status === 'locked' ? 'bg-gray-100 text-gray-800' :
                    step.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'}`}>
                  {step.status === 'locked' ? 'Locked' :
                   step.status === 'completed' ? 'Completed' : 'Available'}
                </span>
              </div>
              <p className="text-gray-500 mb-4">{step.description}</p>
              {step.status !== 'locked' && (
                <Button 
                  className="w-full" 
                  onClick={() => router.push(step.link)}
                >
                  {step.status === 'completed' ? 'Review' : 'Begin'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
