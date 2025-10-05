import React, { useState, useEffect } from 'react'
import { Star, TrendingUp, Users, DollarSign, Award, Crown, Verified } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { influencerService, productService, creatorStatsService, InfluencerProfile, Product, CreatorStats } from '@/services/supabase'
import toast from 'react-hot-toast'

interface InfluencerSectionProps {
  onApplyInfluencer?: () => void
  onViewProduct?: (productId: string) => void
}

export function InfluencerSection({ onApplyInfluencer, onViewProduct }: InfluencerSectionProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'apply' | 'dashboard'>('browse')
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerProfile | null>(null)
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [influencersData, productsData, statsData] = await Promise.all([
          influencerService.getAll(),
          productService.getAll(),
          creatorStatsService.getStats()
        ])
        
        setInfluencers(influencersData)
        setProducts(productsData)
        setCreatorStats(statsData)
      } catch (error) {
        console.error('Error fetching influencer data:', error)
        toast.error('Failed to load influencer data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const tabs = [
    { key: 'browse', label: 'Browse Influencers', icon: Users },
    { key: 'apply', label: 'Become Influencer', icon: Crown },
    { key: 'dashboard', label: 'Earnings Center', icon: DollarSign }
  ]

  const getLevelBadge = (level: string) => {
    const badges = {
      'bronze': { color: 'bg-orange-100 text-orange-700', label: 'Bronze Influencer' },
      'silver': { color: 'bg-gray-100 text-gray-700', label: 'Silver Influencer' },
      'gold': { color: 'bg-yellow-100 text-yellow-700', label: 'Gold Influencer' },
      'platinum': { color: 'bg-purple-100 text-purple-700', label: 'Platinum Influencer' }
    }
    return badges[level as keyof typeof badges] || badges.bronze
  }

  const getCreatorLevelInfo = (level: string) => {
    const levels = {
      'newcomer': { label: 'Newcomer Creator', color: 'text-green-600', icon: '🌱' },
      'rising': { label: 'Rising Star Creator', color: 'text-blue-600', icon: '⭐' },
      'expert': { label: 'Expert Creator', color: 'text-purple-600', icon: '💎' },
      'master': { label: 'Master Creator', color: 'text-yellow-600', icon: '👑' }
    }
    return levels[level as keyof typeof levels] || levels.newcomer
  }

  return (
    <section className="bg-stone-50 py-16">
      <div className="wabi-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-stone-900 mb-4">
            Influencer Platform
          </h2>
          <p className="text-stone-600 text-lg font-light max-w-2xl mx-auto">
            Connect professional influencers with users, building a beautiful ecosystem together
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 rounded ${
                    activeTab === tab.key
                      ? 'bg-black text-white'
                      : 'text-stone-600 hover:text-black'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <Crown className="w-12 h-12 text-stone-400 mx-auto mb-4 animate-pulse" />
            <p className="text-stone-600">Loading influencer platform...</p>
          </div>
        ) : (
          <>
            {activeTab === 'browse' && <InfluencerBrowse influencers={influencers} />}
            {activeTab === 'apply' && <InfluencerApplication onApply={onApplyInfluencer} />}
            {activeTab === 'dashboard' && <CreatorDashboard stats={creatorStats} />}
          </>
        )}
      </div>
    </section>
  )
}

// Browse Influencers Component
function InfluencerBrowse({ influencers }: { influencers: InfluencerProfile[] }) {
  return (
    <div>
      {influencers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">No Influencers Available</h3>
          <p className="text-stone-600">Check back later for new influencer profiles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {influencers.map((influencer) => (
            <InfluencerCard key={influencer.id} influencer={influencer} />
          ))}
        </div>
      )}
    </div>
  )
}

// Influencer Card Component
function InfluencerCard({ influencer }: { influencer: InfluencerProfile }) {
  const levelBadge = getLevelBadge(influencer.verification_level)
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-stone-600" />
            </div>
            <div>
              <h3 className="font-medium text-stone-900">Influencer Shops</h3>
              <span className={`text-xs px-2 py-1 rounded ${levelBadge.color}`}>
                {levelBadge.label}
              </span>
            </div>
          </div>
          <Verified className="w-5 h-5 text-blue-500" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-stone-900">
              {influencer.follower_count.toLocaleString()}
            </div>
            <div className="text-xs text-stone-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-stone-900">
              {influencer.engagement_rate}%
            </div>
            <div className="text-xs text-stone-600">Engagement Rate</div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="text-sm text-stone-600 mb-2">Specialties</div>
          <div className="flex flex-wrap gap-1">
            {influencer.specialty_areas.slice(0, 3).map((area, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Commission */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-stone-600">Commission Rate</span>
          <span className="font-medium text-green-600">
            {influencer.commission_rate}%
          </span>
        </div>

        <Button className="w-full bg-black text-white hover:bg-stone-800">
          Enter Shop
        </Button>
      </div>
    </div>
  )
}

// Influencer Application Component
function InfluencerApplication({ onApply }: { onApply?: () => void }) {
  const requirements = [
    'Have 500+ Followers or relevant professional experience',
    'Possess professional skincare knowledge and experience',
    'Able to create high-quality content regularly',
    'Comply with platform content guidelines and values'
  ]

  const benefits = [
    { icon: <DollarSign className="w-5 h-5" />, title: 'High Commission', desc: '10-20% product sales commission' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Traffic Support', desc: 'Platform exclusive traffic support' },
    { icon: <Award className="w-5 h-5" />, title: 'Brand Partnerships', desc: 'Priority access to brand partnership opportunities' },
    { icon: <Star className="w-5 h-5" />, title: 'Professional Certification', desc: 'Get platform certification badge' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Application Form */}
        <div className="bg-white rounded-lg p-8">
          <h3 className="text-2xl font-light text-stone-900 mb-6">
            Apply to become an influencer
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Personal Introduction
              </label>
              <textarea
                className="w-full p-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                rows={4}
                placeholder="Please introduce your skincare professional background and experience..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Specialties
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Anti-aging Skincare', 'Sensitive Skin Care', 'Ingredient Analysis', 'Affordable Skincare', 'Luxury Skincare', 'Traditional Medicine Skincare'].map((area) => (
                  <label key={area} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-stone-700">{area}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Social Media Links
              </label>
              <input
                type="url"
                className="w-full p-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            
            <Button 
              onClick={onApply}
              className="w-full bg-black text-white hover:bg-stone-800 py-3"
            >
              Submit Application
            </Button>
          </div>
        </div>

        {/* Benefits & Requirements */}
        <div className="space-y-8">
          {/* Benefits */}
          <div className="bg-white rounded-lg p-6">
            <h4 className="text-xl font-medium text-stone-900 mb-6">
              Influencer Benefits
            </h4>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-stone-600">{benefit.icon}</div>
                  <div>
                    <div className="font-medium text-stone-900 text-sm">
                      {benefit.title}
                    </div>
                    <div className="text-stone-600 text-sm">
                      {benefit.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg p-6">
            <h4 className="text-xl font-medium text-stone-900 mb-6">
              Application Requirements
            </h4>
            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-stone-700 text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Creator Dashboard Component
function CreatorDashboard({ stats }: { stats: CreatorStats | null }) {
  if (!stats) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-stone-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-stone-900 mb-2">No Creator Data Available</h3>
        <p className="text-stone-600">Apply to become an influencer to view your dashboard</p>
      </div>
    )
  }
  const levelInfo = getCreatorLevelInfo(stats.level)
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Level & Overview */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-700 rounded-lg p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-light mb-2">
              Creator Center
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{levelInfo.icon}</span>
              <span className={`font-medium ${levelInfo.color}`}>
                {levelInfo.label}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light">
              ${stats.total_earnings.toLocaleString()}
            </div>
            <div className="text-stone-300">Total Earnings</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-stone-600">Monthly Earnings</span>
          </div>
          <div className="text-2xl font-semibold text-stone-900">
            ${stats.earnings_this_month.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-stone-600">Followers Count</span>
          </div>
          <div className="text-2xl font-semibold text-stone-900">
            {stats.total_followers.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-stone-600">Engagement Rate</span>
          </div>
          <div className="text-2xl font-semibold text-stone-900">
            {stats.engagement_rate}%
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-stone-600">Commission Rate</span>
          </div>
          <div className="text-2xl font-semibold text-stone-900">
            {stats.commission_rate}%
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="bg-black text-white hover:bg-stone-800 py-4">
          Create New Content
        </Button>
        <Button variant="outline" className="py-4">
          Manage Product Library
        </Button>
        <Button variant="outline" className="py-4">
          View Data Analytics
        </Button>
      </div>
    </div>
  )
}

function getLevelBadge(level: string) {
  const badges = {
    'bronze': { color: 'bg-orange-100 text-orange-700', label: 'Bronze Influencer' },
    'silver': { color: 'bg-gray-100 text-gray-700', label: 'Silver Influencer' },
    'gold': { color: 'bg-yellow-100 text-yellow-700', label: 'Gold Influencer' },
    'platinum': { color: 'bg-purple-100 text-purple-700', label: 'Platinum Influencer' }
  }
  return badges[level as keyof typeof badges] || badges.bronze
}

function getCreatorLevelInfo(level: string) {
  const levels = {
    'newcomer': { label: 'Newcomer Creator', color: 'text-green-600', icon: '🌱' },
    'rising': { label: 'Rising Star Creator', color: 'text-blue-600', icon: '⭐' },
    'expert': { label: 'Expert Creator', color: 'text-purple-600', icon: '💎' },
    'master': { label: 'Master Creator', color: 'text-yellow-600', icon: '👑' }
  }
  return levels[level as keyof typeof levels] || levels.newcomer
}