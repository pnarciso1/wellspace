'use client'

import { format, subMonths, isAfter, isBefore, isWithinInterval } from 'date-fns'
import { useState } from 'react'
import type { Medication } from '@/types/medications'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimelineGroup } from "./timeline-group"

interface MedicationTimelineProps {
  medications: Medication[]
}

type TimeGroup = {
  label: string
  startDate: Date
  endDate: Date
  medications: Medication[]
}

export function MedicationTimeline({ medications }: MedicationTimelineProps) {
  const [expandedMedId, setExpandedMedId] = useState<string | null>(null)
  const today = new Date()

  // Create time groups
  const timeGroups: TimeGroup[] = [
    {
      label: "Currently Taking",
      startDate: today,
      endDate: today,
      medications: medications.filter(med => med.still_using)
    },
    {
      label: "Last 3 Months",
      startDate: subMonths(today, 3),
      endDate: today,
      medications: medications.filter(med => 
        !med.still_using && 
        isWithinInterval(new Date(med.stop_date || today), {
          start: subMonths(today, 3),
          end: today
        })
      )
    },
    {
      label: "Last 6 Months",
      startDate: subMonths(today, 6),
      endDate: subMonths(today, 3),
      medications: medications.filter(med => 
        !med.still_using &&
        isWithinInterval(new Date(med.stop_date || today), {
          start: subMonths(today, 6),
          end: subMonths(today, 3)
        })
      )
    },
    {
      label: "Previous Year",
      startDate: subMonths(today, 12),
      endDate: subMonths(today, 6),
      medications: medications.filter(med => 
        !med.still_using &&
        isWithinInterval(new Date(med.stop_date || today), {
          start: subMonths(today, 12),
          end: subMonths(today, 6)
        })
      )
    }
  ]

  return (
    <div className="relative min-h-[600px] pl-4">
      {/* Central timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

      {timeGroups.map((group) => (
        <TimelineGroup
          key={group.label}
          label={group.label}
          medications={group.medications}
          expandedMedId={expandedMedId}
          onMedicationClick={(medicationId: string) => 
            setExpandedMedId(expandedMedId === medicationId ? null : medicationId)
          }
        />
      ))}
    </div>
  )
}
