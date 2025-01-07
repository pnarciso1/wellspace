import { Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { ActiveTrack } from "@/app/(authenticated)/health-tracks/components/types"

interface ShareProgressProps {
  track: ActiveTrack
}

export function ShareProgress({ track }: ShareProgressProps) {
  const { toast } = useToast()
  const shareUrl = `${window.location.origin}/share/${track.id}`
  const shareText = `I'm on Day ${track.current_day} of ${track.module.title} with a ${track.progress.current_streak} day streak! 💪`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.module.title,
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      toast({
        title: "Link Copied!",
        description: "Share your progress with friends",
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      <Share2 className="h-4 w-4" />
      Share Progress
    </Button>
  )
} 