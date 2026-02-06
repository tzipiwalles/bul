'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { ProfessionalCard, Professional } from '@/components/cards/professional-card'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight, Loader2 } from 'lucide-react'
import type { Profile } from '@/types/database'

export default function FavoritesPage() {
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('favorites')
  const tCommon = useTranslations('common')
  
  const [favorites, setFavorites] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function loadFavorites() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsLoggedIn(false)
        setLoading(false)
        return
      }
      
      setIsLoggedIn(true)

      // Get favorites with profile data
      const { data: favoritesData, error } = await supabase
        .from('favorites')
        .select(`
          id,
          profile_id,
          profiles:profile_id (
            id,
            business_name,
            city,
            rating,
            review_count,
            description,
            is_verified,
            categories,
            service_type,
            avatar_url,
            media_urls
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && favoritesData) {
        const professionals: Professional[] = favoritesData
          .filter(f => f.profiles)
          .map(f => {
            const profile = f.profiles as unknown as Profile & { media_urls?: string[] }
            return {
              id: profile.id,
              name: profile.business_name,
              category: profile.categories?.[0] || 'כללי',
              city: profile.city,
              rating: profile.rating,
              reviews: profile.review_count,
              description: profile.description || '',
              isVerified: profile.is_verified,
              tags: [],
              avatarUrl: profile.avatar_url,
              hasVideo: profile.media_urls && profile.media_urls.length > 0,
            }
          })
        
        setFavorites(professionals)
      }
      
      setLoading(false)
    }

    loadFavorites()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <Heart className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('loginTitle')}</h1>
        <p className="text-gray-500 mb-6">{t('loginSubtitle')}</p>
        <Link href="/login">
          <Button>{tCommon('login')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 text-sm">{t('savedCount', { count: favorites.length })}</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('empty')}</p>
          <p className="text-gray-400 text-sm mt-2">{t('emptyHint')}</p>
          <Link href="/search">
            <Button className="mt-6">{t('searchPros')}</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {favorites.map(pro => (
            <ProfessionalCard key={pro.id} pro={pro} />
          ))}
        </div>
      )}
    </div>
  )
}
