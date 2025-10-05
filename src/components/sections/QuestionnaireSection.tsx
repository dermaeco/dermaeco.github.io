import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Moon, Brain, Utensils, Dumbbell, Heart, Users, Wine } from 'lucide-react'

interface QuestionnaireData {
  sleep_hours: number
  stress_level: number
  diet_type: string
  exercise_frequency: string
  current_skincare_routine: string
  skin_concerns: string[]
  smoking_status: string
  alcohol_consumption: string
  environmental_factors: string[]
}

interface QuestionnaireSectionProps {
  onComplete: (data: QuestionnaireData) => void
  onBack: () => void
  isAnalyzing?: boolean
}

export function QuestionnaireSection({ onComplete, onBack, isAnalyzing }: QuestionnaireSectionProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<QuestionnaireData>({
    sleep_hours: 7,
    stress_level: 5,
    diet_type: 'balanced',
    exercise_frequency: 'weekly',
    current_skincare_routine: '',
    skin_concerns: [],
    smoking_status: 'never',
    alcohol_consumption: 'occasional',
    environmental_factors: []
  })
  
  const dietOptions = [
    { value: 'balanced', label: t('diet.balanced') },
    { value: 'vegetarian', label: t('diet.vegetarian') },
    { value: 'vegan', label: t('diet.vegan') },
    { value: 'mediterranean', label: t('diet.mediterranean') },
    { value: 'keto', label: t('diet.keto') },
    { value: 'other', label: t('diet.other') }
  ]
  
  const exerciseOptions = [
    { value: 'daily', label: t('exercise.daily') },
    { value: 'weekly', label: t('exercise.weekly') },
    { value: 'occasional', label: t('exercise.occasional') },
    { value: 'rarely', label: t('exercise.rarely') },
    { value: 'never', label: t('exercise.never') }
  ]
  
  const smokingOptions = [
    { value: 'never', label: t('smoking.never') },
    { value: 'former', label: t('smoking.former') },
    { value: 'occasional', label: t('smoking.occasional') },
    { value: 'regular', label: t('smoking.regular') }
  ]
  
  const alcoholOptions = [
    { value: 'none', label: t('alcohol.none') },
    { value: 'occasional', label: t('alcohol.occasional') },
    { value: 'moderate', label: t('alcohol.moderate') },
    { value: 'frequent', label: t('alcohol.frequent') }
  ]
  
  const skinConcerns = [
    { value: 'wrinkles', label: t('concerns.wrinkles') },
    { value: 'spots', label: t('concerns.spots') },
    { value: 'acne', label: t('concerns.acne') },
    { value: 'dryness', label: t('concerns.dryness') },
    { value: 'oiliness', label: t('concerns.oiliness') },
    { value: 'sensitivity', label: t('concerns.sensitivity') },
    { value: 'pores', label: t('concerns.pores') },
    { value: 'redness', label: t('concerns.redness') },
    { value: 'dark_circles', label: t('concerns.dark_circles') }
  ]
  
  const environmentalFactors = [
    { value: 'pollution', label: t('environment.pollution') },
    { value: 'sun_exposure', label: t('environment.sun_exposure') },
    { value: 'dry_climate', label: t('environment.dry_climate') },
    { value: 'humid_climate', label: t('environment.humid_climate') },
    { value: 'air_conditioning', label: t('environment.air_conditioning') },
    { value: 'heating', label: t('environment.heating') }
  ]
  
  const handleConcernToggle = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      skin_concerns: prev.skin_concerns.includes(concern)
        ? prev.skin_concerns.filter(c => c !== concern)
        : [...prev.skin_concerns, concern]
    }))
  }
  
  const handleEnvironmentToggle = (factor: string) => {
    setFormData(prev => ({
      ...prev,
      environmental_factors: prev.environmental_factors.includes(factor)
        ? prev.environmental_factors.filter(f => f !== factor)
        : [...prev.environmental_factors, factor]
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }
  
  return (
    <section className="wabi-section">
      <div className="wabi-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mb-4">
              {t('questionnaire.title')}
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {t('questionnaire.subtitle')}
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Sleep Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-stone-700 font-medium">
                      <Moon className="w-5 h-5 text-gray-600" />
                      <span>{t('questionnaire.sleep')}</span>
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      value={formData.sleep_hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, sleep_hours: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none slider"
                    />
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-600">{formData.sleep_hours}</span>
                      <span className="text-stone-600 ml-1">hours</span>
                    </div>
                  </div>
                  
                  {/* Stress Level */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-stone-700 font-medium">
                      <Brain className="w-5 h-5 text-gray-600" />
                      <span>{t('questionnaire.stress')}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.stress_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, stress_level: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none slider"
                    />
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-600">{formData.stress_level}</span>
                      <span className="text-stone-600 ml-1">/10</span>
                    </div>
                  </div>
                </div>
                
                {/* Diet Type */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-stone-700 font-medium">
                    <Utensils className="w-5 h-5 text-gray-600" />
                    <span>{t('questionnaire.diet')}</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dietOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, diet_type: option.value }))}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          formData.diet_type === option.value
                            ? 'bg-gray-100 border-gray-300 text-black'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Exercise Frequency */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-stone-700 font-medium">
                    <Dumbbell className="w-5 h-5 text-gray-600" />
                    <span>{t('questionnaire.exercise')}</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {exerciseOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, exercise_frequency: option.value }))}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          formData.exercise_frequency === option.value
                            ? 'bg-gray-100 border-gray-300 text-black'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Skin Concerns */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-stone-700 font-medium">
                    <Heart className="w-5 h-5 text-gray-600" />
                    <span>{t('questionnaire.concerns')}</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skinConcerns.map(concern => (
                      <button
                        key={concern.value}
                        type="button"
                        onClick={() => handleConcernToggle(concern.value)}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          formData.skin_concerns.includes(concern.value)
                            ? 'bg-gray-100 border-gray-300 text-black'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {concern.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Lifestyle Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Smoking */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-stone-700 font-medium">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span>{t('questionnaire.smoking')}</span>
                    </label>
                    <div className="space-y-2">
                      {smokingOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, smoking_status: option.value }))}
                          className={`w-full p-3 rounded-xl border transition-all duration-300 text-left ${
                            formData.smoking_status === option.value
                              ? 'bg-gray-100 border-gray-300 text-black'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Alcohol */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-stone-700 font-medium">
                      <Wine className="w-5 h-5 text-gray-600" />
                      <span>{t('questionnaire.alcohol')}</span>
                    </label>
                    <div className="space-y-2">
                      {alcoholOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, alcohol_consumption: option.value }))}
                          className={`w-full p-3 rounded-xl border transition-all duration-300 text-left ${
                            formData.alcohol_consumption === option.value
                              ? 'bg-gray-100 border-gray-300 text-black'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Environmental Factors */}
                <div className="space-y-3">
                  <label className="text-stone-700 font-medium">
                    {t('questionnaire.environment')}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {environmentalFactors.map(factor => (
                      <button
                        key={factor.value}
                        type="button"
                        onClick={() => handleEnvironmentToggle(factor.value)}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          formData.environmental_factors.includes(factor.value)
                            ? 'bg-gray-100 border-gray-300 text-black'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {factor.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Current Skincare Routine */}
                <div className="space-y-3">
                  <label className="text-stone-700 font-medium">
                    {t('questionnaire.skincare')}
                  </label>
                  <textarea
                    value={formData.current_skincare_routine}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_skincare_routine: e.target.value }))}
                    placeholder={t('questionnaire.skincare_placeholder')}
                    className="w-full p-4 bg-white/60 border border-stone-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 h-24 resize-none"
                  />
                </div>
                
                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onBack}
                    className="flex-1"
                  >
                    {t('common.back')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    {t('questionnaire.submit')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
