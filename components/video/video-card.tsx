"use client"

import { Card, CardContent } from "../ui/card"
import { formatDuration } from "@/lib/utils"
import { Video } from "@/types"
import { useState } from "react"

interface VideoCardProps {
  video: Video
  onSelect: (videoId: string) => void
  progress?: number
}

export function VideoCard({ video, onSelect, progress }: VideoCardProps) {
  const [thumbnailError, setThumbnailError] = useState(false);
  const [currentThumbnail, setCurrentThumbnail] = useState(video.thumbnail);

  // Add console logging to track thumbnail loading
  console.log('Thumbnail loading:', {
    videoId: video.id,
    youtubeId: video.youtube_id,
    originalThumbnail: video.thumbnail,
    currentThumbnail,
    hasError: thumbnailError
  });

  return (
    <Card 
      className="bg-white/10 backdrop-blur-md border-white/20 rounded-lg overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all"
      onClick={() => onSelect(video.id)}
    >
      <div className="relative aspect-video">
        <img 
          src={currentThumbnail}
          alt={video.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            console.error('Thumbnail failed to load:', currentThumbnail);
            setThumbnailError(true);
            const fallback = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
            setCurrentThumbnail(fallback);
            e.currentTarget.src = fallback;
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
          {formatDuration(video.duration)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-white font-semibold truncate">{video.title}</h3>
        <p className="text-gray-400 line-clamp-2 text-sm mt-1">
          {video.description}
        </p>
        <span className="text-indigo-400 text-sm mt-2 inline-block">
          {video.category}
        </span>
      </CardContent>
      {progress !== undefined && (
        <div className="h-1 bg-gray-700 mt-2">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </Card>
  )
} 