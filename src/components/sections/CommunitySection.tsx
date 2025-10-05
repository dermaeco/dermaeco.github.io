import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, TrendingUp, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface CommunitySectionProps {
  onCreateDiary?: () => void
  onApplyInfluencer?: () => void
  onViewProduct?: (productId: string) => void
  initialTab?: 'diaries' | 'trending'
  onBack?: () => void
}

export function CommunitySection({ 
  initialTab = 'diaries',
  onBack
}: CommunitySectionProps) {
  const { t } = useTranslation()

  // Mock data for guest mode
  const mockDiaries = [
    {
      id: '1',
      title: 'My 30-Day Vitamin C Journey',
      author: 'Sarah M.',
      avatar: '👩',
      date: '2 days ago',
      likes: 124,
      comments: 18,
      tags: ['Vitamin C', 'Brightening', 'Before & After'],
      preview: 'Seeing amazing results with my new vitamin C routine! My dark spots are fading...'
    },
    {
      id: '2',
      title: 'Retinol Beginners Guide',
      author: 'Emma L.',
      avatar: '👱‍♀️',
      date: '5 days ago',
      likes: 89,
      comments: 12,
      tags: ['Retinol', 'Anti-Aging', 'Tips'],
      preview: 'Started retinol last month and here\'s what I learned about avoiding irritation...'
    },
    {
      id: '3',
      title: 'Korean Skincare Routine Results',
      author: 'Lisa K.',
      avatar: '👧',
      date: '1 week ago',
      likes: 156,
      comments: 24,
      tags: ['K-Beauty', 'Hydration', 'Glass Skin'],
      preview: 'My complete 10-step Korean routine and the glowing results after 60 days...'
    }
  ]

  const mockTrending = [
    {
      id: '1',
      product: 'Eucerin Vitamin C Booster',
      mentions: 234,
      trend: '+45%',
      category: 'Serum',
      price: '€28-35'
    },
    {
      id: '2',
      product: 'La Roche-Posay Retinol',
      mentions: 189,
      trend: '+32%',
      category: 'Treatment',
      price: '€35-42'
    },
    {
      id: '3',
      product: 'Caudalie Vinoperfect',
      mentions: 145,
      trend: '+28%',
      category: 'Brightening',
      price: '€42-49'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            {initialTab === 'diaries' ? t('community.skincare_diaries') : t('community.trending_products')}
          </h1>
          <p className="text-muted-foreground">
            {initialTab === 'diaries' 
              ? t('community.share_discover')
              : t('community.discover_trending')
            }
          </p>
        </motion.div>

        {/* Guest Mode Notice */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              👋 {t('community.preview_notice')}
            </p>
          </CardContent>
        </Card>

        {/* Content */}
        {initialTab === 'diaries' && (
          <div className="grid gap-6">
            {mockDiaries.map((diary, index) => (
              <motion.div
                key={diary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                          {diary.avatar}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{diary.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {diary.author} • {diary.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{diary.preview}</p>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {diary.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <button 
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                        onClick={() => toast(t('community.signup_to_like'), { icon: '💝' })}
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{diary.likes}</span>
                      </button>
                      <button 
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                        onClick={() => toast(t('community.signup_to_comment'), { icon: '💬' })}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{diary.comments}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {initialTab === 'trending' && (
          <div className="grid gap-4">
            {mockTrending.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-gradient-to-r from-primary to-accent">
                            #{index + 1}
                          </Badge>
                          <h3 className="font-semibold text-lg">{item.product}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.price}</span>
                          <span>•</span>
                          <span>{item.mentions} {t('community.mentions')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-green-500 font-semibold">
                        <TrendingUp className="w-5 h-5" />
                        {item.trend}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
