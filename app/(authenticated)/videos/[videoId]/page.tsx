'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Video } from "@/types"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { VideoPlayer } from "@/components/video/video-player"
import { useToast } from "@/components/ui/use-toast"

export default function VideoPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVideo() {
      if (!params?.videoId) {
        toast({
          title: "Error",
          description: "No video ID provided",
          variant: "destructive"
        })
        router.push('/videos')
        return
      }

      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', params.videoId)
          .single()

        if (error) throw error

        setVideo(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load video",
          variant: "destructive"
        })
        router.push('/videos')
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [params?.videoId, router, supabase, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Loading...</div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Video not found</div>
      </div>
    )
  }

  if (!video.youtube_id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Invalid video ID</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/videos')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Videos
      </Button>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        
        <VideoPlayer
          youtubeId={video.youtube_id}
          initialProgress={0}
        />

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mt-6 mb-2">Description</h2>
          <p className="text-muted-foreground">{video.description}</p>
        </div>
      </div>
    </div>
  )
}
