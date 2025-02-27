"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus as PlusIcon, ClipboardList, FileText } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { DoctorVisitForm } from './components/doctor-visit-form'
import { PatientInfoForm } from './components/patient-info-form'
import { QualityOfLifeForm } from './components/quality-of-life-form'
import { SymptomCategoryFilter } from './components/symptom-category-filter'
import { DoctorVisitTimeline } from './components/doctor-visit-timeline'
import { VisitSummary } from './components/visit-summary'
import type { 
  SymptomType, 
  SymptomData, 
  CategoryType,
  DoctorVisitRecord,
  QualityOfLife
} from './types'

type VisitStep = 'patient-info' | 'symptoms' | 'quality-of-life' | 'review'

export default function DoctorVisitClient() {
  const [currentStep, setCurrentStep] = useState<VisitStep>('patient-info')
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [timelineEvents, setTimelineEvents] = useState<SymptomData[]>([])
  const [currentRecord, setCurrentRecord] = useState<DoctorVisitRecord | null>(null)
  const [qualityOfLife, setQualityOfLife] = useState<QualityOfLife | null>(null)

  const supabase = createClientComponentClient()

  // Only load Quality of Life data when moving to review step
  useEffect(() => {
    if (currentStep === 'review' && currentRecord) {
      loadQualityOfLife(currentRecord.id)
    }
  }, [currentStep, currentRecord])

  const loadQualityOfLife = async (recordId: string) => {
    try {
      const { data, error } = await supabase
        .from('doctor_visit_quality_of_life')
        .select('*')
        .eq('record_id', recordId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - this is okay
          console.log('No quality of life data found yet')
          return
        }
        throw error
      }

      console.log('Loaded Quality of Life data:', data)
      setQualityOfLife(data)
    } catch (error) {
      console.error('Error loading quality of life data:', error)
      // Only show error toast if we're actually trying to view the data
      if (currentStep === 'review') {
        toast.error('Failed to load quality of life data')
      }
    }
  }

  const handlePatientInfoComplete = (record: DoctorVisitRecord) => {
    setCurrentRecord(record)
    setCurrentStep('symptoms')
  }

  const handleFormSuccess = async (symptom: SymptomData) => {
    setShowForm(false)
    setTimelineEvents(prev => [symptom, ...prev])
  }

  const handleQualityOfLifeComplete = async () => {
    if (currentRecord) {
      setCurrentStep('review')
    }
  }

  const handleBackToSymptoms = () => {
    setCurrentStep('symptoms')
    setShowForm(false)
  }

  // ... rest of the component remains the same ...

  return (
    <>
      <Toaster />
      {currentStep === 'patient-info' && (
        <PatientInfoForm onComplete={handlePatientInfoComplete} />
      )}

      {currentStep === 'quality-of-life' && currentRecord && (
        <QualityOfLifeForm
          recordId={currentRecord.id}
          onComplete={handleQualityOfLifeComplete}
          onBack={() => setCurrentStep('symptoms')}
        />
      )}

      {currentStep === 'review' && currentRecord && (
        <VisitSummary
          record={currentRecord}
          symptoms={timelineEvents}
          qualityOfLife={qualityOfLife}
          onBack={handleBackToSymptoms}
        />
      )}

      {currentStep === 'symptoms' && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Doctor Visit Preparation</CardTitle>
              <CardDescription>
                Record your symptoms and their details for your doctor visit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-x-4">
                  <Button onClick={() => setShowForm(true)}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Symptom
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('patient-info')}
                  >
                    Edit Patient Info
                  </Button>
                  {timelineEvents.length > 0 && (
                    <Button
                      onClick={() => setCurrentStep('quality-of-life')}
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Continue to Quality of Life
                    </Button>
                  )}
                  {qualityOfLife && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('review')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Summary
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {!timelineEvents.length && !showForm && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground mb-4">
                  Let's start by recording your first symptom
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => setShowForm(true)}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Symptom
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {showForm && currentRecord && (
            <DoctorVisitForm 
              recordId={currentRecord.id}
              onSuccess={handleFormSuccess} 
              onCancel={() => setShowForm(false)}
            />
          )}

          <div className="space-y-8 mt-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">Symptom Timeline</h2>
              <SymptomCategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            <DoctorVisitTimeline
              visits={timelineEvents}
              selectedCategory={selectedCategory}
            />
          </div>
        </>
      )}
    </>
  )
}
