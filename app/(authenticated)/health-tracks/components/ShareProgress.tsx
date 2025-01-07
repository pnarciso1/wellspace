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
    try {
      if (navigator.share) {
        await navigator.share({
          title: track.module.title,
          text: shareText,
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        toast({
          title: "Link Copied!",
          description: "Share your progress with friends",
        })
      }
    } catch (err) {
      // Only show error toast if it's not an AbortError
      if (!(err instanceof Error) || err.name !== 'AbortError') {
        console.error('Share error:', err)
        toast({
          title: "Sharing failed",
          description: "Please try again",
          variant: "destructive"
        })
      }
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