import { supabase } from '@/integrations/supabase/client'

// Types for our database entities
export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price_min: number
  price_max: number
  currency: string
  image_url?: string
  rating?: number
  review_count: number
  key_ingredients: string[]
  skin_types: string[]
  concerns_addressed: string[]
  affiliate_url?: string
  created_at: string
  updated_at: string
}

export interface SkincareEntry {
  id: string
  user_id: string
  title: string
  content?: string
  before_photo_url?: string
  after_photo_url?: string
  tags: string[]
  privacy_setting: string
  likes_count: number
  comments_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface RoutineRecommendation {
  id: string
  title: string
  description?: string
  weather_conditions: string[]
  skin_types: string[]
  time_of_day: string
  created_at: string
  updated_at: string
  steps?: RoutineStep[]
}

export interface RoutineStep {
  id: string
  routine_id: string
  step_number: number
  product_category?: string
  instruction?: string
  duration?: string
  created_at: string
}

export interface InfluencerProfile {
  id: string
  user_id?: string
  status: string
  verification_level?: string
  specialty_areas: string[]
  follower_count: number
  engagement_rate?: number
  commission_rate?: number
  total_earnings: number
  created_at: string
  updated_at: string
}

export interface UserProductLibrary {
  id: string
  user_id?: string
  product_id?: string
  product_name: string
  brand: string
  category: string
  status: string
  rating?: number
  review?: string
  purchase_date?: string
  repurchase_intent: boolean
  created_at: string
  updated_at: string
}

export interface CreatorStats {
  id: string
  user_id?: string
  level: string
  total_posts: number
  total_likes: number
  total_followers: number
  engagement_rate: number
  earnings_this_month: number
  total_earnings: number
  commission_rate: number
  created_at: string
  updated_at: string
}

// Product Services
export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getBySkinType(skinType: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .contains('skin_types', [skinType])
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

// Routine Services  
export const routineService = {
  async getAll(): Promise<RoutineRecommendation[]> {
    const { data, error } = await supabase
      .from('routine_recommendations')
      .select(`
        *,
        steps:routine_steps(id, step_number, product_category, instruction, duration)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByWeatherAndSkinType(weather: string[], skinTypes: string[]): Promise<RoutineRecommendation[]> {
    const { data, error } = await supabase
      .from('routine_recommendations')
      .select(`
        *,
        steps:routine_steps(id, step_number, product_category, instruction, duration)
      `)
      .overlaps('weather_conditions', weather)
      .overlaps('skin_types', skinTypes)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<RoutineRecommendation | null> {
    const { data, error } = await supabase
      .from('routine_recommendations')
      .select(`
        *,
        steps:routine_steps(id, step_number, product_category, instruction, duration)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

// Influencer Services
export const influencerService = {
  async getAll(): Promise<InfluencerProfile[]> {
    const { data, error } = await supabase
      .from('influencer_profiles')
      .select('*')
      .eq('status', 'verified')
      .order('follower_count', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<InfluencerProfile | null> {
    const { data, error } = await supabase
      .from('influencer_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  async getByUserId(userId: string): Promise<InfluencerProfile | null> {
    const { data, error } = await supabase
      .from('influencer_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  async updateEarnings(userId: string, earnings: number): Promise<void> {
    const { error } = await supabase
      .from('influencer_profiles')
      .update({ 
        total_earnings: earnings,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
    
    if (error) throw error
  }
}

// User Products Services
export const userProductService = {
  async getAll(): Promise<UserProductLibrary[]> {
    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByStatus(status: string): Promise<UserProductLibrary[]> {
    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

// Creator Stats Services
export const creatorStatsService = {
  async getStats(): Promise<CreatorStats | null> {
    const { data, error } = await supabase
      .from('creator_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .maybeSingle()
    
    if (error) throw error
    return data
  }
}

// Skincare Entry Services
export const skincareEntryService = {
  async getAll(): Promise<SkincareEntry[]> {
    const { data, error } = await supabase
      .from('skincare_entries')
      .select('*')
      .eq('privacy_setting', 'public')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getFeatured(): Promise<SkincareEntry[]> {
    const { data, error } = await supabase
      .from('skincare_entries')
      .select('*')
      .eq('is_featured', true)
      .eq('privacy_setting', 'public')
      .order('likes_count', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByUserId(userId: string): Promise<SkincareEntry[]> {
    const { data, error } = await supabase
      .from('skincare_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(entry: Omit<SkincareEntry, 'id' | 'created_at' | 'updated_at'>): Promise<SkincareEntry> {
    const { data, error } = await supabase
      .from('skincare_entries')
      .insert(entry)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}


