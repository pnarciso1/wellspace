"use client"

import { useState, useCallback } from "react"
import { VideoGrid } from "@/components/video/video-grid"
import { CategoryFilter } from "@/components/video/category-filter"
import { VideoCategory } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { ErrorBoundary } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
  resetErrorBoundary: () => void
}

function ErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  const handleRetry = useCallback(() => {
    // Reset error boundary which will trigger a re-render
    resetErrorBoundary()
  }, [resetErrorBoundary])

  return (
    <div className="text-center p-6 bg-white/10 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
      <p className="text-gray-400 mb-4">Failed to load video library</p>
      <Button onClick={handleRetry}>
        Try Again
      </Button>
    </div>
  )
}

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(null)
  const { toast } = useToast()
  
  const handleError = (error: Error) => {
    toast({
      title: "Error",
      description: "Failed to load videos. Please try again.",
      variant: "destructive"
    })
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Video Library</h1>
        <p className="text-gray-500">Watch curated health and wellness videos</p>
      </div>

      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ErrorBoundary 
        fallback={(props) => <ErrorFallback {...props} />}
        onReset={() => {
          setSelectedCategory(null)
        }}
      >
        <VideoGrid 
          category={selectedCategory}
          onError={handleError}
        />
      </ErrorBoundary>
    </div>
  )
} 