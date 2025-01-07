export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      health_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          date_of_birth: string | null
          height_feet: number | null
          height_inches: number | null
          weight_lbs: number | null
          blood_type: string | null
          allergies: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          date_of_birth?: string | null
          height_feet?: number | null
          height_inches?: number | null
          weight_lbs?: number | null
          blood_type?: string | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          date_of_birth?: string | null
          height_feet?: number | null
          height_inches?: number | null
          weight_lbs?: number | null
          blood_type?: string | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          file_path: string
          upload_date: string
          description: string | null
          record_type: string | null
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          file_path: string
          upload_date?: string
          description?: string | null
          record_type?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          file_path?: string
          upload_date?: string
          description?: string | null
          record_type?: string | null
        }
      }
      health_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_value: number
          current_value: number
          unit: string
          start_date: string | null
          target_date: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_value?: number
          current_value?: number
          unit?: string
          start_date?: string | null
          target_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_value?: number
          current_value?: number
          unit?: string
          start_date?: string | null
          target_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      health_track_modules: {
        Row: {
          id: string
          title: string
          description: string | null
          duration_days: number
          category: string
          difficulty: string
          tasks: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          duration_days: number
          category: string
          difficulty: string
          tasks?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          duration_days?: number
          category?: string
          difficulty?: string
          tasks?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_health_tracks: {
        Row: {
          id: string
          user_id: string
          module_id: string
          start_date: string
          current_day: number
          status: string
          progress: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          module_id: string
          start_date?: string
          current_day?: number
          status?: string
          progress?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          module_id?: string
          start_date?: string
          current_day?: number
          status?: string
          progress?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

