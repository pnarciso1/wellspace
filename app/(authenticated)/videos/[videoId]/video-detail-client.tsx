'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { VideoPlayer } from "@/components/video/video-player"
import { Video } from "@/types"

interface VideoDetailClientProps {
  video: Video
}

export function VideoDetailClient({ video }: VideoDetailClientProps) {
  const router = useRouter()

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
