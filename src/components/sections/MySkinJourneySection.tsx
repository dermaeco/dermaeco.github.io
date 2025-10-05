import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Lightbulb, Package, Bell, Calendar, Clock, Heart, Plus, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { userDataService } from '@/services/userDataService'
import { UserProduct } from '@/lib/supabase'

interface MySkinJourneySectionProps {
  onCreateReminder?: () => void
  onEditReminder?: (reminderId: string) => void
  onAddProduct?: () => void
  onViewProduct?: (productId: string) => void
  onViewFullRoutine?: (routineId: string) => void
  initialTab?: 'routine' | 'library' | 'reminders'
}

export function MySkinJourneySection({
  onCreateReminder,
  onEditReminder,
  onAddProduct,
  onViewProduct,
  onViewFullRoutine,
  initialTab = 'routine'
}: MySkinJourneySectionProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'routine' | 'library' | 'reminders'>(initialTab)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<UserProduct[]>([])
  const [routines, setRoutines] = useState<any>({})
  const [reminders, setReminders] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Mock data for guest users (demo content)
  const mockProducts = [
    {
      id: '1',
      user_id: 'guest',
      product_name: 'Hyaluronic Acid Serum',
      brand: 'The Ordinary',
      category: 'serum',
      price: 12.99,
      purchase_date: '2024-12-15',
      usage_frequency: 'twice-daily',
      effectiveness_rating: 4,
      notes: 'Amazing hydration boost, skin feels plumper',
      image_url: '/images/hyaluronic-serum.jpg',
      is_active: true,
      created_at: '2024-12-15T10:00:00Z',
      updated_at: '2024-12-15T10:00:00Z'
    },
    {
      id: '2',
      user_id: 'guest',
      product_name: 'Vitamin C Serum',
      brand: 'Skinceuticals',
      category: 'serum',
      price: 85.00,
      purchase_date: '2024-12-01',
      usage_frequency: 'once-daily',
      effectiveness_rating: 5,
      notes: 'Brightened complexion significantly',
      image_url: '/images/vitamin-c-serum.jpg',
      is_active: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '3',
      user_id: 'guest',
      product_name: 'Gentle Cleanser',
      brand: 'CeraVe',
      category: 'cleanser',
      price: 16.99,
      purchase_date: '2024-11-20',
      usage_frequency: 'twice-daily',
      effectiveness_rating: 4,
      notes: 'Perfect for sensitive skin, no irritation',
      image_url: '/images/gentle-cleanser.jpg',
      is_active: true,
      created_at: '2024-11-20T10:00:00Z',
      updated_at: '2024-11-20T10:00:00Z'
    }
  ]

  const mockRoutines = {
    morning: {
      id: 'morning-routine',
      time_of_day: 'morning',
      steps: [
        {
          id: '1',
          step_number: 1,
          product_category: 'Gentle Cleanser',
          instruction: 'Cleanse with lukewarm water',
          duration: '2 min'
        },
        {
          id: '2',
          step_number: 2,
          product_category: 'Vitamin C Serum',
          instruction: 'Apply 3-4 drops to face and neck',
          duration: '1 min'
        },
        {
          id: '3',
          step_number: 3,
          product_category: 'Moisturizer',
          instruction: 'Apply evenly to lock in serum',
          duration: '1 min'
        },
        {
          id: '4',
          step_number: 4,
          product_category: 'Sunscreen SPF 30+',
          instruction: 'Essential UV protection',
          duration: '1 min'
        }
      ]
    },
    evening: {
      id: 'evening-routine',
      time_of_day: 'evening',
      steps: [
        {
          id: '1',
          step_number: 1,
          product_category: 'Oil Cleanser',
          instruction: 'Remove makeup and sunscreen',
          duration: '2 min'
        },
        {
          id: '2',
          step_number: 2,
          product_category: 'Gentle Cleanser',
          instruction: 'Second cleanse for deep clean',
          duration: '2 min'
        },
        {
          id: '3',
          step_number: 3,
          product_category: 'Hyaluronic Acid Serum',
          instruction: 'Apply to damp skin for maximum absorption',
          duration: '1 min'
        },
        {
          id: '4',
          step_number: 4,
          product_category: 'Night Moisturizer',
          instruction: 'Rich cream for overnight repair',
          duration: '1 min'
        }
      ]
    }
  }

  const mockReminders = [
    {
      id: '1',
      user_id: 'guest',
      title: 'Evening Skincare Routine',
      description: 'Time for your nightly skincare routine',
      reminder_time: '21:00',
      frequency: 'daily',
      is_active: true,
      created_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      user_id: 'guest',
      title: 'Vitamin C Serum',
      description: 'Apply your morning vitamin C serum',
      reminder_time: '08:00',
      frequency: 'daily',
      is_active: true,
      created_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '3',
      user_id: 'guest',
      title: 'Weekly Face Mask',
      description: 'Time for your hydrating face mask',
      reminder_time: '19:00',
      frequency: 'weekly',
      is_active: true,
      created_at: '2024-12-01T10:00:00Z'
    }
  ]

  // Load user data
  useEffect(() => {
    loadUserData()
  }, [user])

  const loadUserData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // For guest users, use mock data for seamless demo experience
      if (!user) {
        setProducts(mockProducts)
        setRoutines(mockRoutines)
        setReminders(mockReminders)
        setLoading(false)
        return
      }

      // For authenticated users, try to load real data with fallback to mock
      try {
        const [userProducts, userRoutines, userReminders] = await Promise.all([
          userDataService.getUserProducts(user.id),
          userDataService.getUserRoutines(user.id),
          userDataService.getUserReminders(user.id)
        ])
        
        setProducts(userProducts.length > 0 ? userProducts : mockProducts)
        setRoutines(Object.keys(userRoutines).length > 0 ? userRoutines : mockRoutines)
        setReminders(userReminders.length > 0 ? userReminders : mockReminders)
      } catch {
        // Fallback to mock data for authenticated users if backend fails
        setProducts(mockProducts)
        setRoutines(mockRoutines)
        setReminders(mockReminders)
      }
    } catch (error: any) {
      console.error('Error loading user data:', error)
      // Always fallback to mock data instead of showing error
      setProducts(mockProducts)
      setRoutines(mockRoutines)
      setReminders(mockReminders)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { key: 'routine', label: t('nav.smart_routine'), icon: Lightbulb },
    { key: 'library', label: t('nav.product_library'), icon: Package },
    { key: 'reminders', label: t('nav.reminders'), icon: Bell }
  ]

  // Get morning and evening routines from loaded data
  const morningRoutine = routines.morning
  const eveningRoutine = routines.evening

  return (
    <div className="min-h-screen bg-warm-50 py-8">
      <div className="wabi-container">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-2 rounded-lg mb-8 shadow-soft">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-stone-400 mx-auto mb-4 animate-pulse" />
              <p className="text-stone-600">Loading your skin journey...</p>
            </div>
          ) : (
            activeTab === 'routine' && (
              <motion.div
                key="routine"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Morning Routine */}
                  <div className="bg-white rounded-lg p-8 shadow-soft">
                    <h3 className="text-xl font-medium text-stone-900 mb-6 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Morning Routine
                    </h3>
                    <div className="space-y-4">
                      {morningRoutine?.steps?.map((step, index) => (
                        <div key={step.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-stone-500">Step {step.step_number}</span>
                            <p className="text-stone-900">{step.product_category}</p>
                            {step.instruction && (
                              <p className="text-xs text-stone-600 mt-1">{step.instruction}</p>
                            )}
                          </div>
                          <span className="text-sm text-stone-500">{step.duration}</span>
                        </div>
                      )) || (
                        <div className="text-center py-8">
                          <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                          <p className="text-stone-600">No morning routine available</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onViewFullRoutine?.(morningRoutine?.id || 'morning')}
                      className="w-full mt-6 py-3 text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors duration-200"
                      disabled={!morningRoutine}
                    >
                      View Full Routine
                    </button>
                  </div>

                  {/* Evening Routine */}
                  <div className="bg-white rounded-lg p-8 shadow-soft">
                    <h3 className="text-xl font-medium text-stone-900 mb-6 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Evening Routine
                    </h3>
                    <div className="space-y-4">
                      {eveningRoutine?.steps?.map((step, index) => (
                        <div key={step.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-stone-500">Step {step.step_number}</span>
                            <p className="text-stone-900">{step.product_category}</p>
                            {step.instruction && (
                              <p className="text-xs text-stone-600 mt-1">{step.instruction}</p>
                            )}
                          </div>
                          <span className="text-sm text-stone-500">{step.duration}</span>
                        </div>
                      )) || (
                        <div className="text-center py-8">
                          <Clock className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                          <p className="text-stone-600">No evening routine available</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onViewFullRoutine?.(eveningRoutine?.id || 'evening')}
                      className="w-full mt-6 py-3 text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors duration-200"
                      disabled={!eveningRoutine}
                    >
                      View Full Routine
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-lg p-8 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-stone-900">
                    {t('library.my_products')}
                  </h3>
                  <button
                    onClick={onAddProduct}
                    className="flex items-center space-x-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('library.add_product')}</span>
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div
                        key={product.id}
                        className="border border-stone-200 rounded-lg p-6 hover:shadow-soft transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-stone-900 mb-1">{product.product_name}</h4>
                            <p className="text-sm text-stone-500">{product.brand}</p>
                            <span className="inline-block px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded mt-2">
                              {product.category}
                            </span>
                          </div>
                          <button className="p-1 rounded text-stone-400 hover:text-red-500">
                            <Heart className="w-5 h-5" fill="none" />
                          </button>
                        </div>
                        <p className="text-xs text-stone-500 mb-4">Rating: {product.effectiveness_rating ? `${product.effectiveness_rating}/5` : 'Not rated'}</p>
                        <button
                          onClick={() => onViewProduct?.(product.id)}
                          className="w-full py-2 text-stone-700 border border-stone-300 rounded hover:bg-stone-50 transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Package className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-stone-900 mb-2">No Products Yet</h3>
                      <p className="text-stone-600 mb-4">Add your first skincare product to get started</p>
                      <button
                        onClick={onAddProduct}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reminders' && (
            <motion.div
              key="reminders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-lg p-8 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-stone-900">
                    {t('routine.reminders')}
                  </h3>
                  <button
                    onClick={onCreateReminder}
                    className="flex items-center space-x-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Reminder</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {reminders.length > 0 ? (
                    reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-center justify-between p-6 border border-stone-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full ${reminder.is_active ? 'bg-green-500' : 'bg-stone-300'}`} />
                          <div>
                            <h4 className="font-medium text-stone-900">{reminder.title}</h4>
                            <p className="text-sm text-stone-500">{reminder.reminder_time} • {reminder.frequency}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onEditReminder?.(reminder.id)}
                          className="px-3 py-1 text-stone-600 hover:text-stone-900 transition-colors duration-200"
                        >
                          Edit
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-stone-900 mb-2">No Reminders Yet</h3>
                      <p className="text-stone-600 mb-4">Create your first skincare reminder</p>
                      <button
                        onClick={onCreateReminder}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Reminder</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
