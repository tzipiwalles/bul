import type { Metadata, Viewport } from 'next'
import { Heebo } from 'next/font/google'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'קנ"ש - קהילת נותני שירות',
  description: 'מצא בעלי מקצוע אמינים בקהילה החרדית',
  keywords: ['בעלי מקצוע', 'חרדי', 'שירותים', 'עסקים', 'ישראל'],
  authors: [{ name: 'Kanash' }],
  creator: 'Kanash',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'קנ"ש',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0A2351',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={heebo.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}
