import { supabase } from '@/lib/supabase'
import { SkincareDiary, DiaryComment, DiaryInteraction, UserFollow } from '@/lib/supabase'

export interface CommunityPost {
  id: string
  user_id: string
  title: string
  content?: string
  before_photo_url?: string
  after_photo_url?: string
  tags?: string[]
  privacy_setting: string
  likes_count: number
  comments_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
  // Additional fields for display
  author_name?: string
  author_avatar?: string
  user_has_liked?: boolean
}

export interface TrendingContent {
  id: string
  title: string
  type: 'product' | 'routine' | 'tip'
  engagement_score: number
  content: string
  image_url?: string
  author?: string
  created_at: string
}

export const communityService = {
  // Skincare Diaries
  async getSkincareeDiaries(limit: number = 20, offset: number = 0): Promise<CommunityPost[]> {
    try {
      const { data, error } = await supabase
        .from('skincare_diaries')
        .select('*')
        .eq('privacy_setting', 'public')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      
      // Get user profiles for author information
      const userIds = [...new Set(data?.map(diary => diary.user_id) || [])]
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds)

      // Combine diary data with author information
      return (data || []).map(diary => ({
        ...diary,
        author_name: profiles?.find(p => p.user_id === diary.user_id)?.full_name || 'Anonymous',
        author_avatar: profiles?.find(p => p.user_id === diary.user_id)?.avatar_url
      }))
    } catch (error: any) {
      console.error('Error fetching skincare diaries:', error)
      throw new Error('Failed to fetch skincare diaries')
    }
  },

  async getFeaturedDiaries(limit: number = 10): Promise<CommunityPost[]> {
    try {
      const { data, error } = await supabase
        .from('skincare_diaries')
        .select('*')
        .eq('privacy_setting', 'public')
        .eq('is_featured', true)
        .order('likes_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      
      // Get user profiles for author information
      const userIds = [...new Set(data?.map(diary => diary.user_id) || [])]
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds)

      return (data || []).map(diary => ({
        ...diary,
        author_name: profiles?.find(p => p.user_id === diary.user_id)?.full_name || 'Anonymous',
        author_avatar: profiles?.find(p => p.user_id === diary.user_id)?.avatar_url
      }))
    } catch (error: any) {
      console.error('Error fetching featured diaries:', error)
      throw new Error('Failed to fetch featured diaries')
    }
  },

  async getUserDiaries(userId: string): Promise<CommunityPost[]> {
    try {
      const { data, error } = await supabase
        .from('skincare_diaries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('Error fetching user diaries:', error)
      throw new Error('Failed to fetch user diaries')
    }
  },

  async createDiary(userId: string, diary: Omit<SkincareDiary, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SkincareDiary> {
    try {
      const { data, error } = await supabase
        .from('skincare_diaries')
        .insert({
          user_id: userId,
          ...diary,
          likes_count: 0,
          comments_count: 0,
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error creating diary:', error)
      throw new Error('Failed to create diary entry')
    }
  },

  // Diary Interactions
  async likeDiary(userId: string, diaryId: string): Promise<void> {
    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('diary_interactions')
        .select('id')
        .eq('user_id', userId)
        .eq('diary_id', diaryId)
        .eq('interaction_type', 'like')
        .maybeSingle()

      if (existing) {
        // Unlike
        await supabase
          .from('diary_interactions')
          .delete()
          .eq('id', existing.id)

        // Decrement likes count
        await supabase.rpc('decrement_diary_likes', { diary_id: diaryId })
      } else {
        // Like
        await supabase
          .from('diary_interactions')
          .insert({
            user_id: userId,
            diary_id: diaryId,
            interaction_type: 'like',
            created_at: new Date().toISOString()
          })

        // Increment likes count
        await supabase.rpc('increment_diary_likes', { diary_id: diaryId })
      }
    } catch (error: any) {
      console.error('Error toggling diary like:', error)
      throw new Error('Failed to update like status')
    }
  },

  // Comments
  async getDiaryComments(diaryId: string): Promise<DiaryComment[]> {
    try {
      const { data, error } = await supabase
        .from('diary_comments')
        .select('*')
        .eq('diary_id', diaryId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('Error fetching diary comments:', error)
      throw new Error('Failed to fetch comments')
    }
  },

  async addDiaryComment(userId: string, diaryId: string, content: string): Promise<DiaryComment> {
    try {
      const { data, error } = await supabase
        .from('diary_comments')
        .insert({
          user_id: userId,
          diary_id: diaryId,
          content,
          likes_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      
      // Increment comments count on diary
      await supabase.rpc('increment_diary_comments', { diary_id: diaryId })
      
      return data
    } catch (error: any) {
      console.error('Error adding diary comment:', error)
      throw new Error('Failed to add comment')
    }
  },

  // Trending Content
  async getTrendingContent(limit: number = 20): Promise<TrendingContent[]> {
    try {
      // Get trending diaries based on recent engagement
      const { data, error } = await supabase
        .from('skincare_diaries')
        .select('*')
        .eq('privacy_setting', 'public')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('likes_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      
      // Transform to trending content format
      return (data || []).map(diary => ({
        id: diary.id,
        title: diary.title,
        type: 'routine' as const,
        engagement_score: diary.likes_count + diary.comments_count * 2,
        content: diary.content || '',
        image_url: diary.before_photo_url || diary.after_photo_url,
        author: 'Community Member',
        created_at: diary.created_at
      }))
    } catch (error: any) {
      console.error('Error fetching trending content:', error)
      throw new Error('Failed to fetch trending content')
    }
  },

  // User Following
  async followUser(followerId: string, followingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: followerId,
          following_id: followingId,
          created_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error: any) {
      console.error('Error following user:', error)
      throw new Error('Failed to follow user')
    }
  },

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId)

      if (error) throw error
    } catch (error: any) {
      console.error('Error unfollowing user:', error)
      throw new Error('Failed to unfollow user')
    }
  },

  async getUserFollowing(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', userId)

      if (error) throw error
      return data?.map(follow => follow.following_id) || []
    } catch (error: any) {
      console.error('Error fetching user following:', error)
      return []
    }
  }
}
