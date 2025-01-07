'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"

type HealthTrackModule = {
  id: string
  title: string
  description: string
  duration_days: number
  category: string
  difficulty: string
  tasks: any
}

export default function TrackLibrary() {
  const [modules, setModules] = useState<HealthTrackModule[]>([])
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('health_track_modules')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setModules(data)
    } finally {
      setLoading(false)
    }
  }

  const startTrack = async (moduleId: string) => {
    if (!user) return

    setLoading(true)
    try {
      // Check if user already has this track active
      const { data: existingTrack } = await supabase
        .from('user_health_tracks')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('status', 'active')
        .single()

      if (existingTrack) {
        toast({
          title: "Track Already Active",
          description: "You already have this track in progress",
          variant: "destructive"
        })
        return
      }

      // Start new track
      const { error } = await supabase
        .from('user_health_tracks')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          current_day: 1,
          status: 'active',
          progress: {
            completed_tasks: [],
            current_streak: 0
          }
        })

      if (error) throw error

      toast({
        title: "Track Started",
        description: "Your new health journey has begun!",
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start track. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Available Health Tracks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{module.title}</CardTitle>
                <Badge>{module.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-500">{module.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{module.duration_days} days</span>
                  <span>{module.category}</span>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => startTrack(module.id)}
                >
                  Start Track
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 