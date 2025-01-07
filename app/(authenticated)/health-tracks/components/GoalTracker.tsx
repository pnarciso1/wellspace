'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from '@/types/supabase'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type HealthGoal = Database['public']['Tables']['health_goals']['Row']

type AddGoalDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGoalAdded: () => void
}

function AddGoalDialog({ open, onOpenChange, onGoalAdded }: AddGoalDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_value: '',
    unit: '',
    target_date: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('health_goals')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          target_value: Number(formData.target_value),
          current_value: 0,
          unit: formData.unit,
          target_date: formData.target_date,
          status: 'active'
        })

      if (error) throw error
      toast({ title: "Goal Added" })
      onGoalAdded()
      onOpenChange(false)
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Health Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="target_value">Target Value</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your goal target (e.g., 10000 for steps)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="target_value"
                type="number"
                min="0"
                step="any"
                value={formData.target_value}
                onChange={e => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
                required
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="unit">Unit</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>e.g., steps, miles, pounds, minutes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="unit"
                value={formData.unit}
                onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="target_date">Target Date</Label>
            <Input
              id="target_date"
              type="date"
              value={formData.target_date}
              onChange={e => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Goal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type UpdateProgressDialogProps = {
  goal: HealthGoal
  open: boolean
  onOpenChange: (open: boolean) => void
  onProgressUpdated: () => void
}

function UpdateProgressDialog({ goal, open, onOpenChange, onProgressUpdated }: UpdateProgressDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [currentValue, setCurrentValue] = useState(goal.current_value.toString())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('health_goals')
        .update({ current_value: Number(currentValue) })
        .eq('id', goal.id)

      if (error) throw error
      toast({ title: "Progress Updated" })
      onProgressUpdated()
      onOpenChange(false)
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="current_value">Current Value ({goal.unit})</Label>
            <Input
              id="current_value"
              type="number"
              value={currentValue}
              onChange={e => setCurrentValue(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Progress'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function GoalTracker() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<HealthGoal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showUpdateProgress, setShowUpdateProgress] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('health_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setGoals(data)
  }

  const calculateProgress = (goal: HealthGoal) => {
    if (!goal.target_value || !goal.current_value) return 0
    return Math.min(100, (goal.current_value / goal.target_value) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Health Goals</h2>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle>{goal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-500">{goal.description}</p>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Progress</span>
                    <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                  </div>
                  <Progress value={calculateProgress(goal)} />
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedGoal(goal)
                    setShowUpdateProgress(true)
                  }}
                >
                  Update Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddGoalDialog 
        open={showAddGoal} 
        onOpenChange={setShowAddGoal}
        onGoalAdded={loadGoals}
      />

      {selectedGoal && (
        <UpdateProgressDialog
          goal={selectedGoal}
          open={showUpdateProgress}
          onOpenChange={setShowUpdateProgress}
          onProgressUpdated={loadGoals}
        />
      )}
    </div>
  )
} 