export type TrackId = 'metabolic' | 'hypertension';

export interface Activity {
  task: string;
  explanation: string;
}

export interface WeekTasks {
  week: number;
  activities: Activity[];
}

export interface HealthTrackData {
  title: string;
  description: string;
  tasks: WeekTasks[];
}

export interface Milestone {
  day: number;
  title: string;
  message: string;
}

export interface HealthTracksData {
  [key: string]: HealthTrackData;
}

export interface MilestonesData {
  [key: string]: Milestone[];
}

export interface HealthTrackProgress {
  id: string;
  user_id: string;
  track_id: TrackId;
  progress: boolean[];
  created_at: string;
  updated_at: string;
}

