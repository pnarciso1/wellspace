'use client'

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import type { ActiveTrack } from "@/app/(authenticated)/health-tracks/components/types"
import { MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface HealthTrackProps {
  track: ActiveTrack
  onShare?: () => void
}

export function HealthTrack({ track, onShare }: HealthTrackProps) {
  const handleShare = () => {
    if (onShare) {
      onShare()
    }
    toast({
      title: "Shared!",
      description: "Your progress has been shared with your care team."
    })
  }

  const calculateProgress = () => {
    const totalTasks = Object.keys(track.module.tasks).length
    const completedTasks = track.progress.completed_tasks.length
    return Math.round((completedTasks / totalTasks) * 100)
  }

  const getProgressColor = (progressPercent: number) => {
    if (progressPercent >= 80) return "bg-green-500"
    if (progressPercent >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const progressPercent = calculateProgress()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{track.module.title}</span>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Progress</p>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full ${getProgressColor(progressPercent)}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-right mt-1">{progressPercent}%</p>
          </div>

          <div>
            <p className="font-medium mb-1">Current Day</p>
            <p className="text-sm text-muted-foreground">Day {track.current_day} of {track.module.duration_days}</p>
          </div>

          <div>
            <p className="font-medium mb-1">Current Streak</p>
            <p className="text-sm text-muted-foreground">{track.progress.current_streak} days</p>
          </div>

          <div>
            <p className="font-medium mb-1">Description</p>
            <p className="text-sm text-muted-foreground">{track.module.description}</p>
          </div>

          {track.last_active && (
            <div>
              <p className="font-medium mb-1">Last Active</p>
              <p className="text-sm text-muted-foreground">
                {new Date(track.last_active).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
