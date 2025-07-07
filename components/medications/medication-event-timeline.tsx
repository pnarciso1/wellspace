"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
// import type { Database } from "wellspace/types/supabase"

// Fallback to any if type is not available
// type MedicationHistoryEvent = Database["public"]["Tables"]["medication_history"]["Row"]
type MedicationHistoryEvent = any

interface MedicationEventTimelineProps {
  userId?: string
}

export function MedicationEventTimeline({ userId }: MedicationEventTimelineProps) {
  const [events, setEvents] = useState<MedicationHistoryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      let uid = userId
      if (!uid) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return setLoading(false)
        uid = user.id
      }
      const { data, error } = await supabase
        .from("medication_history")
        .select("*")
        .eq("user_id", uid)
        .order("event_date", { ascending: true })
      if (error) {
        setEvents([])
      } else {
        setEvents(data || [])
      }
      setLoading(false)
    }
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (loading) {
    return <div className="flex items-center justify-center py-8"><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></span> Loading event timeline...</div>
  }

  if (!events.length) {
    return <div className="text-center text-muted-foreground py-8">No medication events found.</div>
  }

  return (
    <div className="space-y-6">
      {events.map(event => (
        <Card key={event.id} className="border-l-4 border-primary shadow-sm">
          <CardContent className="py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold 
                  ${event.event_type === 'start' ? 'bg-green-100 text-green-800' :
                    event.event_type === 'stop' ? 'bg-red-100 text-red-800' :
                    event.event_type === 'change' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'}`}>{event.event_type.toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-lg">{event.drug_name || 'Medication'}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.event_date), 'MMM d, yyyy')}
                </div>
                <div className="mt-1 text-sm">
                  {event.dosage && <span>Dosage: {event.dosage}. </span>}
                  {event.frequency && <span>Frequency: {event.frequency}. </span>}
                  {event.reason && <span>Reason: {event.reason} </span>}
                  {event.notes && <span>Notes: {event.notes}</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 