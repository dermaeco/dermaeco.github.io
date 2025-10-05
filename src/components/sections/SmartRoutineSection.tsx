import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, WeatherRoutine } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Cloud, 
  Sun, 
  Moon,
  Droplets, 
  Wind, 
  Thermometer, 
  MapPin, 
  Clock, 
  Sparkles,
  ShoppingBag,
  Bell,
  Calendar,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SmartRoutineProps {
  onBack?: () => void
}

export function SmartRoutineSection({ onBack }: SmartRoutineProps) {
  const { user } = useAuth()
  const [location, setLocation] = useState('')
  const [skinType, setSkinType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [routineData, setRoutineData] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [userProducts, setUserProducts] = useState<any[]>([])
  const [reminderSettings, setReminderSettings] = useState({
    morningReminder: true,
    eveningReminder: true,
    weatherAlerts: true,
    frequency: 'daily'
  })
  const [recentRoutines, setRecentRoutines] = useState<WeatherRoutine[]>([])

  useEffect(() => {
    if (user) {
      loadUserProducts()
      loadRecentRoutines()
    }
  }, [user])

  const loadUserProducts = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('user_products')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setUserProducts(data || [])
    } catch (error) {
      console.error('Error loading user products:', error)
    }
  }
  
  const loadRecentRoutines = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('weather_routines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      setRecentRoutines(data || [])
    } catch (error) {
      console.error('Error loading recent routines:', error)
    }
  }

  const generateSmartRoutine = async () => {
    if (!location.trim() || !skinType) {
      toast.error('请填写城市和肤质信息')
      return
    }
    
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.functions.invoke('weather-routine-recommendation', {
        body: {
          location: location.trim(),
          skinType: skinType,
          userProducts: userProducts
        }
      })
      
      if (error) throw error
      
      setWeatherData(data.data.weather)
      setRoutineData(data.data.routine)
      setRecommendations(data.data.recommendations)
      
      toast.success('智能护肤方案生成成功！')
      
      // Reload recent routines
      loadRecentRoutines()
      
    } catch (error) {
      console.error('Error generating routine:', error)
      toast.error('生成失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }
  
  const setupNotifications = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('smart-notifications', {
        body: {
          userId: user.id,
          notificationType: 'all',
          weatherData: weatherData,
          userPreferences: {
            skinType: skinType,
            reminderSettings: reminderSettings
          }
        }
      })
      
      if (error) throw error
      
      toast.success('智能提醒设置成功！')
    } catch (error) {
      console.error('Error setting up notifications:', error)
      toast.error('设置失败，请重试')
    }
  }
  
  const WeatherCard = ({ data }: { data: any }) => {
    if (!data) return null
    
    const temp = data.main?.temp || 0
    const humidity = data.main?.humidity || 0
    const weather = data.weather?.[0]?.description || ''
    const uvIndex = data.uvi || 0
    
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">当前天气</h3>
          <MapPin className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{Math.round(temp)}°C</p>
            <p className="text-sm text-gray-500">温度</p>
          </div>
          
          <div className="text-center">
            <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{humidity}%</p>
            <p className="text-sm text-gray-500">湿度</p>
          </div>
          
          <div className="text-center">
            <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{uvIndex}</p>
            <p className="text-sm text-gray-500">紫外线</p>
          </div>
          
          <div className="text-center">
            <Cloud className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <p className="text-lg font-medium capitalize">{weather}</p>
            <p className="text-sm text-gray-500">天况</p>
          </div>
        </div>
      </Card>
    )
  }
  
  const RoutineStepCard = ({ step, type }: { step: any, type: 'morning' | 'evening' }) => {
    return (
      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
          {step.step}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm mb-1">{step.product_type}</h4>
          <p className="text-sm text-gray-600 mb-2">{step.instruction}</p>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {step.duration}
            </Badge>
            {step.priority && (
              <Badge 
                variant={step.priority === 'critical' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {step.priority === 'critical' ? '必需' : '推荐'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  const RecommendationCard = ({ rec }: { rec: any }) => {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">{rec.product_name}</h4>
          <Badge 
            variant={rec.priority === 'critical' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {rec.priority === 'critical' ? '必需' : '推荐'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{rec.category}</span>
          <Button size="sm" variant="outline" className="text-xs px-3">
            <ShoppingBag className="w-3 h-3 mr-1" />
            购买
          </Button>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="wabi-container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-light tracking-wider text-black">
              智能护肤推荐
            </h1>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              基于实时天气和您的肤质，量身定制每日护肤方案
            </p>
          </div>
        </div>
      </div>
      
      <div className="wabi-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Input Section */}
            <Card className="p-6">
              <h2 className="font-medium text-xl mb-6">生成智能方案</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">当前城市</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="如：北京、上海、广州"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>肌肤类型</Label>
                  <Select value={skinType} onValueChange={setSkinType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择您的肌肤类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry">干性肌肤</SelectItem>
                      <SelectItem value="oily">油性肌肤</SelectItem>
                      <SelectItem value="combination">混合性肌肤</SelectItem>
                      <SelectItem value="sensitive">敏感性肌肤</SelectItem>
                      <SelectItem value="normal">中性肌肤</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                onClick={generateSmartRoutine}
                disabled={isLoading}
                className="w-full mt-6 bg-black text-white hover:bg-gray-800 h-12"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>生成中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>生成智能方案</span>
                  </div>
                )}
              </Button>
            </Card>
            
            {/* Weather Data */}
            {weatherData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <WeatherCard data={weatherData} />
              </motion.div>
            )}
            
            {/* Routine Display */}
            {routineData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Special Notes */}
                {routineData.special_notes && routineData.special_notes.length > 0 && (
                  <Card className="p-6">
                    <h3 className="font-medium text-lg mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-500" />
                      今日护肤重点
                    </h3>
                    <div className="space-y-2">
                      {routineData.special_notes.map((note: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <p className="text-sm text-gray-700">{note}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                
                {/* Morning Routine */}
                <Card className="p-6">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                    晨间护肤方案
                  </h3>
                  <div className="space-y-4">
                    {routineData.morning?.map((step: any, index: number) => (
                      <RoutineStepCard key={index} step={step} type="morning" />
                    ))}
                  </div>
                </Card>
                
                {/* Evening Routine */}
                <Card className="p-6">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Moon className="w-5 h-5 mr-2 text-indigo-500" />
                    晚间护肤方案
                  </h3>
                  <div className="space-y-4">
                    {routineData.evening?.map((step: any, index: number) => (
                      <RoutineStepCard key={index} step={step} type="evening" />
                    ))}
                  </div>
                </Card>
                
                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    onClick={setupNotifications}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    设置智能提醒
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    保存方案
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-4">推荐产品</h3>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <RecommendationCard key={index} rec={rec} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Reminder Settings */}
            <Card className="p-6">
              <h3 className="font-medium text-lg mb-4">提醒设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="morning-reminder" className="text-sm">
                    晨间提醒
                  </Label>
                  <Switch
                    id="morning-reminder"
                    checked={reminderSettings.morningReminder}
                    onCheckedChange={(checked) => 
                      setReminderSettings(prev => ({ ...prev, morningReminder: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="evening-reminder" className="text-sm">
                    晚间提醒
                  </Label>
                  <Switch
                    id="evening-reminder"
                    checked={reminderSettings.eveningReminder}
                    onCheckedChange={(checked) => 
                      setReminderSettings(prev => ({ ...prev, eveningReminder: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="weather-alerts" className="text-sm">
                    天气警告
                  </Label>
                  <Switch
                    id="weather-alerts"
                    checked={reminderSettings.weatherAlerts}
                    onCheckedChange={(checked) => 
                      setReminderSettings(prev => ({ ...prev, weatherAlerts: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-sm">提醒频率</Label>
                  <Select 
                    value={reminderSettings.frequency} 
                    onValueChange={(value) => 
                      setReminderSettings(prev => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">每日</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
            
            {/* Recent Routines */}
            {recentRoutines.length > 0 && (
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">历史方案</h3>
                <div className="space-y-3">
                  {recentRoutines.map((routine) => (
                    <div key={routine.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{routine.location_name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(routine.created_at).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>{routine.temperature}°C</span>
                        <span>{routine.humidity}% 湿度</span>
                        <span>UV {routine.uv_index}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Tips */}
            <Card className="p-6">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                护肤小贴士
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>💡 根据天气调整护肤品，让肌肤时刻保持最佳状态</p>
                <p>🌡️ 温度每变化5°C，建议调整保湿力度</p>
                <p>☀️ UV指数超过6时，务必使用SPF30+防晒</p>
                <p>💧 湿度低于30%时，加强补水护理</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}