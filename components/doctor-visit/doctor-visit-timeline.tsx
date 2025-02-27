'use client'

import { format, subMonths, isWithinInterval } from 'date-fns'
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VisitTimelineEvent, SymptomType } from '@/types/doctor-visit'

type TimeGroup = {
  label: string
  startDate: Date
  endDate: Date
  symptoms: VisitTimelineEvent[]
}

interface DoctorVisitTimelineProps {
  visits: SymptomData[]
  selectedCategory: CategoryType
}

export function DoctorVisitTimeline({ visits }: DoctorVisitTimelineProps) {
  const today = new Date()

  // Create time groups
  const timeGroups: TimeGroup[] = [
    {
      label: "Last Month",
      startDate: subMonths(today, 1),
      endDate: today,
      symptoms: visits.filter(visit => 
        isWithinInterval(new Date(visit.created_at), {
          start: subMonths(today, 1),
          end: today
        })
      )
    },
    {
      label: "Last 3 Months",
      startDate: subMonths(today, 3),
      endDate: subMonths(today, 1),
      symptoms: visits.filter(visit => 
        isWithinInterval(new Date(visit.created_at), {
          start: subMonths(today, 3),
          end: subMonths(today, 1)
        })
      )
    },
    {
      label: "Last 6 Months",
      startDate: subMonths(today, 6),
      endDate: subMonths(today, 3),
      symptoms: visits.filter(visit => 
        isWithinInterval(new Date(visit.created_at), {
          start: subMonths(today, 6),
          end: subMonths(today, 3)
        })
      )
    }
  ]

  return (
    <div className="relative min-h-[600px] pl-4">
      {/* Central timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

      {timeGroups.map((group) => (
        <div key={group.label} className="mb-8">
          <h3 className="font-medium mb-4">{group.label}</h3>
          {group.symptoms.map((symptom) => (
            <Card key={symptom.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{symptom.symptom_type}</h4>
                    <p className="text-sm text-gray-600">
                      Intensity: {symptom.intensity}/5
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(symptom.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
} 