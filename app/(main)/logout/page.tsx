'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function LogoutPage() {
  const [status, setStatus] = useState('מנקה נתונים...')

  useEffect(() => {
    // Don't use Supabase at all - just nuke everything
    
    // 1. Clear ALL localStorage
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) keysToRemove.push(key)
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      setStatus('localStorage נוקה')
    } catch (e) {
      console.warn('localStorage clear error:', e)
    }

    // 2. Clear ALL sessionStorage
    try {
      sessionStorage.clear()
    } catch (e) {
      console.warn('sessionStorage clear error:', e)
    }

    // 3. Clear ALL cookies
    try {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const name = cookie.split('=')[0].trim()
        // Delete with all possible path combinations
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname};`
      }
      setStatus('Cookies נוקו')
    } catch (e) {
      console.warn('Cookie clear error:', e)
    }

    // 4. Clear indexedDB if exists
    try {
      if (window.indexedDB) {
        indexedDB.databases().then(dbs => {
          dbs.forEach(db => {
            if (db.name) indexedDB.deleteDatabase(db.name)
          })
        }).catch(() => {})
      }
    } catch (e) {
      console.warn('indexedDB clear error:', e)
    }

    // 5. Unregister all service workers
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(reg => reg.unregister())
        }).catch(() => {})
      }
    } catch (e) {
      console.warn('SW unregister error:', e)
    }

    // 6. Clear caches
    try {
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name))
        }).catch(() => {})
      }
    } catch (e) {
      console.warn('Cache clear error:', e)
    }

    setStatus('מפנה לדף הבית...')

    // Wait a moment and do a HARD redirect
    setTimeout(() => {
      window.location.replace('/')
    }, 1500)
  }, [])

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
