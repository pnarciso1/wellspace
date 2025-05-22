'use client'

import * as React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/lib/icons"
import { toast } from 'sonner'
import { DoctorVisitForm } from './components/doctor-visit-form'
import { DoctorVisitTimeline } from './components/doctor-visit-timeline'
import { QualityOfLifeForm } from './components/quality-of-life-form'
import { SymptomCategoryFilter } from './components/symptom-category-filter'
import { VisitInfoForm } from './components/visit-info-form'
import { cn } from '@/lib/utils'
import type {
  GPACTDoctorVisitRecord,
  GPACTDoctorVisitSymptom,
  GPACTDoctorVisitQualityOfLife,
  GPACTSymptomType
} from '@/types/gpact-doctor-visit'
import { useReactToPrint } from 'react-to-print'

type Step = 'info' | 'symptoms' | 'quality' | 'summary'

// Replace Stepper with persistent tab navigation
const stepTabs = [
  { key: 'info', label: 'Visit Info' },
  { key: 'symptoms', label: 'Symptoms' },
  { key: 'quality', label: 'Quality of Life' },
  { key: 'summary', label: 'Summary' },
]

function StepTabs({ step, setStep }: { step: Step, setStep: (s: Step) => void }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8 border-b pb-2">
      {stepTabs.map((tab) => (
        <button
          key={tab.key}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${step === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
          onClick={() => setStep(tab.key as Step)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// Add VisitSummary component
function VisitSummary({ symptoms, qualityOfLife, visit }: { symptoms: GPACTDoctorVisitSymptom[], qualityOfLife: GPACTDoctorVisitQualityOfLife | null, visit: GPACTDoctorVisitRecord | null }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Visit Summary{visit && visit.visit_date ? ` for ${new Date(visit.visit_date).toLocaleDateString()}` : ''}</CardTitle>
          {visit && (
            <div className="text-muted-foreground text-sm mt-1">
              {visit.doctor_name && <>Doctor: {visit.doctor_name} <br /></>}
              {visit.visit_reason && <>Reason: {visit.visit_reason} <br /></>}
              {visit.diagnosis && <>Diagnosis: {visit.diagnosis} <br /></>}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Symptoms</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-muted">
                  <th className="px-2 py-1 border">Symptom</th>
                  <th className="px-2 py-1 border">Frequency</th>
                  <th className="px-2 py-1 border">Intensity</th>
                  <th className="px-2 py-1 border">When</th>
                  <th className="px-2 py-1 border">Notes</th>
                </tr>
              </thead>
              <tbody>
                {symptoms.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-2">No symptoms reported for this visit.</td></tr>
                ) : symptoms.map(symptom => (
                  <tr key={symptom.id}>
                    <td className="border px-2 py-1">{symptom.symptom_type}</td>
                    <td className="border px-2 py-1">{symptom.frequency}</td>
                    <td className="border px-2 py-1">{symptom.intensity}</td>
                    <td className="border px-2 py-1">
                      {symptom.symptom_start_date ? new Date(symptom.symptom_start_date).toLocaleDateString() : ''}
                      {symptom.time_patterns && typeof symptom.time_patterns === 'object' && (
                        <div className="text-xs text-muted-foreground">
                          {Object.entries(symptom.time_patterns).filter(([k, v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="border px-2 py-1">{symptom.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="font-semibold mt-6 mb-2">Quality of Life</h3>
          {qualityOfLife ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(qualityOfLife).filter(([k]) => k !== 'id' && k !== 'record_id' && k !== 'created_at' && k !== 'updated_at' && k !== 'notes').map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-1">
                  <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
              {qualityOfLife.notes && (
                <div className="col-span-2 mt-2">
                  <span className="font-medium">Notes:</span> {qualityOfLife.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground">No Quality of Life assessment for this visit.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function DoctorVisitClient() {
  const [step, setStep] = useState<Step>('info')
  const [recordId, setRecordId] = useState<string | null>(null)
  const [record, setRecord] = useState<GPACTDoctorVisitRecord | null>(null)
  const [visitSymptoms, setVisitSymptoms] = useState<GPACTDoctorVisitSymptom[]>([])
  const [qualityOfLife, setQualityOfLife] = useState<GPACTDoctorVisitQualityOfLife | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allSymptoms, setAllSymptoms] = useState<GPACTDoctorVisitSymptom[]>([])
  const [allVisits, setAllVisits] = useState<GPACTDoctorVisitRecord[]>([])

  const supabase = createClientComponentClient()

  const summaryRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: summaryRef,
    documentTitle: 'Doctor Visit Report',
  })

  useEffect(() => {
    loadRecentRecord()
    loadAllSymptoms()
    loadAllVisits()
  }, [])

  const loadRecentRecord = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      if (!user) {
        console.error('No user found')
        return
      }

      // Get the most recent record for this user
      const { data: recentRecord, error: recordError } = await supabase
        .from('gpact_doctor_visit_records')
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

  const loadQualityOfLifeData = async (targetRecordId?: string) => {
    const rid = targetRecordId || recordId
    if (!rid) return
    
    try {
      const { data, error } = await supabase
        .from('gpact_doctor_visit_quality_of_life')
        .select('*')
        .eq('record_id', rid)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading quality of life data:', error)
        return
      }
      
      if (data) {
        setQualityOfLife(data)
      }
    } catch (error) {
      console.error('Error loading quality of life data:', error)
    }
  }

  const loadSymptomHistory = async (targetRecordId?: string) => {
    const rid = targetRecordId || recordId
    if (!rid) return
    
    try {
      const { data, error } = await supabase
        .from('gpact_doctor_visit_symptoms')
        .select('*')
        .eq('record_id', rid)
        .order('created_at', { ascending: true })
      
      if (error) {
        console.error('Error loading symptom history:', error)
        toast.error('Failed to load symptom history')
        return
      }
      
      if (data) {
        setVisitSymptoms(data)
      }
    } catch (error) {
      console.error('Error loading symptom history:', error)
      toast.error('Failed to load symptom history')
    }
  }

  const loadAllSymptoms = async () => {
    try {
      // No need to get user or filter by user_id; RLS will handle it
      const { data: symptoms, error: symptomsError } = await supabase
        .from('gpact_doctor_visit_symptoms')
        .select('*')
        .order('created_at', { ascending: false })

      if (symptomsError) throw symptomsError
      setAllSymptoms(symptoms || [])
      console.log('Fetched symptoms:', symptoms)
    } catch (error) {
      console.error('Error loading all symptoms:', error)
      setAllSymptoms([])
    }
  }

  const loadAllVisits = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) return
      const { data, error } = await supabase
        .from('gpact_doctor_visit_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) setAllVisits(data)
    } catch (error) {
      console.error('Error loading all visits:', error)
    }
  }, [supabase])

  const handleInfoSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      if (!user) {
        toast.error('You must be logged in to submit information')
        return
      }
      
      const recordData = {
        ...data,
        user_id: user.id
      }
      
      const { data: record, error } = await supabase
        .from('gpact_doctor_visit_records')
        .insert([recordData])
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSymptomSubmit = async (symptomData: any) => {
    try {
      if (!recordId) {
        toast.error('No active visit record found')
        return
      }

      const payload = { ...symptomData, record_id: recordId };
      console.log('Submitting symptomData:', payload);

      const { error } = await supabase
        .from('gpact_doctor_visit_symptoms')
        .insert([payload])

      if (error) {
        console.error('Supabase error:', error, payload);
        throw error;
      }

      await loadSymptomHistory()
      await loadAllSymptoms()
      toast.success('Symptom recorded successfully')
    } catch (error) {
      console.error('Error saving symptom:', error)
      toast.error('Failed to save symptom')
    }
  }

  const handleQualityOfLifeSubmit = async (data: any) => {
    try {
      if (!recordId) {
        toast.error('No active visit record found')
        return
      }

      const { error } = await supabase
        .from('gpact_doctor_visit_quality_of_life')
        .insert([{
          ...data,
          record_id: recordId
        }])

      if (error) throw error

      await loadQualityOfLifeData()
      setStep('summary')
      toast.success('Quality of life assessment saved')
    } catch (error) {
      console.error('Error saving quality of life assessment:', error)
      toast.error('Failed to save quality of life assessment')
    }
  }

  // Handler to select a visit
  const handleSelectVisit = async (visit: GPACTDoctorVisitRecord) => {
    setRecordId(visit.id)
    setRecord(visit)
    setStep('symptoms')
    await loadSymptomHistory(visit.id)
    await loadQualityOfLifeData(visit.id)
  }

  // Handler to start a new visit
  const handleNewVisit = () => {
    setRecordId(null)
    setRecord(null)
    setVisitSymptoms([])
    setQualityOfLife(null)
    setStep('info')
  }

  // RENDER LOGIC
  return (
    <div className="container mx-auto py-8">
      <StepTabs step={step} setStep={setStep} />
      {/* Visit Timeline/Selector */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Your Doctor Visits</h2>
        <div className="flex flex-wrap gap-2 items-center">
          {allVisits.map((visit) => (
            <Button
              key={visit.id}
              variant={recordId === visit.id ? 'default' : 'outline'}
              onClick={() => handleSelectVisit(visit)}
            >
              {visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : 'Visit'}
            </Button>
          ))}
          <Button variant="secondary" onClick={handleNewVisit}>+ New Visit</Button>
        </div>
      </div>
      {/* Workflow Steps */}
      {step === 'info' && (
        <VisitInfoForm onSubmit={handleInfoSubmit} loading={isSubmitting} />
      )}
      {step === 'symptoms' && record && (
        <div className="space-y-8">
          <DoctorVisitForm onSuccess={handleSymptomSubmit} onCancel={() => {}} />
          <DoctorVisitTimeline symptoms={visitSymptoms} visits={allVisits} selectedVisitId={recordId ?? undefined} />
        </div>
      )}
      {step === 'quality' && record && (
        <QualityOfLifeForm onSuccess={handleQualityOfLifeSubmit} onCancel={() => setStep('symptoms')} />
      )}
      {step === 'summary' && record && (
        <>
          <div className="flex justify-end mb-4 print:hidden">
            <button onClick={handlePrint} type="button" className="inline-flex items-center px-4 py-2 border rounded text-sm font-medium bg-white hover:bg-gray-50 border-gray-300">Print Report</button>
          </div>
          <div ref={summaryRef} className="print:bg-white print:text-black print:p-8">
            <VisitSummary symptoms={visitSymptoms} qualityOfLife={qualityOfLife} visit={record} />
          </div>
        </>
      )}
    </div>
  )
} 