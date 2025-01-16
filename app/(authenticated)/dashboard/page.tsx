"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Calendar, FileText, Heart, MessageSquare, Users, Trophy, CheckCircle, Video } from 'lucide-react'
import Link from 'next/link'
import type { Database } from '@/types/supabase'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

type HealthGoal = Database['public']['Tables']['health_goals']['Row']
type ActiveTrack = {
  id: string
  current_day: number
  progress: {
    completed_tasks: string[]
    current_streak: number
  }
  module: {
    title: string
    duration_days: number
    tasks: any
  }
}

type RecentActivity = {
  type: 'goal_update' | 'task_completion'
  timestamp: string
  details: {
    title?: string
    value?: number
    unit?: string
    track_name?: string
    task_name?: string
  }
}

export default function Dashboard() {
  const { user, getHealthProfile } = useAuth()
  const [profileProgress, setProfileProgress] = useState(0)
  const [goals, setGoals] = useState<HealthGoal[]>([])
  const [activeTracks, setActiveTracks] = useState<ActiveTrack[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    loadProfileProgress()
    loadGoals()
    loadActiveTracks()
    loadRecentActivities()
  }, [])

  const loadProfileProgress = async () => {
    try {
      const profile = await getHealthProfile()
      if (profile) {
        const progress = calculateProgress(profile)
        setProfileProgress(progress)
      }
    } catch (error) {
      console.error('Error loading profile progress:', error)
    }
  }

  const loadGoals = async () => {
    if (!user) return
    const { data } = await supabase
      .from('health_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3) // Show only recent goals

    if (data) setGoals(data)
  }

  const loadActiveTracks = async () => {
    if (!user) return
    const { data } = await supabase
      .from('user_health_tracks')
      .select(`
        *,
        module:health_track_modules (
          title,
          duration_days,
          tasks
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(3)

    if (data) setActiveTracks(data)
  }

  const loadRecentActivities = async () => {
    if (!user) return
    
    // Get recent goal updates
    const { data: goalUpdates } = await supabase
      .from('health_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5)

    // Get recent task completions
    const { data: trackActivities } = await supabase
      .from('user_health_tracks')
      .select(`
        *,
        module:health_track_modules (title)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5)

    const activities: RecentActivity[] = [
      ...goalUpdates?.map((goal): RecentActivity => ({
        type: 'goal_update' as const,
        timestamp: goal.updated_at,
        details: {
          title: goal.title,
          value: goal.current_value,
          unit: goal.unit
        }
      })) || [],
      ...trackActivities?.map((track): RecentActivity => ({
        type: 'task_completion' as const,
        timestamp: track.updated_at,
        details: {
          track_name: track.module.title,
          task_name: `Day ${track.current_day} tasks`
        }
      })) || []
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

    setRecentActivities(activities)
  }

  const calculateProgress = (profile: any) => {
    const mainFields = [
      'name',
      'date_of_birth',
      'blood_type',
      'gender',
      'height_feet',
      'weight_lbs',
      'allergies',
      'medications',
      'chronic_conditions',
      'past_surgeries',
      'family_history',
      'primary_physician',
      'emergency_contact',
      'exercise_frequency',
      'sleep_hours',
      'dietary_restrictions',
      'stress_level',
      'additional_notes'
    ]

    const completedFields = mainFields.filter(field => {
      const value = profile[field]
      
      if (field === 'primary_physician' || field === 'emergency_contact') {
        const nestedObj = value as Record<string, string> | null
        return nestedObj && Object.values(nestedObj).some(v => v)
      }
      
      if (Array.isArray(value)) {
        return value.length > 0
      }
      
      return value !== null && value !== undefined && value !== ''
    }).length

    const percentage = (completedFields / mainFields.length) * 100
    return Math.min(100, Math.max(0, percentage))
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-500">Here's an overview of your health journey</p>
      </div>

      {/* Profile Completion Card - Updated */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>Complete your health profile to get personalized care</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={profileProgress} className="mb-2" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{Math.round(profileProgress)}% Complete</span>
            <Link href="/health-profile">
              <Button variant="link" className="p-0">Complete Profile →</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card 
          className="bg-white/10 backdrop-blur-md border-white/20 hover:border-indigo-500/50 transition-all cursor-pointer"
          onClick={() => router.push('/medical-records')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold">Medical Records</h3>
              <p className="text-sm text-gray-400">View your health data</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-white/10 backdrop-blur-md border-white/20 hover:border-indigo-500/50 transition-all cursor-pointer"
          onClick={() => router.push('/videos')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <Video className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold">Video Library</h3>
              <p className="text-sm text-gray-400">Watch health & wellness videos</p>
            </div>
          </CardContent>
        </Card>

        <Link href="/ai-chat">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <MessageSquare className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="font-semibold">AI Health Assistant</h3>
                <p className="text-sm text-gray-500">Get instant health insights</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/community">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <h3 className="font-semibold">Community</h3>
                <p className="text-sm text-gray-500">Connect with others</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Health Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-orange-500 mr-2" />
                Health Tracking
              </div>
              <Button variant="link" asChild className="text-sm">
                <Link href="/health-tracks">Track Progress →</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {activity.type === 'goal_update' ? (
                        <Badge variant="secondary">Goal Update</Badge>
                      ) : (
                        <Badge variant="secondary">Task Complete</Badge>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.type === 'goal_update' 
                            ? `${activity.details.title}: ${activity.details.value} ${activity.details.unit}`
                            : `${activity.details.track_name}: ${activity.details.task_name}`
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(activity.timestamp))} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
              <Button variant="outline" className="w-full">
                Schedule Check-up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Active Goals</span>
            <Button variant="link" asChild className="text-sm">
              <Link href="/health-tracks">Update Goals →</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{goal.title}</span>
                  <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                </div>
                <Progress value={calculateProgress(goal)} />
              </div>
            ))}
            {goals.length === 0 && (
              <p className="text-sm text-gray-500">No active goals. Set some goals to track your progress!</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-orange-500 mr-2" />
              Active Challenges
            </div>
            <Button variant="link" asChild className="text-sm">
              <Link href="/health-tracks">View Challenges →</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTracks.map(track => (
              <div key={track.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{track.module.title}</span>
                  <Badge variant="outline">Day {track.current_day}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4" />
                  <span>{track.progress.completed_tasks.length} tasks completed today</span>
                </div>
                <Progress value={(track.current_day / track.module.duration_days) * 100} />
              </div>
            ))}
            {activeTracks.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No active challenges</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/health-tracks">Start a Challenge →</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




