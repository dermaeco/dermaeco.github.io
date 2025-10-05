// Wrapper for Supabase client with environment variable fallbacks
// This ensures the client works even if Vite hasn't loaded .env yet
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mohohrmgveheqftcrzzd.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaG9ocm1ndmVoZXFmdGNyenpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MTIwMzQsImV4cCI6MjA3NTE4ODAzNH0._ONuokezNHHq4D_0wkWBLH3_b7Cbw8Co1FTxcomS9kk'

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Database types
export interface Profile {
  id: string
  user_id: string
  full_name?: string
  email?: string
  date_of_birth?: string
  gender?: string
  phone?: string
  preferred_language: string
  avatar_url?: string
  created_at: string
  updated_at: string
  last_login?: string
}

export interface PrivacySettings {
  id: string
  user_id: string
  data_processing_consent: boolean
  marketing_consent: boolean
  analytics_consent: boolean
  consent_date?: string
  consent_ip_address?: string
  data_retention_preference: string
  can_be_contacted: boolean
  created_at: string
  updated_at: string
}

export interface QuestionnaireResponse {
  id: string
  user_id: string
  sleep_hours?: number
  stress_level?: number
  diet_type?: string
  exercise_frequency?: string
  current_skincare_routine?: any
  skin_concerns?: string[]
  smoking_status?: string
  alcohol_consumption?: string
  environmental_factors?: string[]
  created_at: string
  updated_at: string
}

export interface SkinAnalysis {
  id: string
  user_id: string
  image_url: string
  analysis_results: any
  wrinkles_score?: number
  spots_score?: number
  acne_score?: number
  texture_score?: number
  hydration_score?: number
  sebum_score?: number
  pores_score?: number
  redness_score?: number
  dark_circles_score?: number
  skin_age_estimate?: number
  skin_type?: string
  overall_score?: number
  ai_provider?: string
  processing_time_ms?: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category?: string
  subcategory?: string
  description?: string
  ingredients_list?: string[]
  price_min?: number
  price_max?: number
  currency: string
  image_url?: string
  purchase_urls?: any
  country_origin?: string
  skin_types?: string[]
  concerns_addressed?: string[]
  key_ingredients?: string[]
  product_size?: string
  rating?: number
  review_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Recommendation {
  id: string
  user_id: string
  skin_analysis_id: string
  product_id: string
  recommendation_score?: number
  recommendation_reason?: string
  category?: string
  priority_level?: number
  is_personalized: boolean
  created_at: string
}

// New interfaces for upgraded features
export interface SkincareDiary {
  id: string
  user_id: string
  title: string
  content?: string
  before_photo_url?: string
  after_photo_url?: string
  skin_analysis_id?: string
  tags?: string[]
  privacy_setting: string
  likes_count: number
  comments_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface DiaryInteraction {
  id: string
  diary_id: string
  user_id: string
  interaction_type: string
  created_at: string
}

export interface DiaryComment {
  id: string
  diary_id: string
  user_id: string
  content: string
  parent_comment_id?: string
  likes_count: number
  created_at: string
  updated_at: string
}

export interface UserFollow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface InfluencerProfile {
  id: string
  user_id: string
  status: string
  application_reason?: string
  verification_level: string
  specialty_areas?: string[]
  follower_count: number
  engagement_rate: number
  commission_rate: number
  total_earnings: number
  created_at: string
  updated_at: string
}

export interface UserProduct {
  id: string
  user_id: string
  product_name: string
  brand: string
  category?: string
  price?: number
  purchase_date?: string
  expiry_date?: string
  usage_frequency?: string
  effectiveness_rating?: number
  notes?: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WeatherRoutine {
  id: string
  user_id: string
  location_name?: string
  weather_data?: any
  recommended_routine?: any
  routine_date?: string
  temperature?: number
  humidity?: number
  uv_index?: number
  air_quality?: number
  skin_type?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  content?: string
  is_read: boolean
  scheduled_for?: string
  metadata?: any
  created_at: string
}

export interface CreatorEarning {
  id: string
  user_id: string
  earning_type: string
  amount: number
  currency: string
  source_id?: string
  description?: string
  status: string
  created_at: string
}

export interface ProductLink {
  id: string
  influencer_id: string
  product_id: string
  affiliate_link: string
  commission_rate: number
  click_count: number
  conversion_count: number
  total_earnings: number
  is_active: boolean
  created_at: string
  updated_at: string
}