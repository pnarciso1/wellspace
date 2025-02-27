import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  category: string
}

interface VideoCardProps {
  video: Video
  onSelect: (videoId: string) => void
}

export function VideoCard({ video, onSelect }: VideoCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(video.id)}
    >
      <div className="relative aspect-video bg-gray-100">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No thumbnail</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{video.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full">
            {video.category}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
