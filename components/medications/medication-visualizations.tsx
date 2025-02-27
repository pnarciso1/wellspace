'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek 
} from 'date-fns'
import type { Medication } from '@/types/medications'
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/lib/icons"

interface MedicationVisualizationsProps {
  medications: Medication[]
}

export function MedicationVisualizations({ medications }: MedicationVisualizationsProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  // Calculate timeline data
  const timelineData = medications.map(med => ({
    name: med.drug_name,
    start: new Date(med.start_date),
    end: med.stop_date ? new Date(med.stop_date) : new Date(),
    isActive: med.still_using
  }))

  // Generate calendar data
  const generateCalendarDays = (date: Date) => {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }

  // Check if a date has active medications
  const getMedicationsForDate = (date: Date) => {
    return medications.filter(med => {
      const startDate = new Date(med.start_date)
      const endDate = med.stop_date ? new Date(med.stop_date) : new Date()
      return date >= startDate && date <= endDate
    })
  }

  const calendarDays = generateCalendarDays(selectedMonth)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Tabs defaultValue="timeline" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="timeline">Medication Timeline</TabsTrigger>
        <TabsTrigger value="calendar">Adherence Calendar</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline">
        <Card>
          <CardHeader>
            <CardTitle>Medication Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[400px]">
              {timelineData.map((med, index) => (
                <div
                  key={med.name}
                  className="relative h-12 mb-4"
                >
                  <div className="absolute left-24 w-full flex items-center">
                    <span className="text-sm font-medium w-24">{med.name}</span>
                    <div 
                      className={`h-4 rounded-full ${med.isActive ? 'bg-primary' : 'bg-gray-200'}`}
                      style={{
                        width: `${calculateWidth(med.start, med.end)}%`,
                        marginLeft: `${calculateOffset(med.start)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="absolute bottom-0 left-24 right-0 h-8 border-t">
                {Array.from({ length: 13 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-xs text-gray-500"
                    style={{ left: `${(i / 12) * 100}%` }}
                  >
                    {format(addMonths(subMonths(new Date(), 12), i), 'MMM')}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="calendar">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <div className="flex items-center gap-2">
                <Icons.Calendar className="h-5 w-5" />
                Medication Adherence
              </div>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Icons.ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-medium">
                {format(selectedMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Icons.ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                const medsForDay = getMedicationsForDate(day)
                const isCurrentMonth = isSameMonth(day, selectedMonth)
                const isToday = isSameDay(day, new Date())
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      min-h-[80px] p-2 border rounded-lg
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                      ${isToday ? 'border-primary' : 'border-gray-100'}
                    `}
                  >
                    <div className="text-right text-sm mb-1">
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {medsForDay.map(med => (
                        <Badge
                          key={med.id}
                          variant="secondary"
                          className="text-xs w-full truncate"
                        >
                          {med.drug_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Helper functions remain the same
function calculateWidth(start: Date, end: Date): number {
  const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  return Math.min(totalDays / 365 * 100, 100)
}

function calculateOffset(start: Date): number {
  const today = new Date()
  const yearAgo = subMonths(today, 12)
  const daysOffset = (start.getTime() - yearAgo.getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(daysOffset / 365 * 100, 0)
}
