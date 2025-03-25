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
import type { 
  CategoryType,
  QualityOfLife,
  SymptomType,
  FrequencyType,
  TreatmentType,
  TimeOfDay
} from './types'
import { useRouter } from 'next/navigation'
import { ClinicalOverview } from './components/clinical-overview'
import { DoctorVisitInstructions } from './components/doctor-visit-instructions'

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

interface PatientInfoFormProps {
  onSubmit: (data: PatientInfo) => Promise<void>
  onCancel: () => void
}

interface QualityOfLifeFormProps {
  recordId: string
  onComplete: (data: QualityOfLife) => void
  onBack: () => void
}

interface SymptomFormData {
  record_id: string;
  symptom_type: SymptomType;
  frequency: FrequencyType;
  intensity: number;
  treatments: TreatmentType[];
  context: string[];
  time_patterns: TimeOfDay[];
  triggers: { hasTrigggers: boolean; description?: string };
  notes: string;
  created_at: string;
}

export default function DoctorVisitClient() {
  const [step, setStep] = useState<Step>('info')
  const [recordId, setRecordId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [symptoms, setSymptoms] = useState<any[]>([])
  const [qualityOfLife, setQualityOfLife] = useState<any>(null)
  const [record, setRecord] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showClinicalOverview, setShowClinicalOverview] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const supabase = createClientComponentClient()
  const router = useRouter()

  // Load user's most recent record on component mount
  useEffect(() => {
    loadMostRecentRecord();
  }, []);

  const loadMostRecentRecord = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      if (!user) {
        console.error('No user found')
        return
      }

      // Get the most recent record for this user
      const { data: recentRecord, error: recordError } = await supabase
        .from('doctor_visit_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (recordError) {
        if (recordError.code === 'PGRST116') { // No record found
          setStep('info') // Start with info form
          return
        }
        throw recordError
      }

      if (recentRecord) {
        setRecordId(recentRecord.id)
        setRecord(recentRecord)
        setStep('symptoms') // Go directly to symptoms page
        
        // Load associated data
        await Promise.all([
          loadQualityOfLifeData(recentRecord.id),
          loadSymptomHistory(recentRecord.id)
        ])
      }
    } catch (error) {
      console.error('Error loading recent record:', error)
      toast.error('Failed to load your previous visit data')
    }
  }

  // Update loadQualityOfLifeData to accept recordId parameter
  const loadQualityOfLifeData = async (targetRecordId?: string) => {
    const rid = targetRecordId || recordId
    if (!rid) return;
    
    try {
      const { data, error } = await supabase
        .from('doctor_visit_quality_of_life')
        .select('*')
        .eq('record_id', rid)
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

  // Update loadSymptomHistory to accept recordId parameter
  const loadSymptomHistory = async (targetRecordId?: string) => {
    const rid = targetRecordId || recordId
    if (!rid) return;
    
    try {
      const { data, error } = await supabase
        .from('doctor_visit_symptoms')
        .select('*')
        .eq('record_id', rid)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error loading symptom history:', error);
        toast.error('Failed to load symptom history');
        return;
      }
      
      if (data) {
        setSymptoms(data);
        console.log('Loaded symptom history:', data);
      }
    } catch (error) {
      console.error('Error loading symptom history:', error);
      toast.error('Failed to load symptom history');
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

  const handleSymptomSubmit = async (symptomData: SymptomFormData) => {
    try {
      console.log('Saving symptom with data:', symptomData);

      // Save the new symptom to the database
      const { data, error } = await supabase
        .from('doctor_visit_symptoms')
        .insert([symptomData])
        .select()
        .single();

      if (error) {
        console.error('Error saving symptom:', error);
        toast.error('Failed to save symptom');
        return;
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }
      
      // Reload the full history after successful save
      await loadSymptomHistory();
      toast.success('Symptom recorded successfully');
    } catch (error) {
      console.error('Error in symptom submission:', error);
      toast.error('Failed to record symptom');
    }
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
          <Card className="max-w-3xl mx-auto shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Patient Information</CardTitle>
              <CardDescription>
                Please provide your personal details to help your doctor prepare for your visit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientInfoForm 
                onSubmit={handleInfoSubmit} 
                onCancel={() => router.back()}
              />
            </CardContent>
          </Card>
        )
      case 'symptoms':
        return (
          <div className="space-y-8">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <SymptomCategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                  <div className="flex gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none border-dashed hover:border-solid"
                      onClick={() => setStep('quality')}
                    >
                      <Icons.FileText className="h-4 w-4 mr-2" />
                      Quality of Life
                    </Button>
                    <Button 
                      className="flex-1 sm:flex-none shadow-sm"
                      onClick={() => setStep('summary')}
                    >
                      <Icons.CheckCircle className="h-4 w-4 mr-2" />
                      View Summary
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-[1fr_400px] lg:grid-cols-[1.5fr_450px]">
              <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Icons.Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Symptom Timeline
                  </h3>
                  {symptoms.length > 0 ? (
                    <DoctorVisitTimeline
                      visits={symptoms}
                      selectedCategory={selectedCategory}
                    />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                      <Icons.AlertCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/70" />
                      <p className="font-medium">No symptoms recorded yet.</p>
                      <p className="mt-2">Use the form to add your first symptom.</p>
                    </div>
                  )}
                </div>
              </div>
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
          <Card className="max-w-3xl mx-auto shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Quality of Life Assessment</CardTitle>
              <CardDescription>
                Please answer the following questions about how your condition affects your daily life.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QualityOfLifeForm
                recordId={recordId!}
                onComplete={(data) => {
                  setQualityOfLife(data)
                  setStep('summary')
                }}
                onBack={() => setStep('symptoms')}
              />
            </CardContent>
          </Card>
        )
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Visit Summary</h2>
              <div className="space-x-4">
                <Button variant="outline" onClick={() => setStep('symptoms')}>
                  <Icons.ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Symptoms
                </Button>
                <Button onClick={() => setShowClinicalOverview(true)}>
                  <Icons.FileText className="h-4 w-4 mr-2" />
                  View Clinical Overview
                </Button>
              </div>
            </div>
            <VisitSummary
              record={record}
              symptoms={symptoms}
              qualityOfLife={qualityOfLife}
              onBack={() => setStep('symptoms')}
            />
          </div>
        )
      default:
        return null
    }
  }

  if (showInstructions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DoctorVisitInstructions 
          onGetStarted={() => setShowInstructions(false)} 
        />
      </div>
    )
  }

  if (showClinicalOverview && record) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ClinicalOverview
          record={record}
          symptoms={symptoms}
          qualityOfLife={qualityOfLife}
          onBack={() => setShowClinicalOverview(false)}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Doctor Visit Preparation</h1>
            <p className="text-muted-foreground">
              Prepare for your doctor visit by recording your symptoms and health information.
            </p>
          </div>
        </div>
        
        <div className="flex items-center mt-6 border-b pb-4">
          <div className="flex space-x-2">
            <Button 
              variant={step === 'info' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => step !== 'info' && setStep('info')}
              className={step === 'info' ? 'shadow-sm' : ''}
            >
              1. Patient Info
            </Button>
            <Button 
              variant={step === 'symptoms' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => recordId && step !== 'symptoms' && setStep('symptoms')}
              disabled={!recordId}
              className={step === 'symptoms' ? 'shadow-sm' : ''}
            >
              2. Symptoms
            </Button>
            <Button 
              variant={step === 'quality' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => recordId && step !== 'quality' && setStep('quality')}
              disabled={!recordId}
              className={step === 'quality' ? 'shadow-sm' : ''}
            >
              3. Quality of Life
            </Button>
            <Button 
              variant={step === 'summary' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => recordId && step !== 'summary' && setStep('summary')}
              disabled={!recordId}
              className={step === 'summary' ? 'shadow-sm' : ''}
            >
              4. Summary
            </Button>
          </div>
        </div>
      </div>
      
      {renderStep()}
    </div>
  )
}
