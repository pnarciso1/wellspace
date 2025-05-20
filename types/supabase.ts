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
          weight: number | null
          gender: string | null
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
          weight?: number | null
          gender?: string | null
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
          weight?: number | null
          gender?: string | null
          blood_type?: string | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      health_records: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          health_record_id: string
          drug_name: string
          indication: string | null
          dosage: string
          frequency: string
          timing: string | null
          start_date: string
          stop_date: string | null
          still_using: boolean
          status: string
          notes: string | null
          created_at: string
          updated_at: string
          as_needed: boolean
          gastroparesis_specific: boolean
          symptom_target: string[]
        }
        Insert: {
          id?: string
          health_record_id: string
          drug_name: string
          indication?: string | null
          dosage: string
          frequency: string
          timing?: string | null
          start_date: string
          stop_date?: string | null
          still_using: boolean
          status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          as_needed: boolean
          gastroparesis_specific: boolean
          symptom_target: string[]
        }
        Update: {
          id?: string
          health_record_id?: string
          drug_name?: string
          indication?: string | null
          dosage?: string
          frequency?: string
          timing?: string | null
          start_date?: string
          stop_date?: string | null
          still_using?: boolean
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          as_needed?: boolean
          gastroparesis_specific?: boolean
          symptom_target?: string[]
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
          current_day: number
          status: string
          progress: Json
          created_at: string
          updated_at: string
          module: {
            title: string
          }
        }
        Insert: {
          id?: string
          user_id: string
          module_id: string
          current_day?: number
          status?: string
          progress?: Json
        }
        Update: {
          id?: string
          user_id?: string
          module_id?: string
          current_day?: number
          status?: string
          progress?: Json
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
          target_date: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_value: number
          current_value?: number
          unit: string
          target_date: string
          status?: string
        }
        Update: {
          title?: string
          description?: string | null
          target_value?: number
          current_value?: number
          unit?: string
          target_date?: string
          status?: string
        }
      }
      gpact_enrollments: {
        Row: {
          id: string
          user_id: string
          enrolled_at: string
          current_step: number
          video_completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          enrolled_at?: string
          current_step?: number
          video_completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          enrolled_at?: string
          current_step?: number
          video_completed?: boolean
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

