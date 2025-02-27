'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Icons } from '@/lib/icons'
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { formatDistanceToNow } from 'date-fns'
import { ShareProgress } from "./ShareProgress"

type ActiveTrack = {
  id: string
  module_id: string
  start_date: string
  current_day: number
  status: string
  progress: {
    completed_tasks: string[]
    current_streak: number
  }
  module: {
    title: string
    description: string
    duration_days: number
    tasks: {
      [key: string]: {
        task1?: {
          title: string
          description: string
        }
        task2?: {
          title: string
          description: string
        }
        milestone?: {
          title: string
          message: string
        }
      }
    }
  }
  last_position?: number
  last_active?: string
}

export default function ActiveTracks() {
  const { user } = useAuth()
  const [activeTracks, setActiveTracks] = useState<ActiveTrack[]>([])
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [showNextDayPreview, setShowNextDayPreview] = useState(false)
  const [previewData, setPreviewData] = useState<{track: ActiveTrack, nextDay: number} | null>(null)

  useEffect(() => {
    loadActiveTracks()
  }, [])

  const loadActiveTracks = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('user_health_tracks')
      .select(`
        *,
        module:health_track_modules (
          title,
          description,
          duration_days,
          tasks
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (data) setActiveTracks(data)
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load active tracks",
        variant: "destructive"
      })
    }
  }

  const calculateProgress = (track: ActiveTrack) => {
    return (track.current_day / track.module.duration_days) * 100
  }

  const NextDayPreview = ({ track, nextDay }: { track: ActiveTrack, nextDay: number }) => {
    const nextDayTasks = track.module.tasks[nextDay] || {}
    
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Day {nextDay} Tasks Preview</DialogTitle>
          <DialogDescription>Here are your tasks for tomorrow</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {Object.entries(nextDayTasks)
            .filter(([key]) => key !== 'milestone')
            .map(([taskId, taskData]) => {
              const task = taskData as { title: string; description: string }
              return (
                <div key={taskId} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              )
            })}
          {nextDayTasks.milestone && (
            <Alert className="bg-blue-50 border-blue-200">
              <Icons.Trophy className="h-5 w-5 text-blue-500" />
              <AlertTitle>{nextDayTasks.milestone.title}</AlertTitle>
              <AlertDescription>{nextDayTasks.milestone.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    )
  }

  const updateTrackProgress = async (trackId: string, currentDay: number) => {
    const { error } = await supabase
      .from('user_health_tracks')
      .update({ 
        last_position: currentDay,
        last_active: new Date().toISOString()
      })
      .eq('id', trackId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      })
    }
  }

  const completeTask = async (trackId: string, taskId: string) => {
    try {
      const track = activeTracks.find(t => t.id === trackId)
      if (!track) {
        throw new Error('Track not found')
      }

      // Create new completed tasks array
      const newCompletedTasks = track.progress.completed_tasks.includes(taskId)
        ? track.progress.completed_tasks
        : [...track.progress.completed_tasks, taskId]

      // Count tasks for the day
      const currentDayTasks = Object.entries(track.module.tasks[track.current_day] || {})
        .filter(([key]) => key !== 'milestone')
        .length

      const updateData = newCompletedTasks.length >= currentDayTasks
        ? {
            current_day: track.current_day + 1,
            progress: {
              completed_tasks: [],
              current_streak: track.progress.current_streak + 1
            }
          }
        : {
            progress: {
              completed_tasks: newCompletedTasks,
              current_streak: track.progress.current_streak
            }
          }

      const { data, error } = await supabase
        .from('user_health_tracks')
        .update(updateData)
        .eq('id', trackId)
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', {
          error,
          trackId,
          updateData
        })
        throw new Error(`Database update failed: ${error.message}`)
      }

      if (newCompletedTasks.length >= currentDayTasks) {
        toast({
          title: "Day Complete!",
          description: "Great job! Ready for your next day's tasks."
        })
        setPreviewData({ track, nextDay: track.current_day + 1 })
        setShowNextDayPreview(true)
      } else {
        toast({
          title: "Task Complete",
          description: `${currentDayTasks - newCompletedTasks.length} tasks remaining today`,
        })
      }

      await loadActiveTracks()
    } catch (err) {
      console.error('Error completing task:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to complete task. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Active Challenges</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {activeTracks.map((track) => (
          <Card key={track.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{track.module.title}</CardTitle>
                  <CardDescription>Day {track.current_day} of {track.module.duration_days}</CardDescription>
                </div>
                <ShareProgress track={track} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Progress value={calculateProgress(track)} className="mb-2" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{Math.round(calculateProgress(track))}% Complete</span>
                    <span>Streak: {track.progress.current_streak} days</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Today's Tasks</h3>
                  <div className="space-y-3">
                    {Object.entries(track.module.tasks[track.current_day] || {}).map(([taskId, taskData]) => {
                      if (taskId === 'milestone') return null;
                      
                      const task = taskData as { title: string; description: string };
                      return (
                        <Card key={taskId} className={`
                          transition-colors
                          ${track.progress.completed_tasks.includes(taskId) ? 'bg-green-50' : 'bg-gray-50'}
                        `}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-gray-500">{task.description}</p>
                              </div>
                              <Button
                                variant={track.progress.completed_tasks.includes(taskId) ? "ghost" : "outline"}
                                size="sm"
                                onClick={() => completeTask(track.id, taskId)}
                                className={track.progress.completed_tasks.includes(taskId) ? 'text-green-600' : ''}
                              >
                                {track.progress.completed_tasks.includes(taskId) ? (
                                  <>
                                    <Icons.CheckCircle className="h-5 w-5 mr-2" />
                                    Completed
                                  </>
                                ) : (
                                  'Mark Complete'
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {track.module.tasks[track.current_day]?.milestone && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Icons.Trophy className="h-5 w-5 text-blue-500" />
                    <AlertTitle>{track.module.tasks[track.current_day]?.milestone?.title}</AlertTitle>
                    <AlertDescription>
                      {track.module.tasks[track.current_day]?.milestone?.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {activeTracks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No active challenges. Start one from the Track Library!</p>
          </div>
        )}
      </div>

      {showNextDayPreview && previewData && (
        <Dialog open={showNextDayPreview} onOpenChange={setShowNextDayPreview}>
          <NextDayPreview track={previewData.track} nextDay={previewData.nextDay} />
        </Dialog>
      )}
    </div>
  )
} 