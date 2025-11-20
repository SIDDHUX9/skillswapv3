// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Read envs once
 */
const supabaseUrl = process.env.SUPABASE_URL ?? null
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? null
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY ?? null

/**
 * Do NOT throw here — return null if not configured.
 * Create clients lazily and reuse them (avoid multiple instances).
 */
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) return null
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return _supabaseAdmin
}

/**
 * Backwards-compatible exports:
 * - `supabase` and `supabaseAdmin` may be null when envs are missing.
 * - Prefer using getSupabase() / getSupabaseAdmin() in request handlers.
 */
export const supabase = getSupabase()
export const supabaseAdmin = getSupabaseAdmin()

/* ======================================================================
   Database types (keep unchanged from your original file)
   ====================================================================== */

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
