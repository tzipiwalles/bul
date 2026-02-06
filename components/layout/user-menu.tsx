'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  User, 
  Heart, 
  History, 
  Settings, 
  LayoutDashboard, 
  LogOut,
  Store,
  Loader2,
  Shield
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function UserMenu() {
  const router = useRouter()
  
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isBusinessOwner, setIsBusinessOwner] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.error('Sign out error:', e)
    }
    // Clear state regardless
    setUser(null)
    setIsBusinessOwner(false)
    setIsAdmin(false)
    router.push('/')
    router.refresh()
  }, [supabase, router])

  useEffect(() => {
    let isMounted = true
    
    // Force end loading after 5 seconds no matter what
    const maxLoadingTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log('[UserMenu] Force ending loading after 5s timeout')
        setLoading(false)
      }
    }, 5000)

    async function checkUser() {
      console.log('[UserMenu] Starting auth check...')
      
      try {
        // First try getSession (faster, uses cache)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('[UserMenu] getSession result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          error: sessionError?.message
        })
        
        if (!isMounted) return
        
        if (session?.user) {
          setUser(session.user)
          
          // Check profile and admin status - don't wait forever
          try {
            const [profileResult, adminResult] = await Promise.race([
              Promise.allSettled([
                supabase.from('profiles').select('id').eq('id', session.user.id).maybeSingle(),
                supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
              ]),
              new Promise<PromiseSettledResult<{ data: unknown }>[]>((resolve) => 
                setTimeout(() => resolve([
                  { status: 'rejected', reason: 'timeout' },
                  { status: 'rejected', reason: 'timeout' }
                ] as PromiseSettledResult<{ data: unknown }>[]), 4000)
              )
            ])
            
            if (isMounted) {
              if (profileResult.status === 'fulfilled') {
                setIsBusinessOwner(!!(profileResult.value as { data: unknown }).data)
              }
              if (adminResult.status === 'fulfilled') {
                setIsAdmin(!!(adminResult.value as { data: unknown }).data)
              }
            }
          } catch (e) {
            console.warn('[UserMenu] Profile/Admin check error:', e)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('[UserMenu] checkUser error:', error)
      } finally {
        if (isMounted) {
          console.log('[UserMenu] Auth check completed')
          setLoading(false)
        }
      }
    }

    checkUser()

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[UserMenu] Auth state changed:', event)
        if (!isMounted) return
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', session.user.id)
              .maybeSingle()
            
            if (isMounted) setIsBusinessOwner(!!profile)
          } catch {
            if (isMounted) setIsBusinessOwner(false)
          }

          try {
            const { data: adminData } = await supabase
              .from('admins')
              .select('user_id')
              .eq('user_id', session.user.id)
              .maybeSingle()
            
            if (isMounted) setIsAdmin(!!adminData)
          } catch {
            if (isMounted) setIsAdmin(false)
          }
        } else {
          if (isMounted) {
            setIsBusinessOwner(false)
            setIsAdmin(false)
          }
        }
      }
    )

    return () => {
      isMounted = false
      clearTimeout(maxLoadingTimeout)
      subscription.unsubscribe()
    }
  }, [supabase, loading])

  // Loading state - but clickable to sign out!
  if (loading) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Loader2 className="h-5 w-5 animate-spin" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
            <LogOut className="ml-2 h-4 w-4" />
            <span>התנתקות (אילוץ)</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Not logged in - show login/register buttons
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" className="hidden text-gray-600 hover:text-primary sm:flex">
            התחברות
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-primary text-white hover:bg-primary/90 shadow-md shadow-blue-900/10 rounded-full px-6">
            הצטרפות
          </Button>
        </Link>
      </div>
    )
  }

  // Logged in - show user menu
  const userInitial = user.user_metadata?.full_name?.charAt(0) || 
                      user.email?.charAt(0)?.toUpperCase() || 
                      'U'
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'משתמש'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={userName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
              {userInitial}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Regular user options */}
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="flex items-center cursor-pointer">
            <Heart className="ml-2 h-4 w-4" />
            <span>המועדפים שלי</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/history" className="flex items-center cursor-pointer">
            <History className="ml-2 h-4 w-4" />
            <span>היסטוריה</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Business owner options */}
        {isBusinessOwner ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center cursor-pointer">
                <LayoutDashboard className="ml-2 h-4 w-4" />
                <span>לוח בקרה עסקי</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                <Settings className="ml-2 h-4 w-4" />
                <span>עריכת פרופיל עסקי</span>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/register-business" className="flex items-center cursor-pointer text-primary">
              <Store className="ml-2 h-4 w-4" />
              <span>הרשמה כבעל עסק</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        {/* Admin options */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center cursor-pointer text-yellow-600">
                <Shield className="ml-2 h-4 w-4" />
                <span>ניהול האתר</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
          <LogOut className="ml-2 h-4 w-4" />
          <span>התנתקות</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
