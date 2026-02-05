'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2, ExternalLink, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'

interface ProfileMedia {
  id: string
  business_name: string
  media_urls: string[]
  avatar_url: string | null
}

export default function MediaCleanupPage() {
  const [profiles, setProfiles] = useState<ProfileMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const supabase = createClient()
  
  useEffect(() => {
    fetchProfiles()
  }, [])
  
  async function fetchProfiles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, business_name, media_urls, avatar_url')
      .order('business_name')
    
    if (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'שגיאה בטעינת הנתונים' })
    } else {
      // Show all profiles that have media_urls array (even if empty for tracking)
      const filtered = (data || []).filter(p => p.media_urls && p.media_urls.length > 0)
      setProfiles(filtered)
    }
    setLoading(false)
  }
  
  async function deleteMedia(profileId: string, urlToDelete: string) {
    setDeleting(urlToDelete)
    console.log('Deleting media:', { profileId, urlToDelete })
    
    try {
      // Use admin API to delete (bypasses RLS)
      const response = await fetch('/api/admin/delete-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, urlToDelete }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete')
      }
      
      const newUrls = result.remainingUrls
      
      // Update local state - keep profile visible even with 0 images
      setProfiles(prev => prev.map(p => {
        if (p.id === profileId) {
          return { ...p, media_urls: newUrls }
        }
        return p
      }))
      
      setMessage({ type: 'success', text: `התמונה נמחקה בהצלחה (נשארו ${newUrls.length} תמונות)` })
    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ type: 'error', text: `שגיאה במחיקה: ${error instanceof Error ? error.message : 'Unknown error'}` })
    }
    
    setDeleting(null)
    setTimeout(() => setMessage(null), 5000)
  }
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">ניקוי תמונות</h1>
          <p className="text-muted-foreground">סקירה ומחיקת תמונות בעייתיות מפרופילים</p>
        </div>
        <Button onClick={fetchProfiles} variant="outline">
          <RefreshCw className="h-4 w-4 ml-2" />
          רענון
        </Button>
      </div>
      
      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          {message.text}
        </div>
      )}
      
      <div className="text-sm text-muted-foreground mb-4">
        סה"כ {profiles.length} פרופילים עם תמונות
      </div>
      
      <div className="space-y-8">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{profile.business_name}</h2>
              <span className="text-sm text-muted-foreground">
                {profile.media_urls.length} תמונות
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {profile.media_urls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${profile.business_name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg'
                      }}
                    />
                  </div>
                  
                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="פתח בחלון חדש"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-700" />
                    </a>
                    <button
                      onClick={() => deleteMedia(profile.id, url)}
                      disabled={deleting === url}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                      title="מחק תמונה"
                    >
                      {deleting === url ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Image number */}
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {profiles.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          אין פרופילים עם תמונות
        </div>
      )}
    </div>
  )
}
