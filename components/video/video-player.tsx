"use client"

import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube"
import { useState, useCallback, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Slider } from "../ui/slider"
import { toast } from "@/components/ui/use-toast"

interface VideoPlayerProps {
  youtubeId: string
  onProgress?: (progress: number) => void
  initialProgress?: number
}

export function VideoPlayer({ youtubeId, onProgress, initialProgress = 0 }: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(initialProgress)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const playerRef = useRef<YouTubePlayer | null>(null)

  // Add debug log
  console.log('YouTube Player props:', {
    youtubeId,
    initialProgress
  });

  const handlePlayPause = () => {
    if (!playerRef.current) return
    
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!playerRef.current) return
    const newVolume = value[0]
    setVolume(newVolume)
    playerRef.current.setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (!playerRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
      playerRef.current.setVolume(volume)
    } else {
      playerRef.current.mute()
    }
    setIsMuted(!isMuted)
  }

  // Seek to initial position when player is ready
  const handleReady = useCallback((event: YouTubeEvent<any>) => {
    const player = event.target as YouTubePlayer
    playerRef.current = player
    
    if (initialProgress > 0) {
      const seekTime = (player.getDuration() * initialProgress) / 100
      player.seekTo(seekTime, true)
    }
    
    setIsReady(true)
  }, [initialProgress])

  const handleStateChange = useCallback((event: YouTubeEvent<number>) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      const player = event.target as YouTubePlayer
      const interval = setInterval(() => {
        const progress = (player.getCurrentTime() / player.getDuration()) * 100
        setCurrentProgress(progress)
        onProgress?.(progress)
      }, 1000) // Update more frequently for smoother UI

      return () => clearInterval(interval)
    }
  }, [onProgress])

  const handleError = useCallback((error: any) => {
    console.error('YouTube Player Error:', {
      videoId: youtubeId,
      error: error.data
    });

    toast({
      title: "Video Error",
      description: "This video is currently unavailable. Please try again later.",
      variant: "destructive"
    });

    // Show fallback UI
    setIsReady(true);  // Remove loading spinner
  }, [youtubeId]);

  return (
    <div className="relative">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        )}
        
        <YouTube
          videoId={youtubeId}
          className={`w-full aspect-video ${isReady ? 'opacity-100' : 'opacity-0'}`}
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0
            }
          }}
          onReady={handleReady}
          onError={handleError}
          onStateChange={handleStateChange}
        />
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <div className="flex items-center gap-4">
          {/* Play/Pause button */}
          <button 
            onClick={handlePlayPause}
            className="text-white hover:text-indigo-400 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>

          {/* Volume controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </button>
            <div className="w-24">
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>
    </div>
  )
} 