export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat_usage: {
        Row: {
          id: string
          last_used: string | null
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          id?: string
          last_used?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          id?: string
          last_used?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string | null
          date: string
          doctor_name: string | null
          id: string
          location: string | null
          notes: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          doctor_name?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          doctor_name?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_resources: {
        Row: {
          category: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          location: string | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string
        }
        Relationships: []
      }
      doctor_visit_history: {
        Row: {
          created_at: string | null
          id: string
          medication_changes: Json | null
          next_visit_date: string | null
          notes: string | null
          primary_concerns: string[] | null
          record_id: string | null
          treatment_plan: string | null
          visit_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          medication_changes?: Json | null
          next_visit_date?: string | null
          notes?: string | null
          primary_concerns?: string[] | null
          record_id?: string | null
          treatment_plan?: string | null
          visit_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          medication_changes?: Json | null
          next_visit_date?: string | null
          notes?: string | null
          primary_concerns?: string[] | null
          record_id?: string | null
          treatment_plan?: string | null
          visit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_visit_history_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "doctor_visit_records"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_visit_impact: {
        Row: {
          created_at: string | null
          daily_activities: Json | null
          emotional_impact: string | null
          fatigue_level: number | null
          id: string
          notes: string | null
          overall_wellbeing: number | null
          record_id: string | null
          sleep_quality: number | null
          social_impact: string | null
          stress_level: number | null
          updated_at: string | null
          work_impact: string | null
        }
        Insert: {
          created_at?: string | null
          daily_activities?: Json | null
          emotional_impact?: string | null
          fatigue_level?: number | null
          id?: string
          notes?: string | null
          overall_wellbeing?: number | null
          record_id?: string | null
          sleep_quality?: number | null
          social_impact?: string | null
          stress_level?: number | null
          updated_at?: string | null
          work_impact?: string | null
        }
        Update: {
          created_at?: string | null
          daily_activities?: Json | null
          emotional_impact?: string | null
          fatigue_level?: number | null
          id?: string
          notes?: string | null
          overall_wellbeing?: number | null
          record_id?: string | null
          sleep_quality?: number | null
          social_impact?: string | null
          stress_level?: number | null
          updated_at?: string | null
          work_impact?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_visit_impact_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "doctor_visit_records"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_visit_quality_of_life: {
        Row: {
          anxiety_level: number | null
          created_at: string | null
          energy_level: number | null
          exercise_impact: number | null
          household_impact: number | null
          id: string
          medication_effectiveness: number | null
          mood_state: number | null
          notes: string | null
          physical_comfort: number | null
          record_id: string | null
          side_effects_impact: number | null
          sleep_quality: number | null
          social_impact: number | null
          stress_management: number | null
          treatment_satisfaction: number | null
          updated_at: string | null
          work_impact: number | null
        }
        Insert: {
          anxiety_level?: number | null
          created_at?: string | null
          energy_level?: number | null
          exercise_impact?: number | null
          household_impact?: number | null
          id?: string
          medication_effectiveness?: number | null
          mood_state?: number | null
          notes?: string | null
          physical_comfort?: number | null
          record_id?: string | null
          side_effects_impact?: number | null
          sleep_quality?: number | null
          social_impact?: number | null
          stress_management?: number | null
          treatment_satisfaction?: number | null
          updated_at?: string | null
          work_impact?: number | null
        }
        Update: {
          anxiety_level?: number | null
          created_at?: string | null
          energy_level?: number | null
          exercise_impact?: number | null
          household_impact?: number | null
          id?: string
          medication_effectiveness?: number | null
          mood_state?: number | null
          notes?: string | null
          physical_comfort?: number | null
          record_id?: string | null
          side_effects_impact?: number | null
          sleep_quality?: number | null
          social_impact?: number | null
          stress_management?: number | null
          treatment_satisfaction?: number | null
          updated_at?: string | null
          work_impact?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_visit_quality_of_life_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "doctor_visit_records"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_visit_records: {
        Row: {
          address: string | null
          birth_year: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          state: string | null
          updated_at: string | null
          user_id: string | null
          years_with_mg: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birth_year?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_with_mg?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birth_year?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_with_mg?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      doctor_visit_reports: {
        Row: {
          created_at: string | null
          generated_by: string | null
          id: string
          record_id: string | null
          report_type: string | null
          report_url: string | null
        }
        Insert: {
          created_at?: string | null
          generated_by?: string | null
          id?: string
          record_id?: string | null
          report_type?: string | null
          report_url?: string | null
        }
        Update: {
          created_at?: string | null
          generated_by?: string | null
          id?: string
          record_id?: string | null
          report_type?: string | null
          report_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_visit_reports_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "doctor_visit_records"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_visit_symptoms: {
        Row: {
          affected_areas: Json | null
          context: Json | null
          created_at: string | null
          frequency: string | null
          id: string
          intensity: number | null
          is_present: boolean | null
          notes: string | null
          record_id: string | null
          symptom_changes: string[] | null
          symptom_start_date: string | null
          symptom_type: string
          time_patterns: Json | null
          treatments: Json | null
          triggers: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          affected_areas?: Json | null
          context?: Json | null
          created_at?: string | null
          frequency?: string | null
          id?: string
          intensity?: number | null
          is_present?: boolean | null
          notes?: string | null
          record_id?: string | null
          symptom_changes?: string[] | null
          symptom_start_date?: string | null
          symptom_type: string
          time_patterns?: Json | null
          treatments?: Json | null
          triggers?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          affected_areas?: Json | null
          context?: Json | null
          created_at?: string | null
          frequency?: string | null
          id?: string
          intensity?: number | null
          is_present?: boolean | null
          notes?: string | null
          record_id?: string | null
          symptom_changes?: string[] | null
          symptom_start_date?: string | null
          symptom_type?: string
          time_patterns?: Json | null
          treatments?: Json | null
          triggers?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_visit_symptoms_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "doctor_visit_records"
            referencedColumns: ["id"]
          },
        ]
      }
      glossary_terms: {
        Row: {
          categories: string[] | null
          created_at: string | null
          definition: string
          descriptors: string[] | null
          etymology: string | null
          id: string
          related_terms: string[] | null
          search_vector: unknown | null
          term: string
          updated_at: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          definition: string
          descriptors?: string[] | null
          etymology?: string | null
          id?: string
          related_terms?: string[] | null
          search_vector?: unknown | null
          term: string
          updated_at?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          definition?: string
          descriptors?: string[] | null
          etymology?: string | null
          id?: string
          related_terms?: string[] | null
          search_vector?: unknown | null
          term?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gpact_doctor_visit_quality_of_life: {
        Row: {
          anxiety_level: number | null
          created_at: string | null
          emotional_impact: number | null
          energy_level: number | null
          exercise_impact: number | null
          household_impact: number | null
          id: string
          medication_effectiveness: number | null
          mood_state: number | null
          notes: string | null
          overall_impact: number | null
          physical_comfort: number | null
          physical_impact: number | null
          record_id: string
          side_effects_impact: number | null
          sleep_quality: number | null
          social_impact: number | null
          stress_management: number | null
          treatment_satisfaction: number | null
          updated_at: string | null
          work_impact: number | null
        }
        Insert: {
          anxiety_level?: number | null
          created_at?: string | null
          emotional_impact?: number | null
          energy_level?: number | null
          exercise_impact?: number | null
          household_impact?: number | null
          id?: string
          medication_effectiveness?: number | null
          mood_state?: number | null
          notes?: string | null
          overall_impact?: number | null
          physical_comfort?: number | null
          physical_impact?: number | null
          record_id: string
          side_effects_impact?: number | null
          sleep_quality?: number | null
          social_impact?: number | null
          stress_management?: number | null
          treatment_satisfaction?: number | null
          updated_at?: string | null
          work_impact?: number | null
        }
        Update: {
          anxiety_level?: number | null
          created_at?: string | null
          emotional_impact?: number | null
          energy_level?: number | null
          exercise_impact?: number | null
          household_impact?: number | null
          id?: string
          medication_effectiveness?: number | null
          mood_state?: number | null
          notes?: string | null
          overall_impact?: number | null
          physical_comfort?: number | null
          physical_impact?: number | null
          record_id?: string
          side_effects_impact?: number | null
          sleep_quality?: number | null
          social_impact?: number | null
          stress_management?: number | null
          treatment_satisfaction?: number | null
          updated_at?: string | null
          work_impact?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_record"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "gpact_doctor_visit_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gpact_doctor_visit_quality_of_life_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "gpact_doctor_visit_records"
            referencedColumns: ["id"]
          },
        ]
      }
      gpact_doctor_visit_records: {
        Row: {
          created_at: string | null
          diagnosis: string | null
          doctor_name: string | null
          id: string
          updated_at: string | null
          user_id: string
          visit_date: string | null
          visit_reason: string | null
        }
        Insert: {
          created_at?: string | null
          diagnosis?: string | null
          doctor_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          visit_date?: string | null
          visit_reason?: string | null
        }
        Update: {
          created_at?: string | null
          diagnosis?: string | null
          doctor_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          visit_date?: string | null
          visit_reason?: string | null
        }
        Relationships: []
      }
      gpact_doctor_visit_symptoms: {
        Row: {
          affected_areas: string[] | null
          context: string[] | null
          created_at: string | null
          frequency:
            | Database["public"]["Enums"]["gpact_symptom_frequency"]
            | null
          id: string
          intensity:
            | Database["public"]["Enums"]["gpact_symptom_intensity"]
            | null
          is_present: boolean | null
          notes: string | null
          record_id: string
          symptom_changes: string[] | null
          symptom_start_date: string | null
          symptom_type: Database["public"]["Enums"]["gpact_symptom_type"]
          time_patterns: Json | null
          treatments: string[] | null
          triggers: Json | null
          updated_at: string | null
        }
        Insert: {
          affected_areas?: string[] | null
          context?: string[] | null
          created_at?: string | null
          frequency?:
            | Database["public"]["Enums"]["gpact_symptom_frequency"]
            | null
          id?: string
          intensity?:
            | Database["public"]["Enums"]["gpact_symptom_intensity"]
            | null
          is_present?: boolean | null
          notes?: string | null
          record_id: string
          symptom_changes?: string[] | null
          symptom_start_date?: string | null
          symptom_type: Database["public"]["Enums"]["gpact_symptom_type"]
          time_patterns?: Json | null
          treatments?: string[] | null
          triggers?: Json | null
          updated_at?: string | null
        }
        Update: {
          affected_areas?: string[] | null
          context?: string[] | null
          created_at?: string | null
          frequency?:
            | Database["public"]["Enums"]["gpact_symptom_frequency"]
            | null
          id?: string
          intensity?:
            | Database["public"]["Enums"]["gpact_symptom_intensity"]
            | null
          is_present?: boolean | null
          notes?: string | null
          record_id?: string
          symptom_changes?: string[] | null
          symptom_start_date?: string | null
          symptom_type?: Database["public"]["Enums"]["gpact_symptom_type"]
          time_patterns?: Json | null
          treatments?: string[] | null
          triggers?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_record"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "gpact_doctor_visit_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gpact_doctor_visit_symptoms_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "gpact_doctor_visit_records"
            referencedColumns: ["id"]
          },
        ]
      }
      gpact_enrollments: {
        Row: {
          created_at: string | null
          current_step: number | null
          enrolled_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          video_completed: boolean | null
          video_watched_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_step?: number | null
          enrolled_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          video_completed?: boolean | null
          video_watched_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_step?: number | null
          enrolled_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          video_completed?: boolean | null
          video_watched_at?: string | null
        }
        Relationships: []
      }
      gpact_medications: {
        Row: {
          as_needed: boolean | null
          created_at: string | null
          dosage: string
          drug_name: string
          frequency: string
          gastroparesis_specific: boolean | null
          health_record_id: string
          id: string
          indication: string | null
          notes: string | null
          start_date: string
          status: string | null
          still_using: boolean | null
          stop_date: string | null
          symptom_target: string[] | null
          timing: string | null
          updated_at: string | null
        }
        Insert: {
          as_needed?: boolean | null
          created_at?: string | null
          dosage: string
          drug_name: string
          frequency: string
          gastroparesis_specific?: boolean | null
          health_record_id: string
          id?: string
          indication?: string | null
          notes?: string | null
          start_date: string
          status?: string | null
          still_using?: boolean | null
          stop_date?: string | null
          symptom_target?: string[] | null
          timing?: string | null
          updated_at?: string | null
        }
        Update: {
          as_needed?: boolean | null
          created_at?: string | null
          dosage?: string
          drug_name?: string
          frequency?: string
          gastroparesis_specific?: boolean | null
          health_record_id?: string
          id?: string
          indication?: string | null
          notes?: string | null
          start_date?: string
          status?: string | null
          still_using?: boolean | null
          stop_date?: string | null
          symptom_target?: string[] | null
          timing?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_health_record"
            columns: ["health_record_id"]
            isOneToOne: false
            referencedRelation: "health_records"
            referencedColumns: ["id"]
          },
        ]
      }
      gpact_video_progress: {
        Row: {
          created_at: string | null
          id: string
          progress_percentage: number | null
          updated_at: string | null
          user_id: string
          video_id: string
          watched: boolean | null
          watched_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          progress_percentage?: number | null
          updated_at?: string | null
          user_id: string
          video_id: string
          watched?: boolean | null
          watched_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string
          video_id?: string
          watched?: boolean | null
          watched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gpact_video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "gpact_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      gpact_videos: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
          video_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          order_index: number
          title: string
          updated_at?: string | null
          video_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
          video_id?: string
        }
        Relationships: []
      }
      health_goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          start_date: string | null
          status: string | null
          target_date: string | null
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_profiles: {
        Row: {
          additional_notes: string | null
          allergies: string[] | null
          blood_type: string | null
          chronic_conditions: string | null
          created_at: string | null
          date_of_birth: string | null
          dietary_restrictions: string | null
          emergency_contact: Json | null
          exercise_frequency: string | null
          family_history: string | null
          gender: string | null
          height: number | null
          height_feet: number | null
          height_inches: number | null
          id: string
          medications: string | null
          name: string
          past_surgeries: string | null
          primary_physician: Json | null
          sleep_hours: string | null
          stress_level: number | null
          updated_at: string | null
          user_id: string | null
          weight: number | null
          weight_lbs: number | null
        }
        Insert: {
          additional_notes?: string | null
          allergies?: string[] | null
          blood_type?: string | null
          chronic_conditions?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          emergency_contact?: Json | null
          exercise_frequency?: string | null
          family_history?: string | null
          gender?: string | null
          height?: number | null
          height_feet?: number | null
          height_inches?: number | null
          id?: string
          medications?: string | null
          name: string
          past_surgeries?: string | null
          primary_physician?: Json | null
          sleep_hours?: string | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
          weight_lbs?: number | null
        }
        Update: {
          additional_notes?: string | null
          allergies?: string[] | null
          blood_type?: string | null
          chronic_conditions?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          emergency_contact?: Json | null
          exercise_frequency?: string | null
          family_history?: string | null
          gender?: string | null
          height?: number | null
          height_feet?: number | null
          height_inches?: number | null
          id?: string
          medications?: string | null
          name?: string
          past_surgeries?: string | null
          primary_physician?: Json | null
          sleep_hours?: string | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
          weight_lbs?: number | null
        }
        Relationships: []
      }
      health_records: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          record_type: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          record_type?: string
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          record_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_track_modules: {
        Row: {
          category: string
          created_at: string
          description: string | null
          difficulty: string
          duration_days: number
          id: string
          tasks: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          difficulty: string
          duration_days: number
          id?: string
          tasks?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          difficulty?: string
          duration_days?: number
          id?: string
          tasks?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_track_progress: {
        Row: {
          created_at: string | null
          id: string
          progress: Json
          track_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          progress: Json
          track_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          progress?: Json
          track_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_tracks: {
        Row: {
          challenge_name: string
          completed: boolean | null
          end_date: string | null
          id: string
          progress: number | null
          start_date: string
          user_id: string | null
        }
        Insert: {
          challenge_name: string
          completed?: boolean | null
          end_date?: string | null
          id?: string
          progress?: number | null
          start_date: string
          user_id?: string | null
        }
        Update: {
          challenge_name?: string
          completed?: boolean | null
          end_date?: string | null
          id?: string
          progress?: number | null
          start_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_tracks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          file_path: string
          upload_date: string | null
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
          upload_date?: string | null
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
          upload_date?: string | null
          description?: string | null
          record_type?: string | null
        }
        Relationships: []
      }
      medications: {
        Row: {
          as_needed: boolean
          created_at: string | null
          dosage: string
          drug_name: string
          frequency: string
          gastroparesis_specific: boolean
          health_record_id: string
          id: string
          indication: string | null
          notes: string | null
          start_date: string
          status: string | null
          still_using: boolean | null
          stop_date: string | null
          symptom_target: string[]
          timing: string | null
          updated_at: string | null
        }
        Insert: {
          as_needed?: boolean
          created_at?: string | null
          dosage: string
          drug_name: string
          frequency: string
          gastroparesis_specific?: boolean
          health_record_id: string
          id?: string
          indication?: string | null
          notes?: string | null
          start_date: string
          status?: string | null
          still_using?: boolean | null
          stop_date?: string | null
          symptom_target?: string[]
          timing?: string | null
          updated_at?: string | null
        }
        Update: {
          as_needed?: boolean
          created_at?: string | null
          dosage?: string
          drug_name?: string
          frequency?: string
          gastroparesis_specific?: boolean
          health_record_id?: string
          id?: string
          indication?: string | null
          notes?: string | null
          start_date?: string
          status?: string | null
          still_using?: boolean | null
          stop_date?: string | null
          symptom_target?: string[]
          timing?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_health_record_id_fkey"
            columns: ["health_record_id"]
            isOneToOne: false
            referencedRelation: "health_records"
            referencedColumns: ["id"]
          },
        ]
      }
      mgpp_assessment_questions: {
        Row: {
          assessment_type: string
          created_at: string | null
          id: string
          options: Json | null
          order_number: number
          question_text: string
          question_type: string
        }
        Insert: {
          assessment_type: string
          created_at?: string | null
          id?: string
          options?: Json | null
          order_number: number
          question_text: string
          question_type: string
        }
        Update: {
          assessment_type?: string
          created_at?: string | null
          id?: string
          options?: Json | null
          order_number?: number
          question_text?: string
          question_type?: string
        }
        Relationships: []
      }
      mgpp_assessment_responses: {
        Row: {
          assessment_type: string
          created_at: string | null
          enrollment_id: string | null
          id: string
          question_id: string | null
          response: string
          user_id: string | null
        }
        Insert: {
          assessment_type: string
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          question_id?: string | null
          response: string
          user_id?: string | null
        }
        Update: {
          assessment_type?: string
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          question_id?: string | null
          response?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mgpp_assessment_responses_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mgpp_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mgpp_assessment_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "mgpp_assessment_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      mgpp_enrollments: {
        Row: {
          created_at: string | null
          current_step: number | null
          doctor_visit_unlocked: boolean | null
          enrolled_at: string | null
          glossary_unlocked: boolean | null
          id: string
          medication_log_unlocked: boolean | null
          post_assessment_unlocked: boolean | null
          pre_assessment_completed: boolean | null
          updated_at: string | null
          user_id: string | null
          video_completed: boolean | null
          video_watched_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_step?: number | null
          doctor_visit_unlocked?: boolean | null
          enrolled_at?: string | null
          glossary_unlocked?: boolean | null
          id?: string
          medication_log_unlocked?: boolean | null
          post_assessment_unlocked?: boolean | null
          pre_assessment_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          video_completed?: boolean | null
          video_watched_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_step?: number | null
          doctor_visit_unlocked?: boolean | null
          enrolled_at?: string | null
          glossary_unlocked?: boolean | null
          id?: string
          medication_log_unlocked?: boolean | null
          post_assessment_unlocked?: boolean | null
          pre_assessment_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          video_completed?: boolean | null
          video_watched_at?: string | null
        }
        Relationships: []
      }
      mgpp_step_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          enrollment_id: string | null
          id: string
          step_name: string
          step_number: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          step_name: string
          step_number: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          enrollment_id?: string | null
          id?: string
          step_name?: string
          step_number?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mgpp_step_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mgpp_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_entries: {
        Row: {
          health_goal_id: string
          id: string
          notes: string | null
          recorded_at: string | null
          value: number
        }
        Insert: {
          health_goal_id: string
          id?: string
          notes?: string | null
          recorded_at?: string | null
          value: number
        }
        Update: {
          health_goal_id?: string
          id?: string
          notes?: string | null
          recorded_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_entries_health_goal_id_fkey"
            columns: ["health_goal_id"]
            isOneToOne: false
            referencedRelation: "health_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_health_tracks: {
        Row: {
          created_at: string
          current_day: number | null
          id: string
          last_active: string | null
          module_id: string
          progress: Json | null
          start_date: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_day?: number | null
          id?: string
          last_active?: string | null
          module_id: string
          progress?: Json | null
          start_date?: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_day?: number | null
          id?: string
          last_active?: string | null
          module_id?: string
          progress?: Json | null
          start_date?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_health_tracks_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "health_track_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_video_progress: {
        Row: {
          created_at: string | null
          id: string
          last_watched: string | null
          progress: number | null
          timestamp: number | null
          updated_at: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_watched?: string | null
          progress?: number | null
          timestamp?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_watched?: string | null
          progress?: number | null
          timestamp?: number | null
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      video_progress: {
        Row: {
          completed: boolean
          created_at: string | null
          id: string
          last_watched: string | null
          progress: number
          updated_at: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: string
          last_watched?: string | null
          progress?: number
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: string
          last_watched?: string | null
          progress?: number
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          program: string | null
          tags: string[] | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          youtube_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          program?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          youtube_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          program?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          youtube_id?: string
        }
        Relationships: []
      }
      vital_signs: {
        Row: {
          health_record_id: string
          id: string
          measured_at: string | null
          type: string
          unit: string
          value: Json
        }
        Insert: {
          health_record_id: string
          id?: string
          measured_at?: string | null
          type: string
          unit: string
          value: Json
        }
        Update: {
          health_record_id?: string
          id?: string
          measured_at?: string | null
          type?: string
          unit?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_health_record_id_fkey"
            columns: ["health_record_id"]
            isOneToOne: false
            referencedRelation: "health_records"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_enrollment: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          user_id: string
          current_step: number
          pre_assessment_completed: boolean
          enrolled_at: string
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      update_enrollment_status: {
        Args: { p_user_id: string; p_completed: boolean; p_step: number }
        Returns: {
          id: string
          user_id: string
          current_step: number
          pre_assessment_completed: boolean
          enrolled_at: string
        }[]
      }
    }
    Enums: {
      gpact_symptom_frequency:
        | "never"
        | "rarely"
        | "sometimes"
        | "often"
        | "always"
      gpact_symptom_intensity: "mild" | "moderate" | "severe" | "very_severe"
      gpact_symptom_type:
        | "fatigue"
        | "pain"
        | "weakness"
        | "numbness"
        | "tingling"
        | "balance"
        | "vision"
        | "speech"
        | "swallowing"
        | "breathing"
        | "bowel"
        | "bladder"
        | "sexual"
        | "cognitive"
        | "emotional"
        | "sleep"
        | "other"
        | "bloated_stomach"
        | "anxiety"
        | "loss_of_appetite"
        | "constipation"
        | "dehydration"
        | "feeling_full_long_after_eating"
        | "depression"
        | "indigestion"
        | "feeling_full_very_quickly"
        | "vomiting"
        | "upper_abdominal_pain"
        | "belching"
        | "blood_sugar_fluctuations"
        | "weight_loss"
        | "malnutrition"
        | "nausea"
        | "heartburn"
        | "regurgitation"
        | "weight_gain"
        | "dizziness"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gpact_symptom_frequency: [
        "never",
        "rarely",
        "sometimes",
        "often",
        "always",
      ],
      gpact_symptom_intensity: ["mild", "moderate", "severe", "very_severe"],
      gpact_symptom_type: [
        "fatigue",
        "pain",
        "weakness",
        "numbness",
        "tingling",
        "balance",
        "vision",
        "speech",
        "swallowing",
        "breathing",
        "bowel",
        "bladder",
        "sexual",
        "cognitive",
        "emotional",
        "sleep",
        "other",
        "bloated_stomach",
        "anxiety",
        "loss_of_appetite",
        "constipation",
        "dehydration",
        "feeling_full_long_after_eating",
        "depression",
        "indigestion",
        "feeling_full_very_quickly",
        "vomiting",
        "upper_abdominal_pain",
        "belching",
        "blood_sugar_fluctuations",
        "weight_loss",
        "malnutrition",
        "nausea",
        "heartburn",
        "regurgitation",
        "weight_gain",
        "dizziness",
      ],
    },
  },
} as const
