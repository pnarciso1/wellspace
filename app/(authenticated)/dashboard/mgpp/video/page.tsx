'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import YouTube from 'react-youtube'

interface YouTubeEvent {
  target: {
    pauseVideo: () => void
    playVideo: () => void
    getCurrentTime: () => number
    getDuration: () => number
  }
}

export default function VideoModule() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const playerRef = useRef<any>(null)
  const [videoCompleted, setVideoCompleted] = useState(false)

  const VIDEO_ID = 'T98yN0_63zg'  // MG program video

  const handleVideoComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Update enrollment status and unlock all modules
      const { error } = await supabase
        .from('mgpp_enrollments')
        .update({
          video_completed: true,
          video_watched_at: new Date().toISOString(),
          current_step: 3,
          glossary_unlocked: true,
          medication_log_unlocked: true,
          doctor_visit_unlocked: true,
          post_assessment_unlocked: true
        })
        .eq('user_id', user.id)

      if (error) throw error

      setVideoCompleted(true)
      toast({
        title: "Video Completed",
        description: "All modules are now unlocked. You can continue with the program.",
      })

      // Navigate back to dashboard
      router.refresh()
      router.push('/dashboard/mgpp')

    } catch (error) {
      console.error('Error updating video status:', error)
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive"
      })
    }
  }

  const onStateChange = (event: { data: number }) => {
    if (event.data === 0) { // Video ended
      handleVideoComplete()
    }
  }

  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      fs: 1,
    },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Program Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <YouTube
              videoId={VIDEO_ID}
              opts={opts}
              onStateChange={onStateChange}
              onReady={(event: YouTubeEvent) => {
                playerRef.current = event.target
                setLoading(false)
              }}
              className="w-full"
            />
          </div>
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">About This Video</h3>
            <p className="text-gray-500">
              This comprehensive overview introduces you to the Myasthenia Gravis Patient Program.
              Learn about the program structure, available resources, and how to make the most
              of your participation.
            </p>
            <p className="text-sm text-gray-400">
              Note: After completing this video, all program modules will be unlocked automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const dynamic = 'force-dynamic'
