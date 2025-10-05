import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, Bell, Calendar, Clock, Heart, Sun, Cloud, 
  Droplets, ArrowLeft, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

interface MySkinJourneySectionProps {
  onCreateReminder?: () => void
  onEditReminder?: (reminderId: string) => void
  onAddProduct?: () => void
  onViewProduct?: (productId: string) => void
  onViewFullRoutine?: (routineId: string) => void
  initialTab?: 'routine' | 'library' | 'reminders'
  onBack?: () => void
}

export function MySkinJourneySection({
  initialTab = 'routine',
  onBack
}: MySkinJourneySectionProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'routine' | 'library' | 'reminders'>(initialTab)

  // Mock data for guest mode
  const mockRoutine = {
    morning: [
      { step: 1, name: 'Gentle Cleanser', time: '30 seconds', icon: Droplets },
      { step: 2, name: 'Vitamin C Serum', time: '1 minute', icon: Sparkles },
      { step: 3, name: 'Moisturizer', time: '1 minute', icon: Cloud },
      { step: 4, name: 'SPF 50+', time: '1 minute', icon: Sun }
    ],
    evening: [
      { step: 1, name: 'Oil Cleanser', time: '1 minute', icon: Droplets },
      { step: 2, name: 'Water Cleanser', time: '30 seconds', icon: Droplets },
      { step: 3, name: 'Retinol Serum', time: '1 minute', icon: Sparkles },
      { step: 4, name: 'Night Cream', time: '1 minute', icon: Cloud }
    ]
  }

  const mockProducts = [
    {
      id: '1',
      name: 'Eucerin Vitamin C Booster',
      brand: 'Eucerin',
      category: 'Serum',
      opened: '2024-01-15',
      expires: '2024-07-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'La Roche-Posay Retinol',
      brand: 'La Roche-Posay',
      category: 'Treatment',
      opened: '2024-02-01',
      expires: '2024-08-01',
      status: 'active'
    },
    {
      id: '3',
      name: 'CeraVe Moisturizing Cream',
      brand: 'CeraVe',
      category: 'Moisturizer',
      opened: '2023-12-10',
      expires: '2024-06-10',
      status: 'expiring-soon'
    }
  ]

  const mockReminders = [
    {
      id: '1',
      title: 'Morning Skincare Routine',
      time: '08:00',
      frequency: 'Daily',
      active: true
    },
    {
      id: '2',
      title: 'Evening Skincare Routine',
      time: '22:00',
      frequency: 'Daily',
      active: true
    },
    {
      id: '3',
      title: 'Retinol Night (Mon, Wed, Fri)',
      time: '21:30',
      frequency: 'Custom',
      active: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            My Skin Journey
          </h1>
          <p className="text-muted-foreground">
            Track your products, routines, and progress
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <Button
            variant={activeTab === 'routine' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('routine')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Smart Routine
          </Button>
          <Button
            variant={activeTab === 'library' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('library')}
          >
            <Package className="w-4 h-4 mr-2" />
            Product Library
          </Button>
          <Button
            variant={activeTab === 'reminders' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('reminders')}
          >
            <Bell className="w-4 h-4 mr-2" />
            Reminders
          </Button>
        </div>

        {/* Guest Mode Notice */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              👋 This is a preview. Sign up to create your personalized routine and track your products!
            </p>
          </CardContent>
        </Card>

        {/* Content */}
        {activeTab === 'routine' && (
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    Morning Routine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRoutine.morning.map((step) => {
                      const Icon = step.icon
                      return (
                        <div key={step.step} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          <Icon className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{step.name}</p>
                            <p className="text-xs text-muted-foreground">{step.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    Evening Routine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRoutine.evening.map((step) => {
                      const Icon = step.icon
                      return (
                        <div key={step.step} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          <Icon className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{step.name}</p>
                            <p className="text-xs text-muted-foreground">{step.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="grid gap-4">
            {mockProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.brand} • {product.category}
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Opened: {product.opened}</span>
                          <span>Expires: {product.expires}</span>
                        </div>
                      </div>
                      <Badge variant={product.status === 'expiring-soon' ? 'destructive' : 'secondary'}>
                        {product.status === 'expiring-soon' ? 'Expiring Soon' : 'Active'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="grid gap-4">
            {mockReminders.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Bell className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold">{reminder.title}</h3>
                          <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {reminder.time}
                            </span>
                            <span>•</span>
                            <span>{reminder.frequency}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={reminder.active ? 'secondary' : 'outline'}>
                        {reminder.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
