import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { LocationProvider } from '@/lib/context/location-context'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const isRtl = locale === 'he'

  return (
    <div lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <NextIntlClientProvider>
        <LocationProvider>
          {children}
        </LocationProvider>
      </NextIntlClientProvider>
    </div>
  )
}