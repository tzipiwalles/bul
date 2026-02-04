'use client'

import React, { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfessionalCard, Professional } from '@/components/cards/professional-card'
import { SponsoredCard } from '@/components/ads/sponsored-card'
import { MOCK_ADS } from '@/lib/ads-data'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { Skeleton } from '@/components/ui/skeleton'
import { CITIES, CATEGORIES } from '@/lib/constants'
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

// Convert database profile to display format
function profileToProfessional(profile: Profile & { media_urls?: string[] }): Professional {
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
      profile.service_type === 'emergency' ? '24/6' : null,
      profile.is_verified ? 'מאומת' : null,
    ].filter(Boolean) as string[],
    avatarUrl: profile.avatar_url,
    hasVideo,
  }
}

function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex gap-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null)
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [onlyWithVideo, setOnlyWithVideo] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const feedAds = MOCK_ADS.filter(ad => ad.placement === 'feed')
  
  // Count active filters
  const activeFiltersCount = [selectedCity, selectedCategory, selectedServiceType, onlyVerified, onlyWithVideo].filter(Boolean).length

  useEffect(() => {
    async function fetchProfessionals() {
      setLoading(true)
      const supabase = createClient()
      
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
      
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
        query = query.eq('service_type', selectedServiceType)
      }
      
      // Apply verified filter
      if (onlyVerified) {
        query = query.eq('is_verified', true)
      }
      
      const { data, error } = await query.limit(100)
      
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
          // Videos first
          if (a.hasVideo && !b.hasVideo) return -1
          if (!a.hasVideo && b.hasVideo) return 1
          // Then by rating
          return b.rating - a.rating
        })
        
        setProfessionals(results)
      }
      
      setLoading(false)
    }
    
    fetchProfessionals()
  }, [searchQuery, selectedCity, selectedCategory, selectedServiceType, onlyVerified, onlyWithVideo])
  
  const clearAllFilters = () => {
    setSelectedCity(null)
    setSelectedCategory(null)
    setSelectedServiceType(null)
    setOnlyVerified(false)
    setOnlyWithVideo(false)
  }

  // Function to inject ads into the results list
  const renderResultsWithAds = () => {
    const items: React.ReactNode[] = []
    let adIndex = 0

    professionals.forEach((result, index) => {
      items.push(<ProfessionalCard key={`pro-${result.id}`} pro={result} />)

      // Inject ad every 5 items on mobile
      if ((index + 1) % 5 === 0 && adIndex < feedAds.length) {
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
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-20 z-10 md:static md:top-0">
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
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>סינון תוצאות</SheetTitle>
                <SheetDescription>בחר את הפילטרים הרצויים</SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* City Filter */}
                <div className="space-y-2">
                  <Label>עיר</Label>
                  <Select value={selectedCity || ''} onValueChange={(v) => setSelectedCity(v || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="כל הערים" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="">כל הערים</SelectItem>
                      {CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>קטגוריה</Label>
                  <Select value={selectedCategory || ''} onValueChange={(v) => setSelectedCategory(v || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="כל הקטגוריות" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="">כל הקטגוריות</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Service Type Filter */}
                <div className="space-y-2">
                  <Label>סוג שירות</Label>
                  <Select value={selectedServiceType || ''} onValueChange={(v) => setSelectedServiceType(v || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="כל הסוגים" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">כל הסוגים</SelectItem>
                      <SelectItem value="appointment">קביעת תור</SelectItem>
                      <SelectItem value="project">פרויקטים</SelectItem>
                      <SelectItem value="emergency">חירום</SelectItem>
                      <SelectItem value="retail">חנות</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Toggle Filters */}
                <div className="space-y-3">
                  <Label>אפשרויות נוספות</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={onlyVerified ? "default" : "outline"}
                      className={onlyVerified ? "bg-primary" : ""}
                      onClick={() => setOnlyVerified(!onlyVerified)}
                    >
                      מאומתים בלבד
                    </Button>
                    <Button
                      size="sm"
                      variant={onlyWithVideo ? "default" : "outline"}
                      className={onlyWithVideo ? "bg-secondary" : ""}
                      onClick={() => setOnlyWithVideo(!onlyWithVideo)}
                    >
                      עם סרטון בלבד
                    </Button>
                  </div>
                </div>
                
                {/* Clear All */}
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={clearAllFilters}
                  >
                    <X className="h-4 w-4 ml-2" />
                    נקה את כל הפילטרים
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Quick Filters - Popular Cities */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            size="sm" 
            variant={!selectedCity ? "secondary" : "outline"}
            className={`rounded-full px-4 flex-shrink-0 ${!selectedCity ? 'bg-primary/10 text-primary hover:bg-primary/20 border-0' : 'border-gray-200 text-gray-600'}`}
            onClick={() => setSelectedCity(null)}
          >
            כל הארץ
          </Button>
          {['ירושלים', 'בני ברק', 'מודיעין עילית', 'ביתר עילית', 'אלעד', 'בית שמש'].map(city => (
            <Button 
              key={city}
              size="sm" 
              variant={selectedCity === city ? "secondary" : "outline"}
              className={`rounded-full px-4 flex-shrink-0 ${selectedCity === city ? 'bg-primary/10 text-primary hover:bg-primary/20 border-0' : 'border-gray-200 text-gray-600'}`}
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
                 selectedServiceType === 'emergency' ? 'חירום' : 'חנות'}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedServiceType(null)} />
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
            <h1 className="text-xl font-bold text-gray-900">
              בעלי מקצוע
              <span className="text-sm font-normal text-gray-500 mr-2">
                ({loading ? '...' : professionals.length} תוצאות)
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              // Loading skeletons
              <>
                <ProfileCardSkeleton />
                <ProfileCardSkeleton />
                <ProfileCardSkeleton />
              </>
            ) : professionals.length > 0 ? (
              renderResultsWithAds()
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-lg">לא נמצאו תוצאות</p>
                <p className="text-gray-400 text-sm mt-2">נסה לשנות את החיפוש או המיקום</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
