'use client'

import React, { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfessionalCard, Professional } from '@/components/cards/professional-card'
import { SponsoredCard } from '@/components/ads/sponsored-card'
import { MOCK_ADS } from '@/lib/ads-data'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { Skeleton } from '@/components/ui/skeleton'

// Convert database profile to display format
function profileToProfessional(profile: Profile): Professional {
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
  
  const feedAds = MOCK_ADS.filter(ad => ad.placement === 'feed')

  useEffect(() => {
    async function fetchProfessionals() {
      setLoading(true)
      const supabase = createClient()
      
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })
      
      // Apply search filter
      if (searchQuery) {
        query = query.or(`business_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
      }
      
      // Apply city filter
      if (selectedCity) {
        query = query.eq('city', selectedCity)
      }
      
      const { data, error } = await query.limit(50)
      
      if (error) {
        console.error('Error fetching professionals:', error)
      } else if (data) {
        setProfessionals(data.map(profileToProfessional))
      }
      
      setLoading(false)
    }
    
    fetchProfessionals()
  }, [searchQuery, selectedCity])

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
          <Button size="icon" variant="outline" className="border-gray-200">
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        
        {/* Quick Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            size="sm" 
            variant={!selectedCity ? "secondary" : "outline"}
            className={`rounded-full px-4 flex-shrink-0 ${!selectedCity ? 'bg-primary/10 text-primary hover:bg-primary/20 border-0' : 'border-gray-200 text-gray-600'}`}
            onClick={() => setSelectedCity(null)}
          >
            כל הארץ
          </Button>
          <Button 
            size="sm" 
            variant={selectedCity === 'ירושלים' ? "secondary" : "outline"}
            className={`rounded-full px-4 flex-shrink-0 ${selectedCity === 'ירושלים' ? 'bg-primary/10 text-primary hover:bg-primary/20 border-0' : 'border-gray-200 text-gray-600'}`}
            onClick={() => setSelectedCity('ירושלים')}
          >
            ירושלים
          </Button>
          <Button 
            size="sm" 
            variant={selectedCity === 'בני ברק' ? "secondary" : "outline"}
            className={`rounded-full px-4 flex-shrink-0 ${selectedCity === 'בני ברק' ? 'bg-primary/10 text-primary hover:bg-primary/20 border-0' : 'border-gray-200 text-gray-600'}`}
            onClick={() => setSelectedCity('בני ברק')}
          >
            בני ברק
          </Button>
          <Button 
            size="sm" 
            variant={selectedCity === 'מודיעין עילית' ? "secondary" : "outline"}
            className={`rounded-full px-4 flex-shrink-0 ${selectedCity === 'מודיעין עילית' ? 'bg-primary/10 text-primary hover:bg-primary/20 border-0' : 'border-gray-200 text-gray-600'}`}
            onClick={() => setSelectedCity('מודיעין עילית')}
          >
            מודיעין עילית
          </Button>
        </div>
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
