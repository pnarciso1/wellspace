'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "../../../../components/ui/use-toast"
import Activity from 'lucide-react/dist/esm/icons/activity'
import Book from 'lucide-react/dist/esm/icons/book'
import Clipboard from 'lucide-react/dist/esm/icons/clipboard'
import Info from 'lucide-react/dist/esm/icons/info'
import type { Database } from '../../../../types/supabase'

export default function GPACTPage() {
  const router = useRouter()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    videoCompleted: false,
    currentStep: 1
  })
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()

  const checkEnrollment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: enrollment } = await supabase
        .from('gpact_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (enrollment) {
        setIsEnrolled(true)
        setEnrollmentStatus({
          videoCompleted: enrollment.video_completed,
          currentStep: enrollment.current_step
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
        .from('gpact_enrollments')
        .insert([{
          user_id: user.id,
          current_step: 1,
          video_completed: false,
          enrolled_at: new Date().toISOString()
        }])

      setIsEnrolled(true)
      toast({
        title: "Successfully Enrolled",
        description: "Welcome to the G-PACT Program!"
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
      title: "Video Library",
      description: "Access our comprehensive library of G-PACT educational videos.",
      icon: Activity,
      status: 'available',
      link: '/dashboard/gpact/videos'
    },
    {
      id: 2,
      title: "Healthcare Terms Glossary",
      description: "Access our comprehensive glossary of G-PACT related healthcare terms with AI-powered chat assistance.",
      icon: Book,
      status: 'available',
      link: '/dashboard/gpact/tools/glossary'
    },
    {
      id: 3,
      title: "Medication Log",
      description: "Track and manage your medications with our interactive logging tool.",
      icon: Clipboard,
      status: 'available',
      link: '/dashboard/gpact/tools/medications'
    },
    {
      id: 4,
      title: "Symptom Tracker and Doctor Visit Preparation",
      description: "Track your symptoms and prepare effectively for your medical appointments with our structured tools.",
      icon: Info,
      status: 'available',
      link: '/dashboard/gpact/tools/doctor-visit'
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
            <CardTitle>Welcome to the G-PACT Program</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Join our comprehensive program designed to support your Gastroparesis journey.</p>
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
          <img src="/images/gpact-logo.png" alt="G-PACT Logo" className="mx-auto h-16 mb-4 bg-white border" style={{ width: 'auto', maxHeight: '4rem' }} />
          <CardTitle>
            <span className="block text-4xl font-bold">Gastroparesis</span>
            <span className="block text-primary">Patient Program</span>
          </CardTitle>
          <p className="mt-3 text-xl text-gray-500">
            An innovative, patient-centered program empowering individuals living with Gastroparesis.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {programSteps.map((step) => (
          <Card key={step.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 