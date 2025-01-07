export type ActiveTrack = {
  id: string
  module_id: string
  start_date: string
  current_day: number
  status: string
  progress: {
    completed_tasks: string[]
    current_streak: number
  }
  module: {
    title: string
    description: string
    duration_days: number
    tasks: {
      [key: string]: {
        task1?: {
          title: string
          description: string
        }
        task2?: {
          title: string
          description: string
        }
        milestone?: {
          title: string
          message: string
        }
      }
    }
  }
  last_position?: number
  last_active?: string
} 