'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function LogoutPage() {
  const router = useRouter()
  const [status, setStatus] = useState('מתנתק...')

  useEffect(() => {
    async function performLogout() {
      try {
        const supabase = createClient()
        
        // Sign out from Supabase
        setStatus('מתנתק מ-Supabase...')
        await supabase.auth.signOut()
        
        // Clear all cookies related to auth
        setStatus('מנקה cookies...')
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=")
          const name = eqPos > -1 ? c.substring(0, eqPos) : c
          document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        })
        
        // Clear localStorage
        setStatus('מנקה localStorage...')
        try {
          localStorage.clear()
        } catch (e) {
          console.warn('Could not clear localStorage:', e)
        }
        
        // Clear sessionStorage
        setStatus('מנקה sessionStorage...')
        try {
          sessionStorage.clear()
        } catch (e) {
          console.warn('Could not clear sessionStorage:', e)
        }
        
        setStatus('הפנייה לדף הבית...')
        
        // Force a full page reload to the homepage
        window.location.href = '/'
        
      } catch (error) {
        console.error('Logout error:', error)
        setStatus('שגיאה בהתנתקות - מנסה שוב...')
        
        // Even if there's an error, clear storage and redirect
        try {
          localStorage.clear()
          sessionStorage.clear()
        } catch (e) {
          // ignore
        }
        
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">מתנתק...</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}
