import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware({
  ...routing,
  // Always use Hebrew as default, don't detect from browser
  localeDetection: true,
  // Prefer Hebrew even if browser sends different language
  alternateLinks: false
})

export const config = {
  // Match all pathnames except for
  // - ...if they start with `/api`, `/trpc`, `/_next`, `/_vercel`, `/auth`
  // - ...the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|auth|.*\\..*).*)'
}
