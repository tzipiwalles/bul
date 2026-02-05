'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  Play, 
  Calendar, 
  Wrench, 
  AlertTriangle, 
  Store,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
  videoUrl?: string
  serviceType?: 'appointment' | 'project' | 'emergency' | 'retail'
  gender?: 'male' | 'female'
  yearsExperience?: number
  community?: string
  galleryImages?: string[]
  isSponsored?: boolean
}

// Service type config
const SERVICE_CONFIG = {
  appointment: { label: 'קביעת תור', icon: Calendar, color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  project: { label: 'פרויקטים', icon: Wrench, color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-50' },
  emergency: { label: 'חירום 24/6', icon: AlertTriangle, color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' },
  retail: { label: 'חנות', icon: Store, color: 'bg-purple-500', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
}

interface ProCardProps {
  pro: Professional
  index?: number
  onVideoClick?: (pro: Professional) => void
  priority?: boolean
}

export function ProCard({ pro, index = 0, onVideoClick, priority = false }: ProCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Build image array - for females (modesty rules), only show work samples/logos
  const images = pro.galleryImages?.length 
    ? pro.galleryImages 
    : pro.avatarUrl 
      ? [pro.avatarUrl]
      : pro.imageUrl 
        ? [pro.imageUrl]
        : []

  const showCarousel = images.length > 1
  const hasVideoPreview = pro.hasVideo && pro.videoUrl

  // Intersection Observer for lazy loading and video autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        
        // Auto-play video when in view
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {})
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause()
        }
      },
      { threshold: 0.3, rootMargin: '100px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold && currentImageIndex > 0) {
      setDirection(-1)
      setCurrentImageIndex(prev => prev - 1)
    } else if (info.offset.x < -threshold && currentImageIndex < images.length - 1) {
      setDirection(1)
      setCurrentImageIndex(prev => prev + 1)
    }
  }, [currentImageIndex, images.length])

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentImageIndex < images.length - 1) {
      setDirection(1)
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentImageIndex > 0) {
      setDirection(-1)
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  const handleStoryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onVideoClick) {
      onVideoClick(pro)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const ServiceIcon = pro.serviceType ? SERVICE_CONFIG[pro.serviceType]?.icon : null

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link href={`/profile/${pro.id}`} className="block group">
        <div 
          className={cn(
            "bg-white rounded-2xl overflow-hidden transition-all duration-300",
            "shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10",
            pro.isSponsored && "ring-2 ring-yellow-400/50 relative"
          )}
        >
          {/* Sponsored Badge */}
          {pro.isSponsored && (
            <div className="absolute top-3 right-3 z-20">
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-lg">
                ממומן ✨
              </Badge>
            </div>
          )}

          {/* Image/Video Carousel - 3:2 Aspect Ratio */}
          <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
            {/* Video Preview (if available) */}
            {hasVideoPreview && isInView ? (
              <div className="absolute inset-0 z-[5]">
                <video
                  ref={videoRef}
                  src={pro.videoUrl}
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Mute/Unmute Toggle */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 left-3 z-10 w-8 h-8 rounded-full glass flex items-center justify-center transition-transform hover:scale-110"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-gray-700" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-gray-700" />
                  )}
                </button>
              </div>
            ) : images.length > 0 ? (
              <>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentImageIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    drag={showCarousel ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[currentImageIndex]}
                      alt={pro.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Navigation */}
                {showCarousel && (
                  <>
                    <button 
                      onClick={prevImage}
                      className={cn(
                        "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                        "w-8 h-8 rounded-full glass flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-all hover:scale-110",
                        currentImageIndex === 0 && "hidden"
                      )}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                        "w-8 h-8 rounded-full glass flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-all hover:scale-110",
                        currentImageIndex === images.length - 1 && "hidden"
                      )}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                      {images.map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1.5 rounded-full transition-all carousel-dot",
                            i === currentImageIndex 
                              ? "w-6 bg-white" 
                              : "w-1.5 bg-white/60"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-5xl font-bold text-gray-300">{pro.name[0]}</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-[6]" />

            {/* Service Type Badge */}
            {pro.serviceType && SERVICE_CONFIG[pro.serviceType] && (
              <div className="absolute top-3 left-3 z-10">
                <div className={cn(
                  "px-2.5 py-1 rounded-full flex items-center gap-1.5",
                  "glass text-xs font-medium"
                )}>
                  {ServiceIcon && <ServiceIcon className="h-3 w-3" />}
                  <span>{SERVICE_CONFIG[pro.serviceType].label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 relative">
            {/* Profile Avatar with Story Ring - z-20 to appear above carousel */}
            <div className="absolute -top-8 right-4 z-20">
              <div 
                className={cn(
                  "w-14 h-14 rounded-full p-[2.5px] relative",
                  pro.hasVideo ? "story-ring story-ring-glow cursor-pointer" : "bg-white shadow-md"
                )}
                onClick={pro.hasVideo ? handleStoryClick : undefined}
              >
                {/* Fixed aspect ratio inner container */}
                <div className="w-full h-full rounded-full overflow-hidden bg-white aspect-square">
                  {pro.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={pro.avatarUrl}
                      alt={pro.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{pro.name[0]}</span>
                    </div>
                  )}
                </div>
                {/* Play icon for video */}
                {pro.hasVideo && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Play className="h-3 w-3 text-secondary fill-secondary" />
                  </div>
                )}
              </div>
              {/* Verified badge */}
              {pro.isVerified && (
                <div className="absolute -bottom-1 left-0 bg-white rounded-full p-0.5 shadow-sm z-10">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-50" />
                </div>
              )}
            </div>

            {/* Name & Rating Row */}
            <div className="flex justify-between items-start pt-5 mb-2">
              <div className="flex-1 min-w-0 pl-4">
                <h3 className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                  {pro.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{pro.category}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm">{pro.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({pro.reviews})</span>
              </div>
            </div>

            {/* Info Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {/* City Chip */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                <MapPin className="h-3 w-3" />
                {pro.city}
              </span>
              
              {/* Years Experience Chip */}
              {pro.yearsExperience && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  <Clock className="h-3 w-3" />
                  {pro.yearsExperience} שנות ניסיון
                </span>
              )}
              
              {/* Community Chip */}
              {pro.community && pro.community !== 'general' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/5 text-primary text-xs rounded-full">
                  <Users className="h-3 w-3" />
                  {pro.community}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {pro.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Skeleton loader for ProCard
export function ProCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/2] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 relative">
        {/* Avatar Skeleton */}
        <div className="absolute -top-8 right-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
        </div>
        
        {/* Text Skeletons */}
        <div className="pt-5 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse" />
            </div>
            <div className="h-5 bg-gray-200 rounded-md w-16 animate-pulse" />
          </div>
          
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-md w-4/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Sponsored Card Variant
export function SponsoredProCard({ pro, index }: ProCardProps) {
  return <ProCard pro={{ ...pro, isSponsored: true }} index={index} />
}
