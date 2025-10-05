import React, { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf } from 'lucide-react'

// Context and i18n
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import '@/lib/i18n'

// Components
import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/sections/HeroSection'
import { UploadSection } from '@/components/sections/UploadSection'
import { QuestionnaireSection } from '@/components/sections/QuestionnaireSection'
import { ResultsSection } from '@/components/sections/ResultsSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { CommunitySection } from '@/components/sections/CommunitySection'
import { MySkinJourneySection } from '@/components/sections/MySkinJourneySection'
import { OurVisionSection } from '@/components/sections/OurVisionSection'
import { ProfileSection } from '@/components/sections/ProfileSection'
import { AuthModal } from '@/components/AuthModal'

// Hooks
import { useSkinAnalysis } from '@/hooks/useSkinAnalysis'
import { useGuestMode } from '@/hooks/useGuestMode'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

// Types
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

type AppSection = 'home' | 'analysis' | 'community' | 'my-skin-journey' | 'our-vision' | 'upload' | 'questionnaire' | 'results' | 'products' | 'smart-routine' | 'product-library' | 'reminders' | 'skincare-diaries' | 'trending' | 'profile'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function AppContent() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const { isGuest, enableGuestMode } = useGuestMode()
  const [currentSection, setCurrentSection] = useState<AppSection>('home')
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const {
    uploadedImageUrl,
    analysisResults,
    isAnalyzing,
    currentAnalysisId,
    analyzeImage,
    setUploadedImageUrl,
    setAnalysisResults,
    setCurrentAnalysisId
  } = useSkinAnalysis()
  
  // Enable guest mode automatically for demo purposes, but disable when user logs in
  useEffect(() => {
    console.log('🔐 Auth state:', { user: !!user, isGuest, loading })
    if (!user && !isGuest && !loading) {
      console.log('👤 Enabling guest mode')
      enableGuestMode()
    } else if (user && isGuest) {
      console.log('👤 User logged in, but guest mode still active - this is the bug!')
      // Force re-check of guest mode
      localStorage.removeItem('guest_session')
      window.location.reload()
    }
  }, [user, isGuest, loading, enableGuestMode])
  
  // Check if user needs to authenticate - DISABLED for demo
  const isAuthenticated = user || isGuest || true // Always allow access for demo
  
  // REMOVED: Auth modal logic for seamless demo experience
  
  // Navigation handler
  const handleSectionChange = (section: string) => {
    setCurrentSection(section as AppSection)
    
    // If switching away from analysis flow, reset state
    if (!['upload', 'questionnaire', 'analysis', 'results', 'products'].includes(section)) {
      setUploadedImageUrl(null)
      setAnalysisResults(null)
      setQuestionnaireData(null)
      setCurrentAnalysisId(null)
    }
  }
  
  // Analysis flow handlers
  const handleStartAnalysis = () => {
    // Always allow analysis for demo purposes
    setCurrentSection('upload')
  }
  
  const handleUploadComplete = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl)
    setCurrentSection('questionnaire')
  }
  
  const handleQuestionnaireComplete = async (data: QuestionnaireData) => {
    setQuestionnaireData(data)
    
    if (uploadedImageUrl) {
      try {
        const results = await analyzeImage(uploadedImageUrl, data)
        if (results.analysis_id) {
          setCurrentAnalysisId(results.analysis_id)
        }
        setCurrentSection('results')
      } catch (error) {
        console.error('Analysis failed:', error)
        toast.error(t('toast.analysis_failed'))
        setCurrentSection('questionnaire')
      }
    }
  }
  
  const handleViewRecommendations = () => {
    if (currentAnalysisId) {
      setCurrentSection('products')
    }
  }
  
  const handleBackToUpload = () => {
    setCurrentSection('upload')
  }
  
  const handleBackToQuestionnaire = () => {
    setCurrentSection('questionnaire')
  }
  
  const handleBackToResults = () => {
    setCurrentSection('results')
  }
  
  // Community handlers
  const handleCreateDiary = () => {
    toast.success(t('toast.diary_feature_development'))
  }
  
  // Influencer handlers
  const handleApplyInfluencer = () => {
    toast.success(t('toast.influencer_application_submitted'))
  }
  
  // Product library handlers
  const handleAddProduct = () => {
    toast.success(t('toast.add_product_development'))
  }
  
  const handleViewProduct = (productId: string) => {
    toast.success(t('toast.view_product_details') + ': ' + productId)
  }
  
  // Reminder handlers
  const handleCreateReminder = () => {
    toast.success(t('toast.reminder_creation_development'))
  }
  
  const handleEditReminder = (reminderId: string) => {
    toast.success(t('toast.edit_reminder') + ': ' + reminderId)
  }
  
  // Smart routine handlers
  const handleViewFullRoutine = (routineId: string) => {
    toast.success(t('toast.view_full_routine') + ': ' + routineId)
  }

  // Profile handlers
  const handleViewPastAnalysis = (analysisId: string) => {
    if (analysisId === 'new') {
      setCurrentSection('upload')
    } else {
      // TODO: Load specific analysis and show results
      toast('Loading analysis... (feature in progress)')
    }
  }
  
  // Don't show main content if loading
  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="text-white w-7 h-7" />
          </div>
          <p className="text-stone-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-warm-50">
      <Navigation 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {/* Home Section */}
          {currentSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection onStartAnalysis={handleStartAnalysis} />
            </motion.div>
          )}
          
          {/* Analysis Flow */}
          {currentSection === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <UploadSection 
                onUploadComplete={handleUploadComplete}
                onBack={() => setCurrentSection('home')}
              />
            </motion.div>
          )}
          
          {currentSection === 'questionnaire' && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <QuestionnaireSection 
                onComplete={handleQuestionnaireComplete}
                onBack={handleBackToUpload}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}
          
          {currentSection === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsSection 
                results={analysisResults}
                imageUrl={uploadedImageUrl}
                onViewRecommendations={handleViewRecommendations}
                onStartOver={() => setCurrentSection('home')}
                onBack={handleBackToQuestionnaire}
              />
            </motion.div>
          )}
          
          {currentSection === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ProductsSection 
                analysisId={currentAnalysisId}
                onBack={handleBackToResults}
              />
            </motion.div>
          )}
          
          {/* New Feature Sections */}
          {currentSection === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <CommunitySection 
                onCreateDiary={handleCreateDiary}
                onApplyInfluencer={handleApplyInfluencer}
                onViewProduct={handleViewProduct}
              />
            </motion.div>
          )}
          
          {currentSection === 'my-skin-journey' && (
            <motion.div
              key="my-skin-journey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MySkinJourneySection 
                onCreateReminder={handleCreateReminder}
                onEditReminder={handleEditReminder}
                onAddProduct={handleAddProduct}
                onViewProduct={handleViewProduct}
                onViewFullRoutine={handleViewFullRoutine}
              />
            </motion.div>
          )}
          
          {currentSection === 'our-vision' && (
            <motion.div
              key="our-vision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <OurVisionSection onBack={() => setCurrentSection('home')} />
            </motion.div>
          )}
          
          {/* Legacy sections - accessible through My Skin Journey */}
          
          {/* Analysis Section (direct access) */}
          {currentSection === 'analysis' && (
            <motion.div
              key="analysis-direct"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <UploadSection 
                onUploadComplete={handleUploadComplete}
                onBack={() => setCurrentSection('home')}
              />
            </motion.div>
          )}

          {/* Dropdown Navigation Sections */}
          {currentSection === 'smart-routine' && (
            <motion.div
              key="smart-routine"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MySkinJourneySection 
                onCreateReminder={handleCreateReminder}
                onEditReminder={handleEditReminder}
                onAddProduct={handleAddProduct}
                onViewProduct={handleViewProduct}
                onViewFullRoutine={handleViewFullRoutine}
                initialTab="routine"
              />
            </motion.div>
          )}

          {currentSection === 'product-library' && (
            <motion.div
              key="product-library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MySkinJourneySection 
                onCreateReminder={handleCreateReminder}
                onEditReminder={handleEditReminder}
                onAddProduct={handleAddProduct}
                onViewProduct={handleViewProduct}
                onViewFullRoutine={handleViewFullRoutine}
                initialTab="library"
              />
            </motion.div>
          )}

          {currentSection === 'reminders' && (
            <motion.div
              key="reminders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MySkinJourneySection 
                onCreateReminder={handleCreateReminder}
                onEditReminder={handleEditReminder}
                onAddProduct={handleAddProduct}
                onViewProduct={handleViewProduct}
                onViewFullRoutine={handleViewFullRoutine}
                initialTab="reminders"
              />
            </motion.div>
          )}

          {(currentSection === 'skincare-diaries' || currentSection === 'trending') && (
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <CommunitySection 
                onCreateDiary={handleCreateDiary}
                onApplyInfluencer={handleApplyInfluencer}
                onViewProduct={handleViewProduct}
                initialTab={currentSection === 'skincare-diaries' ? 'diaries' : 'trending'}
              />
            </motion.div>
          )}

          {/* Profile Section */}
          {currentSection === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileSection
                onViewAnalysis={handleViewPastAnalysis}
                onBack={() => setCurrentSection('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="signin"
        onModeChange={() => {}}
      />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1c1917',
            color: '#fef7ed',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App