'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Save, Upload, Trash2, Loader2, Plus, X, Camera, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CITIES } from '@/lib/constants'
import { LOCATIONS, getCitiesForCountry } from '@/lib/locations'
import { CategoryPicker } from '@/components/category-picker'
import { COMMUNITIES } from '@/lib/communities'
import { createClient } from '@/lib/supabase/client'
import { compressImage, isImageFile, formatFileSize } from '@/lib/image-utils'
import type { Profile, ServiceType, Gender } from '@/types/database'

export default function SettingsPage() {
  const supabase = createClient()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Profile data
  const [profile, setProfile] = useState<Partial<Profile>>({
    business_name: '',
    phone: '',
    whatsapp: '',
    website_url: '',
    country: 'IL',
    city: '',
    address: '',
    description: '',
    categories: [],
    service_type: 'project',
    gender: 'male',
    avatar_url: null,
    media_urls: [],
  })

  // Load profile on mount
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }
      
      setLoading(false)
    }

    loadProfile()
  }, [supabase])

  // Handle avatar upload with compression
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Delete old avatar if exists
      if (profile.avatar_url) {
        try {
          // Extract file path from URL (after /avatars/)
          const urlParts = profile.avatar_url.split('/avatars/')
          if (urlParts[1]) {
            const oldFilePath = decodeURIComponent(urlParts[1])
            await supabase.storage.from('avatars').remove([oldFilePath])
            console.log('Old avatar deleted:', oldFilePath)
          }
        } catch (deleteError) {
          console.warn('Could not delete old avatar:', deleteError)
          // Continue with upload even if delete fails
        }
      }

      // Compress image to WebP format
      let processedFile = file
      if (isImageFile(file)) {
        console.log(`Compressing avatar: ${formatFileSize(file.size)}`)
        processedFile = await compressImage(file, {
          maxWidthOrHeight: 400, // Smaller for avatars
          quality: 0.85,
        })
        console.log(`Compressed to: ${formatFileSize(processedFile.size)}`)
      }

      const fileName = `${user.id}/avatar-${Date.now()}.webp`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, processedFile, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile
      setProfile(prev => ({ ...prev, avatar_url: urlData.publicUrl }))
      setMessage({ type: 'success', text: 'התמונה הועלתה בהצלחה (WebP)' })
    } catch (error) {
      console.error('Avatar upload error:', error)
      setMessage({ type: 'error', text: 'שגיאה בהעלאת התמונה' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Remove avatar (delete from storage + clear URL)
  const removeAvatar = async () => {
    if (!profile.avatar_url) return
    
    try {
      // Extract file path from URL
      const urlParts = profile.avatar_url.split('/avatars/')
      if (urlParts[1]) {
        const filePath = decodeURIComponent(urlParts[1])
        await supabase.storage.from('avatars').remove([filePath])
        console.log('Avatar deleted from storage:', filePath)
      }
    } catch (deleteError) {
      console.warn('Could not delete avatar from storage:', deleteError)
    }
    
    // Clear from profile state
    setProfile(prev => ({ ...prev, avatar_url: null }))
    setMessage({ type: 'success', text: 'התמונה הוסרה' })
  }

  // Handle media upload (images/videos) with compression
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingMedia(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const newMediaUrls: string[] = []

      for (const file of Array.from(files)) {
        let processedFile = file
        let fileExt = file.name.split('.').pop()

        // Compress images to WebP, keep videos as-is
        if (isImageFile(file)) {
          console.log(`Compressing media: ${file.name} (${formatFileSize(file.size)})`)
          processedFile = await compressImage(file, {
            maxWidthOrHeight: 1200,
            quality: 0.8,
          })
          fileExt = 'webp'
          console.log(`Compressed to: ${formatFileSize(processedFile.size)}`)
        }

        const fileName = `${user.id}/media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, processedFile)

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
      
      setMessage({ type: 'success', text: `${newMediaUrls.length} קבצים הועלו בהצלחה (WebP)` })
    } catch (error) {
      console.error('Media upload error:', error)
      setMessage({ type: 'error', text: 'שגיאה בהעלאת הקבצים' })
    } finally {
      setUploadingMedia(false)
    }
  }

  // Remove media item (also deletes from storage)
  const removeMedia = async (index: number) => {
    const mediaUrl = profile.media_urls?.[index]
    
    // Delete from Supabase storage
    if (mediaUrl) {
      try {
        const urlParts = mediaUrl.split('/media/')
        if (urlParts[1]) {
          const filePath = decodeURIComponent(urlParts[1])
          await supabase.storage.from('media').remove([filePath])
          console.log('Media deleted from storage:', filePath)
        }
      } catch (deleteError) {
        console.warn('Could not delete media from storage:', deleteError)
        // Continue with removal from profile even if storage delete fails
      }
    }
    
    // Remove from profile state
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const updateData = {
        business_name: profile.business_name,
        phone: profile.phone,
        whatsapp: profile.whatsapp,
        website_url: profile.website_url,
        city: profile.city,
        address: profile.address,
        description: profile.description,
        categories: profile.categories,
        service_type: profile.service_type,
        avatar_url: profile.avatar_url,
        media_urls: profile.media_urls,
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">עריכת פרופיל</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
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
          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {profile.gender === 'female' ? 'לוגו עסקי' : 'תמונת פרופיל'}
              </CardTitle>
              <CardDescription>
                {profile.gender === 'female' 
                  ? 'הלוגו שיוצג בפרופיל העסק שלך' 
                  : 'התמונה שתוצג בפרופיל שלך'}
              </CardDescription>
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
                      onClick={removeAvatar}
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
              <CardDescription>
                תמונות וסרטונים שמציגים את העבודה שלך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {/* Existing media */}
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
                
                {/* Upload button */}
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
              <p className="text-xs text-muted-foreground mt-3">
                ניתן להעלות עד 10 תמונות או סרטונים. גודל מקסימלי: 10MB לכל קובץ
              </p>
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
                  placeholder="שם העסק שלך" 
                  className="mt-1.5" 
                  required
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
                <Label htmlFor="website">קישור לאתר</Label>
                <Input 
                  id="website" 
                  type="url" 
                  value={profile.website_url || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, website_url: e.target.value }))}
                  placeholder="https://www.example.com" 
                  dir="ltr" 
                  className="mt-1.5" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  הכנס את כתובת האתר שלך כולל https://
                </p>
              </div>
              <div>
                <Label htmlFor="country">׳׳“׳™׳ ׳”</Label>
                <select
                  id="country"
                  value={profile.country || 'IL'}
                  onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value, city: '' }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5"
                >
                  <option value="IL">׳™׳©׳¨׳׳ נ‡®נ‡±</option>
                  <option value="US">׳׳¨׳¦׳•׳× ׳”׳‘׳¨׳™׳× נ‡÷נ‡¸</option>
                  <option value="GB">׳‘׳¨׳™׳˜׳ ׳™׳” נ‡¬נ‡§</option>
                  <option value="CA">׳§׳ ׳“׳” נ‡¨נ‡¦</option>
                  <option value="FR">׳¦׳¨׳₪׳× נ‡«נ‡·</option>
                  <option value="BE">׳‘׳׳’׳™׳” נ‡§נ‡×</option>
                  <option value="AR">׳׳¨׳’׳ ׳˜׳™׳ ׳” נ‡¦נ‡·</option>
                </select>
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
                <Label htmlFor="address">כתובת (אופציונלי)</Label>
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
                <Label htmlFor="category">קטגוריה ראשית</Label>
                <CategoryPicker
                  value={profile.categories?.[0] || ''}
                  onChange={(v) => setProfile(prev => ({ ...prev, categories: [v] }))}
                  placeholder="לחץ לבחירת קטגוריה"
                />
              </div>
              <div>
                <Label htmlFor="serviceType">סוג שירות</Label>
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
                    <SelectItem value="retail">קניות ומסחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="community">קהילה / חסידות</Label>
                <Select>
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
                <Label htmlFor="description">תיאור העסק</Label>
                <Textarea 
                  id="description" 
                  value={profile.description || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="ספר על העסק שלך, הניסיון והשירותים שאתה מציע..."
                  rows={5}
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
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
        </form>
      </main>
    </div>
  )
}
