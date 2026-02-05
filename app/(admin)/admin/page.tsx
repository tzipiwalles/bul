'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, User, CheckCircle, Video, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES } from '@/lib/constants'
import { COMMUNITIES } from '@/lib/communities'
import type { Profile } from '@/types/database'

const SERVICE_TYPES = [
  { value: 'appointment', label: 'קביעת תור' },
  { value: 'project', label: 'פרויקטים / הצעת מחיר' },
  { value: 'emergency', label: 'שירות חירום 24/6' },
  { value: 'retail', label: 'חנות / קמעונאות' },
]

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('__all__')
  const [selectedCommunity, setSelectedCommunity] = useState('__all__')
  const [selectedServiceType, setSelectedServiceType] = useState('__all__')
  const [selectedStatus, setSelectedStatus] = useState('__all__')

  // Check admin and load profiles
  useEffect(() => {
    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Check if admin
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle()

        console.log('Admin page - admin check:', { admin, adminError, userId: user.id })

        if (adminError) {
          console.error('Admin check error:', adminError)
          setLoading(false)
          return
        }

        if (!admin) {
          console.log('Not admin, redirecting to /')
          router.push('/')
          return
        }

        // Load all profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        console.log('Profiles loaded:', { count: data?.length, error })

        if (error) {
          console.error('Error loading profiles:', error)
        } else {
          setProfiles(data || [])
          setFilteredProfiles(data || [])
        }
      } catch (err) {
        console.error('Init error:', err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [supabase, router])

  // Apply filters
  useEffect(() => {
    let filtered = [...profiles]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.business_name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.phone?.includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== '__all__') {
      filtered = filtered.filter(p => p.categories?.includes(selectedCategory))
    }

    // Community filter
    if (selectedCommunity !== '__all__') {
      filtered = filtered.filter(p => p.community === selectedCommunity)
    }

    // Service type filter
    if (selectedServiceType !== '__all__') {
      filtered = filtered.filter(p => p.service_type === selectedServiceType)
    }

    // Status filter
    if (selectedStatus !== '__all__') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(p => p.is_active)
      } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter(p => !p.is_active)
      } else if (selectedStatus === 'verified') {
        filtered = filtered.filter(p => p.is_verified)
      }
    }

    setFilteredProfiles(filtered)
  }, [profiles, searchQuery, selectedCategory, selectedCommunity, selectedServiceType, selectedStatus])

  // Calculate stats
  const stats = {
    total: profiles.length,
    active: profiles.filter(p => p.is_active).length,
    verified: profiles.filter(p => p.is_verified).length,
    withVideo: profiles.filter(p => p.media_urls?.some((url: string) => url.includes('.mp4') || url.includes('video'))).length,
    male: profiles.filter(p => p.gender === 'male').length,
    female: profiles.filter(p => p.gender === 'female').length,
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('__all__')
    setSelectedCommunity('__all__')
    setSelectedServiceType('__all__')
    setSelectedStatus('__all__')
  }

  const hasActiveFilters = searchQuery || selectedCategory !== '__all__' || 
                          selectedCommunity !== '__all__' || selectedServiceType !== '__all__' ||
                          selectedStatus !== '__all__'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-lg">טוען...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">ניהול בעלי עסקים</h1>
        <p className="text-gray-600 mt-1">צפייה ועריכת כל הפרופילים במערכת</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-gray-600">סך הכל</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">פעילים</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
          <div className="text-sm text-gray-600">מאומתים</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">{stats.withVideo}</div>
          <div className="text-sm text-gray-600">עם סרטון</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">{stats.male}</div>
          <div className="text-sm text-gray-600">גברים</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-2xl font-bold text-pink-600">{stats.female}</div>
          <div className="text-sm text-gray-600">נשים</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">סינון וחיפוש</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 ml-1" />
              נקה סינונים
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="חיפוש לפי שם עסק, אימייל, טלפון, עיר..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Filter Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">קטגוריה</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="כל הקטגוריות" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="__all__">כל הקטגוריות</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">קהילה / חסידות</label>
            <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
              <SelectTrigger>
                <SelectValue placeholder="כל הקהילות" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="__all__">כל הקהילות</SelectItem>
                {COMMUNITIES.map(comm => (
                  <SelectItem key={comm.id} value={comm.id}>{comm.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">סוג שירות</label>
            <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="כל הסוגים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">כל הסוגים</SelectItem>
                {SERVICE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">סטטוס</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="כל הסטטוסים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">כל הסטטוסים</SelectItem>
                <SelectItem value="active">פעיל</SelectItem>
                <SelectItem value="inactive">לא פעיל</SelectItem>
                <SelectItem value="verified">מאומת</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          מציג {filteredProfiles.length} מתוך {profiles.length} בעלי עסק
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">בעל עסק</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">עיר</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">קטגוריה</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">קהילה</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">סטטוס</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">מדיה</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">דירוג</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    {hasActiveFilters ? 'לא נמצאו תוצאות מתאימות' : 'אין פרופילים'}
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {profile.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={profile.avatar_url}
                              alt={profile.business_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium flex items-center gap-2">
                            <span className="truncate">{profile.business_name}</span>
                            {profile.is_verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{profile.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{profile.city}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {profile.categories?.[0] || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {COMMUNITIES.find(c => c.id === profile.community)?.label || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {profile.is_active ? (
                          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                            פעיל
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            לא פעיל
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {profile.media_urls?.some((url: string) => url.includes('.mp4') || url.includes('video')) && (
                          <Video className="h-4 w-4 text-purple-500" />
                        )}
                        {(profile.media_urls?.length || 0) > 0 && (
                          <span className="text-xs text-gray-500">
                            {profile.media_urls?.length}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm">
                        ⭐ {profile.rating?.toFixed(1) || '0.0'}
                        <span className="text-xs text-gray-500 mr-1">
                          ({profile.reviews_count || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/admin/profile/${profile.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 ml-1" />
                          ערוך
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
