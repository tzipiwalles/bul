'use client'

import { useEffect, useState } from 'react'
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
  const supabase = createClient()
  
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isBusinessOwner, setIsBusinessOwner] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Check if user has a business profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()
        
        setIsBusinessOwner(!!profile)

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle()
        
        console.log('Admin check:', { adminData, adminError, userId: user.id })
        setIsAdmin(!!adminData)
      }
      
      setLoading(false)
    }

    checkUser()

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single()
          
          setIsBusinessOwner(!!profile)

          // Check if user is admin
          const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('user_id')
            .eq('user_id', session.user.id)
            .maybeSingle()
          
          console.log('Admin check (auth change):', { adminData, adminError, userId: session.user.id })
          setIsAdmin(!!adminData)
        } else {
          setIsBusinessOwner(false)
          setIsAdmin(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
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
