import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { DesktopSidebar } from '@/components/ads/desktop-sidebar'
import { MOCK_ADS } from '@/lib/ads-data'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
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
