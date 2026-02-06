"use client"

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowRight, Upload, X, Loader2, AlertTriangle, ImageIcon } from 'lucide-react'
import type { RegistrationData } from '../page'

interface StepMediaProps {
  data: RegistrationData
  updateData: (updates: Partial<RegistrationData>) => void
  onSubmit: () => void
  onPrev: () => void
  loading: boolean
}

export function StepMedia({ data, updateData, onSubmit, onPrev, loading }: StepMediaProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string[]>([])
  
  const isMale = data.gender === 'male'
  const isFemale = data.gender === 'female'

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateData({ avatarFile: file })
      const reader = new FileReader()
      reader.onload = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }, [updateData])

  const removeAvatar = () => {
    updateData({ avatarFile: null })
    setAvatarPreview(null)
  }

  const handleMediaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxFiles = 5 - data.mediaFiles.length
    const newFiles = files.slice(0, maxFiles)
    
    updateData({ mediaFiles: [...data.mediaFiles, ...newFiles] })
    
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setMediaPreview(prev => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    })
  }, [data.mediaFiles, updateData])

  const removeMedia = (index: number) => {
    const newFiles = data.mediaFiles.filter((_, i) => i !== index)
    const newPreviews = mediaPreview.filter((_, i) => i !== index)
    updateData({ mediaFiles: newFiles })
    setMediaPreview(newPreviews)
  }

  return (
    <div className="space-y-6">
      {/* Avatar/Logo Upload */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          {isMale ? 'תמונת פרופיל' : 'לוגו עסקי'}
        </Label>
        
        {/* CRITICAL: Gender-specific guidance */}
        {isMale && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>העלה תמונת פרופיל</strong> - תמונה אמיתית מגבירה אמון בקרב לקוחות
            </p>
          </div>
        )}
        
        {isFemale && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  העלי לוגו עסקי בלבד
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  בהתאם לכללי הצניעות, נא להעלות לוגו בלבד. 
                  <strong> אין להעלות תמונות של נשים.</strong>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={avatarPreview}
                  alt="תצוגה מקדימה"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-1 -right-1 p-1 bg-destructive text-white rounded-full shadow-md hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">העלאה</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>{isMale ? 'תמונה ברורה של הפנים' : 'לוגו העסק שלך'}</p>
            <p className="text-xs">PNG, JPG עד 5MB</p>
          </div>
        </div>
      </div>

      {/* Gallery Upload */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          גלריית עבודות (אופציונלי)
        </Label>
        <p className="text-sm text-muted-foreground">
          הוסף עד 5 תמונות של העבודות שלך
        </p>
        
        {isFemale && (
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-700">
              נא להקפיד שהתמונות אינן כוללות דמויות נשים
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-3">
          {mediaPreview.map((preview, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={preview}
                alt={`עבודה ${index + 1}`}
                fill
                className="object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute -top-1 -right-1 p-1 bg-destructive text-white rounded-full shadow-md hover:bg-destructive/90"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          {mediaPreview.length < 5 && (
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">
                +{5 - mediaPreview.length}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMediaChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex-1"
          size="lg"
          disabled={loading}
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          חזור
        </Button>
        
        <Button
          onClick={onSubmit}
          className="flex-1"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              יוצר חשבון...
            </>
          ) : (
            'סיום והרשמה'
          )}
        </Button>
      </div>
    </div>
  )
}
