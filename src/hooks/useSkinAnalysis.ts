import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useGuestMode } from '@/hooks/useGuestMode'
import { supabase } from '@/lib/supabase'
import { AnalysisResults } from '@/types'
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

      if (error) throw error
      
      const results = {
        analysis_id: 'analysis-' + Date.now(),
        ...data
      }
      
      setAnalysisResults(results)
      setCurrentAnalysisId(results.analysis_id)

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
      
      return results
    } catch (error: any) {
      toast.error(error.message || 'Analysis failed')
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function getRecommendations(analysisId: string, preferences?: any) {
    if (!user && !isGuest) throw new Error('User not authenticated')
    
    try {
      // For now, provide demo recommendations for all users
      // TODO: Implement real product recommendation Edge Function
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate loading
      
      return {
        recommendations: [
          {
            id: 'demo-eucerin-vitamin-c',
            name: 'Eucerin Hyaluron-Filler Vitamin C Booster',
            brand: 'Eucerin',
            category: 'serum',
            price_min: 28.00,
            price_max: 35.00,
            currency: 'EUR',
            country_origin: 'Germany',
            skin_types: ['all'],
            concerns_addressed: ['spots', 'dullness', 'wrinkles'],
            key_ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Licochalcone A'],
            purchase_urls: {
              official: 'https://www.eucerin.com',
              amazon: 'https://www.amazon.de/s?k=eucerin+vitamin+c'
            },
            image_url: '/images/products/eucerin-vitamin-c.png',
            recommendation_score: 85,
            recommendation_reason: 'Perfect for your combination skin type and addresses dark spots effectively',
            priority_level: 1,
            rating: 4.4
          },
          {
            id: 'demo-laroche-retinol',
            name: 'La Roche-Posay Redermic R Anti-Age Retinol Serum',
            brand: 'La Roche-Posay',
            category: 'serum',
            price_min: 35.00,
            price_max: 42.00,
            currency: 'EUR',
            country_origin: 'France',
            skin_types: ['normal', 'combination', 'mature'],
            concerns_addressed: ['wrinkles', 'texture', 'spots'],
            key_ingredients: ['Retinol', 'Adenosine', 'LHA'],
            purchase_urls: {
              official: 'https://www.laroche-posay.com',
              amazon: 'https://www.amazon.de/s?k=la+roche+posay+retinol'
            },
            image_url: '/images/products/laroche-retinol.jpg',
            recommendation_score: 82,
            recommendation_reason: 'Gentle retinol formula ideal for improving skin texture and reducing fine lines',
            priority_level: 1,
            rating: 4.3
          },
          {
            id: 'demo-caudalie-radiance',
            name: 'Caudalie Vinoperfect Radiance Serum',
            brand: 'Caudalie',
            category: 'serum',
            price_min: 42.00,
            price_max: 49.00,
            currency: 'EUR',
            country_origin: 'France',
            skin_types: ['all'],
            concerns_addressed: ['spots', 'dullness', 'hyperpigmentation'],
            key_ingredients: ['Viniferine', 'Glycolic Acid', 'Vitamin C'],
            purchase_urls: {
              official: 'https://www.caudalie.com',
              sephora: 'https://www.sephora.com/search?keyword=caudalie'
            },
            image_url: '/images/products/caudalie-radiance.jpg',
            recommendation_score: 80,
            recommendation_reason: 'Natural ingredients that brighten skin and reduce hyperpigmentation',
            priority_level: 2,
            rating: 4.1
          }
        ],
        total_count: 3,
        analysis_summary: {
          skin_type: 'combination',
          primary_concerns: ['dark spots', 'hydration', 'fine lines']
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
