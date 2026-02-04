"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Import step components
import { StepCredentials } from './steps/step-credentials'
import { StepProfile } from './steps/step-profile'
import { StepBusiness } from './steps/step-business'
import { StepMedia } from './steps/step-media'

import type { Gender, Role, ServiceType } from '@/types/database'

export interface RegistrationData {
  // Step 1 - Credentials
  email: string
  password: string
  // Step 2 - Profile
  businessName: string
  phone: string
  city: string
  gender: Gender | null
  // Step 3 - Business
  role: Role
  serviceType: ServiceType | null
  categories: string[]
  description: string
  // Step 4 - Media
  avatarFile: File | null
  mediaFiles: File[]
}

const initialData: RegistrationData = {
  email: '',
  password: '',
  businessName: '',
  phone: '',
  city: '',
  gender: null,
  role: 'professional',
  serviceType: null,
  categories: [],
  description: '',
  avatarFile: null,
  mediaFiles: [],
}

const TOTAL_STEPS = 4

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<RegistrationData>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateData = (updates: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
      setError(null)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError || !authData.user) {
        if (authError?.message?.includes('already registered')) {
          setError('אימייל זה כבר רשום במערכת')
        } else {
          setError('שגיאה ביצירת החשבון. נסה שוב.')
        }
        setLoading(false)
        return
      }

      const userId = authData.user.id

      // Step 2: Upload avatar if exists
      let avatarUrl: string | null = null
      if (data.avatarFile) {
        const fileExt = data.avatarFile.name.split('.').pop()
        const fileName = `${userId}/avatar.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, data.avatarFile)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)
          avatarUrl = urlData.publicUrl
        }
      }

      // Step 3: Upload media files
      const mediaUrls: string[] = []
      for (let i = 0; i < data.mediaFiles.length; i++) {
        const file = data.mediaFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/media-${i}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(fileName)
          mediaUrls.push(urlData.publicUrl)
        }
      }

      // Step 4: Create profile
      const profileData = {
        id: userId,
        email: data.email,
        business_name: data.businessName,
        phone: data.phone,
        city: data.city,
        gender: data.gender!,
        role: data.role,
        service_type: data.serviceType!,
        categories: data.categories,
        description: data.description || '',
        avatar_url: avatarUrl,
        media_urls: mediaUrls,
      }
      
      console.log('Creating profile with data:', profileData)
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData as any)

      if (profileError) {
        console.error('Profile error:', JSON.stringify(profileError, null, 2))
        console.error('Profile error message:', profileError.message)
        console.error('Profile error code:', profileError.code)
        console.error('Profile error details:', profileError.details)
        setError(`שגיאה ביצירת הפרופיל: ${profileError.message || 'נסה שוב'}`)
        setLoading(false)
        return
      }

      // Success! Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Registration error:', err)
      setError('אירעה שגיאה. נסה שוב.')
      setLoading(false)
    }
  }

  const stepTitles = [
    'יצירת חשבון',
    'פרטים אישיים',
    'סוג העסק',
    data.gender === 'male' ? 'תמונת פרופיל' : 'לוגו עסקי',
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-primary/5 to-background">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link href="/" className="text-3xl font-bold text-primary mb-2 block">
            בול
          </Link>
          <CardTitle className="text-2xl">{stepTitles[currentStep - 1]}</CardTitle>
          <CardDescription>
            שלב {currentStep} מתוך {TOTAL_STEPS}
          </CardDescription>
          
          {/* Progress bar */}
          <div className="flex gap-2 mt-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
              {error}
            </div>
          )}
          
          {currentStep === 1 && (
            <StepCredentials
              data={data}
              updateData={updateData}
              onNext={nextStep}
              setError={setError}
            />
          )}
          
          {currentStep === 2 && (
            <StepProfile
              data={data}
              updateData={updateData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <StepBusiness
              data={data}
              updateData={updateData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          
          {currentStep === 4 && (
            <StepMedia
              data={data}
              updateData={updateData}
              onSubmit={handleSubmit}
              onPrev={prevStep}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
