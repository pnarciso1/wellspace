"use client"

import { useEffect, useState } from "react"
import { VideoCard } from "./video-card"
import { VideoCategory, Video } from "@/types"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface VideoGridProps {
  category: VideoCategory | null
  onError: (error: Error) => void
}

export function VideoGrid({ category, onError }: VideoGridProps) {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        let query = supabase.from('videos').select('*')
        
        if (category) {
          query = query.eq('category', category)
        }

        const { data, error } = await query.order('created_at', { ascending: false })
        
        if (error) throw error
        
        setVideos(data || [])
      } catch (error) {
        onError(error as Error)
        throw error // This will trigger the ErrorBoundary
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [category, onError])

  const handleVideoSelect = (videoId: string) => {
    router.push(`/videos/${videoId}`)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md border-white/20 rounded-lg overflow-hidden">
            {/* Thumbnail skeleton */}
            <div className="relative aspect-video bg-white/5 animate-pulse" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Title skeleton */}
              <div className="h-6 bg-white/5 animate-pulse rounded" />
              
              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-white/5 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-white/5 animate-pulse rounded w-1/2" />
              </div>
              
              {/* Category skeleton */}
              <div className="h-4 bg-white/5 animate-pulse rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onSelect={handleVideoSelect}
        />
      ))}
    </div>
  )
}