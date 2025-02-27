'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer } from 'lucide-react'
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
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Symptoms
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Summary
        </Button>
      </div>

      <Card className="print:shadow-none">
        <CardHeader>
          <CardTitle>Visit Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{record.first_name} {record.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{record.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>{record.address}</p>
                  <p>{record.state} {record.zip_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Birth Year</p>
                  <p>{record.birth_year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Years with MG</p>
                  <p>{record.years_with_mg}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">Symptoms</h3>
              {symptoms.length > 0 ? (
                <div className="space-y-4">
                  {symptoms.map((symptom) => (
                    <div key={symptom.id} className="border p-4 rounded-lg">
                      <h4 className="font-medium">
                        {SYMPTOM_DEFINITIONS[symptom.symptom_type].medical_term}
                      </h4>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Frequency</p>
                          <p className="capitalize">{symptom.frequency.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Intensity</p>
                          <p>Level {symptom.intensity}</p>
                        </div>
                        {symptom.treatments && symptom.treatments.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Treatments</p>
                            <p>{symptom.treatments.map(t => 
                              TREATMENT_OPTIONS.find(opt => opt.value === t)?.label
                            ).join(', ')}</p>
                          </div>
                        )}
                        {symptom.notes && (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Notes</p>
                            <p>{symptom.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No symptoms recorded</p>
              )}
            </section>

            {qualityOfLife && (
              <section>
                <h3 className="text-lg font-semibold mb-4">Quality of Life Assessment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Work Impact</p>
                    <p>Level {qualityOfLife.work_impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Household Impact</p>
                    <p>Level {qualityOfLife.household_impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Social Impact</p>
                    <p>Level {qualityOfLife.social_impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Exercise Impact</p>
                    <p>Level {qualityOfLife.exercise_impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Energy Level</p>
                    <p>Level {qualityOfLife.energy_level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sleep Quality</p>
                    <p>Level {qualityOfLife.sleep_quality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Physical Comfort</p>
                    <p>Level {qualityOfLife.physical_comfort}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mood State</p>
                    <p>Level {qualityOfLife.mood_state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Anxiety Level</p>
                    <p>Level {qualityOfLife.anxiety_level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stress Management</p>
                    <p>Level {qualityOfLife.stress_management}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Medication Effectiveness</p>
                    <p>Level {qualityOfLife.medication_effectiveness}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Side Effects Impact</p>
                    <p>Level {qualityOfLife.side_effects_impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Treatment Satisfaction</p>
                    <p>Level {qualityOfLife.treatment_satisfaction}</p>
                  </div>
                  {qualityOfLife.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Additional Notes</p>
                      <p>{qualityOfLife.notes}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
