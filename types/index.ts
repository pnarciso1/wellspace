export interface Video {
  id: string
  youtube_id: string
  title: string
  description: string
  category: VideoCategory
  tags: string[]
  thumbnail: string
  duration: string
  createdAt: Date
  updatedAt: Date
}

export type VideoCategory = 'wellness' | 'nutrition' | 'fitness' | 'mental-health' | 'medical-info' 