'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { CITIES } from '@/lib/constants'
import { ArrowRight, Store, Loader2 } from 'lucide-react'
import type { Gender, ServiceType } from '@/types/database'

export default function RegisterBusinessPage() {
  const router = useRouter()
  const supabase = createClient()
  
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
      setError('נא למלא את כל השדות הנדרשים')
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
        setError(`שגיאה ביצירת הפרופיל: ${profileError.message}`)
        setSubmitting(false)
        return
      }

      // Success - redirect to dashboard
      console.log('Profile created successfully, redirecting...')
      router.push('/dashboard/settings')
      router.refresh()
    } catch (err) {
      console.error('Error:', err)
      setError('אירעה שגיאה. נסה שוב.')
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
          <h1 className="text-2xl font-bold text-gray-900">הרשמה כבעל עסק</h1>
          <p className="text-gray-500 text-sm">צור פרופיל עסקי והגיע ללקוחות חדשים</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            פרטי העסק
          </CardTitle>
          <CardDescription>
            מלא את הפרטים כדי ליצור את הפרופיל העסקי שלך
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
              <Label htmlFor="businessName">שם העסק *</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="שם העסק שלך"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">טלפון *</Label>
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
              <Label htmlFor="city">עיר *</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="בחר עיר" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CITIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>מגדר</Label>
              <RadioGroup
                value={gender}
                onValueChange={(v) => setGender(v as Gender)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">גבר</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">אישה</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-1">
                {gender === 'male' ? 'תוכל להעלות תמונת פרופיל' : 'תוכלי להעלות לוגו עסקי בלבד'}
              </p>
            </div>

            <div>
              <Label htmlFor="category">קטגוריה *</Label>
              <CategoryPicker
                value={category}
                onChange={setCategory}
                placeholder="לחץ לבחירת קטגוריה"
              />
            </div>

            <div>
              <Label htmlFor="serviceType">סוג שירות</Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
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
              <Label htmlFor="description">תיאור העסק</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ספר על העסק שלך, הניסיון והשירותים שאתה מציע..."
                rows={4}
                className="mt-1.5"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  יוצר פרופיל...
                </>
              ) : (
                <>
                  <Store className="ml-2 h-5 w-5" />
                  צור פרופיל עסקי
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
