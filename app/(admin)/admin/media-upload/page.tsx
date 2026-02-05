'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Image as ImageIcon,
  Search,
  User,
  Camera
} from 'lucide-react'
import { compressImage, isImageFile, formatFileSize } from '@/lib/image-utils'

interface ProfileBasic {
  id: string
  business_name: string
  avatar_url: string | null
  media_urls: string[]
}

export default function MediaUploadPage() {
  const [profiles, setProfiles] = useState<ProfileBasic[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileBasic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProfile, setSelectedProfile] = useState<ProfileBasic | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const supabase = createClient()
  
  useEffect(() => {
    fetchProfiles()
  }, [])
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProfiles(profiles)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredProfiles(profiles.filter(p => 
        p.business_name.toLowerCase().includes(query)
      ))
    }
  }, [searchQuery, profiles])
  
  async function fetchProfiles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, business_name, avatar_url, media_urls')
      .eq('is_active', true)
      .order('business_name')
    
    if (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'שגיאה בטעינת הנתונים' })
    } else {
      setProfiles(data || [])
      setFilteredProfiles(data || [])
    }
    setLoading(false)
  }
  
  // Handle avatar upload
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !selectedProfile) return
    
    setUploadingAvatar(true)
    setMessage(null)
    
    try {
      // Compress image to WebP
      let processedFile = file
      if (isImageFile(file)) {
        processedFile = await compressImage(file, {
          maxWidthOrHeight: 400, // Smaller for avatars
          quality: 0.85,
        })
      }
      
      // Upload via admin API
      const formData = new FormData()
      formData.append('file', processedFile)
      formData.append('profileId', selectedProfile.id)
      
      const response = await fetch('/api/admin/upload-avatar', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload avatar')
      }
      
      // Update local state
      const newAvatarUrl = result.avatarUrl
      setSelectedProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null)
      setProfiles(prev => prev.map(p => 
        p.id === selectedProfile.id ? { ...p, avatar_url: newAvatarUrl } : p
      ))
      
      setMessage({ type: 'success', text: 'תמונת הפרופיל הוחלפה בהצלחה' })
    } catch (error) {
      console.error('Avatar upload error:', error)
      setMessage({ type: 'error', text: `שגיאה בהעלאת תמונת פרופיל: ${error instanceof Error ? error.message : 'Unknown'}` })
    } finally {
      setUploadingAvatar(false)
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ''
      }
    }
  }
  
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0 || !selectedProfile) return
    
    setUploading(true)
    setUploadProgress([])
    setMessage(null)
    
    try {
      const newMediaUrls: string[] = []
      const fileArray = Array.from(files)
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setUploadProgress(prev => [...prev, `מעבד ${file.name}...`])
        
        let processedFile = file
        let fileExt = file.name.split('.').pop()
        
        // Compress images to WebP
        if (isImageFile(file)) {
          setUploadProgress(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = `דוחס ${file.name} (${formatFileSize(file.size)})...`
            return updated
          })
          
          processedFile = await compressImage(file, {
            maxWidthOrHeight: 1200,
            quality: 0.8,
          })
          fileExt = 'webp'
          
          setUploadProgress(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = `נדחס ל-${formatFileSize(processedFile.size)}, מעלה...`
            return updated
          })
        }
        
        const fileName = `${selectedProfile.id}/media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        
        // Upload via admin API to bypass RLS
        const formData = new FormData()
        formData.append('file', processedFile)
        formData.append('profileId', selectedProfile.id)
        formData.append('fileName', fileName)
        
        const uploadResponse = await fetch('/api/admin/upload-file', {
          method: 'POST',
          body: formData,
        })
        
        const uploadResult = await uploadResponse.json()
        
        if (!uploadResponse.ok) {
          console.error('Upload error:', uploadResult.error)
          setUploadProgress(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = `❌ שגיאה בהעלאת ${file.name}: ${uploadResult.error}`
            return updated
          })
          continue
        }
        
        newMediaUrls.push(uploadResult.publicUrl)
        
        setUploadProgress(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = `✅ ${file.name} הועלה בהצלחה`
          return updated
        })
      }
      
      if (newMediaUrls.length > 0) {
        // Use admin API to update profile (bypasses RLS)
        const response = await fetch('/api/admin/upload-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: selectedProfile.id,
            mediaUrls: newMediaUrls,
          }),
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to update profile')
        }
        
        // Update local state with the returned URLs
        const updatedUrls = result.mediaUrls
        setSelectedProfile(prev => prev ? { ...prev, media_urls: updatedUrls } : null)
        setProfiles(prev => prev.map(p => 
          p.id === selectedProfile.id ? { ...p, media_urls: updatedUrls } : p
        ))
        
        setMessage({ 
          type: 'success', 
          text: `${newMediaUrls.length} קבצים הועלו בהצלחה ל-${selectedProfile.business_name}` 
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: `שגיאה בהעלאה: ${error instanceof Error ? error.message : 'Unknown'}` })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
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
          <h1 className="text-2xl font-bold">העלאת מדיה</h1>
          <p className="text-muted-foreground">העלאת תמונות וסרטונים לפרופילים של בעלי עסקים</p>
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
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Profile Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">בחירת בעל עסק</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="חיפוש לפי שם..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            {filteredProfiles.length} בעלי עסקים
          </div>
          
          {/* Profile List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredProfiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors ${
                  selectedProfile?.id === profile.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt={profile.business_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {profile.business_name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{profile.business_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {profile.media_urls?.length || 0} תמונות
                  </div>
                </div>
                {selectedProfile?.id === profile.id && (
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right: Upload Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">העלאת קבצים</h2>
          
          {selectedProfile ? (
            <>
              {/* Profile Header with Avatar */}
              <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-4">
                  {/* Avatar with upload overlay */}
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                      {selectedProfile.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedProfile.avatar_url}
                          alt={selectedProfile.business_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                          {selectedProfile.business_name[0]}
                        </div>
                      )}
                    </div>
                    {/* Upload overlay */}
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      {uploadingAvatar ? (
                        <RefreshCw className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{selectedProfile.business_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedProfile.media_urls?.length || 0} תמונות בגלריה
                    </div>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      {uploadingAvatar ? 'מעלה...' : 'החלף תמונת פרופיל'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Hidden file inputs */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {/* Gallery Upload Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  העלאת תמונות לגלריה
                </h3>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full mb-3"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-5 w-5 ml-2 animate-spin" />
                      מעלה...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 ml-2" />
                      בחירת קבצים להעלאה
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground mb-4">
                  תמונות יידחסו אוטומטית לפורמט WebP (מקסימום 1200px, איכות 80%)
                </p>
              </div>
              
              {/* Upload Progress */}
              {uploadProgress.length > 0 && (
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
                  {uploadProgress.map((msg, i) => (
                    <div key={i} className="text-sm flex items-center gap-2">
                      {msg.startsWith('✅') ? (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : msg.startsWith('❌') ? (
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      ) : (
                        <RefreshCw className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
                      )}
                      <span>{msg.replace(/^[✅❌]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Current Images Preview */}
              {selectedProfile.media_urls && selectedProfile.media_urls.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">תמונות קיימות:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProfile.media_urls.slice(0, 9).map((url, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`${selectedProfile.business_name} - ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {selectedProfile.media_urls.length > 9 && (
                      <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                        +{selectedProfile.media_urls.length - 9}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>בחרי בעל עסק מהרשימה כדי להעלות תמונות</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
