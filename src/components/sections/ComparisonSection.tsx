import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getScoreColor, getScoreBgColor, getScoreLabel } from '@/lib/utils'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface Analysis {
  id: string
  created_at: string
  image_url: string
  analysis_data: any
}

interface ComparisonSectionProps {
  onBack: () => void
}

export function ComparisonSection({ onBack }: ComparisonSectionProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [analysis1, setAnalysis1] = useState<Analysis | null>(null)
  const [analysis2, setAnalysis2] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAnalyses()
    }
  }, [user])

  const fetchAnalyses = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('skin_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching analyses:', error)
      toast.error('Failed to load analyses')
    } else {
      setAnalyses(data || [])
      // Auto-select first two if available
      if (data && data.length >= 2) {
        setAnalysis1(data[1]) // Older one
        setAnalysis2(data[0]) // Newer one
      }
    }
    setLoading(false)
  }

  const getScoreDifference = (score1: number | undefined, score2: number | undefined) => {
    if (score1 === undefined || score2 === undefined) return null
    return score2 - score1
  }

  const renderTrend = (diff: number | null) => {
    if (diff === null) return null
    
    if (diff < 0) {
      // Improvement (less problems)
      return (
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-medium">{Math.abs(diff).toFixed(1)} better</span>
        </div>
      )
    } else if (diff > 0) {
      // Worsening (more problems)
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">{diff.toFixed(1)} worse</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-stone-500">
          <Minus className="w-4 h-4" />
          <span className="text-sm">No change</span>
        </div>
      )
    }
  }

  if (!user) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-4xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">
              {t('comparison.signInRequired')}
            </h2>
            <p className="text-stone-600 mb-6">
              {t('comparison.signInMessage')}
            </p>
            <Button onClick={onBack}>{t('common.goBack')}</Button>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-6xl">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-stone-900 rounded-full mx-auto mb-4" />
            <p className="text-stone-600">{t('comparison.loading')}</p>
          </div>
        </div>
      </section>
    )
  }

  if (analyses.length < 2) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-6xl">
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">
              {t('comparison.notEnough')}
            </h2>
            <p className="text-stone-600 mb-6">
              {t('comparison.notEnoughMessage')}
            </p>
          </div>
        </div>
      </section>
    )
  }

  const data1 = analysis1?.analysis_data?.analysis
  const data2 = analysis2?.analysis_data?.analysis

  const metrics = [
    { key: 'wrinkles_score', label: 'Wrinkles & Fine Lines' },
    { key: 'spots_score', label: 'Dark Spots' },
    { key: 'acne_score', label: 'Acne & Blemishes' },
    { key: 'texture_score', label: 'Texture Unevenness' },
    { key: 'hydration_score', label: 'Dryness' },
    { key: 'pores_score', label: 'Pore Visibility' },
  ]

  return (
    <section className="wabi-section">
      <div className="wabi-container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mb-2">
            {t('comparison.title')}
          </h1>
          <p className="text-stone-600 mb-8">{t('comparison.subtitle')}</p>

          {/* Analysis Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('comparison.before')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={analysis1?.id || ''}
                  onValueChange={(value) => {
                    const selected = analyses.find(a => a.id === value)
                    setAnalysis1(selected || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an analysis" />
                  </SelectTrigger>
                  <SelectContent>
                    {analyses.map((analysis) => (
                      <SelectItem key={analysis.id} value={analysis.id}>
                        {format(new Date(analysis.created_at), 'MMM d, yyyy - h:mm a')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('comparison.after')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={analysis2?.id || ''}
                  onValueChange={(value) => {
                    const selected = analyses.find(a => a.id === value)
                    setAnalysis2(selected || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an analysis" />
                  </SelectTrigger>
                  <SelectContent>
                    {analyses.map((analysis) => (
                      <SelectItem key={analysis.id} value={analysis.id}>
                        {format(new Date(analysis.created_at), 'MMM d, yyyy - h:mm a')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {analysis1 && analysis2 && (
            <>
              {/* Images Comparison */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{t('comparison.visualComparison')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-stone-600 mb-2">
                        {format(new Date(analysis1.created_at), 'MMMM d, yyyy')}
                      </p>
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={analysis1.image_url}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-stone-600 mb-2">
                        {format(new Date(analysis2.created_at), 'MMMM d, yyyy')}
                      </p>
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={analysis2.image_url}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('comparison.metricsComparison')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.map((metric) => {
                      const score1 = data1?.[metric.key]
                      const score2 = data2?.[metric.key]
                      const diff = getScoreDifference(score1, score2)

                      return (
                        <div key={metric.key} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-stone-900">{metric.label}</h4>
                            {renderTrend(diff)}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-4 ${getScoreBgColor(score1 || 5)}`}>
                                <span className={`text-2xl font-bold ${getScoreColor(score1 || 5)}`}>
                                  {score1 || 'N/A'}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 mt-2">{getScoreLabel(score1 || 5)}</p>
                            </div>
                            <div className="text-center">
                              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-4 ${getScoreBgColor(score2 || 5)}`}>
                                <span className={`text-2xl font-bold ${getScoreColor(score2 || 5)}`}>
                                  {score2 || 'N/A'}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 mt-2">{getScoreLabel(score2 || 5)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
