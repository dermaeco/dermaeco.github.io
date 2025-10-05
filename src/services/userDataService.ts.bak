import { supabase } from '@/integrations/supabase/client'
import { UserProduct, WeatherRoutine, Notification } from '@/lib/supabase'

export interface UserProductInput {
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
}

export interface UserRoutine {
  id: string
  user_id: string
  time_of_day: string
  steps: RoutineStep[]
  created_at: string
  updated_at: string
}

export interface RoutineStep {
  id: string
  step_number: number
  product_category: string
  product_name?: string
  instruction?: string
  duration?: string
}

export interface UserReminder {
  id: string
  user_id: string
  title: string
  description?: string
  reminder_time: string
  frequency: string
  is_active: boolean
  created_at: string
}

export const userDataService = {
  // User Products Library
  async getUserProducts(userId: string): Promise<UserProduct[]> {
    try {
      const { data, error } = await supabase
        .from('user_products')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('Error fetching user products:', error)
      throw new Error('Failed to fetch product library')
    }
  },

  async addUserProduct(userId: string, product: UserProductInput): Promise<UserProduct> {
    try {
      const { data, error } = await supabase
        .from('user_products')
        .insert({
          user_id: userId,
          ...product,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error adding user product:', error)
      throw new Error('Failed to add product to library')
    }
  },

  async updateUserProduct(productId: string, updates: Partial<UserProductInput>): Promise<UserProduct> {
    try {
      const { data, error } = await supabase
        .from('user_products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error updating user product:', error)
      throw new Error('Failed to update product')
    }
  },

  async removeUserProduct(productId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_products')
        .update({ is_active: false })
        .eq('id', productId)

      if (error) throw error
    } catch (error: any) {
      console.error('Error removing user product:', error)
      throw new Error('Failed to remove product')
    }
  },

  // User Routines
  async getUserRoutines(userId: string): Promise<any> {
    try {
      // Get morning routine
      const { data: morningData, error: morningError } = await supabase
        .from('routine_recommendations')
        .select(`
          *,
          steps:routine_steps(*)
        `)
        .eq('time_of_day', 'morning')
        .limit(1)
        .maybeSingle()

      // Get evening routine  
      const { data: eveningData, error: eveningError } = await supabase
        .from('routine_recommendations')
        .select(`
          *,
          steps:routine_steps(*)
        `)
        .eq('time_of_day', 'evening')
        .limit(1)
        .maybeSingle()

      if (morningError && morningError.code !== 'PGRST116') throw morningError
      if (eveningError && eveningError.code !== 'PGRST116') throw eveningError

      return {
        morning: morningData,
        evening: eveningData
      }
    } catch (error: any) {
      console.error('Error fetching user routines:', error)
      throw new Error('Failed to fetch routines')
    }
  },

  // User Reminders
  async getUserReminders(userId: string): Promise<UserReminder[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'reminder')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform notifications to reminder format
      return (data || []).map(notification => ({
        id: notification.id,
        user_id: notification.user_id,
        title: notification.title,
        description: notification.content,
        reminder_time: notification.scheduled_for || '08:00',
        frequency: notification.metadata?.frequency || 'daily',
        is_active: !notification.is_read,
        created_at: notification.created_at
      }))
    } catch (error: any) {
      console.error('Error fetching user reminders:', error)
      throw new Error('Failed to fetch reminders')
    }
  },

  async createUserReminder(userId: string, reminder: Omit<UserReminder, 'id' | 'user_id' | 'created_at'>): Promise<UserReminder> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'reminder',
          title: reminder.title,
          content: reminder.description,
          scheduled_for: reminder.reminder_time,
          is_read: !reminder.is_active,
          metadata: {
            frequency: reminder.frequency
          },
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      
      return {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.content,
        reminder_time: data.scheduled_for || '08:00',
        frequency: data.metadata?.frequency || 'daily',
        is_active: !data.is_read,
        created_at: data.created_at
      }
    } catch (error: any) {
      console.error('Error creating user reminder:', error)
      throw new Error('Failed to create reminder')
    }
  },

  async updateUserReminder(reminderId: string, updates: Partial<UserReminder>): Promise<UserReminder> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          title: updates.title,
          content: updates.description,
          scheduled_for: updates.reminder_time,
          is_read: updates.is_active !== undefined ? !updates.is_active : undefined,
          metadata: updates.frequency ? { frequency: updates.frequency } : undefined
        })
        .eq('id', reminderId)
        .select()
        .single()

      if (error) throw error
      
      return {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.content,
        reminder_time: data.scheduled_for || '08:00',
        frequency: data.metadata?.frequency || 'daily',
        is_active: !data.is_read,
        created_at: data.created_at
      }
    } catch (error: any) {
      console.error('Error updating user reminder:', error)
      throw new Error('Failed to update reminder')
    }
  },

  async deleteUserReminder(reminderId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', reminderId)

      if (error) throw error
    } catch (error: any) {
      console.error('Error deleting user reminder:', error)
      throw new Error('Failed to delete reminder')
    }
  },

  // Weather-based routines
  async getWeatherRoutine(userId: string): Promise<WeatherRoutine | null> {
    try {
      const { data, error } = await supabase
        .from('weather_routines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error fetching weather routine:', error)
      return null
    }
  }
}
