import type { Metadata, Viewport } from 'next'
import { Heebo } from 'next/font/google'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'בול - מדריך בעלי מקצוע',
  description: 'מצא בעלי מקצוע אמינים בקהילה החרדית',
  keywords: ['בעלי מקצוע', 'חרדי', 'שירותים', 'עסקים', 'ישראל'],
  authors: [{ name: 'Bul' }],
  creator: 'Bul',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'בול',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}
