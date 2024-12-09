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

