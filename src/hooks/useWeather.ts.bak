import { useState, useEffect } from 'react'
import { WeatherData } from '@/types'
import { supabase } from '@/integrations/supabase/client'

interface GeolocationPosition {
  coords: {
    latitude: number
    longitude: number
  }
}

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('地理位置服务不可用'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      )
    })
  }

  const fetchWeatherData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Try to get user location
      let latitude = 31.2304 // Default: Shanghai
      let longitude = 121.4737
      
      try {
        const position = await getLocation()
        latitude = position.coords.latitude
        longitude = position.coords.longitude
      } catch (locationError) {
        console.log('Could not get location, using default:', locationError.message)
        setError('无法获取精确位置，使用默认天气数据')
      }
      
      // Call our weather API edge function
      const { data, error: apiError } = await supabase.functions.invoke('weather-routine-recommendations', {
        body: {
          latitude,
          longitude,
          userSkinType: 'mixed', // Could be passed from user profile
          userConcerns: ['保湿', '防晒'] // Could be passed from user profile
        }
      })
      
      if (apiError) {
        console.error('Weather API error:', apiError)
        throw new Error('获取天气数据失败')
      }
      
      if (data?.data?.weather) {
        setWeatherData(data.data.weather)
      } else {
        throw new Error('天气数据格式错误')
      }
      
    } catch (err: any) {
      console.error('Weather fetch error:', err)
      
      // Fallback to mock data
      const fallbackData: WeatherData = {
        temperature: 22,
        humidity: 65,
        uv_index: 5,
        air_quality: 85,
        location: '当前位置',
        conditions: '多云'
      }
      
      setWeatherData(fallbackData)
      setError(err.message || '获取天气数据失败，使用默认数据')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [])

  return {
    weatherData,
    loading,
    error,
    refreshWeather: fetchWeatherData
  }
}