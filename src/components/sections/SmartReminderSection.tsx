import React, { useState } from 'react'
import { Bell, Clock, Calendar, Thermometer, Sun, Droplets, ShoppingCart, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Reminder } from '@/types'

interface SmartReminderSectionProps {
  onCreateReminder?: () => void
  onEditReminder?: (reminderId: string) => void
}

export function SmartReminderSection({ onCreateReminder, onEditReminder }: SmartReminderSectionProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'weather' | 'product' | 'routine'>('active')
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)

  const tabs = [
    { key: 'active', label: '活跃提醒', icon: Bell },
    { key: 'weather', label: '天气提醒', icon: Sun },
    { key: 'product', label: '产品提醒', icon: ShoppingCart },
    { key: 'routine', label: '护肤提醒', icon: Clock }
  ]

  const toggleReminder = (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, is_active: !reminder.is_active }
        : reminder
    ))
  }

  const filteredReminders = reminders.filter(reminder => {
    if (activeTab === 'active') return reminder.is_active
    return reminder.type === activeTab
  })

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'routine': return <Clock className="w-4 h-4" />
      case 'product': return <ShoppingCart className="w-4 h-4" />
      case 'weather': return <Sun className="w-4 h-4" />
      case 'restock': return <ShoppingCart className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getReminderTypeColor = (type: string) => {
    switch (type) {
      case 'routine': return 'text-blue-600 bg-blue-100'
      case 'product': return 'text-green-600 bg-green-100'
      case 'weather': return 'text-yellow-600 bg-yellow-100'
      case 'restock': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <section className="bg-stone-50 py-16">
      <div className="wabi-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-light text-stone-900 mb-4">
              智能提醒系统
            </h2>
            <p className="text-stone-600 text-lg font-light">
              基于你的习惯和环境，提供个性化的护肤提醒
            </p>
          </div>
          <Button 
            onClick={onCreateReminder}
            className="bg-black text-white hover:bg-stone-800"
          >
            创建提醒
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-stone-600">活跃提醒</span>
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              {reminders.filter(r => r.is_active).length}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <span className="text-sm text-stone-600">今日任务</span>
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              5
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-stone-600">天气提醒</span>
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              3
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-stone-600">补货提醒</span>
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              2
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 rounded ${
                  activeTab === tab.key
                    ? 'bg-black text-white'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Today's Smart Recommendations */}
        {activeTab === 'active' && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-stone-900 mb-4">
              今日智能推荐
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-stone-900">防晒提醒</span>
                </div>
                <p className="text-sm text-stone-600">
                  今日UV指数6，建议使用SPF30+防晒产品
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-stone-900">保湿提醒</span>
                </div>
                <p className="text-sm text-stone-600">
                  湿度46%，空气较干燥，增加保湿步骤
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <ShoppingCart className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-stone-900">补货提醒</span>
                </div>
                <p className="text-sm text-stone-600">
                  你的精华液预计3天后用完
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reminder List */}
        <div className="space-y-4">
          {filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggle={() => toggleReminder(reminder.id)}
              onEdit={() => onEditReminder?.(reminder.id)}
              getReminderIcon={getReminderIcon}
              getReminderTypeColor={getReminderTypeColor}
            />
          ))}
        </div>

        {filteredReminders.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              还没有设置提醒
            </h3>
            <p className="text-stone-600 mb-6">
              创建你的第一个智能提醒吧
            </p>
            <Button 
              onClick={onCreateReminder}
              className="bg-black text-white hover:bg-stone-800"
            >
              创建提醒
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

interface ReminderCardProps {
  reminder: Reminder
  onToggle: () => void
  onEdit: () => void
  getReminderIcon: (type: string) => React.ReactNode
  getReminderTypeColor: (type: string) => string
}

function ReminderCard({ reminder, onToggle, onEdit, getReminderIcon, getReminderTypeColor }: ReminderCardProps) {
  const typeColor = getReminderTypeColor(reminder.type)
  
  return (
    <div className={`bg-white rounded-lg p-6 border-l-4 transition-all duration-300 ${
      reminder.is_active ? 'border-black' : 'border-stone-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`p-2 rounded-lg ${typeColor}`}>
            {getReminderIcon(reminder.type)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className={`font-medium ${
                reminder.is_active ? 'text-stone-900' : 'text-stone-500'
              }`}>
                {reminder.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded ${typeColor}`}>
                {getTypeLabel(reminder.type)}
              </span>
              {reminder.frequency && (
                <span className="text-xs text-stone-500">
                  {getFrequencyLabel(reminder.frequency)}
                </span>
              )}
            </div>
            
            <p className={`text-sm mb-3 ${
              reminder.is_active ? 'text-stone-600' : 'text-stone-400'
            }`}>
              {reminder.description}
            </p>
            
            {reminder.time && (
              <div className="flex items-center space-x-2 text-xs text-stone-500">
                <Clock className="w-3 h-3" />
                <span>提醒时间: {reminder.time}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggle}
            className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
              reminder.is_active ? 'bg-black' : 'bg-stone-300'
            }`}
          >
            <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform duration-200 ${
              reminder.is_active ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
          
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'routine': return '护肤提醒'
    case 'product': return '产品提醒'
    case 'weather': return '天气提醒'
    case 'restock': return '补货提醒'
    default: return '其他'
  }
}

function getFrequencyLabel(frequency: string) {
  switch (frequency) {
    case 'daily': return '每日'
    case 'weekly': return '每周'
    case 'monthly': return '每月'
    case 'custom': return '自定义'
    default: return '一次性'
  }
}

// Mock data for reminders
const mockReminders: Reminder[] = [
  {
    id: '1',
    user_id: 'user1',
    type: 'routine',
    title: '晚间护肤提醒',
    description: '时间进行你的晚间护肤程序，包括洁面、精华和面霜',
    frequency: 'daily',
    time: '21:00',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user1',
    type: 'weather',
    title: '高UV防晒提醒',
    description: '当UV指数超过6时，提醒你加强防晒保护',
    frequency: 'custom',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: 'user1',
    type: 'product',
    title: '精华液补货提醒',
    description: '你的兰蔻小黑瓶精华预计3天后用完',
    frequency: 'custom',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '4',
    user_id: 'user1',
    type: 'routine',
    title: '清洁面膜提醒',
    description: '每周使用1-2次清洁面膜，帮助清除毛孔污垢',
    frequency: 'weekly',
    time: '19:00',
    is_active: false,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '5',
    user_id: 'user1',
    type: 'weather',
    title: '干燥天气保湿提醒',
    description: '当湿度低于50%时，提醒增加保湿步骤',
    frequency: 'custom',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z'
  }
]