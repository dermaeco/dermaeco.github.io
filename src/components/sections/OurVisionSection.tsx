import React from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, Eye, TrendingUp, Database, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface OurVisionSectionProps {
  onBack?: () => void
}

export function OurVisionSection({ onBack }: OurVisionSectionProps) {
  const { t } = useTranslation()

  const businessAssumptions = [
    {
      icon: TrendingUp,
      title: "Advanced Skincare Made Accessible",
      description: "Making professional-grade, personalized skin analysis accessible to everyone through cutting-edge AI technology that breaks down barriers to expert skincare guidance."
    },
    {
      icon: Database,
      title: "Evidence-Based Community Building",
      description: "Fostering a collaborative community founded on scientific research and data-driven insights that promotes healthy lifestyle practices and informed skincare decisions."
    },
    {
      icon: Users,
      title: "Sustainable Beauty Solutions", 
      description: "Promoting eco-friendly skincare practices through locally-sourced product recommendations that support regional brands and reduce environmental impact."
    }
  ]

  return (
    <div className="min-h-screen bg-warm-50 py-20">
      <div className="wabi-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Eye className="w-12 h-12 text-stone-800" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
            Our Vision
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Transforming skincare through intelligent technology and sustainable practices
          </p>
        </motion.div>

        {/* Business Assumptions */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-light text-stone-900 mb-12 text-center">
            Advanced AI Technology for Universal Access
          </h2>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {businessAssumptions.map((assumption, index) => {
              const Icon = assumption.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-lg p-8 shadow-soft hover:shadow-softer transition-shadow duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-stone-700" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-stone-900 mb-4">
                    {assumption.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    {assumption.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* GDPR Compliance Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg p-8 md:p-12 shadow-soft"
        >
          <div className="flex items-center mb-8">
            <Shield className="w-8 h-8 text-stone-700 mr-3" />
            <h2 className="text-3xl font-light text-stone-900">
              GDPR Compliance
            </h2>
          </div>
          
          <p className="text-lg text-stone-600 mb-8">
            We are committed to protecting your privacy and ensuring full compliance with the General Data Protection Regulation (GDPR).
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-medium text-stone-900 mb-4">
                Data Protection
              </h3>
              <p className="text-stone-600">
                We implement comprehensive security measures to protect your personal data and ensure it is processed lawfully and transparently.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-stone-900 mb-4">
                User Rights
              </h3>
              <p className="text-stone-600">
                You have the right to access, rectify, or delete your personal data, as well as to restrict or object to its processing.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-stone-900 mb-4">
                Consent
              </h3>
              <p className="text-stone-600">
                We obtain clear and explicit consent before processing your data and allow you to withdraw consent at any time.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Back Button */}
        {onBack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={onBack}
              className="px-8 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors duration-200 rounded-lg"
            >
              Back
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
