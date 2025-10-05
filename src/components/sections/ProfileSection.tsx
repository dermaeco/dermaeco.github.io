import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { User, Calendar, Trash2, Eye, AlertCircle } from 'lucide-react'
import { getScoreLabel } from '@/lib/utils'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface AnalysisData {
  overall_level?: string
  overall_summary?: string
  skin_type?: string
  skin_age_estimate?: number
  wrinkles_score?: number
  spots_score?: number
  acne_score?: number
}

interface SkinAnalysis {
  id: string
  created_at: string
  image_url: string
  user_id: string
  questionnaire_data: any
  analysis_data: any
}

interface ProfileSectionProps {
  onViewAnalysis: (analysisId: string) => void
  onCompare: () => void
  onBack: () => void
}

export function ProfileSection({ onViewAnalysis, onCompare, onBack }: ProfileSectionProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState<SkinAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{ full_name?: string; email?: string } | null>(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchAnalyses()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }
  }

  const fetchAnalyses = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('skin_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching analyses:', error)
      toast.error('Failed to load analysis history')
    } else {
      setAnalyses(data || [])
    }
    setLoading(false)
  }

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return

    const { error } = await supabase
      .from('skin_analyses')
      .delete()
      .eq('id', analysisId)

    if (error) {
      toast.error('Failed to delete analysis')
    } else {
      toast.success('Analysis deleted successfully')
      fetchAnalyses()
    }
  }

  if (!user) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-4xl">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">
              Sign In Required
            </h2>
            <p className="text-stone-600 mb-6">
              Please sign in to view your profile and analysis history
            </p>
            <Button onClick={onBack}>Go Back</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="wabi-section">
      <div className="wabi-container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Button onClick={onBack} variant="outline" className="mb-4">
              ← Back
            </Button>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mb-2">
              My Profile
            </h1>
            <p className="text-stone-600">Manage your account and view your skin analysis history</p>
          </div>

          {/* Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-stone-600">Email</label>
                  <p className="font-medium text-stone-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-stone-600">Name</label>
                  <p className="font-medium text-stone-900">
                    {profile?.full_name || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-stone-600">Member Since</label>
                  <p className="font-medium text-stone-900">
                    {format(new Date(user.created_at || Date.now()), 'MMMM yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Analysis History ({analyses.length})
                </CardTitle>
                {analyses.length >= 2 && (
                  <Button onClick={onCompare} variant="outline" size="sm">
                    Compare Analyses
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-stone-900 rounded-full mx-auto mb-4" />
                  <p className="text-stone-600">Loading your analyses...</p>
                </div>
              ) : analyses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-stone-600 mb-4">No analyses yet</p>
                  <Button onClick={() => onViewAnalysis('new')}>
                    Start Your First Analysis
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyses.map((analysis, index) => {
                    const analysisData: AnalysisData = (analysis.analysis_data as any)?.analysis || {}
                    return (
                      <motion.div
                        key={analysis.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                          <CardContent className="p-4">
                            {/* Image Preview */}
                            <div className="aspect-square rounded-lg overflow-hidden mb-3">
                              <img
                                src={analysis.image_url}
                                alt="Analysis"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Analysis Info */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-stone-500">
                                  {format(new Date(analysis.created_at), 'MMM d, yyyy')}
                                </span>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${
                                  analysisData.overall_level === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                                  analysisData.overall_level === 'Good' ? 'bg-amber-100 text-amber-700' :
                                  analysisData.overall_level === 'Fair' ? 'bg-orange-100 text-orange-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {analysisData.overall_level || 'N/A'}
                                </span>
                              </div>

                              <p className="text-sm text-stone-600 line-clamp-2">
                                {analysisData.overall_summary || 'No summary available'}
                              </p>

                              {analysisData.skin_type && (
                                <p className="text-xs text-stone-500">
                                  Skin Type: <span className="font-medium capitalize">{analysisData.skin_type}</span>
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => onViewAnalysis(analysis.id)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAnalysis(analysis.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
