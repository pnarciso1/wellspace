import { Suspense } from 'react'
import VideoPlayer from './video-player'

export default async function VideoPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPlayer videoId={videoId} />
    </Suspense>
  )
} 