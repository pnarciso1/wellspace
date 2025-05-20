'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from '@/lib/icons'
import Link from 'next/link'
import YouTube from 'react-youtube'

interface Video {
  id: string
  youtube_id: string
  title: string
  description: string
  category: string
  tags: string[]
  thumbnail: string
  duration: string
  created_at: string
  updated_at: string
  program: string
}

interface VideoPlayerProps {
  videoId: string
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const router = useRouter()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', videoId)
          .single()

        if (error) throw error

        setVideo(data)
      } catch (error) {
        console.error('Error fetching video:', error)
        toast({
          title: "Error",
          description: "Failed to load video. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      fetchVideo()
    }
  }, [videoId, supabase, toast])

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
        <div className="text-center py-12">
          <Icons.Video className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Video not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/dashboard/gpact/tools/videos')}
          >
            Back to Video Library
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{video.title}</h1>
        <Button asChild>
          <Link href="/dashboard/gpact/tools/videos">
            Back to Video Library
            <Icons.ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <YouTube
                  videoId={video.youtube_id}
                  opts={opts}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.FileText className="h-5 w-5" />
                About This Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Category</h3>
                  <p className="text-sm text-gray-500 capitalize">{video.category}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Description</h3>
                  <p className="text-sm text-gray-500">{video.description}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Added</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 