'use client'

import Image from 'next/image'
import { Ad } from '@/lib/ads-data'
import { ExternalLink } from 'lucide-react'

interface DesktopSidebarProps {
  ads: Ad[]
}

export function DesktopSidebar({ ads }: DesktopSidebarProps) {
  const sidebarAds = ads.filter(ad => ad.placement === 'sidebar')

  if (sidebarAds.length === 0) return null

  return (
    <aside className="hidden xl:flex flex-col gap-6 w-[300px] min-w-[300px] sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pl-4 pb-4">
      <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">ממומן</div>
      
      {sidebarAds.map((ad) => (
        <a 
          key={ad.id}
          href={ad.link_url}
          target="_blank" 
          rel="noopener noreferrer"
          className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
        >
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={ad.image_url}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
              ממומן
            </div>
          </div>
          <div className="p-4">
            {ad.advertiser_name && (
              <div className="text-xs text-secondary font-medium mb-1">
                {ad.advertiser_name}
              </div>
            )}
            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {ad.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
              {ad.description}
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              לפרטים נוספים <ExternalLink className="h-3 w-3 mr-1" />
            </div>
          </div>
        </a>
      ))}
    </aside>
  )
}
