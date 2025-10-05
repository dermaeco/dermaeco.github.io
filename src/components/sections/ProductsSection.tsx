import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  ExternalLink, 
  MapPin,
  Award,
  Filter,
  Search
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useSkinAnalysis } from '@/hooks/useSkinAnalysis'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  price_min: number
  price_max: number
  currency: string
  image_url?: string
  country_origin: string
  skin_types: string[]
  concerns_addressed: string[]
  key_ingredients: string[]
  rating?: number
  recommendation_score: number
  recommendation_reason: string
  priority_level: number
  purchase_urls: {
    official?: string
    amazon?: string
    sephora?: string
    douglas?: string
    [key: string]: string | undefined
  }
}

interface ProductsSectionProps {
  analysisId: string
  onBack: () => void
}

export function ProductsSection({ analysisId, onBack }: ProductsSectionProps) {
  const { t } = useTranslation()
  const { getRecommendations } = useSkinAnalysis()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await getRecommendations(analysisId)
        setProducts(data.recommendations || [])
      } catch (error) {
        console.error('Failed to load recommendations:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (analysisId) {
      loadRecommendations()
    }
  }, [analysisId, getRecommendations])
  
  const categories = ['all', 'serum', 'moisturizer', 'cleanser', 'toner', 'facial_oil']
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter)
  
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }
  
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Switzerland': '🇨🇭',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'United Kingdom': '🇬🇧'
    }
    return flags[country] || '🇪🇺'
  }
  
  if (loading) {
    return (
      <section className="wabi-section">
        <div className="wabi-container max-w-6xl">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-gray-200 border-t-sage-500 rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">
              Curating Recommendations
            </h2>
            <p className="text-stone-600">Finding the perfect products for your skin...</p>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="wabi-section">
      <div className="wabi-container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mb-4">
              {t('products.title')}
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>
        </motion.div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-stone-600" />
                  <span className="text-stone-700 font-medium">Filter by category:</span>
                </div>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      filter === category
                        ? 'bg-black text-white shadow-softer'
                        : 'bg-white text-stone-600 hover:bg-gray-50 border border-stone-200'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-wabi transition-all duration-300 group">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-warm-100 to-gray-100 rounded-t-2xl relative overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-stone-400" />
                      </div>
                    )}
                    
                    {/* Priority Badge */}
                    {product.priority_level <= 2 && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>Top Pick</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          favorites.has(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-stone-400'
                        }`} 
                      />
                    </button>
                    
                    {/* Country Flag */}
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white/90 px-2 py-1 rounded-lg flex items-center space-x-1">
                        <span className="text-sm">{getCountryFlag(product.country_origin)}</span>
                        <span className="text-xs font-medium text-stone-700">{product.country_origin}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-serif font-semibold text-stone-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 font-medium">{product.brand}</p>
                    </div>
                    
                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 0) 
                                  ? 'text-amber-400 fill-current' 
                                  : 'text-stone-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-stone-600">({product.rating})</span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-stone-900">
                        {formatPrice(product.price_min, product.currency)}
                      </span>
                      {product.price_max > product.price_min && (
                        <span className="text-stone-600 ml-1">
                          - {formatPrice(product.price_max, product.currency)}
                        </span>
                      )}
                    </div>
                    
                    {/* Key Ingredients */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-stone-700 mb-2">{t('products.ingredients')}:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.key_ingredients.slice(0, 3).map((ingredient, i) => (
                          <span 
                            key={i}
                            className="text-xs bg-gray-100 text-black px-2 py-1 rounded-full"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {product.key_ingredients.length > 3 && (
                          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                            +{product.key_ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Recommendation Reason */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-stone-700">
                        <strong>Why this product:</strong> {product.recommendation_reason}
                      </p>
                    </div>
                    
                    {/* Purchase Links */}
                    <div className="space-y-2">
                      {Object.entries(product.purchase_urls).slice(0, 2).map(([store, url]) => (
                        url && (
                          <a
                            key={store}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button 
                              variant={store === 'official' ? 'primary' : 'secondary'}
                              size="sm"
                              className="w-full justify-between"
                            >
                              <span>Buy on {store.charAt(0).toUpperCase() + store.slice(1)}</span>
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-stone-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-stone-900 mb-2">
              No products found
            </h3>
            <p className="text-stone-600">Try adjusting your filters or check back later for new recommendations.</p>
          </div>
        )}
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button variant="secondary" onClick={onBack}>
            Back to Results
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
