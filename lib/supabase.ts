import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          week: number
          module: number
          title: string
          description: string
          content: string
          duration_minutes: number
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          week: number
          module: number
          title: string
          description: string
          content: string
          duration_minutes: number
          order: number
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          completed: boolean
          completed_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          completed?: boolean
          completed_at?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      search_analytics: {
        Row: {
          id: string
          user_id: string
          search_query: string
          results_count: number
          clicked_course_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          search_query: string
          results_count: number
          clicked_course_id?: string | null
          created_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_start: string
          session_end: string | null
          pages_visited: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_start: string
          session_end?: string | null
          pages_visited?: string[]
          created_at?: string
        }
      }
    }
  }
}
