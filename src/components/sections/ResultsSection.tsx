import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Droplet, 
  Sun, 
  Sparkles, 
  Target,
  ArrowRight,
  Clock,
  Share2,
  Download
} from 'lucide-react'
import { getScoreColor, getScoreBgColor, getScoreLabel } from '@/lib/utils'
import { AnalysisResults } from '@/types'
import toast from 'react-hot-toast'

interface ResultsSectionProps {
  results: AnalysisResults | null
  imageUrl: string | null
  isLoading?: boolean
  onViewRecommendations: () => void
  onStartOver: () => void
  onBack?: () => void
}

export function ResultsSection({ 
  results, 
  imageUrl, 
  isLoading = false, 
  onViewRecommendations, 
  onStartOver,
  onBack
}: ResultsSectionProps) {
  const { t } = useTranslation()
  
  // Helper function to translate demo keys
  const translateIfKey = (text: string): string => {
    if (!text) return text
    // Check if it's a demo translation key
    if (text.startsWith('demo.')) {
      // Handle keys with parameters (e.g., "demo.sleep_factor|8")
      if (text.includes('|')) {
        const [key, value] = text.split('|')
        return t(key, { hours: value, level: value, type: value })
      }
      return t(text)
    }
    return text
  }
  
  // Check loading state FIRST before checking for results
  if (isLoading) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-4xl">
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-stone-200 border-t-stone-800 rounded-full mx-auto mb-8"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-stone-900 mb-4">
                {t('results.analyzing')}
              </h2>
              <p className="text-lg text-stone-600 mb-2">{t('results.analyzing_desc')}</p>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center space-x-2 text-stone-500"
              >
                <Brain className="w-5 h-5" />
                <span className="text-sm">{t('results.ai_working')}</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }
  
  // Then check if results exist
  if (!results) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">
              {t('results.no_results_title')}
            </h2>
            <p className="text-stone-600 mb-6">{t('results.no_results_desc')}</p>
            {onBack && (
              <Button onClick={onBack} variant="outline">
                {t('common.back')}
              </Button>
            )}
          </div>
        </div>
      </section>
    )
  }
  
  const analysis = results.analysis || {}
  const detailed = results.detailed_analysis || {}

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Skin Analysis Results',
          text: `Overall Skin Health: ${analysis.overall_level || 'N/A'}\n${analysis.overall_summary || ''}`,
          url: window.location.href
        })
        toast.success('Shared successfully!')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `My Skin Analysis Results\n\nOverall Health: ${analysis.overall_level || 'N/A'}\n${analysis.overall_summary || ''}\n\nCheck out DermaEco for your own skin analysis!`
      navigator.clipboard.writeText(shareText)
      toast.success('Results copied to clipboard!')
    }
  }

  const handleExport = () => {
    // Create a simple text export
    const exportData = {
      date: new Date().toISOString(),
      overall_level: analysis.overall_level,
      overall_summary: analysis.overall_summary,
      skin_type: analysis.skin_type,
      skin_age_estimate: analysis.skin_age_estimate,
      scores: {
        wrinkles: analysis.wrinkles_score,
        spots: analysis.spots_score,
        acne: analysis.acne_score,
        texture: analysis.texture_score,
        hydration: analysis.hydration_score,
        sebum: analysis.sebum_score,
      },
      strengths: detailed.strengths,
      concerns: detailed.concerns,
      recommendations: detailed.recommendations,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skin-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Analysis exported!')
  }
  
  const scoreCategories = [
    {
      key: 'wrinkles_score',
      label: t('analysis.wrinkles'),
      icon: Clock,
      score: analysis.wrinkles_score
    },
    {
      key: 'spots_score',
      label: t('analysis.spots'),
      icon: Sun,
      score: analysis.spots_score
    },
    {
      key: 'acne_score',
      label: t('analysis.acne'),
      icon: Target,
      score: analysis.acne_score
    },
    {
      key: 'texture_score',
      label: t('analysis.texture'),
      icon: Sparkles,
      score: analysis.texture_score
    },
    {
      key: 'hydration_score',
      label: t('analysis.hydration'),
      icon: Droplet,
      score: analysis.hydration_score
    },
    {
      key: 'sebum_score',
      label: t('analysis.sebum'),
      icon: Sun,
      score: analysis.sebum_score
    }
  ].filter(category => category.score !== undefined)
  
  return (
    <section className="wabi-section">
      <div className="wabi-container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mb-4">
                {t('results.title')}
              </h2>
              <p className="text-lg text-stone-600">{t('results.powered_by')}</p>
            </div>
            
            {/* Share and Export Buttons */}
            <div className="flex justify-center gap-3">
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                {t('results.share_results')}
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {t('results.export_data')}
              </Button>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image and Overall Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="p-6">
                <div className="aspect-square rounded-xl overflow-hidden mb-6">
                  <img 
                    src={imageUrl} 
                    alt="Analyzed skin" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overall Health */}
                <div className="text-center">
                  <h3 className="text-lg font-serif font-semibold text-stone-900 mb-4">
                    {t('results.overall_health')}
                  </h3>
                  <div className="mb-4">
                    <p className={`text-2xl font-bold mb-2 ${
                      analysis.overall_level === 'Excellent' ? 'text-emerald-600' :
                      analysis.overall_level === 'Good' ? 'text-amber-600' :
                      analysis.overall_level === 'Fair' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {analysis.overall_level === 'Excellent' ? t('results.score_excellent') :
                       analysis.overall_level === 'Good' ? t('results.score_good') :
                       analysis.overall_level === 'Fair' ? t('results.score_fair') :
                       analysis.overall_level || 'N/A'}
                    </p>
                    <p className="text-sm text-stone-600 text-left px-2">
                      {translateIfKey(analysis.overall_summary) || 'Analysis summary not available'}
                    </p>
                  </div>
                </div>
                
                {/* Skin Type and Age */}
                <div className="mt-6 space-y-3">
                  {analysis.skin_type && (
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">{t('results.skin_type')}:</span>
                      <span className="font-medium text-stone-900 capitalize">
                        {t(`skin_type.${analysis.skin_type}`)}
                      </span>
                    </div>
                  )}
                  {analysis.skin_age_estimate && (
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">{t('results.skin_age')}:</span>
                      <span className="font-medium text-stone-900">
                        {analysis.skin_age_estimate} {t('results.years')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Detailed Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('results.detailed_analysis')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scoreCategories.map((category, index) => {
                    const Icon = category.icon
                    return (
                      <motion.div
                        key={category.key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`p-4 rounded-xl border-2 ${
                          getScoreBgColor(category.score || 5)
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-5 h-5 ${
                              getScoreColor(category.score || 5)
                            }`} />
                            <span className="font-medium text-stone-900">
                              {category.label}
                            </span>
                          </div>
                          <span className={`text-xl font-bold ${
                            getScoreColor(category.score || 5)
                          }`}>
                            {category.score}/10
                          </span>
                        </div>
                        <div className="w-full bg-white/60 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              category.score && category.score <= 3 ? 'bg-emerald-500' :
                              category.score && category.score <= 5 ? 'bg-amber-500' :
                              category.score && category.score <= 7 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(category.score || 0) * 10}%` }}
                          />
                        </div>
                        <p className={`text-sm mt-2 ${
                          getScoreColor(category.score || 5)
                        }`}>
                          {category.score && category.score <= 3 ? t('results.score_excellent') :
                           category.score && category.score <= 5 ? t('results.score_good') :
                           category.score && category.score <= 7 ? t('results.score_fair') :
                           t('results.score_needs_attention')}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              {detailed.strengths && detailed.strengths.length > 0 && (
                <Card variant="glass">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-emerald-600" />
                      <CardTitle className="text-lg">{t('results.strengths')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {detailed.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-stone-700">{translateIfKey(strength)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {/* Concerns */}
              {detailed.concerns && detailed.concerns.length > 0 && (
                <Card variant="glass">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      <CardTitle className="text-lg">{t('results.areas_improvement')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {detailed.concerns.map((concern, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-stone-700">{translateIfKey(concern)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Recommendations Preview */}
        {detailed.recommendations && detailed.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-gray-600" />
                  <CardTitle>{t('results.ai_recommendations')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {detailed.recommendations.slice(0, 3).map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-gray-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-stone-700">{translateIfKey(recommendation)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <Button onClick={onViewRecommendations} className="flex-1">
                    {t('results.recommendations')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="secondary" onClick={onStartOver}>
                    {t('results.new_analysis')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}
