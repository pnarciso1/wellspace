"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Video } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { VideoPlayer } from "@/components/video/video-player"
import { useAuth } from "@/contexts/AuthContext"

export default function VideoPage() {
  const params = useParams() as { videoId: string }
  const router = useRouter()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedProgress, setSavedProgress] = useState<number>(0)
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  // Fetch video and progress
  useEffect(() => {
    async function fetchVideoAndProgress() {
      try {
        setLoading(true)
        
        // Fetch video details
        const { data: videoData, error: videoError } = await supabase
          .from('videos')
          .select('*')
          .eq('id', params.videoId)
          .single()

        if (videoError) throw videoError
        setVideo(videoData)

        // Fetch progress if user is authenticated
        if (user) {
          const { data: progressData } = await supabase
            .from('video_progress')
            .select('progress')
            .eq('video_id', params.videoId)
            .eq('user_id', user.id)
            .single()

          if (progressData) {
            setSavedProgress(progressData.progress)
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideoAndProgress()
  }, [params.videoId, user])

  const handleProgress = async (progress: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('video_progress')
        .upsert(
          {
            user_id: user.id,
            video_id: params.videoId,
            progress,
            completed: progress >= 90,
            last_watched: new Date().toISOString()
          },
          {
            onConflict: 'user_id,video_id',
            ignoreDuplicates: false
          }
        )

      if (error) throw error
      setSavedProgress(progress)
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!video) {
    return <div>Video not found</div>
  }

  console.log('Video data:', {
    id: video.id,
    youtube_id: video.youtube_id,
    title: video.title
  });

  return (
    <div className="container mx-auto p-8">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>

      <VideoPlayer 
        youtubeId={video.youtube_id}
        onProgress={handleProgress}
        initialProgress={savedProgress}
      />

      <div className="mt-4 flex items-center gap-2">
        <div className="w-full bg-gray-700 h-2 rounded-full">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all"
            style={{ width: `${savedProgress}%` }}
          />
        </div>
        <span className="text-sm text-gray-400">
          {Math.round(savedProgress)}%
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
      <p className="text-gray-400 mb-4">{video.description}</p>
      <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm">
        {video.category}
      </span>
    </div>
  )
} 