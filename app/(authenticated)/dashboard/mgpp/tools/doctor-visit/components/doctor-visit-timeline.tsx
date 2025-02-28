'use client'

import * as React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/lib/icons"
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
      <div className="flex items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20">
        <div className="text-center">
          <Icons.AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
          <p className="font-medium text-muted-foreground">
            No symptoms recorded for this category.
          </p>
        </div>
      </div>
    )
  }

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 1: return "bg-green-100 text-green-800 border-green-200"
      case 2: return "bg-blue-100 text-blue-800 border-blue-200"
      case 3: return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 4: return "bg-orange-100 text-orange-800 border-orange-200"
      case 5: return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'sometimes': return <Icons.Calendar className="h-4 w-4 mr-1.5" />
      case 'daily_not_constant': return <Icons.Activity className="h-4 w-4 mr-1.5" />
      case 'constant': return <Icons.AlertCircle className="h-4 w-4 mr-1.5" />
      default: return <Icons.Calendar className="h-4 w-4 mr-1.5" />
    }
  }

  return (
    <div className="space-y-4">
      {filteredVisits.map((visit) => (
        <Card key={visit.id} className="overflow-hidden border-muted/60 hover:border-muted transition-colors">
          <div className="border-l-4 pl-4 py-2 bg-muted/20" style={{ 
            borderLeftColor: visit.intensity === 5 ? '#ef4444' : 
                            visit.intensity === 4 ? '#f97316' : 
                            visit.intensity === 3 ? '#eab308' : 
                            visit.intensity === 2 ? '#3b82f6' : '#22c55e' 
          }}>
            <h3 className="font-semibold text-base px-4">
              {SYMPTOM_DEFINITIONS[visit.symptom_type].medical_term}
            </h3>
          </div>
          <CardContent className="p-5">
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                {SYMPTOM_DEFINITIONS[visit.symptom_type].description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="outline" className={`flex items-center ${getIntensityColor(visit.intensity)}`}>
                  <Icons.Activity className="h-3.5 w-3.5 mr-1" />
                  Intensity: Level {visit.intensity}
                </Badge>
                
                <Badge variant="outline" className="flex items-center">
                  {getFrequencyIcon(visit.frequency)}
                  {visit.frequency.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
              
              {visit.treatments.length > 0 && (
                <div className="mt-1">
                  <p className="text-sm font-medium flex items-center mb-1.5">
                    <Icons.Heart className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Treatments
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {visit.treatments.map((treatment, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {treatment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {visit.notes && (
                <div className="mt-1 bg-muted/10 p-3 rounded-md border border-dashed">
                  <p className="text-sm font-medium flex items-center mb-1">
                    <Icons.FileText className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Notes
                  </p>
                  <p className="text-sm text-muted-foreground">{visit.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
