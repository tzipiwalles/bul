'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calendar,
  Navigation,
  Share2,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle2,
  Play,
  X,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Profile, OpeningHours } from '@/types/database'

interface ProfileContentProps {
  profile: Profile
}

export default function ProfileContent({ profile }: ProfileContentProps) {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [isLeadOpen, setIsLeadOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isActionBarVisible, setIsActionBarVisible] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  
  const serviceType = profile.service_type
  const openingHours = profile.opening_hours as OpeningHours | null

  // Get all media items (images and videos combined)
  const mediaUrls = profile.media_urls || []
  const allMedia: { type: 'image' | 'video'; url: string }[] = []
  
  // Add all media_urls (determine type by extension)
  mediaUrls.forEach(url => {
    const isVideo = /\.(mp4|webm|mov|avi)$/i.test(url)
    allMedia.push({ type: isVideo ? 'video' : 'image', url })
  })
  
  // If no media and avatar exists, use avatar
  if (allMedia.length === 0 && profile.avatar_url) {
    allMedia.push({ type: 'image', url: profile.avatar_url })
  }
  
  const hasMultipleMedia = allMedia.length > 1
  const SLIDE_DURATION = 5000 // 5 seconds per slide (longer for profile)
  
  // Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    direction: 'rtl',
  })
  
  // Update current index when embla changes
  useEffect(() => {
    if (!emblaApi) return
    
    const onSelect = () => {
      setCurrentMediaIndex(emblaApi.selectedScrollSnap())
      setProgress(0)
    }
    
    // Initialize
    onSelect()
    
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    
    return () => { 
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])
  
  // Auto-slideshow (only for images, pause for videos)
  useEffect(() => {
    const currentMedia = allMedia[currentMediaIndex]
    const isCurrentVideo = currentMedia?.type === 'video'
    
    // Clear previous timers
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current)
      autoPlayRef.current = null
    }
    if (progressRef.current) {
      clearInterval(progressRef.current)
      progressRef.current = null
    }
    
    // Don't run if conditions aren't met
    if (!emblaApi || !hasMultipleMedia || isPaused || isCurrentVideo) {
      return
    }

    // Start progress animation
    const progressInterval = 50
    let currentProgress = 0
    
    progressRef.current = setInterval(() => {
      currentProgress += (progressInterval / SLIDE_DURATION) * 100
      if (currentProgress >= 100) {
        setProgress(100)
      } else {
        setProgress(currentProgress)
      }
    }, progressInterval)

    // Auto-advance to next slide
    autoPlayRef.current = setTimeout(() => {
      if (emblaApi) {
        emblaApi.scrollNext()
      }
    }, SLIDE_DURATION)

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
        autoPlayRef.current = null
      }
      if (progressRef.current) {
        clearInterval(progressRef.current)
        progressRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi, hasMultipleMedia, isPaused, currentMediaIndex])
  
  // Handle video autoplay when slide changes
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentMediaIndex) {
          video.play().catch(() => {})
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })
  }, [currentMediaIndex])
  
  const nextMedia = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])
  
  const prevMedia = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])
  
  const toggleMute = () => {
    setIsMuted(!isMuted)
    videoRefs.current.forEach(video => {
      if (video) video.muted = !isMuted
    })
  }

  // Handle scroll to show sticky action bar
  useEffect(() => {
    const handleScroll = () => {
      setIsActionBarVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Generate tags based on profile data
  const tags = [
    profile.is_verified ? 'מאומת' : null,
    profile.service_type === 'emergency' ? 'זמין 24/6' : null,
    profile.community && profile.community !== 'general' ? profile.community : null,
  ].filter(Boolean) as string[]

  const getCTAConfig = () => {
    switch (serviceType) {
      case 'appointment':
        return { icon: Calendar, label: 'קביעת תור', color: 'bg-blue-500 hover:bg-blue-600' }
      case 'project':
        return { icon: MessageSquare, label: 'בקש הצעת מחיר', color: 'bg-green-500 hover:bg-green-600' }
      case 'emergency':
        return { icon: Phone, label: 'התקשר עכשיו', color: 'bg-red-500 hover:bg-red-600' }
      case 'retail':
        return { icon: Navigation, label: 'נווט לעסק', color: 'bg-purple-500 hover:bg-purple-600' }
      default:
        return { icon: Phone, label: 'צור קשר', color: 'bg-secondary hover:bg-secondary/90' }
    }
  }

  const ctaConfig = getCTAConfig()
  const CTAIcon = ctaConfig.icon

  const handlePrimaryCTA = () => {
    switch (serviceType) {
      case 'appointment':
        setIsAppointmentOpen(true)
        break
      case 'project':
        setIsLeadOpen(true)
        break
      case 'emergency':
        window.location.href = `tel:${profile.phone}`
        break
      case 'retail':
        window.open(`https://waze.com/ul?q=${encodeURIComponent((profile.address || '') + ', ' + profile.city)}&navigate=yes`, '_blank')
        break
      default:
        window.location.href = `tel:${profile.phone}`
    }
  }

  return (
    <>
      <motion.div 
        className="flex flex-col gap-6 pb-24 md:pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back Button */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="text-gray-500 hover:text-primary transition-colors">
            <ArrowRight className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">חזרה לתוצאות</h1>
        </div>

        {/* Profile Header Card - Premium Design */}
        <motion.div 
          className="bg-white rounded-3xl overflow-hidden shadow-premium border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Cover Media Carousel - WhatsApp Status Style */}
          <div 
            className="relative aspect-[16/9] md:aspect-[21/9] bg-gray-900 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 1000)}
          >
            {/* Progress Bars */}
            {hasMultipleMedia && (
              <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                {allMedia.map((_, i) => (
                  <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                      style={{ 
                        width: i < currentMediaIndex 
                          ? '100%' 
                          : i === currentMediaIndex 
                            ? `${progress}%` 
                            : '0%' 
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Media Carousel */}
            {allMedia.length > 0 ? (
              <div className="absolute inset-0" ref={emblaRef}>
                <div className="flex h-full">
                  {allMedia.map((media, i) => (
                    <div key={i} className="flex-[0_0_100%] min-w-0 h-full relative">
                      {media.type === 'video' ? (
                        <video
                          ref={el => { videoRefs.current[i] = el }}
                          src={media.url}
                          muted={isMuted}
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={media.url}
                          alt={`${profile.business_name} - ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-blue-900">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10" />
            
            {/* Navigation Arrows */}
            {hasMultipleMedia && (
              <>
                <button 
                  onClick={prevMedia}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-dark flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button 
                  onClick={nextMedia}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-dark flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}
            
            {/* Mute/Unmute Button (for videos) */}
            {allMedia.some(m => m.type === 'video') && (
              <button
                onClick={toggleMute}
                className="absolute bottom-3 left-3 z-20 w-10 h-10 rounded-full glass-dark flex items-center justify-center"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-white" />
                ) : (
                  <Volume2 className="h-5 w-5 text-white" />
                )}
              </button>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-12 left-3 z-20 flex gap-2">
              <Button 
                size="icon" 
                variant="secondary" 
                className="glass-dark border-0 hover:bg-white/30"
                onClick={() => {
                  navigator.share?.({
                    title: profile.business_name,
                    url: window.location.href
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href)
                  })
                }}
              >
                <Share2 className="h-5 w-5 text-white" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className={cn(
                  "glass-dark border-0 hover:bg-white/30 transition-colors",
                  isFavorite && "bg-red-500/50"
                )}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={cn("h-5 w-5", isFavorite ? "fill-white text-white" : "text-white")} />
              </Button>
            </div>
            
            {/* Media Counter */}
            {hasMultipleMedia && (
              <div className="absolute bottom-3 right-3 z-20 glass-dark px-3 py-1 rounded-full text-white text-sm">
                {currentMediaIndex + 1} / {allMedia.length}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6 relative z-20">
            {/* Avatar */}
            <div className="relative flex justify-between items-end -mt-16 mb-4">
              <div className="relative z-30">
                <motion.div 
                  className={cn(
                    "w-28 h-28 rounded-2xl p-1 shadow-xl",
                    allMedia.some(m => m.type === 'video') ? "story-ring" : "bg-white"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white">
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.business_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-4xl font-bold text-primary">
                        {profile.business_name[0]}
                      </div>
                    )}
                  </div>
                </motion.div>
                {profile.is_verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                    <CheckCircle2 className="h-7 w-7 text-blue-600 fill-white" />
                  </div>
                )}
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl shadow-sm">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-xl text-gray-900">{profile.rating}</span>
                <span className="text-xs text-gray-500">ניקוד</span>
              </div>
            </div>

            {/* Name & Category */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{profile.business_name}</h1>
              <p className="text-gray-600 text-lg">{profile.categories?.join(' • ') || 'שירותים'}</p>
            </div>

            {/* Info Chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {/* Location Chip */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                <MapPin className="h-4 w-4" />
                {profile.address ? `${profile.address}, ` : ''}{profile.city}
              </span>
              
              {/* Opening Status */}
              {openingHours && (
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full",
                  isOpenNow(openingHours) 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                )}>
                  <Clock className="h-4 w-4" />
                  {isOpenNow(openingHours) ? 'פתוח עכשיו' : 'סגור כרגע'}
                </span>
              )}

              {/* Tags */}
              {tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1.5 bg-primary/5 text-primary border-0 text-sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Primary CTA - Desktop */}
            <div className="hidden md:block">
              <Button 
                size="lg" 
                className={cn("w-full text-lg py-7 rounded-xl font-bold shadow-lg", ctaConfig.color)}
                onClick={handlePrimaryCTA}
              >
                <CTAIcon className="ml-2 h-6 w-6" />
                {ctaConfig.label}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Media info - only if there are multiple items */}
        {allMedia.length > 1 && (
          <motion.div 
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Play className="h-4 w-4" />
              <span>{allMedia.length} תמונות וסרטונים בגלריה</span>
            </div>
            <span className="text-xs text-gray-400">החליקו או לחצו לניווט</span>
          </motion.div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.section 
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">אודות</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {profile.description || 'אין תיאור זמין.'}
              </p>
            </motion.section>

            {/* Contact Form */}
            <motion.section 
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">שלח הודעה פרטית</h2>
              </div>
              <p className="text-gray-500 text-sm mb-5">
                ההודעה תישלח ישירות לבעל העסק ולא תפורסם באתר
              </p>
              <PrivateMessageForm profileId={profile.id} businessName={profile.business_name} />
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <motion.div 
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                פרטי התקשרות
              </h3>
              <div className="space-y-4">
                <a 
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">טלפון</div>
                    <div className="font-medium text-gray-900" dir="ltr">{profile.phone}</div>
                  </div>
                </a>
                
                {profile.whatsapp && (
                  <a 
                    href={`https://wa.me/972${profile.whatsapp.replace(/^0/, '').replace(/-/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center">
                      {/* WhatsApp Icon SVG */}
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">WhatsApp</div>
                      <div className="font-medium text-[#25D366]">שלח הודעה</div>
                    </div>
                  </a>
                )}
                
                {/* Website Link */}
                {(profile as { website_url?: string }).website_url && (
                  <a 
                    href={(profile as { website_url?: string }).website_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">אתר אינטרנט</div>
                      <div className="font-medium text-blue-600">בקר באתר</div>
                    </div>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Opening Hours */}
            {openingHours && (
              <motion.div 
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  שעות פתיחה
                </h3>
                <div className="space-y-2">
                  {Object.entries(openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-gray-600">{getDayName(day)}</span>
                      <span className={cn(
                        "font-medium",
                        hours ? 'text-gray-900' : 'text-gray-400'
                      )}>
                        {hours ? `${hours.open} - ${hours.close}` : 'סגור'}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Sticky Action Bar */}
      <AnimatePresence>
        {isActionBarVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="action-bar-sticky md:hidden glass border-t border-gray-200"
          >
            <div className="flex gap-3 p-4">
              <Button
                className={cn("flex-1 h-14 text-base font-bold rounded-xl shadow-lg", ctaConfig.color)}
                onClick={handlePrimaryCTA}
              >
                <CTAIcon className="ml-2 h-5 w-5" />
                {ctaConfig.label}
              </Button>
              <a href={`tel:${profile.phone}`}>
                <Button size="icon" variant="outline" className="h-14 w-14 rounded-xl border-gray-200">
                  <Phone className="h-6 w-6" />
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Dialog */}
      <Dialog open={isAppointmentOpen} onOpenChange={setIsAppointmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>קביעת תור עם {profile.business_name}</DialogTitle>
            <DialogDescription>מלא את הפרטים ונחזור אליך בהקדם</DialogDescription>
          </DialogHeader>
          <AppointmentForm profileId={profile.id} businessName={profile.business_name} />
        </DialogContent>
      </Dialog>

      {/* Lead Dialog */}
      <Dialog open={isLeadOpen} onOpenChange={setIsLeadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>בקשה לפגישת ייעוץ</DialogTitle>
            <DialogDescription>ספר לנו על הפרויקט ונחזור אליך</DialogDescription>
          </DialogHeader>
          <LeadForm profileId={profile.id} businessName={profile.business_name} />
        </DialogContent>
      </Dialog>

      {/* Fullscreen Media Viewer */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full glass-dark flex items-center justify-center"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation */}
            {selectedImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(prev => prev !== null ? prev - 1 : null)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-dark flex items-center justify-center"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            )}
            {selectedImageIndex < allMedia.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(prev => prev !== null ? prev + 1 : null)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-dark flex items-center justify-center"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            )}

            <motion.div 
              className="max-w-4xl max-h-[80vh] w-full p-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {allMedia[selectedImageIndex]?.type === 'video' ? (
                <video 
                  autoPlay 
                  controls 
                  className="w-full max-h-[80vh] rounded-lg"
                >
                  <source src={allMedia[selectedImageIndex].url} type="video/mp4" />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={allMedia[selectedImageIndex]?.url}
                  alt=""
                  className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
                />
              )}
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-dark px-4 py-2 rounded-full text-white text-sm">
              {selectedImageIndex + 1} / {allMedia.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function AppointmentForm({ profileId, businessName }: { profileId: string; businessName: string }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>שם מלא</Label>
          <Input placeholder="הזן שם מלא" className="mt-1.5 h-12" />
        </div>
        <div className="col-span-2">
          <Label>טלפון</Label>
          <Input type="tel" placeholder="050-0000000" dir="ltr" className="mt-1.5 h-12" />
        </div>
        <div>
          <Label>תאריך</Label>
          <Input type="date" className="mt-1.5 h-12" />
        </div>
        <div>
          <Label>שעה</Label>
          <Input type="time" className="mt-1.5 h-12" />
        </div>
        <div className="col-span-2">
          <Label>הערות</Label>
          <Textarea placeholder="פרטים נוספים..." className="mt-1.5" />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full h-12 bg-primary hover:bg-primary/90 mt-2">
        שלח בקשה
      </Button>
    </form>
  )
}

function LeadForm({ profileId, businessName }: { profileId: string; businessName: string }) {
  return (
    <form className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label>שם מלא</Label>
          <Input placeholder="הזן שם מלא" className="mt-1.5 h-12" />
        </div>
        <div>
          <Label>טלפון</Label>
          <Input type="tel" placeholder="050-0000000" dir="ltr" className="mt-1.5 h-12" />
        </div>
        <div>
          <Label>מה מהות הפניה?</Label>
          <Textarea placeholder="ספר לנו במה נוכל לעזור..." rows={4} className="mt-1.5" />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full h-12 bg-primary hover:bg-primary/90 mt-2">
        שלח פניה
      </Button>
    </form>
  )
}

function PrivateMessageForm({ profileId, businessName }: { profileId: string; businessName: string }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>שם מלא</Label>
          <Input placeholder="השם שלך" className="mt-1.5 h-12" />
        </div>
        <div>
          <Label>טלפון</Label>
          <Input type="tel" placeholder="050-0000000" dir="ltr" className="mt-1.5 h-12" />
        </div>
      </div>
      <div>
        <Label>הודעה</Label>
        <Textarea placeholder="כתוב את ההודעה שלך..." rows={4} className="mt-1.5" />
      </div>
      <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90">
        <MessageSquare className="ml-2 h-5 w-5" />
        שלח הודעה
      </Button>
    </form>
  )
}

function getDayName(day: string): string {
  const days: Record<string, string> = {
    sunday: 'ראשון',
    monday: 'שני',
    tuesday: 'שלישי',
    wednesday: 'רביעי',
    thursday: 'חמישי',
    friday: 'שישי',
    saturday: 'שבת',
  }
  return days[day] || day
}

function isOpenNow(openingHours: OpeningHours): boolean {
  const now = new Date()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const currentDay = dayNames[now.getDay()] as keyof OpeningHours
  const todayHours = openingHours[currentDay]
  
  if (!todayHours) return false
  
  const currentTime = now.getHours() * 100 + now.getMinutes()
  const openTime = parseInt(todayHours.open.replace(':', ''))
  const closeTime = parseInt(todayHours.close.replace(':', ''))
  
  return currentTime >= openTime && currentTime <= closeTime
}
