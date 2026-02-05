'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { History, ArrowRight, Loader2, Phone, MessageCircle, Calendar, Eye } from 'lucide-react'
import type { Profile } from '@/types/database'

interface ActivityItem {
  id: string
  activity_type: string
  created_at: string
  profile: {
    id: string
    business_name: string
    city: string
    avatar_url: string | null
  } | null
}

const activityIcons: Record<string, React.ReactNode> = {
  view: <Eye className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  appointment_request: <Calendar className="h-4 w-4" />,
  lead_sent: <MessageCircle className="h-4 w-4" />,
}

const activityLabels: Record<string, string> = {
  view: 'צפית בפרופיל',
  call: 'התקשרת',
  whatsapp: 'שלחת וואטסאפ',
  appointment_request: 'בקשת תור',
  lead_sent: 'שלחת פנייה',
}

export default function HistoryPage() {
  const supabase = createClient()
  
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function loadHistory() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsLoggedIn(false)
        setLoading(false)
        return
      }
      
      setIsLoggedIn(true)

      const { data, error } = await supabase
        .from('user_activity')
        .select(`
          id,
          activity_type,
          created_at,
          profiles:profile_id (
            id,
            business_name,
            city,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setActivities(data.map(d => ({
          ...d,
          profile: d.profiles as ActivityItem['profile']
        })))
      }
      
      setLoading(false)
    }

    loadHistory()
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
        <History className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">התחבר כדי לראות את ההיסטוריה</h1>
        <p className="text-gray-500 mb-6">עקוב אחרי הפעילות שלך עם בעלי מקצוע</p>
        <Link href="/login">
          <Button>התחברות</Button>
        </Link>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'עכשיו'
    if (diffMins < 60) return `לפני ${diffMins} דקות`
    if (diffHours < 24) return `לפני ${diffHours} שעות`
    if (diffDays < 7) return `לפני ${diffDays} ימים`
    
    return date.toLocaleDateString('he-IL')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">היסטוריית פעילות</h1>
          <p className="text-gray-500 text-sm">הפעילות האחרונה שלך באתר</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">אין פעילות עדיין</p>
          <p className="text-gray-400 text-sm mt-2">התחל לחפש בעלי מקצוע</p>
          <Link href="/search">
            <Button className="mt-6">חפש בעלי מקצוע</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y">
          {activities.map(activity => (
            <div key={activity.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                {activityIcons[activity.activity_type] || <Eye className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">
                  {activityLabels[activity.activity_type] || activity.activity_type}
                </p>
                {activity.profile && (
                  <Link 
                    href={`/profile/${activity.profile.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {activity.profile.business_name} - {activity.profile.city}
                  </Link>
                )}
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {formatDate(activity.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
