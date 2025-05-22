'use client'

import * as React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/lib/icons"
import type { GPACTDoctorVisitSymptom } from '@/types/gpact-doctor-visit'

interface DoctorVisitTimelineProps {
  symptoms: GPACTDoctorVisitSymptom[]
  visits: any[]
  selectedVisitId?: string
}

export function DoctorVisitTimeline({ symptoms, visits, selectedVisitId }: DoctorVisitTimelineProps) {
  if (!symptoms || symptoms.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Icons.Calendar className="mx-auto h-12 w-12 mb-4" />
            <p>No symptoms recorded yet.</p>
            <p className="text-sm">Add your first symptom to start your timeline.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {symptoms.map((symptom) => (
        <Card key={symptom.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">
                  {symptom.created_at ? new Date(symptom.created_at).toLocaleString() : 'No date'}
                </h3>
                <p className="text-sm text-primary font-medium mt-1">
                  {symptom.symptom_type}
                  {symptom.intensity && ` (Intensity: ${symptom.intensity})`}
                </p>
                {symptom.notes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Notes: {symptom.notes}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 