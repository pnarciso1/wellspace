'use client'

import { useState, useEffect } from 'react'
import { format, subMonths, isAfter, isBefore, isWithinInterval } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { VisitTimelineEvent, SymptomType } from '@/types/doctor-visit'

interface TimelineProps {
  events: VisitTimelineEvent[]
  onRangeChange?: (start: Date, end: Date) => void
}

export function VisitTimeline({ events, onRangeChange }: TimelineProps) {
  const [timeRange, setTimeRange] = useState(3) // months
  const [startDate, setStartDate] = useState(() => subMonths(new Date(), 3))
  const [filteredEvents, setFilteredEvents] = useState<VisitTimelineEvent[]>([])

  useEffect(() => {
    const end = new Date()
    const start = subMonths(end, timeRange)
    
    const filtered = events.filter(event => {
      const eventDate = new Date(event.created_at)
      return isWithinInterval(eventDate, { start, end })
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setFilteredEvents(filtered)
    setStartDate(start)
    onRangeChange?.(start, end)
  }, [timeRange, events, onRangeChange])

  const handleRangeChange = (newRange: number) => {
    setTimeRange(newRange)
  }

  const getEventColor = (type: SymptomType | undefined) => {
    switch (type) {
      case 'speech': return 'bg-blue-500'
      case 'swallowing': return 'bg-green-500'
      case 'breathing': return 'bg-red-500'
      case 'vision': return 'bg-purple-500'
      case 'eyelid': return 'bg-yellow-500'
      case 'expression': return 'bg-pink-500'
      case 'muscle_weakness': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getEventIcon = (type: SymptomType | undefined) => {
    // You can add custom icons for each symptom type here
    return '●'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Visit & Symptom Timeline</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRangeChange(1)}
              className={timeRange === 1 ? 'bg-primary text-primary-foreground' : ''}
            >
              1M
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRangeChange(3)}
              className={timeRange === 3 ? 'bg-primary text-primary-foreground' : ''}
            >
              3M
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRangeChange(6)}
              className={timeRange === 6 ? 'bg-primary text-primary-foreground' : ''}
            >
              6M
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
          
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="relative pl-20 pb-8 last:pb-0"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className={`absolute left-8 w-2 h-2 rounded-full -translate-x-[4px] mt-2.5 ${getEventColor(event.symptom_type)}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{event.symptom_type || 'Visit Record'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(event.created_at), 'MMM d, yyyy')}
                </span>
                <span className="font-medium">{event.symptom_type}</span>
                <p className="text-sm text-muted-foreground">
                  {`Intensity: ${event.intensity}, Frequency: ${event.frequency}`}
                </p>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No events in this time period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
