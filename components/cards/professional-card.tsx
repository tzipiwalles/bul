import Link from 'next/link'
import { Star, MapPin, CheckCircle2, Play, Calendar, Wrench, AlertTriangle, Store } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface Professional {
  id: string | number
  name: string
  category: string
  city: string
  rating: number
  reviews: number
  description: string
  isVerified: boolean
  tags: string[]
  imageUrl?: string
  avatarUrl?: string | null
  hasVideo?: boolean
  serviceType?: 'appointment' | 'project' | 'emergency' | 'retail'
}

// Service type badge config
const SERVICE_BADGE_CONFIG = {
  appointment: { label: 'קביעת תור', icon: Calendar, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  project: { label: 'פרויקטים', icon: Wrench, className: 'bg-green-50 text-green-700 border-green-200' },
  emergency: { label: 'חירום 24/6', icon: AlertTriangle, className: 'bg-red-50 text-red-700 border-red-200' },
  retail: { label: 'קניות ומסחר', icon: Store, className: 'bg-purple-50 text-purple-700 border-purple-200' },
}

interface ProfessionalCardProps {
  pro: Professional
}

export function ProfessionalCard({ pro }: ProfessionalCardProps) {
  return (
    <Link href={`/profile/${pro.id}`} className="block">
      <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl font-bold text-primary shadow-inner overflow-hidden">
              {(pro.avatarUrl || pro.imageUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pro.avatarUrl || pro.imageUrl} alt={pro.name} className="w-full h-full object-cover" />
              ) : (
                pro.name[0]
              )}
            </div>
            {pro.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-50" />
              </div>
            )}
            {/* Video indicator */}
            {pro.hasVideo && (
              <div className="absolute -top-1 -left-1 bg-secondary rounded-full p-1 shadow-sm">
                <Play className="h-3 w-3 text-white fill-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors truncate">
                  {pro.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{pro.category}</p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm text-gray-900">{pro.rating}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
              {pro.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Service Type Badge */}
              {pro.serviceType && SERVICE_BADGE_CONFIG[pro.serviceType] && (
                <Badge variant="outline" className={`font-normal border ${SERVICE_BADGE_CONFIG[pro.serviceType].className}`}>
                  {(() => {
                    const Icon = SERVICE_BADGE_CONFIG[pro.serviceType!].icon
                    return <Icon className="h-3 w-3 ml-1" />
                  })()}
                  {SERVICE_BADGE_CONFIG[pro.serviceType].label}
                </Badge>
              )}
              {pro.hasVideo && (
                <Badge variant="secondary" className="font-normal bg-secondary/10 text-secondary border border-secondary/20">
                  <Play className="h-3 w-3 ml-1" />
                  סרטון
                </Badge>
              )}
              {pro.tags.filter(tag => tag !== '24/6' || pro.serviceType !== 'emergency').map((tag, i) => (
                <Badge key={i} variant="secondary" className="font-normal bg-gray-50 text-gray-600 hover:bg-gray-100">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Footer - Location only, no button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{pro.city}</span>
              </div>
              <span className="text-xs text-primary font-medium group-hover:underline">
                צפה בפרופיל ←
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
