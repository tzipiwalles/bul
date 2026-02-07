'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { DesktopSidebar } from '@/components/ads/desktop-sidebar'
import { MOCK_ADS } from '@/lib/ads-data'
import { AlertTriangle } from 'lucide-react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = useTranslations('demoBanner')
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Demo Notice Banner */}
      <div className="bg-amber-500 text-white py-2 px-4 text-center text-sm font-medium shadow-md">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="font-bold">{t('title')}</span>
          <span className="hidden sm:inline">-</span>
          <span>{t('message')}</span>
        </div>
      </div>
      
      <Header />
      
      <div className="container mx-auto px-4 flex-1 py-6">
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>
          
          <DesktopSidebar ads={MOCK_ADS} />
        </div>
      </div>
      
      <Footer />
      <BottomNav />
    </div>
  )
}
