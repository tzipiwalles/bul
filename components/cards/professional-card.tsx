import Link from 'next/link'
import { Star, MapPin, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface Professional {
  id: number
  name: string
  category: string
  city: string
  rating: number
  reviews: number
  description: string
  isVerified: boolean
  tags: string[]
  imageUrl?: string
}

interface ProfessionalCardProps {
  pro: Professional
}

export function ProfessionalCard({ pro }: ProfessionalCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl font-bold text-primary shadow-inner">
            {pro.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pro.imageUrl} alt={pro.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              pro.name[0]
            )}
          </div>
          {pro.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-50" />
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
            {pro.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="font-normal bg-gray-50 text-gray-600 hover:bg-gray-100">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>{pro.city}</span>
            </div>
            
            <Link href={`/profile/${pro.id}`}>
              <Button size="sm" className="bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
                צור קשר
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
