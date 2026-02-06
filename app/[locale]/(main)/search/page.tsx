'use client'

import React, { useEffect, useState, Suspense, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, Calendar, Wrench, AlertTriangle, Store, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProCard, Professional, ProCardSkeleton } from '@/components/cards/pro-card'
import { SponsoredCard } from '@/components/ads/sponsored-card'
import { MOCK_ADS } from '@/lib/ads-data'
import { createClient } from '@/lib/supabase/client'
import { useLocation } from '@/lib/context/location-context'
import { getCitiesForCountry } from '@/lib/locations'
import type { Profile } from '@/types/database'
import { Skeleton } from '@/components/ui/skeleton'
import { CITIES, CATEGORIES } from '@/lib/constants'
import { COMMUNITIES } from '@/lib/communities'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

// Service type definitions (all 4 types for filtering)
const SERVICE_TYPE_CONFIG = {
  services: { name: 'נותני שירות', icon: Wrench, color: 'bg-blue-500', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  appointment: { name: 'קביעת תור', icon: Calendar, color: 'bg-blue-500', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  project: { name: 'פרויקטים', icon: Wrench, color: 'bg-green-500', badgeColor: 'bg-green-50 text-green-700 border-green-200' },
  emergency: { name: 'חירום 24/6', icon: AlertTriangle, color: 'bg-red-500', badgeColor: 'bg-red-50 text-red-700 border-red-200' },
  retail: { name: 'קניות ומסחר', icon: Store, color: 'bg-purple-500', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
}

// Main homepage categories (2 main types)
const MAIN_FILTER_TYPES = {
  services: { name: 'נותני שירות', icon: Wrench, color: 'bg-blue-500', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200', dbTypes: ['appointment', 'project', 'emergency'] },
  retail: { name: 'קניות ומסחר', icon: Store, color: 'bg-purple-500', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200', dbTypes: ['retail'] },
}

// Convert database profile to display format
function profileToProfessional(profile: Profile & { media_urls?: string[], gallery_urls?: string[] }): Professional {
  const hasVideo = profile.media_urls && profile.media_urls.length > 0
  return {
    id: profile.id,
    name: profile.business_name,
    category: profile.categories?.[0] || 'כללי',
    city: profile.city,
    rating: profile.rating,
    reviews: profile.review_count,
    description: profile.description || '',
    isVerified: profile.is_verified,
    tags: [
      profile.is_verified ? 'מאומת' : null,
    ].filter(Boolean) as string[],
    avatarUrl: profile.avatar_url,
    hasVideo,
    serviceType: profile.service_type as Professional['serviceType'],
    gender: profile.gender as 'male' | 'female' | undefined,
    community: profile.community || undefined,
    galleryImages: profile.media_urls?.length ? profile.media_urls : (profile.avatar_url ? [profile.avatar_url] : []),
  }
}

// Using ProCardSkeleton from pro-card.tsx

// Video Viewer Modal
function VideoViewer({ pro, onClose }: { pro: Professional | null; onClose: () => void }) {
  if (!pro) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass-dark flex items-center justify-center"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          {pro.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pro.avatarUrl} alt={pro.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">{pro.name[0]}</span>
            </div>
          )}
        </div>
        <div className="text-white">
          <div className="font-bold">{pro.name}</div>
          <div className="text-xs text-white/70">{pro.category}</div>
        </div>
      </div>

      <div 
        className="relative max-w-md w-full h-[80vh] bg-black rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-white/60">
            <Play className="h-16 w-16 mx-auto mb-4" />
            <p>סרטון זמין בעמוד הפרופיל</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ITEMS_PER_PAGE = 12

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  // Initialize from URL params
  const initialServiceType = searchParams.get('serviceType')
  const initialCategory = searchParams.get('category')
  const initialCity = searchParams.get('city')
  const initialQuery = searchParams.get('q')
  
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState(initialQuery || '')
  const [selectedCity, setSelectedCity] = useState<string | null>(initialCity)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory)
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(initialServiceType)
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [onlyWithVideo, setOnlyWithVideo] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Professional | null>(null)
  
  const feedAds = MOCK_ADS.filter(ad => ad.placement === 'feed')
  const { selectedCountry: locationCountry } = useLocation()
  const countryCities = getCitiesForCountry(locationCountry, 'he')
  
  // Sync state with URL params when they change
  useEffect(() => {
    const urlServiceType = searchParams.get('serviceType')
    const urlCategory = searchParams.get('category')
    const urlCity = searchParams.get('city')
    const urlQuery = searchParams.get('q')
    
    // Update state from URL params
    setSelectedServiceType(urlServiceType)
    setSelectedCategory(urlCategory)
    setSelectedCity(urlCity)
    if (urlQuery !== null) {
      setSearchQuery(urlQuery)
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Count active filters
  const activeFiltersCount = [selectedCity, selectedCategory, selectedServiceType, selectedCommunity, onlyVerified, onlyWithVideo].filter(Boolean).length
  
  // Get page title based on service type
  const getPageTitle = () => {
    if (selectedServiceType && SERVICE_TYPE_CONFIG[selectedServiceType as keyof typeof SERVICE_TYPE_CONFIG]) {
      return SERVICE_TYPE_CONFIG[selectedServiceType as keyof typeof SERVICE_TYPE_CONFIG].name
    }
    return 'בעלי מקצוע'
  }

  // Build query with filters (for data fetching)
  const buildQuery = useCallback((supabase: ReturnType<typeof createClient>) => {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_active', true)
    
    // Apply country filter from location context
    if (locationCountry) {
      query = query.eq('country', locationCountry)
    }
    
    // Apply search filter
    if (searchQuery) {
      query = query.or(`business_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
    }
    
    // Apply city filter
    if (selectedCity) {
      query = query.eq('city', selectedCity)
    }
    
    // Apply category filter
    if (selectedCategory) {
      query = query.contains('categories', [selectedCategory])
    }
    
    // Apply service type filter
    if (selectedServiceType) {
      if (selectedServiceType === 'services') {
        // Combined filter for all service types (not retail)
        query = query.in('service_type', ['appointment', 'project', 'emergency'])
      } else {
        query = query.eq('service_type', selectedServiceType)
      }
    }
    
    // Apply community filter
    if (selectedCommunity) {
      query = query.eq('community', selectedCommunity)
    }
    
    // Apply verified filter
    if (onlyVerified) {
      query = query.eq('is_verified', true)
    }
    
    return query
  }, [searchQuery, selectedCity, selectedCategory, selectedServiceType, selectedCommunity, onlyVerified, locationCountry])

  // Build count query (separate to avoid double select)
  const buildCountQuery = useCallback((supabase: ReturnType<typeof createClient>) => {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    
    if (locationCountry) {
      query = query.eq('country', locationCountry)
    }
    
    if (searchQuery) {
      query = query.or(`business_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
    }
    if (selectedCity) {
      query = query.eq('city', selectedCity)
    }
    if (selectedCategory) {
      query = query.contains('categories', [selectedCategory])
    }
    if (selectedServiceType) {
      if (selectedServiceType === 'services') {
        query = query.in('service_type', ['appointment', 'project', 'emergency'])
      } else {
        query = query.eq('service_type', selectedServiceType)
      }
    }
    if (selectedCommunity) {
      query = query.eq('community', selectedCommunity)
    }
    if (onlyVerified) {
      query = query.eq('is_verified', true)
    }
    
    return query
  }, [searchQuery, selectedCity, selectedCategory, selectedServiceType, selectedCommunity, onlyVerified, locationCountry])

  // Initial fetch
  useEffect(() => {
    async function fetchProfessionals() {
      setLoading(true)
      setProfessionals([])
      setPage(0)
      setHasMore(true)
      setTotalCount(0)
      
      const supabase = createClient()
      
      // Get total count first
      const { count } = await buildCountQuery(supabase)
      setTotalCount(count || 0)
      
      // Get first page of data
      const query = buildQuery(supabase)
      const { data, error } = await query
        .order('rating', { ascending: false })
        .range(0, ITEMS_PER_PAGE - 1)
      
      if (error) {
        console.error('Error fetching professionals:', error)
      } else if (data) {
        // Convert to professionals
        let results = data.map(profileToProfessional)
        
        // Filter by video if needed
        if (onlyWithVideo) {
          results = results.filter(p => p.hasVideo)
        }
        
        // Sort: videos first, then by rating
        results.sort((a, b) => {
          if (a.hasVideo && !b.hasVideo) return -1
          if (!a.hasVideo && b.hasVideo) return 1
          return b.rating - a.rating
        })
        
        setProfessionals(results)
        setHasMore(data.length === ITEMS_PER_PAGE)
      }
      
      setLoading(false)
    }
    
    fetchProfessionals()
  }, [buildQuery, buildCountQuery, onlyWithVideo])

  // Load more function for infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    const nextPage = page + 1
    const from = nextPage * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1
    
    const supabase = createClient()
    const query = buildQuery(supabase)
    
    const { data, error } = await query
      .order('rating', { ascending: false })
      .range(from, to)
    
    if (error) {
      console.error('Error loading more:', error)
    } else if (data) {
      let results = data.map(profileToProfessional)
      
      if (onlyWithVideo) {
        results = results.filter(p => p.hasVideo)
      }
      
      setProfessionals(prev => [...prev, ...results])
      setPage(nextPage)
      setHasMore(data.length === ITEMS_PER_PAGE)
    }
    
    setLoadingMore(false)
  }, [loadingMore, hasMore, page, buildQuery, onlyWithVideo])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
    
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loadMore])
  
  const clearAllFilters = () => {
    setSelectedCity(null)
    setSelectedCategory(null)
    setSelectedServiceType(null)
    setSelectedCommunity(null)
    setOnlyVerified(false)
    setOnlyWithVideo(false)
  }

  // Function to inject ads into the results list
  const renderResultsWithAds = () => {
    const items: React.ReactNode[] = []
    let adIndex = 0

    professionals.forEach((result, index) => {
      // Mark every 5th item as sponsored for demo
      const isSponsored = (index + 1) % 6 === 0
      
      items.push(
        <ProCard 
          key={`pro-${result.id}`} 
          pro={{ ...result, isSponsored }} 
          index={index}
          onVideoClick={(pro) => setSelectedVideo(pro)}
        />
      )

      // Inject ad every 5 items on mobile (legacy ads)
      if ((index + 1) % 8 === 0 && adIndex < feedAds.length) {
        items.push(
          <div key={`ad-${feedAds[adIndex].id}`} className="md:hidden">
            <SponsoredCard ad={feedAds[adIndex]} />
          </div>
        )
        adIndex++
      }
    })

    return items
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile Search Header */}
      <div className="glass p-4 rounded-2xl shadow-sm border border-white/50 sticky top-20 z-10 md:static md:top-0">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="חיפוש לפי שם, עיר או תחום..."
              className="pr-10 h-10 bg-gray-50 border-0 focus:ring-1 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* AI Disclaimer */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hidden sm:flex items-center gap-1">
              <span>🤖</span>
            </div>
          </div>
          
          {/* Filter Sheet */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="border-gray-200 relative">
                <SlidersHorizontal className="h-4 w-4 text-gray-600" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[340px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  סינון תוצאות
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {activeFiltersCount} פילטרים פעילים
                    </Badge>
                  )}
                </SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6 pb-20">
                {/* Service Type Filter - 2 Main Categories */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">סוג שירות</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(MAIN_FILTER_TYPES).map(([id, config]) => {
                      const Icon = config.icon
                      const isSelected = selectedServiceType === id
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedServiceType(isSelected ? null : id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? `${config.badgeColor} border-current` 
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? config.color : 'bg-gray-100'} ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? '' : 'text-gray-600'}`}>
                            {config.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Category Filter with Search */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">קטגוריה</Label>
                  <Select value={selectedCategory || '__all__'} onValueChange={(v) => setSelectedCategory(v === '__all__' ? null : v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="כל הקטגוריות" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="__all__">כל הקטגוריות</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* City Filter */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">עיר</Label>
                  <Select value={selectedCity || '__all__'} onValueChange={(v) => setSelectedCity(v === '__all__' ? null : v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="כל הערים" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="__all__">כל הערים</SelectItem>
                      {CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Quick City Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {['ירושלים', 'בני ברק', 'מודיעין עילית', 'ביתר עילית'].map(city => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                        className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                          selectedCity === city 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Community Filter */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">קהילה / חסידות</Label>
                  <Select value={selectedCommunity || '__all__'} onValueChange={(v) => setSelectedCommunity(v === '__all__' ? null : v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="כל הקהילות" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="__all__">כל הקהילות</SelectItem>
                      {COMMUNITIES.map(community => (
                        <SelectItem key={community.id} value={community.id}>{community.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Toggle Filters - More Visual */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">סינון מתקדם</Label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setOnlyVerified(!onlyVerified)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        onlyVerified 
                          ? 'border-blue-200 bg-blue-50' 
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${onlyVerified ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          ✓
                        </span>
                        <span className={`text-sm font-medium ${onlyVerified ? 'text-blue-700' : 'text-gray-600'}`}>
                          מאומתים בלבד
                        </span>
                      </span>
                      <div className={`w-10 h-6 rounded-full transition-all ${onlyVerified ? 'bg-blue-500' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-all mt-0.5 ${onlyVerified ? 'mr-0.5' : 'mr-4'}`} />
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setOnlyWithVideo(!onlyWithVideo)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        onlyWithVideo 
                          ? 'border-orange-200 bg-orange-50' 
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${onlyWithVideo ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          ▶
                        </span>
                        <span className={`text-sm font-medium ${onlyWithVideo ? 'text-orange-700' : 'text-gray-600'}`}>
                          עם סרטון בלבד
                        </span>
                      </span>
                      <div className={`w-10 h-6 rounded-full transition-all ${onlyWithVideo ? 'bg-orange-500' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-all mt-0.5 ${onlyWithVideo ? 'mr-0.5' : 'mr-4'}`} />
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Clear All - Fixed at Bottom */}
                {activeFiltersCount > 0 && (
                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5" 
                      onClick={() => {
                        clearAllFilters()
                        setIsFilterOpen(false)
                      }}
                    >
                      <X className="h-4 w-4 ml-2" />
                      נקה הכל ואתחל מחדש
                    </Button>
                  </div>
                )}
                
                {/* Apply Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
                  <Button 
                    className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    הצג {totalCount} תוצאות
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Quick Filters - Service Types (2 Main Categories) */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            size="sm" 
            variant={!selectedServiceType ? "secondary" : "outline"}
            className={`rounded-full px-4 flex-shrink-0 ${!selectedServiceType ? 'bg-primary text-white hover:bg-primary/90 border-0' : 'border-gray-200 text-gray-600'}`}
            onClick={() => setSelectedServiceType(null)}
          >
            הכל
          </Button>
          {Object.entries(MAIN_FILTER_TYPES).map(([id, config]) => {
            const Icon = config.icon
            return (
              <Button 
                key={id}
                size="sm" 
                variant={selectedServiceType === id ? "secondary" : "outline"}
                className={`rounded-full px-4 flex-shrink-0 gap-1.5 ${
                  selectedServiceType === id 
                    ? `${config.badgeColor} border` 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setSelectedServiceType(selectedServiceType === id ? null : id)}
              >
                <Icon className="h-3.5 w-3.5" />
                {config.name}
              </Button>
            )
          })}
        </div>
        
        {/* Quick Filters - Popular Cities */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            size="sm" 
            variant={!selectedCity ? "secondary" : "outline"}
            className={`rounded-full px-3 flex-shrink-0 text-xs ${!selectedCity ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-0' : 'border-gray-200 text-gray-500'}`}
            onClick={() => setSelectedCity(null)}
          >
            כל הארץ
          </Button>
          {['ירושלים', 'בני ברק', 'מודיעין עילית', 'ביתר עילית', 'אלעד', 'בית שמש'].map(city => (
            <Button 
              key={city}
              size="sm" 
              variant={selectedCity === city ? "secondary" : "outline"}
              className={`rounded-full px-3 flex-shrink-0 text-xs ${selectedCity === city ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-0' : 'border-gray-200 text-gray-500'}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </Button>
          ))}
        </div>
        
        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700">
                {selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
              </Badge>
            )}
            {selectedServiceType && (
              <Badge variant="secondary" className="gap-1 bg-green-50 text-green-700">
                {selectedServiceType === 'appointment' ? 'קביעת תור' : 
                 selectedServiceType === 'project' ? 'פרויקטים' : 
                 selectedServiceType === 'emergency' ? 'חירום' : 'קניות ומסחר'}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedServiceType(null)} />
              </Badge>
            )}
            {selectedCommunity && (
              <Badge variant="secondary" className="gap-1 bg-amber-50 text-amber-700">
                {COMMUNITIES.find(c => c.id === selectedCommunity)?.label || selectedCommunity}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCommunity(null)} />
              </Badge>
            )}
            {onlyVerified && (
              <Badge variant="secondary" className="gap-1 bg-purple-50 text-purple-700">
                מאומתים
                <X className="h-3 w-3 cursor-pointer" onClick={() => setOnlyVerified(false)} />
              </Badge>
            )}
            {onlyWithVideo && (
              <Badge variant="secondary" className="gap-1 bg-secondary/10 text-secondary">
                עם סרטון
                <X className="h-3 w-3 cursor-pointer" onClick={() => setOnlyWithVideo(false)} />
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Results */}
        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {selectedServiceType && SERVICE_TYPE_CONFIG[selectedServiceType as keyof typeof SERVICE_TYPE_CONFIG] && (
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${SERVICE_TYPE_CONFIG[selectedServiceType as keyof typeof SERVICE_TYPE_CONFIG].color} text-white`}>
                  {React.createElement(SERVICE_TYPE_CONFIG[selectedServiceType as keyof typeof SERVICE_TYPE_CONFIG].icon, { className: "h-4 w-4" })}
                </span>
              )}
              {getPageTitle()}
              <span className="text-sm font-normal text-gray-500">
                ({loading ? '...' : totalCount} תוצאות)
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              // Loading skeletons
              <>
                <ProCardSkeleton />
                <ProCardSkeleton />
                <ProCardSkeleton />
                <ProCardSkeleton />
                <ProCardSkeleton />
                <ProCardSkeleton />
              </>
            ) : professionals.length > 0 ? (
              <>
                {renderResultsWithAds()}
                
                {/* Load More Trigger for Infinite Scroll */}
                <div 
                  ref={loadMoreRef} 
                  className="col-span-full flex justify-center py-8"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">טוען עוד תוצאות...</span>
                    </div>
                  ) : hasMore ? (
                    <Button 
                      variant="outline" 
                      onClick={() => loadMore()}
                      className="mx-auto"
                    >
                      טען עוד תוצאות
                    </Button>
                  ) : (
                    <div className="text-sm text-muted-foreground py-4">
                      הצגת כל {professionals.length} התוצאות
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg font-medium">לא נמצאו תוצאות</p>
                <p className="text-gray-400 text-sm mt-2">נסה לשנות את החיפוש או הפילטרים</p>
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={clearAllFilters}
                  >
                    נקה את כל הפילטרים
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Video Viewer Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoViewer pro={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// Wrapper with Suspense for useSearchParams
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
