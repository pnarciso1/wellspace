'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from '@/lib/icons'
import { Toaster, toast } from 'sonner'
import { DoctorVisitForm } from './components/doctor-visit-form'
import { PatientInfoForm } from './components/patient-info-form'
import { QualityOfLifeForm } from './components/quality-of-life-form'
import { VisitSummary } from './components/visit-summary'
import { SymptomCategoryFilter } from './components/symptom-category-filter'
import { DoctorVisitTimeline } from './components/doctor-visit-timeline'
import type { CategoryType } from './types'

type Step = 'info' | 'symptoms' | 'quality' | 'summary'

interface PatientInfo {
  first_name: string
  last_name: string
  email: string
  address: string
  state: string
  zip_code: string
  birth_year: string
  years_with_mg: string
}

export default function DoctorVisitClient() {
  const [step, setStep] = useState<Step>('info')
  const [recordId, setRecordId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [symptoms, setSymptoms] = useState<any[]>([])
  const [qualityOfLife, setQualityOfLife] = useState<any>(null)
  const [record, setRecord] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClientComponentClient()

  // Load quality of life data when recordId changes
  useEffect(() => {
    if (recordId) {
      loadQualityOfLifeData();
    }
  }, [recordId]);

  const loadQualityOfLifeData = async () => {
    if (!recordId) return;
    
    try {
      const { data, error } = await supabase
        .from('doctor_visit_quality_of_life')
        .select('*')
        .eq('record_id', recordId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading quality of life data:', error);
        return;
      }
      
      if (data) {
        setQualityOfLife(data);
      }
    } catch (error) {
      console.error('Error loading quality of life data:', error);
    }
  };

  const handleInfoSubmit = async (data: PatientInfo) => {
    try {
      setIsSubmitting(true)
      console.log('Submitting patient info:', data)
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        throw userError
      }
      
      if (!user) {
        toast.error('You must be logged in to submit information')
        return
      }
      
      // Add user_id to the data
      const recordData = {
        ...data,
        user_id: user.id
      }
      
      const { data: record, error } = await supabase
        .from('doctor_visit_records')
        .insert([recordData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setRecordId(record.id)
      setRecord(record)
      setStep('symptoms')
      toast.success('Patient information saved')
    } catch (error) {
      console.error('Error saving patient info:', error)
      toast.error('Failed to save patient information')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSymptomSubmit = (symptom: any) => {
    setSymptoms(prev => [...prev, symptom])
    toast.success('Symptom recorded')
  }

  const handleQualitySubmit = async () => {
    // Reload quality of life data before moving to summary
    await loadQualityOfLifeData();
    setStep('summary')
  }

  const renderStep = () => {
    switch (step) {
      case 'info':
        return (
          <PatientInfoForm 
            onSubmit={handleInfoSubmit} 
          />
        )
      case 'symptoms':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <SymptomCategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('quality')}
                >
                  <Icons.FileText className="h-4 w-4 mr-2" />
                  Quality of Life
                </Button>
                <Button onClick={() => setStep('summary')}>
                  <span className="mr-2">📋</span>
                  View Summary
                </Button>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_400px]">
              <DoctorVisitTimeline
                visits={symptoms}
                selectedCategory={selectedCategory}
              />
              <DoctorVisitForm
                recordId={recordId!}
                onSuccess={handleSymptomSubmit}
                onCancel={() => {}}
              />
            </div>
          </div>
        )
      case 'quality':
        return (
          <QualityOfLifeForm
            recordId={recordId!}
            onComplete={handleQualitySubmit}
            onBack={() => setStep('symptoms')}
          />
        )
      case 'summary':
        return (
          <VisitSummary
            record={record}
            symptoms={symptoms}
            qualityOfLife={qualityOfLife}
            onBack={() => setStep('symptoms')}
          />
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Doctor Visit Preparation</h1>
      {renderStep()}
    </div>
  )
}
