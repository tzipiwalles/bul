'use client'

import { useState, useEffect } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CategoryPicker } from '@/components/category-picker'
import { TermsConsent } from '@/components/legal-modal'
import { CITIES } from '@/lib/constants'
import { ArrowRight, Store, Loader2 } from 'lucide-react'
import type { Gender, ServiceType } from '@/types/database'

export default function RegisterBusinessPage() {
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('registerBusiness')
  const tCommon = useTranslations('common')
  const tService = useTranslations('serviceTypes')
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')

  // Form data
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [serviceType, setServiceType] = useState<ServiceType>('project')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    async function checkUser() {
      try {
        console.log('Checking user...')
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Auth error:', userError)
        }
        
        console.log('User:', user?.email || 'Not logged in')
        
        if (!user) {
          // Not logged in, redirect to login
          console.log('Redirecting to login...')
          router.push('/login?redirect=/register-business')
          return
        }

        // Check if already a business owner
        console.log('Checking for existing profile...')
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) {
          console.error('Profile check error:', profileError)
        }
        
        console.log('Existing profile:', profile ? 'Yes' : 'No')

        if (profile) {
          // Already a business owner, redirect to dashboard
          console.log('User already has profile, redirecting to dashboard...')
          router.push('/dashboard')
          return
        }

        console.log('Ready to register business')
        setUserId(user.id)
        setUserEmail(user.email || '')
        setBusinessName(user.user_metadata?.full_name || '')
        setLoading(false)
      } catch (err) {
        console.error('checkUser error:', err)
        setLoading(false)
      }
    }

    checkUser()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setSubmitting(true)
    setError(null)

    // Validation
    if (!businessName || !phone || !city || !category) {
      setError(t('fillRequired'))
      setSubmitting(false)
      return
    }

    if (!termsAccepted) {
      setError(t('acceptTerms'))
      setSubmitting(false)
      return
    }

    try {
      console.log('Creating profile for user:', userId)
      console.log('Profile data:', { businessName, phone, city, gender, serviceType, category })
      
      const { data, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          business_name: businessName,
          phone,
          city,
          gender,
          role: 'professional',
          service_type: serviceType,
          categories: [category],
          description,
          is_active: true,
        })
        .select()

      console.log('Insert result:', { data, error: profileError })

      if (profileError) {
        console.error('Profile error:', profileError)
        setError(`${t('profileCreateError')} ${profileError.message}`)
        setSubmitting(false)
        return
      }

      // Success - redirect to dashboard
      console.log('Profile created successfully, redirecting...')
      router.push('/dashboard/settings')
      router.refresh()
    } catch (err) {
      console.error('Error:', err)
      setError(tCommon('error'))
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="text-gray-500 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 text-sm">{t('subtitle')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            {t('formTitle')}
          </CardTitle>
          <CardDescription>
            {t('formSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="businessName">{t('businessName')}</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={t('businessNamePlaceholder')}
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-0000000"
                dir="ltr"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="city">{t('city')}</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder={t('selectCity')} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CITIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('gender')}</Label>
              <RadioGroup
                value={gender}
                onValueChange={(v) => setGender(v as Gender)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">{tCommon('male')}</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">{tCommon('female')}</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-1">
                {gender === 'male' ? t('maleUploadHint') : t('femaleUploadHint')}
              </p>
            </div>

            <div>
              <Label htmlFor="category">{t('category')}</Label>
              <CategoryPicker
                value={category}
                onChange={setCategory}
                placeholder={t('selectCategory')}
              />
            </div>

            <div>
              <Label htmlFor="serviceType">{t('serviceType')}</Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder={t('selectServiceType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">{tService('appointment')}</SelectItem>
                  <SelectItem value="project">{tService('projectQuote')}</SelectItem>
                  <SelectItem value="emergency">{tService('emergencyService')}</SelectItem>
                  <SelectItem value="retail">{tService('retail')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">{t('businessDescription')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('descriptionPlaceholder')}
                rows={4}
                className="mt-1.5"
              />
            </div>

            {/* Terms Consent */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <TermsConsent
                checked={termsAccepted}
                onChange={setTermsAccepted}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting || !termsAccepted}>
              {submitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {t('creating')}
                </>
              ) : (
                <>
                  <Store className="ml-2 h-5 w-5" />
                  {t('createProfile')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
