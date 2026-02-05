'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Save, Upload, Trash2, Loader2, Plus, X, Camera, Video, Shield, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CITIES } from '@/lib/constants'
import { CategoryPicker } from '@/components/category-picker'
import { COMMUNITIES } from '@/lib/communities'
import { createClient } from '@/lib/supabase/client'
import type { Profile, ServiceType, Gender } from '@/types/database'

export default function AdminProfileEditPage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.id as string
  
  const supabase = createClient()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Profile data
  const [profile, setProfile] = useState<Partial<Profile>>({
    business_name: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: '',
    address: '',
    description: '',
    categories: [],
    service_type: 'project',
    gender: 'male',
    avatar_url: null,
    media_urls: [],
    is_active: true,
    is_verified: false,
    community: 'general',
  })

  // Check admin and load profile
  useEffect(() => {
    async function init() {
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

      console.log('Admin profile edit - admin check:', { admin, adminError, userId: user.id })

      if (!admin) {
        console.log('Not admin, redirecting to /')
        router.push('/')
        return
      }
      
      setIsAdmin(true)

      // Load profile - use service role for admin access
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single()

      if (error || !data) {
        setMessage({ type: 'error', text: 'הפרופיל לא נמצא' })
        setLoading(false)
        return
      }

      setProfile(data)
      setLoading(false)
    }

    init()
  }, [supabase, profileId, router])

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setMessage(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profileId}/avatar-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setProfile(prev => ({ ...prev, avatar_url: urlData.publicUrl }))
      setMessage({ type: 'success', text: 'התמונה הועלתה בהצלחה' })
    } catch (error) {
      console.error('Avatar upload error:', error)
      setMessage({ type: 'error', text: 'שגיאה בהעלאת התמונה' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Handle media upload
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingMedia(true)
    setMessage(null)

    try {
      const newMediaUrls: string[] = []

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${profileId}/media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }

        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(fileName)

        newMediaUrls.push(urlData.publicUrl)
      }

      setProfile(prev => ({
        ...prev,
        media_urls: [...(prev.media_urls || []), ...newMediaUrls]
      }))
      
      setMessage({ type: 'success', text: `${newMediaUrls.length} קבצים הועלו בהצלחה` })
    } catch (error) {
      console.error('Media upload error:', error)
      setMessage({ type: 'error', text: 'שגיאה בהעלאת הקבצים' })
    } finally {
      setUploadingMedia(false)
    }
  }

  // Remove media item
  const removeMedia = (index: number) => {
    setProfile(prev => ({
      ...prev,
      media_urls: prev.media_urls?.filter((_, i) => i !== index) || []
    }))
  }

  // Save profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const updateData = {
        business_name: profile.business_name,
        phone: profile.phone,
        whatsapp: profile.whatsapp,
        email: profile.email,
        city: profile.city,
        address: profile.address,
        description: profile.description,
        categories: profile.categories,
        service_type: profile.service_type,
        gender: profile.gender,
        avatar_url: profile.avatar_url,
        media_urls: profile.media_urls,
        is_active: profile.is_active,
        is_verified: profile.is_verified,
        community: profile.community,
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profileId)

      if (error) throw error

      setMessage({ type: 'success', text: 'הפרטים נשמרו בהצלחה!' })
    } catch (error) {
      console.error('Save error:', error)
      setMessage({ type: 'error', text: 'שגיאה בשמירת הפרטים' })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-gray-500 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">עריכת פרופיל (אדמין)</h1>
          <p className="text-gray-500 text-sm">
            {profile.business_name} • {profile.email}
          </p>
        </div>
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">מצב אדמין</span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Admin Controls */}
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Shield className="h-5 w-5" />
              הגדרות אדמין
            </CardTitle>
            <CardDescription>
              הגדרות שרק אדמין יכול לשנות
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>פרופיל פעיל</Label>
                <p className="text-sm text-gray-500">האם הפרופיל מוצג בחיפוש</p>
              </div>
              <Switch 
                checked={profile.is_active ?? true}
                onCheckedChange={(v) => setProfile(prev => ({ ...prev, is_active: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  פרופיל מאומת
                </Label>
                <p className="text-sm text-gray-500">תג אימות כחול ליד השם</p>
              </div>
              <Switch 
                checked={profile.is_verified ?? false}
                onCheckedChange={(v) => setProfile(prev => ({ ...prev, is_verified: v }))}
              />
            </div>
            <div>
              <Label>מין בעל העסק</Label>
              <Select 
                value={profile.gender || 'male'} 
                onValueChange={(v) => setProfile(prev => ({ ...prev, gender: v as Gender }))}
              >
                <SelectTrigger className="mt-1.5 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">גבר</SelectItem>
                  <SelectItem value="female">אישה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {profile.gender === 'female' ? 'לוגו עסקי' : 'תמונת פרופיל'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-blue-50 flex items-center justify-center">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {profile.business_name?.charAt(0) || 'א'}
                  </span>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  <Upload className="ml-2 h-4 w-4" />
                  {uploadingAvatar ? 'מעלה...' : 'העלה תמונה'}
                </Button>
                {profile.avatar_url && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => setProfile(prev => ({ ...prev, avatar_url: null }))}
                  >
                    <Trash2 className="ml-2 h-4 w-4" />
                    הסר תמונה
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              גלריית מדיה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {profile.media_urls?.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  {url.includes('.mp4') || url.includes('video') ? (
                    <video src={url} className="w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <div className="relative">
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={uploadingMedia}
                  className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  {uploadingMedia ? (
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  ) : (
                    <>
                      <Plus className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500">הוסף</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>פרטים בסיסיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">שם העסק *</Label>
              <Input 
                id="businessName" 
                value={profile.business_name || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="שם העסק" 
                className="mt-1.5" 
                required
              />
            </div>
            <div>
              <Label htmlFor="email">אימייל</Label>
              <Input 
                id="email" 
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com" 
                dir="ltr"
                className="mt-1.5" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">טלפון *</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profile.phone || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="050-0000000" 
                  dir="ltr" 
                  className="mt-1.5" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input 
                  id="whatsapp" 
                  type="tel" 
                  value={profile.whatsapp || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="050-0000000" 
                  dir="ltr" 
                  className="mt-1.5" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="city">עיר *</Label>
              <Select 
                value={profile.city || ''} 
                onValueChange={(v) => setProfile(prev => ({ ...prev, city: v }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="בחר עיר" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="address">כתובת</Label>
              <Input 
                id="address" 
                value={profile.address || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                placeholder="רחוב ומספר" 
                className="mt-1.5" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle>פרטי העסק</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>קטגוריה ראשית</Label>
              <CategoryPicker
                value={profile.categories?.[0] || ''}
                onChange={(v) => setProfile(prev => ({ ...prev, categories: [v] }))}
                placeholder="לחץ לבחירת קטגוריה"
              />
            </div>
            <div>
              <Label>סוג שירות</Label>
              <Select 
                value={profile.service_type || 'project'} 
                onValueChange={(v) => setProfile(prev => ({ ...prev, service_type: v as ServiceType }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="בחר סוג שירות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">קביעת תור</SelectItem>
                  <SelectItem value="project">פרויקטים / הצעת מחיר</SelectItem>
                  <SelectItem value="emergency">שירות חירום 24/6</SelectItem>
                  <SelectItem value="retail">חנות / קמעונאות</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>קהילה / חסידות</Label>
              <Select 
                value={profile.community || 'general'} 
                onValueChange={(v) => setProfile(prev => ({ ...prev, community: v }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="בחר קהילה" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {COMMUNITIES.map(community => (
                    <SelectItem key={community.id} value={community.id}>{community.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>תיאור העסק</Label>
              <Textarea 
                value={profile.description || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                placeholder="ספר על העסק..."
                rows={5}
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" className="flex-1" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                שומר...
              </>
            ) : (
              <>
                <Save className="ml-2 h-5 w-5" />
                שמור שינויים
              </>
            )}
          </Button>
          <Link href="/admin">
            <Button type="button" variant="outline" size="lg">
              חזור לרשימה
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
