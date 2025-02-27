'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    unit: ''
  })
  const { toast } = useToast()

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.unit) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit
    }

    setGoals([...goals, goal])
    setNewGoal({ title: '', target: 0, unit: '' })
    setShowAddGoal(false)

    toast({
      title: "Success",
      description: "Goal added successfully"
    })
  }

  const handleIncrement = (goalId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId && goal.current < goal.target) {
        return { ...goal, current: goal.current + 1 }
      }
      return goal
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Goal Tracker</h2>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Track your health and wellness goals. Set targets and monitor your progress over time.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle>{goal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
                  <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} />
                <Button 
                  onClick={() => handleIncrement(goal.id)}
                  disabled={goal.current >= goal.target}
                >
                  Add Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g., Daily Steps"
              />
            </div>
            <div>
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                value={newGoal.target || ''}
                onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                placeholder="e.g., 10000"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                placeholder="e.g., steps"
              />
            </div>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
