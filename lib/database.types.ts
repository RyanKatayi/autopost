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
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          email: string | null
          linkedin_id: string | null
          linkedin_access_token: string | null
          linkedin_refresh_token: string | null
          linkedin_expires_at: string | null
          timezone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          linkedin_id?: string | null
          linkedin_access_token?: string | null
          linkedin_refresh_token?: string | null
          linkedin_expires_at?: string | null
          timezone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          linkedin_id?: string | null
          linkedin_access_token?: string | null
          linkedin_refresh_token?: string | null
          linkedin_expires_at?: string | null
          timezone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          linkedin_id: string | null
          linkedin_access_token: string | null
          linkedin_refresh_token: string | null
          linkedin_expires_at: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          linkedin_id?: string | null
          linkedin_access_token?: string | null
          linkedin_refresh_token?: string | null
          linkedin_expires_at?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          linkedin_id?: string | null
          linkedin_access_token?: string | null
          linkedin_refresh_token?: string | null
          linkedin_expires_at?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          images: string[] | null
          hashtags: string[] | null
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_at: string | null
          published_at: string | null
          linkedin_post_id: string | null
          engagement_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          images?: string[] | null
          hashtags?: string[] | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_at?: string | null
          published_at?: string | null
          linkedin_post_id?: string | null
          engagement_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          images?: string[] | null
          hashtags?: string[] | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_at?: string | null
          published_at?: string | null
          linkedin_post_id?: string | null
          engagement_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      post_analytics: {
        Row: {
          id: string
          post_id: string
          impressions: number | null
          clicks: number | null
          likes: number | null
          comments: number | null
          shares: number | null
          engagement_rate: number | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          impressions?: number | null
          clicks?: number | null
          likes?: number | null
          comments?: number | null
          shares?: number | null
          engagement_rate?: number | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          impressions?: number | null
          clicks?: number | null
          likes?: number | null
          comments?: number | null
          shares?: number | null
          engagement_rate?: number | null
          recorded_at?: string
          created_at?: string
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
      post_status: 'draft' | 'scheduled' | 'published' | 'failed'
    }
  }
}