import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['he', 'en', 'fr'],
  defaultLocale: 'he',
  // Don't prefix the default locale (he) in URLs
  localePrefix: 'as-needed'
})
