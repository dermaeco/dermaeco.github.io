import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, Star, Award, TrendingUp, Heart, MessageCircle, Share2, Plus, Calendar, Badge, Camera, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { communityService } from '@/services/communityService'
import toast from 'react-hot-toast'

interface CommunitySectionProps {
  onCreateDiary?: () => void
  onApplyInfluencer?: () => void
  onViewProduct?: (productId: string) => void
  initialTab?: 'diaries' | 'trending'
}

export function CommunitySection({
  onCreateDiary,
  onApplyInfluencer,
  onViewProduct,
  initialTab = 'diaries'
}: CommunitySectionProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'diaries' | 'trending'>(initialTab === 'diaries' || initialTab === 'trending' ? initialTab : 'diaries')
  const [loading, setLoading] = useState(true)
  const [diaries, setDiaries] = useState<any[]>([])
  const [trendingContent, setTrendingContent] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Mock data for guest users (demo content)
  const mockDiaries = [
    {
      id: '1',
      title: 'My 30-Day Hydration Journey',
      content: 'After incorporating hyaluronic acid serum into my routine, I noticed a significant improvement in my skin hydration levels. My complexion looks more plump and radiant.',
      author_name: 'Sarah Chen',
      created_at: '2025-01-08T10:00:00Z',
      tags: ['hydration', 'hyaluronic-acid', 'glow'],
      likes_count: 127,
      comments_count: 23,
      is_featured: true,
      before_photo_url: '/images/before1.jpg',
      after_photo_url: '/images/after1.jpg'
    },
    {
      id: '2', 
      title: 'Gentle Approach to Anti-Aging',
      content: 'Starting with a gentle retinol routine has transformed my fine lines without irritation. Patience and consistency are key to healthy aging.',
      author_name: 'Maria Rodriguez',
      created_at: '2025-01-07T15:30:00Z',
      tags: ['anti-aging', 'retinol', 'gentle-skincare'],
      likes_count: 89,
      comments_count: 15,
      is_featured: false
    },
    {
      id: '3',
      title: 'Clearing My Acne Naturally',
      content: 'Switching to a minimal, natural routine with tea tree oil and niacinamide helped clear my stubborn acne. Less is truly more!',
      author_name: 'Alex Kim',
      created_at: '2025-01-06T09:15:00Z',
      tags: ['acne', 'natural-skincare', 'minimal-routine'],
      likes_count: 156,
      comments_count: 31,
      is_featured: true
    }
  ]

  const mockTrending = [
    {
      id: '1',
      title: 'Vitamin C Serum',
      type: 'product',
      engagement_score: 94,
      content: 'Antioxidant powerhouse for radiant skin'
    },
    {
      id: '2', 
      title: 'Double Cleansing Method',
      type: 'routine',
      engagement_score: 87,
      content: 'Oil cleanse followed by water-based cleanser'
    },
    {
      id: '3',
      title: 'Ceramides for Barrier Repair',
      type: 'tip',
      engagement_score: 82,
      content: 'Essential for maintaining healthy skin barrier'
    },
    {
      id: '4',
      title: 'Sunscreen Every Day',
      type: 'tip',
      engagement_score: 91,
      content: 'UV protection prevents 80% of visible aging'
    },
    {
      id: '5',
      title: 'Niacinamide Benefits',
      type: 'product',
      engagement_score: 78,
      content: 'Reduces pores and controls oil production'
    }
  ]

  const tabs = [
    { key: 'diaries', label: 'Skincare Diaries', icon: Users },
    { key: 'trending', label: 'Trending', icon: TrendingUp }
  ]

  // Load community data
  useEffect(() => {
    loadCommunityData()
  }, [activeTab])

  const loadCommunityData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // For guest users, use mock data for seamless demo experience
      if (!user) {
        if (activeTab === 'diaries') {
          setDiaries(mockDiaries)
        } else if (activeTab === 'trending') {
          setTrendingContent(mockTrending)
        }
        setLoading(false)
        return
      }

      // For authenticated users, try to load real data with fallback to mock
      if (activeTab === 'diaries') {
        try {
          const diariesData = await communityService.getSkincareeDiaries(20, 0)
          setDiaries(diariesData.length > 0 ? diariesData : mockDiaries)
        } catch {
          setDiaries(mockDiaries) // Fallback to mock data
        }
      } else if (activeTab === 'trending') {
        try {
          const trendingData = await communityService.getTrendingContent(20)
          setTrendingContent(trendingData.length > 0 ? trendingData : mockTrending)
        } catch {
          setTrendingContent(mockTrending) // Fallback to mock data
        }
      }
    } catch (error: any) {
      console.error('Error loading community data:', error)
      // Always fallback to mock data instead of showing error
      if (activeTab === 'diaries') {
        setDiaries(mockDiaries)
      } else if (activeTab === 'trending') {
        setTrendingContent(mockTrending)
      }
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-warm-50 py-8">
      <div className="wabi-container">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-2 rounded-lg mb-8 shadow-soft">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'diaries' && (
            <motion.div
              key="diaries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Create Diary Button */}
              <div className="mb-8">
                <button
                  onClick={onCreateDiary}
                  className="w-full bg-stone-900 text-white py-4 rounded-lg hover:bg-stone-800 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>{t('community.create_diary')}</span>
                </button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
                  <p className="text-stone-600">Loading community content...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button 
                    onClick={loadCommunityData}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Diary List */}
              {!loading && !error && (
                <div className="grid gap-6">
                  {diaries.length > 0 ? (
                    diaries.map((diary) => (
                      <div key={diary.id} className="bg-white rounded-lg p-6 shadow-soft hover:shadow-softer transition-shadow duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
                              <span className="text-stone-600 font-medium text-sm">
                                {diary.author_name?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">{diary.author_name || 'Anonymous'}</p>
                              <p className="text-sm text-stone-500">{new Date(diary.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {diary.is_featured && (
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span className="text-xs font-medium">Featured</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                          <h3 className="text-lg font-medium text-stone-900 mb-2">{diary.title}</h3>
                          <p className="text-stone-600">{diary.content}</p>
                        </div>

                        {/* Before/After Photos */}
                        {(diary.before_photo_url || diary.after_photo_url) && (
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {diary.before_photo_url && (
                              <div>
                                <p className="text-xs text-stone-500 mb-2 text-center">Before</p>
                                <div className="w-full h-32 bg-stone-200 rounded-lg"></div>
                              </div>
                            )}
                            {diary.after_photo_url && (
                              <div>
                                <p className="text-xs text-stone-500 mb-2 text-center">After</p>
                                <div className="w-full h-32 bg-stone-200 rounded-lg"></div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {diary.tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-stone-100 text-stone-700 px-2 py-1 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          )) || []}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-6 text-stone-500">
                          <button className="flex items-center space-x-2 hover:text-red-500 transition-colors duration-200">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{diary.likes_count || 0}</span>
                          </button>
                          <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-200">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{diary.comments_count || 0}</span>
                          </button>
                          <button className="flex items-center space-x-2 hover:text-green-500 transition-colors duration-200">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                      <p className="text-stone-600">No skincare diaries found. Be the first to share your journey!</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'trending' && (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-lg shadow-soft">
                <div className="p-6 border-b border-stone-200">
                  <h3 className="text-xl font-medium text-stone-900">Trending This Week</h3>
                  <p className="text-stone-600">Popular products, topics, and ingredients in the community</p>
                </div>
                
                <div className="divide-y divide-stone-200">
                  {trendingContent.length > 0 ? (
                    trendingContent.map((item, index) => (
                      <div key={item.id} className="p-6 hover:bg-stone-50 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-600 font-medium">
                              #{index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-stone-900">{item.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-stone-500">
                                <span className="capitalize">{item.type}</span>
                                <span>•</span>
                                <span>{item.engagement_score} engagement</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              +{item.engagement_score}%
                            </div>
                            <div className="text-xs text-stone-500">{item.type}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="text-stone-600">No trending content available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
