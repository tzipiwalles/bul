'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
  ChevronRight
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
  
  const serviceType = profile.service_type
  const openingHours = profile.opening_hours as OpeningHours | null

  // Get all media items (images and videos)
  const galleryImages = profile.gallery_urls || []
  const videos = profile.media_urls || []
  const allMedia = [...galleryImages]
  
  // If avatar exists and no gallery, use avatar
  if (allMedia.length === 0 && profile.avatar_url) {
    allMedia.push(profile.avatar_url)
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
        return { icon: Navigation, label: 'נווט לחנות', color: 'bg-purple-500 hover:bg-purple-600' }
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
          {/* Cover with Gradient */}
          <div className="h-40 md:h-48 bg-gradient-to-r from-primary via-primary to-blue-900 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
            
            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex gap-2">
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

            {/* Video Play Button */}
            {videos.length > 0 && (
              <motion.button
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full glass-dark flex items-center justify-center story-ring-glow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoOpen(true)}
              >
                <Play className="h-8 w-8 text-white fill-white ml-1" />
              </motion.button>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="relative flex justify-between items-end -mt-14 mb-4">
              <div className="relative">
                <motion.div 
                  className={cn(
                    "w-28 h-28 rounded-2xl p-1 shadow-xl",
                    videos.length > 0 ? "story-ring" : "bg-white"
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

        {/* Masonry Gallery */}
        {allMedia.length > 0 && (
          <motion.section 
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">גלריה</h2>
              <span className="text-sm text-gray-500">{allMedia.length} תמונות</span>
            </div>
            
            <div className="masonry-grid">
              {allMedia.map((url, index) => (
                <motion.div
                  key={index}
                  className="masonry-item cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <div className="relative rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${profile.business_name} - תמונה ${index + 1}`}
                      className="w-full object-cover"
                      loading="lazy"
                      style={{ 
                        aspectRatio: index % 3 === 0 ? '1/1' : index % 3 === 1 ? '3/4' : '4/3'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Video Section */}
        {videos.length > 0 && (
          <motion.section 
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Play className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold text-gray-900">הצצה לעבודה</h2>
            </div>
            <div className="space-y-4">
              {videos.map((url, index) => (
                <div key={index} className="rounded-2xl overflow-hidden bg-gray-900 shadow-lg">
                  <video 
                    controls 
                    className="w-full aspect-video"
                    poster={profile.avatar_url || undefined}
                    preload="metadata"
                  >
                    <source src={url} type="video/mp4" />
                    הדפדפן שלך אינו תומך בהצגת וידאו
                  </video>
                </div>
              ))}
            </div>
          </motion.section>
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
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">WhatsApp</div>
                      <div className="font-medium text-green-600">שלח הודעה</div>
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

      {/* Video Viewer */}
      <AnimatePresence>
        {isVideoOpen && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
            onClick={() => setIsVideoOpen(false)}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full glass-dark flex items-center justify-center"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <div 
              className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video autoPlay controls className="w-full h-full">
                <source src={videos[0]} type="video/mp4" />
              </video>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
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
              className="max-w-4xl max-h-[80vh] p-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allMedia[selectedImageIndex]}
                alt=""
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
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
