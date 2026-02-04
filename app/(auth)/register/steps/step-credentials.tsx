"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import type { RegistrationData } from '../page'

interface StepCredentialsProps {
  data: RegistrationData
  updateData: (updates: Partial<RegistrationData>) => void
  onNext: () => void
  setError: (error: string | null) => void
}

export function StepCredentials({ data, updateData, onNext, setError }: StepCredentialsProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleNext = async () => {
    // Validation
    if (!data.email || !data.password) {
      setError('נא למלא את כל השדות')
      return
    }

    if (!validateEmail(data.email)) {
      setError('נא להזין כתובת אימייל תקינה')
      return
    }

    if (data.password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }

    if (data.password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות')
      return
    }

    setLoading(true)
    setError(null)

    // Check if email already exists
    // We can't directly check this, but we'll handle it during final registration
    
    setLoading(false)
    onNext()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">אימייל</Label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="pr-10"
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">סיסמה</Label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="לפחות 6 תווים"
            value={data.password}
            onChange={(e) => updateData({ password: e.target.value })}
            className="pr-10 pl-10"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">אימות סיסמה</Label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="הזן שוב את הסיסמה"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10"
            dir="ltr"
          />
        </div>
      </div>

      <Button
        onClick={handleNext}
        className="w-full mt-6"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            בודק...
          </>
        ) : (
          'המשך'
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center mt-4">
        יש לך כבר חשבון?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          התחבר
        </Link>
      </p>
    </div>
  )
}
