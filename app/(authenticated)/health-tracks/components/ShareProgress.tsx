import { MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { ActiveTrack } from "@/app/(authenticated)/health-tracks/components/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ShareProgressProps {
  track: ActiveTrack
}

export function ShareProgress({ track }: ShareProgressProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleShare = () => {
    // Here you would typically send this to your backend
    toast({
      title: "Progress Shared",
      description: "Your care team has been notified of your progress.",
    })
    setIsOpen(false)
    setNotes("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Share Progress
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Progress</DialogTitle>
          <DialogDescription>
            Share your progress on "{track.module.title}" with your care team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="progress-notes">Additional Notes</Label>
            <Textarea
              id="progress-notes"
              placeholder="Add any notes about your progress..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Progress Summary:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Current Day: {track.current_day} of {track.module.duration_days}</li>
              <li>Current Streak: {track.progress.current_streak} days</li>
              <li>Completed Tasks: {track.progress.completed_tasks.length}</li>
            </ul>
          </div>
          <Button onClick={handleShare} className="w-full">
            Share with Care Team
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
