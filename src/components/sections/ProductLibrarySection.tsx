import React, { useState, useEffect } from 'react'
import { Package, Star, Calendar, ShoppingCart, AlertCircle, CheckCircle, Clock, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { productService, userProductService, Product, UserProductLibrary } from '@/services/supabase'
import toast from 'react-hot-toast'

interface ProductLibrarySectionProps {
  onAddProduct?: () => void
  onViewProduct?: (productId: string) => void
}

export function ProductLibrarySection({ onAddProduct, onViewProduct }: ProductLibrarySectionProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'wishlist' | 'finished'>('current')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [userLibrary, setUserLibrary] = useState<(UserProductLibrary & { product?: Product })[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [userProductsData, productsData] = await Promise.all([
          userProductService.getAll(),
          productService.getAll()
        ])
        
        // Create a product lookup map
        const productMap = new Map(productsData.map(p => [p.id, p]))
        
        // Combine user products with product details
        const enrichedUserLibrary = userProductsData.map(userProduct => ({
          ...userProduct,
          product: userProduct.product_id ? productMap.get(userProduct.product_id) : undefined
        }))
        
        setUserLibrary(enrichedUserLibrary)
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching product library data:', error)
        toast.error('Failed to load product library')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const tabs = [
    { key: 'current', label: 'Currently Using', icon: Package, count: userLibrary.filter(p => p.status === 'current').length },
    { key: 'wishlist', label: 'Wishlist', icon: Heart, count: userLibrary.filter(p => p.status === 'wishlist').length },
    { key: 'finished', label: 'Finished', icon: CheckCircle, count: userLibrary.filter(p => p.status === 'finished').length }
  ]

  const filteredProducts = userLibrary.filter(item => item.status === activeTab)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'text-green-600 bg-green-100'
      case 'wishlist': return 'text-blue-600 bg-blue-100'
      case 'finished': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'current': return '使用中'
      case 'wishlist': return '心愿清单'
      case 'finished': return '已用完'
      default: return '未知'
    }
  }

  return (
    <section className="bg-white py-16">
      <div className="wabi-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-light text-stone-900 mb-4">
              产品库管理
            </h2>
            <p className="text-stone-600 text-lg font-light">
              管理你的护肤产品，记录使用心得
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-stone-600'
                }`}
              >
                <Package className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-stone-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            <Button 
              onClick={onAddProduct}
              className="bg-black text-white hover:bg-stone-800"
            >
              添加产品
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-stone-100 rounded-lg p-1 mb-8 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 rounded ${
                  activeTab === tab.key
                    ? 'bg-white text-black shadow-sm'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="ml-1 text-xs bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-stone-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Package className="w-5 h-5 text-green-500" />
              <span className="text-sm text-stone-600">Total Products</span>
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              {userLibrary.length}
            </div>
          </div>
          
          <div className="bg-stone-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-stone-600">Average Rating</span>
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              {userLibrary.filter(p => p.rating).length > 0 
                ? (userLibrary.filter(p => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0) / userLibrary.filter(p => p.rating).length).toFixed(1)
                : 'N/A'
              }
            </div>
          </div>
          
          <div className="bg-stone-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-stone-600">Running Low</span>
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              {userLibrary.filter(p => p.status === 'current').length}
            </div>
          </div>
          
          <div className="bg-stone-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-stone-600">This Month</span>
            </div>
            <div className="text-2xl font-semibold text-stone-900">
              €{userLibrary.filter(p => p.purchase_date && new Date(p.purchase_date) > new Date(Date.now() - 30*24*60*60*1000)).length * 65}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-stone-400 mx-auto mb-4 animate-pulse" />
            <p className="text-stone-600">Loading your product library...</p>
          </div>
        ) : (
          /* Product Grid/List */
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} item={item} onView={() => onViewProduct?.(item.product_id || item.id)} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((item) => (
                <ProductListItem key={item.id} item={item} onView={() => onViewProduct?.(item.product_id || item.id)} />
              ))}
            </div>
          )
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              还没有{getStatusLabel(activeTab)}的产品
            </h3>
            <p className="text-stone-600 mb-6">
              快来添加你的第一个产品吧
            </p>
            <Button 
              onClick={onAddProduct}
              className="bg-black text-white hover:bg-stone-800"
            >
              添加产品
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

interface ProductCardProps {
  item: UserProductLibrary & { product?: Product }
  onView: () => void
}

function ProductCard({ item, onView }: ProductCardProps) {
  const statusColor = getStatusColor(item.status)
  
  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        {/* Product Image Placeholder */}
        <div className="w-full h-32 bg-stone-100 rounded-lg mb-4 flex items-center justify-center">
          <Package className="w-8 h-8 text-stone-400" />
        </div>
        
        {/* Product Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-stone-900 line-clamp-1">
              {item.product?.name || item.product_name}
            </h3>
            <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
              {getStatusLabel(item.status)}
            </span>
          </div>
          <p className="text-sm text-stone-600 mb-2">
            {item.product?.brand || item.brand}
          </p>
          
          {/* Rating */}
          {item.rating && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < item.rating! ? 'text-yellow-400 fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-600">({item.rating})</span>
            </div>
          )}
          
          {/* Purchase Date */}
          {item.purchase_date && (
            <div className="flex items-center space-x-2 text-xs text-stone-500">
              <Calendar className="w-3 h-3" />
              <span>购于 {new Date(item.purchase_date).toLocaleDateString('zh-CN')}</span>
            </div>
          )}
        </div>
        
        {/* Review */}
        {item.review && (
          <div className="mb-4">
            <p className="text-sm text-stone-600 line-clamp-2">
              {item.review}
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            onClick={onView}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            查看详情
          </Button>
          {item.repurchase_intent && (
            <Button 
              size="sm"
              className="bg-black text-white hover:bg-stone-800"
            >
              再次购买
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface ProductListItemProps {
  item: UserProductLibrary & { product?: Product }
  onView: () => void
}

function ProductListItem({ item, onView }: ProductListItemProps) {
  const statusColor = getStatusColor(item.status)
  
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-stone-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="font-medium text-stone-900">
                {item.product?.name || item.product_name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
                {getStatusLabel(item.status)}
              </span>
            </div>
            <p className="text-sm text-stone-600 mb-2">
              {item.product?.brand || item.brand} · {item.product?.category || item.category}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-stone-500">
              {item.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{item.rating}</span>
                </div>
              )}
              {item.purchase_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.purchase_date).toLocaleDateString('zh-CN')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onView}
            variant="outline"
            size="sm"
          >
            查看
          </Button>
          {item.repurchase_intent && (
            <Button 
              size="sm"
              className="bg-black text-white hover:bg-stone-800"
            >
              再次购买
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'current': return 'text-green-600 bg-green-100'
    case 'wishlist': return 'text-blue-600 bg-blue-100'
    case 'finished': return 'text-gray-600 bg-gray-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'current': return '使用中'
    case 'wishlist': return '心愿清单'
    case 'finished': return '已用完'
    default: return '未知'
  }
}