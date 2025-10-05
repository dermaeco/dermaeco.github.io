import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  onStartAnalysis: () => void
}

export function HeroSection({ onStartAnalysis }: HeroSectionProps) {
  const { t } = useTranslation()
  
  return (
    <section className="wabi-hero relative overflow-hidden pt-8 lg:pt-12">
      <div className="wabi-container relative">
        {/* Ultra-minimalist layout inspired by The Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start lg:items-center min-h-[75vh]">
          
          {/* Left side - Subtle feature text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-3 space-y-8 lg:space-y-12 order-2 lg:order-1"
          >
            <div className="text-left lg:text-left">
              <p className="text-luxury-xs lg:text-luxury-sm text-wabi-mushroom font-light tracking-wide mb-2">
                AI-POWERED
              </p>
              <p className="text-luxury-xs lg:text-luxury-sm text-wabi-charcoal leading-relaxed font-light">
                Advanced computer vision technology for accurate skin assessment
              </p>
            </div>
            
            <div className="text-left lg:text-left">
              <p className="text-luxury-xs lg:text-luxury-sm text-wabi-mushroom font-light tracking-wide mb-2">
                TRUSTED RECOMMENDATIONS
              </p>
              <p className="text-luxury-xs lg:text-luxury-sm text-wabi-charcoal leading-relaxed font-light">
                Unbiased recommendations from premium, trustworthy brands
              </p>
            </div>
          </motion.div>
          
          {/* Center - Hero content and image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 text-center space-y-6 lg:space-y-8 order-1 lg:order-2"
          >
            {/* Enhanced headline with properly sized titles */}
            <div className="space-y-6 lg:space-y-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-wabi-obsidian leading-[0.9] tracking-tight">
                Discover Your Skin's True Potential
              </h1>
              
              <p className="text-sm md:text-base lg:text-lg text-wabi-charcoal font-light leading-relaxed max-w-2xl mx-auto">
                Cutting-edge AI-powered skin analysis with personalized skincare recommendations
              </p>
            </div>
            
            {/* Hero Image - More subtle, less visually dominant */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="wabi-hero-image my-6 lg:my-8"
            >
              <img 
                src="/images/wabi-sabi-hero.png" 
                alt="DermaEco Hero" 
                className="opacity-75 hover:opacity-90 transition-opacity duration-300 max-w-md mx-auto"
              />
            </motion.div>
            
            {/* Minimal CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button 
                size="md" 
                onClick={onStartAnalysis}
                className="group relative overflow-hidden bg-wabi-obsidian hover:bg-wabi-earth text-wabi-cream font-light tracking-wider px-6 lg:px-8 py-2 lg:py-3"
              >
                <Sparkles className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                {t('hero.cta')}
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right side - Enhanced content with science focus and GDPR */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="lg:col-span-3 text-left lg:text-right order-3 lg:order-3 space-y-8"
          >
            {/* New Science Focus Section */}
            <div className="space-y-3 lg:space-y-4">
              <p className="text-luxury-xs lg:text-luxury-sm text-wabi-mushroom font-light tracking-wide mb-2">
                EVIDENCE-BASED
              </p>
              <p className="text-luxury-xs lg:text-luxury-sm text-wabi-charcoal leading-relaxed font-light">
                Scientifically-backed analysis with environmentally conscious recommendations for sustainable beauty
              </p>
            </div>
            
            {/* GDPR Compliance */}
            <div className="space-y-3 lg:space-y-4">
              <p className="text-luxury-xs lg:text-luxury-sm text-wabi-mushroom font-light tracking-wide mb-2">
                GDPR COMPLIANT
              </p>
              <p className="text-luxury-xs lg:text-luxury-sm text-wabi-charcoal leading-relaxed font-light">
                Your privacy and data security are our top priorities
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
