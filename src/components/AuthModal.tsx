import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useGuestMode } from '@/hooks/useGuestMode'
import { X, Mail, Lock, User, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'signin' | 'signup'
  onModeChange?: (mode: 'signin' | 'signup') => void
}

export function AuthModal({ isOpen, onClose, mode = 'signin', onModeChange }: AuthModalProps) {
  const { t } = useTranslation()
  const { signIn, signUp, loading } = useAuth()
  const { enableGuestMode } = useGuestMode()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  
  // Sync internal state with prop
  useEffect(() => {
    setAuthMode(mode)
  }, [mode])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      // Demo account exception - bypass normal auth for testing
      if (email === 'admin@demo.com' && password === 'admin123' && authMode === 'signin') {
        // Create a mock user session for demo account
        localStorage.setItem('test_user', JSON.stringify({
          id: 'demo-user-123',
          email: 'admin@demo.com',
          created_at: new Date().toISOString()
        }))
        enableGuestMode() // Enable guest mode for full functionality
        onClose()
        return
      }
      
      
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        await signUp(email, password)
        onClose()
      } else {
        await signIn(email, password)
        onClose()
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed')
    }
  }
  
  const handleGuestMode = () => {
    enableGuestMode()
    onClose()
  }
  
  if (!isOpen) return null
  
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Container */}
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md"
          >
          <Card>
            <CardHeader className="text-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-8 h-8 bg-emerald-600 flex items-center justify-center mx-auto mb-6 rounded-lg">
                <Leaf className="text-white w-5 h-5" />
              </div>
              
              <CardTitle className="text-xl font-light tracking-wide">
                {authMode === 'signin' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
              </CardTitle>
              <p className="text-gray-600 mt-3 font-light text-sm">
                {authMode === 'signin' 
                  ? 'Sign in to access your skin analysis history' 
                  : 'Join DermaEco to save your analysis results'
                }
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-wabi-linen border border-wabi-sand rounded-lg">
                    <p className="text-sm text-wabi-earth">{error}</p>
                  </div>
                )}
                
                
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="w-4 h-4" />}
                />
                
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={<Lock className="w-4 h-4" />}
                />
                
                {authMode === 'signup' && (
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    icon={<Lock className="w-4 h-4" />}
                  />
                )}
                
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                >
                  {authMode === 'signin' ? t('common.signin') : t('common.signup')}
                </Button>
              </form>
              
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-stone-500">or</span>
                  </div>
                </div>
                
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleGuestMode}
                >
                  <User className="w-4 h-4 mr-2" />
                  Continue as Guest
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      const newMode = authMode === 'signin' ? 'signup' : 'signin'
                      if (onModeChange) {
                        onModeChange(newMode)
                      } else {
                        setAuthMode(newMode)
                      }
                    }}
                    className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer"
                  >
                    {authMode === 'signin' 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              </div>
              
              {authMode === 'signup' && (
                <div className="mt-4 p-3 bg-stone-50 rounded-lg">
                  <p className="text-xs text-stone-600">
                    By creating an account, you agree to our Terms of Service and Privacy Policy. 
                    Your data will be processed in accordance with GDPR requirements.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
