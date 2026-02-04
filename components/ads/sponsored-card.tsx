import Image from 'next/image'
import { Ad } from '@/lib/ads-data'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SponsoredCardProps {
  ad: Ad
}

export function SponsoredCard({ ad }: SponsoredCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-secondary/20 shadow-sm relative overflow-hidden group hover:border-secondary/40 transition-colors">
      <div className="absolute top-0 right-0 bg-secondary text-white text-xs px-3 py-1 rounded-bl-xl font-medium z-10">
        ממומן
      </div>
      
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col h-full justify-between">
            <div>
              {ad.advertiser_name && (
                <div className="text-xs font-medium text-secondary mb-1">
                  {ad.advertiser_name}
                </div>
              )}
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                {ad.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {ad.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-secondary/10 flex justify-end">
        <Button variant="outline" size="sm" className="gap-2 text-secondary border-secondary/20 hover:bg-secondary/5 hover:text-secondary-foreground w-full sm:w-auto" asChild>
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
            לפרטים נוספים
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  )
}
