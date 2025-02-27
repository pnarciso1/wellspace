'use client'

import * as React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { SYMPTOM_DEFINITIONS } from '../types'
import type { SymptomData, CategoryType } from '../types'

interface DoctorVisitTimelineProps {
  visits: SymptomData[]
  selectedCategory: CategoryType
}

export function DoctorVisitTimeline({ visits, selectedCategory }: DoctorVisitTimelineProps) {
  const filteredVisits = selectedCategory === 'all' 
    ? visits 
    : visits.filter(visit => visit.symptom_type === selectedCategory)

  if (!filteredVisits.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No symptoms recorded for this category.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredVisits.map((visit) => (
        <Card key={visit.id}>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold">
                  {SYMPTOM_DEFINITIONS[visit.symptom_type].medical_term}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {SYMPTOM_DEFINITIONS[visit.symptom_type].description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Frequency</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {visit.frequency.replace(/_/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Intensity</p>
                  <p className="text-sm text-muted-foreground">
                    Level {visit.intensity}
                  </p>
                </div>
                {visit.treatments.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Treatments</p>
                    <p className="text-sm text-muted-foreground">
                      {visit.treatments.join(', ')}
                    </p>
                  </div>
                )}
                {visit.notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">{visit.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
