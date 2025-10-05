// Core types for skinAI platform
export interface User {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface SkincareEntry {
  id: string
  user_id: string
  title: string
  content: string
  before_photo_url?: string
  after_photo_url?: string
  skin_analysis_id?: string
  tags: string[]
  privacy_setting: 'public' | 'private' | 'followers'
  likes_count: number
  comments_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
  author?: {
    id: string
    full_name: string
    avatar_url?: string
    is_verified: boolean
  }
}

export interface Comment {
  id: string
  user_id: string
  content: string
  likes_count: number
  created_at: string
  author: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

export interface InfluencerProfile {
  id: string
  user_id: string
  status: 'pending' | 'verified' | 'rejected'
  verification_level: 'bronze' | 'silver' | 'gold' | 'platinum'
  specialty_areas: string[]
  follower_count: number
  engagement_rate: number
  commission_rate: number
  total_earnings: number
  created_at: string
}

export interface WeatherData {
  temperature: number
  humidity: number
  uv_index: number
  air_quality: number
  location: string
  conditions: string
}

export interface RoutineRecommendation {
  id: string
  title: string
  description: string
  steps: RoutineStep[]
  weather_conditions: string[]
  skin_types: string[]
  time_of_day: 'morning' | 'evening' | 'anytime'
}

export interface RoutineStep {
  id: string
  step_number: number
  product_category: string
  instruction: string
  duration?: string
  products?: Product[]
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price_min?: number
  price_max?: number
  currency: string
  image_url?: string
  rating?: number
  review_count: number
  key_ingredients: string[]
  skin_types: string[]
  concerns_addressed: string[]
  affiliate_url?: string
}

export interface UserProductLibrary {
  id: string
  user_id: string
  product_id: string
  status: 'current' | 'finished' | 'wishlist'
  rating?: number
  review?: string
  purchase_date?: string
  finish_date?: string
  repurchase_intent: boolean
}

export interface Reminder {
  id: string
  user_id: string
  type: 'routine' | 'product' | 'weather' | 'restock'
  title: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  time?: string
  is_active: boolean
  created_at: string
}

export interface CreatorStats {
  level: 'newcomer' | 'rising' | 'expert' | 'master'
  total_posts: number
  total_likes: number
  total_followers: number
  engagement_rate: number
  earnings_this_month: number
  total_earnings: number
  commission_rate: number
}

export interface AnalysisResults {
  analysis: {
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
  }
  detailed_analysis?: {
    strengths?: string[]
    concerns?: string[]
    recommendations?: string[]
  }
  lifestyle_impact?: {
    sleep_factor?: string
    stress_factor?: string
    diet_factor?: string
    exercise_factor?: string
  }
  analysis_id?: string
  processing_time?: string
}