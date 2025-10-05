import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { AuthModal } from '@/components/AuthModal'
import { useGuestMode } from '@/hooks/useGuestMode'
import { User, Shield, Camera, Home, Users, Lightbulb, Menu, X, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  currentSection?: string
  onSectionChange?: (section: string) => void
}

export function Navigation({ currentSection = 'home', onSectionChange }: NavigationProps) {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const { isGuest } = useGuestMode()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const navItems = [
    { key: 'home', label: t('nav.home'), icon: Home },
    { key: 'analysis', label: t('nav.analysis'), icon: Camera },
    { key: 'community', label: t('nav.community'), icon: Users },
    { key: 'my-skin-journey', label: t('nav.my_skin_journey'), icon: Lightbulb },
    { key: 'our-vision', label: t('nav.our_vision'), icon: Shield },
  ]
  
  const handleSectionClick = (section: string) => {
    onSectionChange?.(section)
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }
  
  const handleDropdownToggle = (itemKey: string) => {
    setActiveDropdown(activeDropdown === itemKey ? null : itemKey)
  }
  
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="wabi-container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer gap-2"
              onClick={() => handleSectionClick('home')}
            >
              <Leaf className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-light text-wabi-obsidian tracking-tight">Derma Eco</span>
            </div>
            
            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentSection === item.key
                
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSectionClick(item.key)}
                    className={`flex items-center space-x-2 px-4 py-3 transition-all duration-200 font-light text-sm tracking-wide ${
                      isActive 
                        ? 'text-black border-b border-black' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
            
            {/* Right side */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {user && (
                <Button
                  onClick={() => onSectionChange?.('profile')}
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              )}
              
              {user ? (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-stone-900">
                      {user.email?.split('@')[0] || t('common.user')}
                    </p>
                  </div>
                  <Button
                    onClick={async () => {
                      await signOut()
                      // Navigation will be handled by signOut function
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs px-3 py-1"
                  >
                    {t('common.signout')}
                  </Button>
                </div>
              ) : isGuest ? (
                <div className="hidden md:flex items-center space-x-3">
                  <span className="text-sm text-stone-600">{t('common.guest_mode')}</span>
                  <Button
                    onClick={() => {
                      setAuthMode('signin')
                      setShowAuthModal(true)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs px-3 py-1"
                  >
                    {t('common.signin')}
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    onClick={() => {
                      setAuthMode('signin')
                      setShowAuthModal(true)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs px-3 py-1"
                  >
                    {t('common.signin')}
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode('signup')
                      setShowAuthModal(true)
                    }}
                    size="sm"
                    className="bg-black text-white hover:bg-stone-800 text-xs px-3 py-1"
                  >
                    {t('common.signup')}
                  </Button>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-stone-600 hover:text-black transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-stone-200"
            >
              <div className="wabi-container py-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentSection === item.key
                    
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleSectionClick(item.key)}
                        className={`flex items-center space-x-3 w-full px-4 py-3 text-left transition-all duration-200 ${
                          isActive 
                            ? 'text-black bg-stone-50' 
                            : 'text-gray-600 hover:text-black hover:bg-stone-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
                
                {/* Mobile Auth Section */}
                <div className="mt-6 pt-6 border-t border-stone-200">
                  {user ? (
                    <div className="space-y-3">
                      <div className="px-4">
                        <p className="text-sm font-medium text-stone-900">
                          {user.email?.split('@')[0] || t('common.user')}
                        </p>
                        <p className="text-xs text-stone-500">{user.email}</p>
                      </div>
                      <Button
                        onClick={async () => {
                          await signOut()
                          // Navigation will be handled by signOut function
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        {t('common.signout')}
                      </Button>
                    </div>
                  ) : isGuest ? (
                    <div className="space-y-3">
                      <div className="px-4">
                        <p className="text-sm text-stone-600">{t('common.guest_mode')}</p>
                      </div>
                      <Button
                        onClick={() => {
                          setAuthMode('signin')
                          setShowAuthModal(true)
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full bg-black text-white hover:bg-stone-800"
                      >
                        {t('common.signin')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setAuthMode('signin')
                          setShowAuthModal(true)
                          setIsMobileMenuOpen(false)
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        {t('common.signin')}
                      </Button>
                      <Button
                        onClick={() => {
                          setAuthMode('signup')
                          setShowAuthModal(true)
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full bg-black text-white hover:bg-stone-800"
                      >
                        {t('common.signup')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}