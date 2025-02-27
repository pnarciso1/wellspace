'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatDistanceToNow } from 'date-fns'
import type { 
  SymptomData, 
  CategoryType, 
  SymptomType 
} from '../types'
import { SYMPTOM_DEFINITIONS, SYMPTOM_INTENSITY_SCALES } from '../types'

interface DoctorVisitTimelineProps {
  visits: SymptomData[]
  selectedCategory: CategoryType
}

export function DoctorVisitTimeline({ 
  visits, 
  selectedCategory
}: DoctorVisitTimelineProps) {
  const filteredVisits = React.useMemo(() => {
    if (selectedCategory === 'all') return visits
    return visits.filter(visit => visit.symptom_type === selectedCategory)
  }, [visits, selectedCategory])

  if (filteredVisits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No symptoms recorded for this category.
        </CardContent>
      </Card>
    )
  }

  const getIntensityLabel = (symptomType: SymptomType, intensityValue: string) => {
    const scale = SYMPTOM_INTENSITY_SCALES[symptomType]
    return scale.find(s => s.value === intensityValue)?.label || intensityValue
  }

  const renderSymptomDetails = (visit: SymptomData) => {
    const def = SYMPTOM_DEFINITIONS[visit.symptom_type]
    
    return (
      <>
        <div className="flex justify-between items-start">
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="text-lg font-semibold flex items-center gap-2 cursor-help">
                    {def.medical_term}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({def.description})
                    </span>
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{def.etymology}</p>
                  {def.example && (
                    <p className="text-sm mt-1">Example: {def.example}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-sm text-muted-foreground">
              Recorded {formatDistanceToNow(new Date(visit.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex gap-2">
            {visit.frequency && (
              <Badge variant="outline">
                {visit.frequency.replace('_', ' ')}
              </Badge>
            )}
            {visit.intensity && (
              <Badge variant="secondary">
                {getIntensityLabel(visit.symptom_type, visit.intensity)}
              </Badge>
            )}
          </div>
        </div>

        {visit.treatments && visit.treatments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Treatments:</h4>
            <div className="flex flex-wrap gap-2">
              {visit.treatments.map((treatment, idx) => (
                <Badge key={idx} variant="outline">
                  {treatment}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {visit.context && visit.context.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Context:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {visit.context.map((ctx, idx) => (
                <li key={idx}>{ctx}</li>
              ))}
            </ul>
          </div>
        )}

        {visit.rhythm && visit.rhythm.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Time of Day:</h4>
            <div className="flex flex-wrap gap-2">
              {visit.rhythm.map((time, idx) => (
                <Badge key={idx} variant="outline">
                  {time.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {visit.triggers?.has_triggers && visit.triggers.description && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Triggers:</h4>
            <p className="text-sm text-muted-foreground">
              {visit.triggers.description}
            </p>
          </div>
        )}

        {visit.notes && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Additional Notes:</h4>
            <p className="text-sm text-muted-foreground">
              {visit.notes}
            </p>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="space-y-4">
      {filteredVisits.map((visit) => (
        <Card key={visit.id}>
          <CardContent className="p-6">
            {renderSymptomDetails(visit)}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
