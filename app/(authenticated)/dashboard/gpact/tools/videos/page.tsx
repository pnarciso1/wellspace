'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from '@/lib/icons'
import Link from 'next/link'

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

export default function GPACTVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('program', 'gpact')
          .order('created_at', { ascending: false })

        if (error) throw error

        setVideos(data || [])
      } catch (error) {
        console.error('Error fetching videos:', error)
        toast({
          title: "Error",
          description: "Failed to load videos. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [supabase, toast])

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'wellness', label: 'Wellness' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'fitness', label: 'Fitness' },
    { key: 'mental-health', label: 'Mental Health' },
    { key: 'medical-info', label: 'Medical Info' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">G-PACT Video Library</h1>
        </div>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">G-PACT Video Library</h1>
        <Button asChild>
          <Link href="/dashboard/gpact">
            Back to Dashboard
            <Icons.ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Video className="h-5 w-5" />
            Educational Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Access our comprehensive library of educational videos about Gastroparesis.
            Use the search box to find specific topics or filter by category.
          </p>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.key)}
            className="whitespace-nowrap"
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {video.description}
              </p>
              <Button 
                className="w-full"
                onClick={() => router.push(`/dashboard/gpact/tools/videos/${video.id}`)}
              >
                Watch Video
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Icons.Video className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
} 