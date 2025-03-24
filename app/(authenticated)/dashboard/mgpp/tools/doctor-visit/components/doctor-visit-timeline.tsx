'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/lib/icons"
import { SYMPTOM_DEFINITIONS } from '../types'
import { format, subDays, subWeeks, subMonths, isWithinInterval } from 'date-fns'
import { ResponsiveLine } from '@nivo/line'
import type { SymptomData, CategoryType } from '../types'
import { Heart } from 'lucide-react'

interface DoctorVisitTimelineProps {
  visits: SymptomData[]
  selectedCategory: CategoryType
}

type DateRange = '7days' | '30days' | '90days' | 'all'

/**
 * Chart component for displaying symptom trends using Nivo.
 * Provides better TypeScript support and smoother animations.
 */
const SymptomChart = ({ data }: { data: any[] }) => {
  // Transform data for Nivo format
  const chartData = [
    {
      id: 'Intensity',
      color: '#8884d8',
      data: data.map(d => ({
        x: d.date,
        y: d.intensity
      }))
    },
    {
      id: 'Frequency',
      color: '#82ca9d',
      data: data.map(d => ({
        x: d.date,
        y: d.frequency
      }))
    }
  ]

  return (
    <ResponsiveLine
      data={chartData}
      margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 0,
        max: 5,
        stacked: false,
      }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Date',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Level',
        legendOffset: -40,
        legendPosition: 'middle'
      }}
      pointSize={8}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'top',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: -20,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  )
}

export function DoctorVisitTimeline({ visits, selectedCategory }: DoctorVisitTimelineProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30days')
  const [showTrends, setShowTrends] = useState(false)

  // Filter visits by category and date range
  const filteredVisits = useMemo(() => {
    const now = new Date()
    let startDate: Date

    switch (dateRange) {
      case '7days':
        startDate = subDays(now, 7)
        break
      case '30days':
        startDate = subMonths(now, 1)
        break
      case '90days':
        startDate = subMonths(now, 3)
        break
      default:
        startDate = new Date(0) // Beginning of time
    }

    return visits
      .filter(visit => selectedCategory === 'all' || visit.symptom_type === selectedCategory)
      .filter(visit => isWithinInterval(new Date(visit.created_at), { start: startDate, end: now }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [visits, selectedCategory, dateRange])

  // Group visits by date
  const groupedVisits = useMemo(() => {
    const groups: { [key: string]: SymptomData[] } = {}
    
    filteredVisits.forEach(visit => {
      const date = format(new Date(visit.created_at), 'yyyy-MM-dd')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(visit)
    })

    return groups
  }, [filteredVisits])

  // Prepare trend data
  const trendData = useMemo(() => {
    if (selectedCategory === 'all') return []

    return filteredVisits
      .filter(visit => visit.symptom_type === selectedCategory)
      .map(visit => ({
        date: format(new Date(visit.created_at), 'MM/dd'),
        intensity: visit.intensity,
        frequency: visit.frequency
      }))
      .reverse()
  }, [filteredVisits, selectedCategory])

  if (!filteredVisits.length) {
    return (
      <div className="flex items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20">
        <div className="text-center">
          <Icons.AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
          <p className="font-medium text-muted-foreground">
            No symptoms recorded for this category and time period.
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={dateRange}
            onValueChange={(value: DateRange) => setDateRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          {selectedCategory !== 'all' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTrends(!showTrends)}
            >
              {showTrends ? 'Hide Trends' : 'Show Trends'}
            </Button>
          )}
        </div>
      </div>

      {showTrends && selectedCategory !== 'all' && trendData.length > 0 && (
        <Card className="p-4">
          <div className="h-[300px]">
            <SymptomChart data={trendData} />
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(groupedVisits).map(([date, dayVisits]) => (
          <div key={date} className="space-y-4">
            <h3 className="font-medium text-lg">
              {format(new Date(date), 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-4">
              {dayVisits.map((visit) => (
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

                      {visit.context && visit.context.length > 0 && (
                        <div className="mt-1">
                          <p className="text-sm font-medium flex items-center mb-1.5">
                            <Icons.CheckCircle className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            Context
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {visit.context.map((ctx, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {ctx}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {visit.time_patterns && visit.time_patterns.length > 0 && (
                        <div className="mt-1">
                          <p className="text-sm font-medium flex items-center mb-1.5">
                            <Icons.Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            Time Patterns
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {visit.time_patterns.map((pattern, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {pattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {visit.treatments.length > 0 && (
                        <div className="mt-1">
                          <p className="text-sm font-medium flex items-center mb-1.5">
                            <Icons.Activity className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            Treatments
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {visit.treatments.map((treatment, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {treatment.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
          </div>
        ))}
      </div>
    </div>
  )
}
