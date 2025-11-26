import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useGuestMode } from '@/hooks/useGuestMode'
import { supabase } from '@/lib/supabase'
import { AnalysisResults } from '@/types'
import { mockProducts } from '@/data/mockData'
import { generateScientificRecommendation } from '@/lib/ingredientBenefits'
import toast from 'react-hot-toast'

interface AnalysisData {
  analysis_id: string | null
  analysis_results: any
  processing_time: string
}

interface QuestionnaireData {
  sleep_hours?: number
  stress_level?: number
  diet_type?: string
  exercise_frequency?: string
  current_skincare_routine?: any
  skin_concerns?: string[]
  smoking_status?: string
  alcohol_consumption?: string
  environmental_factors?: string[]
  budget_level?: string
  product_preference?: string
}

export function useSkinAnalysis() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { isGuest } = useGuestMode()
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null)

  // Clear analysis data when user logs out
  useEffect(() => {
    if (!user && !isGuest) {
      setUploadedImageUrl(null)
      setAnalysisResults(null)
    }
  }, [user, isGuest])

  async function uploadImage(file: File): Promise<string> {
    if (!user && !isGuest) throw new Error('User not authenticated')
    
    setIsUploading(true)
    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      if (isGuest) {
        // For guest mode, use local storage and return base64 data
        const guestImageUrl = base64Data
        setUploadedImageUrl(guestImageUrl)
        toast.success('Photo uploaded successfully!')
        return guestImageUrl
      }

      // For authenticated users, store the base64 directly (AI needs base64 format)
      // We don't need to upload to storage for analysis
      setUploadedImageUrl(base64Data)
      toast.success('Photo uploaded successfully!')
      return base64Data
    } catch (error: any) {
      toast.error(error.message || 'Upload failed')
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  async function analyzeImage(imageUrl: string, questionnaire?: QuestionnaireData): Promise<AnalysisResults> {
    if (!user && !isGuest) throw new Error('User not authenticated')
    
    console.log('🔍 analyzeImage called:', { user: !!user, isGuest, imageUrl })
    
    setIsAnalyzing(true)
    try {
      if (isGuest) {
        console.log('📊 Using DEMO analysis for guest mode')
        // For guest mode, provide a demo analysis result
        await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate processing time
        
        const demoResults = {
          analysis_id: 'demo-' + Date.now(),
          is_demo: true, // Flag to indicate this is demo data
          analysis: {
            wrinkles_score: 2,  // 2/10 = minimal wrinkles (Excellent)
            spots_score: 5,     // 5/10 = some dark spots (Good)
            acne_score: 3,      // 3/10 = minor acne (Excellent)
            texture_score: 4,   // 4/10 = slight unevenness (Good)
            hydration_score: 5, // 5/10 = some dryness (Good)
            sebum_score: 4,     // 4/10 = slight oil (Good)
            pores_score: 6,     // 6/10 = some enlarged pores (Fair)
            redness_score: 3,   // 3/10 = minimal redness (Excellent)
            dark_circles_score: 5, // 5/10 = some dark circles (Good)
            skin_age_estimate: 32,
            skin_type: 'combination',
            overall_level: 'Good',
            overall_summary: 'demo.overall_summary' // Store translation key
          },
          detailed_analysis: {
            strengths: [
              'demo.strength1',
              'demo.strength2',
              'demo.strength3'
            ],
            concerns: [
              'demo.concern1',
              'demo.concern2',
              'demo.concern3'
            ],
            recommendations: [
              'demo.recommendation1',
              'demo.recommendation2',
              'demo.recommendation3',
              'demo.recommendation4',
              'demo.recommendation5'
            ]
          },
          lifestyle_impact: questionnaire ? {
            sleep_factor: questionnaire.sleep_hours ? `demo.sleep_factor|${questionnaire.sleep_hours}` : 'demo.sleep_generic',
            stress_factor: questionnaire.stress_level ? `demo.stress_factor|${questionnaire.stress_level}` : 'demo.stress_generic',
            diet_factor: questionnaire.diet_type ? `demo.diet_factor|${questionnaire.diet_type}` : 'demo.diet_generic'
          } : undefined,
          processing_time: 'demo.processing_complete'
        }
        
        setAnalysisResults(demoResults)
        setIsAnalyzing(false)
        toast.success(t('toast.demo_analysis_complete'))
        return demoResults
      }
      
      // Call AI-powered skin analysis Edge Function for authenticated users
      console.log('🤖 Calling REAL AI analysis for authenticated user')
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: {
          imageUrl,
          questionnaire,
          language: i18n.language // Pass current language to AI
        }
      })

      console.log('🤖 AI response:', { data, error })

      if (error) {
        setIsAnalyzing(false)
        throw error
      }
      
      const results = {
        analysis_id: 'analysis-' + Date.now(),
        ...data
      }
      
      console.log('✅ Setting analysis results:', results)
      setAnalysisResults(results)
      setCurrentAnalysisId(results.analysis_id)
      console.log('✅ Analysis state updated')

      // Save analysis to database for authenticated users
      if (user) {
        try {
          const { error: saveError } = await supabase
            .from('skin_analyses')
            .insert([{
              user_id: user.id,
              image_url: imageUrl,
              analysis_data: results as any,
              questionnaire_data: questionnaire as any
            }])

          if (saveError) {
            console.error('Error saving analysis:', saveError)
            toast.error('Analysis completed but failed to save to history')
          } else {
            toast.success('AI analysis completed and saved!')
          }
        } catch (saveError) {
          console.error('Error saving analysis:', saveError)
        }
      } else {
        toast.success('AI analysis completed!')
      }
      
      // Important: Set isAnalyzing to false AFTER all state updates
      setIsAnalyzing(false)
      console.log('🏁 Analysis complete, loading state cleared')
      
      return results
    } catch (error: any) {
      console.error('❌ Analysis error:', error)
      setIsAnalyzing(false)
      toast.error(error.message || 'Analysis failed')
      throw error
    }
  }

  async function getRecommendations(analysisId: string, preferences?: QuestionnaireData) {
    if (!user && !isGuest) throw new Error('User not authenticated')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate loading
      
      // Get analysis results to determine skin type and concerns
      const skinType = analysisResults?.analysis?.skin_type || 'combination'
      const concerns: string[] = []
      
      // Determine concerns based on scores
      if (analysisResults?.analysis) {
        const analysis = analysisResults.analysis
        if (analysis.wrinkles_score && analysis.wrinkles_score >= 5) concerns.push('Wrinkles', 'Anti-aging')
        if (analysis.spots_score && analysis.spots_score >= 5) concerns.push('Dark Spots', 'Hyperpigmentation')
        if (analysis.acne_score && analysis.acne_score >= 5) concerns.push('Acne', 'Blemishes')
        if (analysis.texture_score && analysis.texture_score >= 5) concerns.push('Texture', 'Uneven Skin')
        if (analysis.hydration_score && analysis.hydration_score >= 5) concerns.push('Dryness', 'Hydration')
        if (analysis.sebum_score && analysis.sebum_score >= 5) concerns.push('Oily Skin', 'Excess Oil')
        if (analysis.pores_score && analysis.pores_score >= 5) concerns.push('Large Pores')
        if (analysis.redness_score && analysis.redness_score >= 5) concerns.push('Redness', 'Sensitivity')
      }
      
      // Budget filtering
      const budgetRanges: { [key: string]: { min: number; max: number } } = {
        low: { min: 0, max: 30 },
        medium: { min: 30, max: 70 },
        high: { min: 70, max: 150 },
        luxury: { min: 150, max: 10000 }
      }
      
      const budgetLevel = preferences?.budget_level || 'medium'
      const budgetRange = budgetRanges[budgetLevel]
      
      // Product preference filtering
      const productPreference = preferences?.product_preference || 'any'
      
      // Filter and score products
      const scoredProducts = mockProducts
        .filter(product => {
          // Budget filter
          const productPrice = product.price_min || 0
          if (productPrice < budgetRange.min || productPrice > budgetRange.max) {
            return false
          }
          
          // Product preference filter
          if (productPreference !== 'any') {
            const isNatural = product.category.toLowerCase().includes('natural') || 
                            product.key_ingredients?.some(ing => 
                              ['oil', 'extract', 'butter', 'botanical'].some(term => 
                                ing.toLowerCase().includes(term)
                              )
                            )
            if (productPreference === 'natural' && !isNatural) return false
            if (productPreference === 'scientific' && isNatural) return false
          }
          
          return true
        })
        .map(product => {
          let score = 0
          
          // Match skin type (40 points)
          const productSkinTypes = product.skin_types.map(t => t.toLowerCase())
          if (productSkinTypes.some(t => t.includes('all') || t.includes(skinType))) {
            score += 40
          }
          
          // Match concerns (40 points)
          const concernMatches = product.concerns_addressed.filter(concern =>
            concerns.some(userConcern => 
              concern.toLowerCase().includes(userConcern.toLowerCase()) ||
              userConcern.toLowerCase().includes(concern.toLowerCase())
            )
          ).length
          score += Math.min(concernMatches * 10, 40)
          
          // Rating bonus (10 points)
          if (product.rating) {
            score += (product.rating / 5) * 10
          }
          
          // Review count bonus (10 points)
          if (product.review_count && product.review_count > 1000) {
            score += 10
          } else if (product.review_count && product.review_count > 500) {
            score += 5
          }
          
          return {
            ...product,
            price_min: product.price_min || 0,
            price_max: product.price_max || product.price_min || 0,
            recommendation_score: Math.round(score),
            recommendation_reason: generateScientificRecommendation(product, skinType, concerns),
            priority_level: score >= 80 ? 1 : score >= 60 ? 2 : 3,
            country_origin: product.country_origin || 'Switzerland',
            purchase_urls: {
              official: product.affiliate_url || '#',
              amazon: `https://www.amazon.com/s?k=${encodeURIComponent(product.brand + ' ' + product.name)}`
            }
          }
        })
      
      // Sort by score and return top 12
      const topRecommendations = scoredProducts
        .sort((a, b) => b.recommendation_score - a.recommendation_score)
        .slice(0, 12)
      
      return {
        recommendations: topRecommendations,
        total_count: topRecommendations.length,
        analysis_summary: {
          skin_type: skinType,
          primary_concerns: concerns.slice(0, 3)
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to get recommendations')
      throw error
    }
  }
  

  async function loadAnalysis(analysisId: string) {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('skin_analyses')
        .select('*')
        .eq('id', analysisId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Analysis not found')

      // Set the loaded analysis as current
      setUploadedImageUrl(data.image_url)
      setAnalysisResults(data.analysis_data as any as AnalysisResults)
      setCurrentAnalysisId(data.id)

      return data
    } catch (error: any) {
      toast.error(error.message || 'Failed to load analysis')
      throw error
    }
  }

  return {
    isUploading,
    isAnalyzing,
    uploadedImageUrl,
    analysisResults,
    currentAnalysisId,
    uploadImage,
    analyzeImage,
    getRecommendations,
    loadAnalysis,
    setUploadedImageUrl,
    setAnalysisResults,
    setCurrentAnalysisId
  }
}
