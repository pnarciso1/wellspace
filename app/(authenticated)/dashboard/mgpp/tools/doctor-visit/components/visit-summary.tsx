'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import { 
  SYMPTOM_DEFINITIONS,
  TREATMENT_OPTIONS
} from '../types'
import type { 
  DoctorVisitRecord, 
  SymptomData,
  QualityOfLife
} from '../types'

interface VisitSummaryProps {
  record: DoctorVisitRecord
  symptoms: SymptomData[]
  qualityOfLife: QualityOfLife | null
  onBack: () => void
}

export function VisitSummary({ record, symptoms, qualityOfLife, onBack }: VisitSummaryProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          {/* @ts-ignore - Icon component has correct types but TypeScript is having issues */}
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Symptoms
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          Print Summary
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">
                  {record.first_name} {record.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{record.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  {record.address}
                  {record.state && `, ${record.state}`}
                  {record.zip_code && ` ${record.zip_code}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Birth Year</p>
                <p className="text-sm text-muted-foreground">{record.birth_year}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Years with MG</p>
                <p className="text-sm text-muted-foreground">{record.years_with_mg}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Symptoms</h3>
            <div className="space-y-4">
              {symptoms.map((symptom) => (
                <Card key={symptom.id}>
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      <div>
                        <h4 className="font-semibold">
                          {SYMPTOM_DEFINITIONS[symptom.symptom_type].medical_term}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {SYMPTOM_DEFINITIONS[symptom.symptom_type].description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Frequency</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {symptom.frequency.replace(/_/g, ' ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Intensity</p>
                          <p className="text-sm text-muted-foreground">
                            Level {symptom.intensity}
                          </p>
                        </div>
                        {symptom.treatments.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-sm font-medium">Treatments</p>
                            <p className="text-sm text-muted-foreground">
                              {symptom.treatments
                                .map(t => TREATMENT_OPTIONS.find(opt => opt.value === t)?.label)
                                .join(', ')}
                            </p>
                          </div>
                        )}
                        {symptom.notes && (
                          <div className="col-span-2">
                            <p className="text-sm font-medium">Notes</p>
                            <p className="text-sm text-muted-foreground">{symptom.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {qualityOfLife && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Quality of Life Assessment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Work Impact</p>
                  <p className="text-sm text-muted-foreground">Level {qualityOfLife.work_impact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Household Impact</p>
                  <p className="text-sm text-muted-foreground">Level {qualityOfLife.household_impact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Social Impact</p>
                  <p className="text-sm text-muted-foreground">Level {qualityOfLife.social_impact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Exercise Impact</p>
                  <p className="text-sm text-muted-foreground">Level {qualityOfLife.exercise_impact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Energy Level</p>
                  <p className="text-sm text-muted-foreground">Level {qualityOfLife.energy_level}</p>
                </div>
                {qualityOfLife.notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Additional Notes</p>
                    <p className="text-sm text-muted-foreground">{qualityOfLife.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
