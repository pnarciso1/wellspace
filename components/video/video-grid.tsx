'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { VideoCard, Video } from './video-card'
import { useRouter } from 'next/navigation'

interface VideoGridProps {
  category: string | null
  onError: (error: Error) => void
}

export function VideoGrid({ category, onError }: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchVideos() {
      try {
        let query = supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })

        if (category) {
          query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) throw error

        // Transform the data to match Video interface
        const formattedVideos = data.map((video: any) => ({
          id: video.id,
          title: video.title,
          description: video.description,
          // Use the correct thumbnail field from your database
          thumbnailUrl: `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`,
          category: video.category
        }))

        setVideos(formattedVideos)
      } catch (error) {
        console.error('Error fetching videos:', error)
        onError(error as Error)
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="aspect-video bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No videos found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
