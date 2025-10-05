import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGuestMode } from '@/hooks/useGuestMode'
import { supabase } from '@/integrations/supabase/client'
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
  const { user } = useAuth()
  const { isGuest } = useGuestMode()
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)

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

      // Upload via Edge Function for authenticated users
      const { data, error } = await supabase.functions.invoke('photo-upload', {
        body: {
          imageData: base64Data,
          fileName: `${Date.now()}-${file.name}`
        }
      })

      if (error) throw error
      
      const imageUrl = data.data.publicUrl
      setUploadedImageUrl(imageUrl)
      toast.success('Photo uploaded successfully!')
      return imageUrl
    } catch (error: any) {
      toast.error(error.message || 'Upload failed')
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  async function analyzeImage(imageUrl: string, questionnaire?: QuestionnaireData): Promise<AnalysisResults> {
    if (!user && !isGuest) throw new Error('User not authenticated')
    
    setIsAnalyzing(true)
    try {
      // Call AI-powered skin analysis Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: {
          imageUrl,
          questionnaire
        }
      })

      if (error) throw error
      
      const results = {
        analysis_id: 'analysis-' + Date.now(),
        ...data
      }
      
      setAnalysisResults(results)
      toast.success('AI analysis completed!')
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
      if (isGuest) {
        // For guest mode, provide demo recommendations
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
      }
      
      const { data, error } = await supabase.functions.invoke('product-recommendations', {
        body: {
          analysisId,
          ...preferences
        }
      })

      if (error) throw error
      
      return data.data
    } catch (error: any) {
      toast.error(error.message || 'Failed to get recommendations')
      throw error
    }
  }

  return {
    isUploading,
    isAnalyzing,
    uploadedImageUrl,
    analysisResults,
    uploadImage,
    analyzeImage,
    getRecommendations,
    setUploadedImageUrl,
    setAnalysisResults
  }
}
