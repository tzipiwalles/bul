import { NextResponse, type NextRequest } from 'next/server'

// Simple middleware that doesn't use Supabase SSR (which causes Edge Runtime issues)
// Auth checks are handled in server components/route handlers instead
export async function middleware(request: NextRequest) {
  // For now, just pass through all requests
  // Protected route checks will be handled in the dashboard layout
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
