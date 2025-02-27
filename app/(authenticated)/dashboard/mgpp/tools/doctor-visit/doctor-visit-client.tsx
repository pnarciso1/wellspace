'use client'

import * as React from 'react'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus as PlusIcon, FileText } from 'lucide-react'
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

  const supabase = createClientComponentClient()

  const handleInfoSubmit = async (data: PatientInfo) => {
    try {
      const { data: record, error } = await supabase
        .from('doctor_visit_records')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      setRecordId(record.id)
      setRecord(record)
      setStep('symptoms')
      toast.success('Patient information saved')
    } catch (error) {
      console.error('Error saving patient info:', error)
      toast.error('Failed to save patient information')
    }
  }

  const handleSymptomSubmit = (symptom: any) => {
    setSymptoms(prev => [...prev, symptom])
    toast.success('Symptom recorded')
  }

  const handleQualitySubmit = () => {
    setStep('summary')
  }

  const renderStep = () => {
    switch (step) {
      case 'info':
        return (
          <PatientInfoForm onSubmit={handleInfoSubmit} />
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
                  <FileText className="h-4 w-4 mr-2" />
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

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Symptom</CardTitle>
                    <CardDescription>
                      Record a new symptom and its details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => {
                        const dialog = document.getElementById('symptom-dialog') as HTMLDialogElement
                        if (dialog) dialog.showModal()
                      }}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      New Symptom
                    </Button>
                  </CardContent>
                </Card>

                <dialog id="symptom-dialog" className="modal">
                  <div className="modal-box max-w-3xl">
                    <DoctorVisitForm
                      recordId={recordId!}
                      onSuccess={(symptom) => {
                        handleSymptomSubmit(symptom)
                        const dialog = document.getElementById('symptom-dialog') as HTMLDialogElement
                        if (dialog) dialog.close()
                      }}
                      onCancel={() => {
                        const dialog = document.getElementById('symptom-dialog') as HTMLDialogElement
                        if (dialog) dialog.close()
                      }}
                    />
                  </div>
                </dialog>
              </div>
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
      default:
        return null
    }
  }

  return (
    <div className="container py-8">
      {renderStep()}
      <Toaster />
    </div>
  )
}
