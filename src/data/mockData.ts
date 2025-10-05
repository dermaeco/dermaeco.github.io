import { SkincareEntry, Product, InfluencerProfile, RoutineRecommendation, CreatorStats } from '@/types'

export const mockSkincareEntries: SkincareEntry[] = [
  {
    id: '1',
    user_id: 'user1',
    title: '30-Day Serum & Moisturizer Combination Record',
    content: 'Using Lancôme Advanced Génifique serum with Estée Lauder Nutritious Pomegranate moisturizer, skin condition improved significantly. Need to control morning dosage to avoid pilling.',
    before_photo_url: '/images/before-1.jpg',
    after_photo_url: '/images/after-1.jpg',
    tags: ['Hydration', 'Anti-aging', 'Serums', 'Lancôme', 'Estée Lauder'],
    privacy_setting: 'public',
    likes_count: 234,
    comments_count: 18,
    is_featured: true,
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
    author: {
      id: 'user1',
      full_name: 'Skincare Expert Emma',
      avatar_url: '/images/avatar-1.jpg',
      is_verified: true
    }
  },
  {
    id: '2',
    user_id: 'user2',
    title: 'Sensitive Skin Recovery Journey',
    content: '60-day journey from rosacea to healthy skin. Key focus on gentle cleansing and adequate moisturizing, avoiding over-stimulation. La Roche-Posay Toleriane series highly recommended.',
    before_photo_url: '/images/before-2.jpg',
    after_photo_url: '/images/after-2.jpg',
    tags: ['Sensitive Skin', 'Recovery', 'La Roche-Posay', 'Gentle Care'],
    privacy_setting: 'public',
    likes_count: 156,
    comments_count: 23,
    is_featured: false,
    created_at: '2025-01-14T15:20:00Z',
    updated_at: '2025-01-14T15:20:00Z',
    author: {
      id: 'user2',
      full_name: 'Sensitive Skin Specialist',
      avatar_url: '/images/avatar-2.jpg',
      is_verified: false
    }
  },
  {
    id: '3',
    user_id: 'user3',
    title: 'Winter Hydration Strategy Guide',
    content: 'Winter moisture retention tips for dry climate conditions, complete routine from cleanser to night cream. Especially recommend SK-II Facial Treatment Essence with Avène Tolerance cream.',
    tags: ['Winter Skincare', 'Hydration', 'SK-II', 'Avène'],
    privacy_setting: 'public',
    likes_count: 89,
    comments_count: 12,
    is_featured: false,
    created_at: '2025-01-13T09:15:00Z',
    updated_at: '2025-01-13T09:15:00Z',
    author: {
      id: 'user3',
      full_name: 'Winter Skincare Pro',
      avatar_url: '/images/avatar-3.jpg',
      is_verified: true
    }
  }
]

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Advanced Génifique Serum',
    brand: 'Lancôme',
    category: 'Serum',
    price_min: 85,
    price_max: 180,
    currency: 'EUR',
    image_url: '/images/lancome-serum.jpg',
    rating: 4.6,
    review_count: 2340,
    key_ingredients: ['Bifida Ferment Lysate', 'Adenosine', 'Niacinamide'],
    skin_types: ['All Skin Types', 'Dull Skin', 'Mature Skin'],
    concerns_addressed: ['Brightening', 'Anti-aging', 'Skin Barrier Repair'],
    affiliate_url: 'https://example.com/lancome-serum'
  },
  {
    id: 'prod2',
    name: 'Nutritious Pomegranate Radiant Energy Lotion',
    brand: 'Estée Lauder',
    category: 'Toner',
    price_min: 60,
    price_max: 95,
    currency: 'EUR',
    image_url: '/images/estee-lauder-toner.jpg',
    rating: 4.4,
    review_count: 1560,
    key_ingredients: ['Pomegranate Extract', 'Hyaluronic Acid', 'Niacinamide'],
    skin_types: ['Dry Skin', 'Combination Skin', 'Dull Skin'],
    concerns_addressed: ['Hydration', 'Brightening', 'Antioxidant Protection'],
    affiliate_url: 'https://example.com/estee-lauder-toner'
  },
  {
    id: 'prod3',
    name: 'Facial Treatment Essence',
    brand: 'SK-II',
    category: 'Essence',
    price_min: 99,
    price_max: 230,
    currency: 'EUR',
    image_url: '/images/skii-essence.jpg',
    rating: 4.7,
    review_count: 4520,
    key_ingredients: ['Pitera™ Yeast Extract', 'Niacinamide', 'Adenosine'],
    skin_types: ['All Skin Types', 'Dull Skin', 'Rough Texture'],
    concerns_addressed: ['Texture Improvement', 'Brightening', 'Hydration'],
    affiliate_url: 'https://example.com/skii-essence'
  }
]

export const mockInfluencers: InfluencerProfile[] = [
  {
    id: 'inf1',
    user_id: 'user1',
    status: 'verified',
    verification_level: 'gold',
    specialty_areas: ['Anti-aging Skincare', 'Luxury Skincare', 'Ingredient Analysis'],
    follower_count: 15420,
    engagement_rate: 8.5,
    commission_rate: 15,
    total_earnings: 23560,
    created_at: '2024-06-15T08:00:00Z'
  },
  {
    id: 'inf2',
    user_id: 'user2',
    status: 'verified',
    verification_level: 'silver',
    specialty_areas: ['Sensitive Skin Care', 'Affordable Skincare', 'Repair Products'],
    follower_count: 8930,
    engagement_rate: 12.3,
    commission_rate: 12,
    total_earnings: 12340,
    created_at: '2024-08-20T14:30:00Z'
  }
]

export const mockRoutineRecommendations: RoutineRecommendation[] = [
  {
    id: 'routine1',
    title: 'Winter Dry Weather Skincare Routine',
    description: 'Deep moisturizing care for low temperature and low humidity environments',
    weather_conditions: ['Temperature <15°C', 'Humidity <50%', 'Strong winds'],
    skin_types: ['Dry Skin', 'Combination Skin'],
    time_of_day: 'evening',
    steps: [
      {
        id: 'step1',
        step_number: 1,
        product_category: 'Cleanser',
        instruction: 'Use gentle cleanser, avoid over-cleansing',
        duration: '1-2 minutes'
      },
      {
        id: 'step2',
        step_number: 2,
        product_category: 'Essence Toner',
        instruction: 'Pat until fully absorbed, can repeat 2-3 times',
        duration: '3-5 minutes'
      },
      {
        id: 'step3',
        step_number: 3,
        product_category: 'Serum',
        instruction: 'Focus application on dry areas',
        duration: '2-3 minutes'
      },
      {
        id: 'step4',
        step_number: 4,
        product_category: 'Moisturizer',
        instruction: 'Choose nourishing cream, massage until absorbed',
        duration: '3-5 minutes'
      }
    ]
  },
  {
    id: 'routine2',
    title: 'High Temperature High Humidity Fresh Care',
    description: 'Oil control and moisturizing solution for summer or humid environments',
    weather_conditions: ['Temperature >25°C', 'Humidity >70%', 'UV Index >6'],
    skin_types: ['Oily Skin', 'Combination Skin'],
    time_of_day: 'morning',
    steps: [
      {
        id: 'step1',
        step_number: 1,
        product_category: 'Cleanser',
        instruction: 'Use oil-control cleanser, focus on T-zone',
        duration: '2-3 minutes'
      },
      {
        id: 'step2',
        step_number: 2,
        product_category: 'Toner',
        instruction: 'Choose refreshing toner, avoid heavy texture',
        duration: '2 minutes'
      },
      {
        id: 'step3',
        step_number: 3,
        product_category: 'Sunscreen',
        instruction: 'Choose lightweight sunscreen, SPF30+',
        duration: '2 minutes'
      }
    ]
  }
]

export const mockCreatorStats: CreatorStats = {
  level: 'expert',
  total_posts: 127,
  total_likes: 5420,
  total_followers: 2340,
  engagement_rate: 8.7,
  earnings_this_month: 1560,
  total_earnings: 23450,
  commission_rate: 15
}