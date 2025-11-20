import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY.')
}

// Client for browser-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for server-side operations (with elevated privileges)
export const supabaseAdmin = createClient(
  supabaseUrl!,
  supabaseServiceKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          credits: number
          karma: number
          is_id_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          credits?: number
          karma?: number
          is_id_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          credits?: number
          karma?: number
          is_id_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          owner_id: string
          price_credits: number
          lat: number
          lng: number
          avg_rating: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          owner_id: string
          price_credits: number
          lat: number
          lng: number
          avg_rating?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          owner_id?: string
          price_credits?: number
          lat?: number
          lng?: number
          avg_rating?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          skill_id: string
          learner_id: string
          start_time: string
          end_time: string
          status: 'BOOKED' | 'COMPLETED' | 'CANCELLED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          skill_id: string
          learner_id: string
          start_time: string
          end_time: string
          status?: 'BOOKED' | 'COMPLETED' | 'CANCELLED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          skill_id?: string
          learner_id?: string
          start_time?: string
          end_time?: string
          status?: 'BOOKED' | 'COMPLETED' | 'CANCELLED'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          skill_id: string
          reviewer_id: string
          booking_id: string
          stars: number
          comment: string
          is_flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          skill_id: string
          reviewer_id: string
          booking_id: string
          stars: number
          comment?: string
          is_flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          skill_id?: string
          reviewer_id?: string
          booking_id?: string
          stars?: number
          comment?: string
          is_flagged?: boolean
          created_at?: string
        }
      }
      credit_txns: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'EARNED' | 'SPENT' | 'DONATED'
          ref_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'EARNED' | 'SPENT' | 'DONATED'
          ref_id?: string
          message?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'EARNED' | 'SPENT' | 'DONATED'
          ref_id?: string
          message?: string
          created_at?: string
        }
      }
      community_projects: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string
          max_volunteers: number
          current_volunteers: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description: string
          max_volunteers: number
          current_volunteers?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string
          max_volunteers?: number
          current_volunteers?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      project_volunteers: {
        Row: {
          id: string
          project_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          joined_at?: string
        }
      }
    }
  }
}