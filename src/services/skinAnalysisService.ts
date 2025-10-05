import { supabase } from '@/lib/supabase'
import { SkinAnalysis, Recommendation } from '@/lib/supabase'

export interface SkinAnalysisRequest {
  imageData: string  // base64 encoded image
  questionnaireData?: {
    age?: number
    skin_concerns?: string[]
    current_routine?: string[]
    skin_type?: string
    lifestyle_factors?: {
      sleep_hours?: number
      stress_level?: number
      diet_type?: string
      exercise_frequency?: string
    }
  }
}

export interface SkinAnalysisResult {
  analysis: SkinAnalysis
  recommendations: any[]
  analysis_summary: {
    skin_type: string
    overall_score: number
    main_concerns: string[]
    key_recommendations: string[]
  }
}

export const skinAnalysisService = {
  async processAnalysis(request: SkinAnalysisRequest): Promise<SkinAnalysisResult> {
    try {
      const { data, error } = await supabase.functions.invoke('skin-analysis-process', {
        body: request
      })

      if (error) {
        throw new Error(error.message || 'Analysis processing failed')
      }

      if (data?.error) {
        throw new Error(data.error.message || 'Analysis processing failed')
      }

      return data.data
    } catch (error: any) {
      console.error('Skin analysis error:', error)
      throw new Error(error.message || 'Failed to process skin analysis')
    }
  },

  async getUserAnalyses(userId: string): Promise<SkinAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('skin_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('Error fetching user analyses:', error)
      throw new Error('Failed to fetch analysis history')
    }
  },

  async getAnalysisById(id: string): Promise<SkinAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('skin_analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error fetching analysis:', error)
      throw new Error('Failed to fetch analysis')
    }
  },

  async saveQuestionnaireResponse(userId: string, responses: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert({
          user_id: userId,
          ...responses,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error: any) {
      console.error('Error saving questionnaire:', error)
      throw new Error('Failed to save questionnaire responses')
    }
  },

  async getQuestionnaireResponse(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Error fetching questionnaire:', error)
      return null
    }
  }
}
