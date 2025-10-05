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
  Clock
} from 'lucide-react'
import { getScoreColor, getScoreBgColor, getScoreLabel } from '@/lib/utils'
import { AnalysisResults } from '@/types'

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
  
  if (!results) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">
              分析结果未找到
            </h2>
            <p className="text-stone-600 mb-6">请重新进行分析</p>
            {onBack && (
              <Button onClick={onBack} variant="outline">
                返回
              </Button>
            )}
          </div>
        </div>
      </section>
    )
  }
  
  if (isLoading) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-4xl">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-gray-200 border-t-sage-500 rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">
              {t('results.processing')}
            </h2>
            <p className="text-stone-600">This may take a few moments...</p>
          </div>
        </div>
      </section>
    )
  }
  
  const analysis = results.analysis || {}
  const detailed = results.detailed_analysis || {}
  
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mb-4">
              {t('results.title')}
            </h2>
            <p className="text-lg text-stone-600">Powered by advanced AI analysis</p>
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
                
                {/* Overall Score */}
                <div className="text-center">
                  <h3 className="text-lg font-serif font-semibold text-stone-900 mb-4">
                    {t('results.overall_score')}
                  </h3>
                  <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 ${
                    getScoreBgColor(analysis.overall_score || 5)
                  }`}>
                    <span className={`text-3xl font-bold ${
                      getScoreColor(analysis.overall_score || 5)
                    }`}>
                      {analysis.overall_score || 'N/A'}
                    </span>
                  </div>
                  <p className={`font-medium ${
                    getScoreColor(analysis.overall_score || 5)
                  }`}>
                    {getScoreLabel(analysis.overall_score || 5)}
                  </p>
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
                        {analysis.skin_age_estimate} years
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
                <CardTitle>{t('results.detailed')}</CardTitle>
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
                          {getScoreLabel(category.score || 5)}
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
                      <CardTitle className="text-lg">Strengths</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {detailed.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-stone-700">{strength}</span>
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
                      <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {detailed.concerns.map((concern, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-stone-700">{concern}</span>
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
                  <CardTitle>AI Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {detailed.recommendations.slice(0, 3).map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-gray-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-stone-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <Button onClick={onViewRecommendations} className="flex-1">
                    {t('results.recommendations')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="secondary" onClick={onStartOver}>
                    New Analysis
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
