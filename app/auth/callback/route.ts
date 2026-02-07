import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error_param = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/'

  console.log('[Auth Callback] Request received:', { 
    hasCode: !!code, 
    error_param,
    error_description,
    origin,
    next 
  })

  // Handle OAuth errors from provider
  if (error_param) {
    console.error('[Auth Callback] OAuth error:', error_param, error_description)
    return NextResponse.redirect(`${origin}/he/login?error=${encodeURIComponent(error_param)}&message=${encodeURIComponent(error_description || '')}`)
  }

  if (code) {
    try {
      const supabase = await createClient()
      console.log('[Auth Callback] Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('[Auth Callback] Exchange result:', {
        hasUser: !!data?.user,
        userId: data?.user?.id?.substring(0, 8),
        error: error?.message
      })
      
      if (!error && data.user) {
        // Redirect to where they wanted to go, or home page
        console.log('[Auth Callback] Success, redirecting to:', next)
        return NextResponse.redirect(`${origin}${next}`)
      }
      
      if (error) {
        console.error('[Auth Callback] Exchange error:', error.message)
        return NextResponse.redirect(`${origin}/he/login?error=exchange_failed&message=${encodeURIComponent(error.message)}`)
      }
    } catch (e) {
      console.error('[Auth Callback] Unexpected error:', e)
      return NextResponse.redirect(`${origin}/he/login?error=unexpected_error&message=${encodeURIComponent(e instanceof Error ? e.message : 'Unknown error')}`)
    }
  }

  // No code provided
  console.log('[Auth Callback] No code provided')
  return NextResponse.redirect(`${origin}/he/login?error=no_code`)
}
