'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/shared/star-rating'
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
import type { Profile, OpeningHours } from '@/types/database'

interface ProfileContentProps {
  profile: Profile
}

export default function ProfileContent({ profile }: ProfileContentProps) {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [isLeadOpen, setIsLeadOpen] = useState(false)
  
  const serviceType = profile.service_type
  const openingHours = profile.opening_hours as OpeningHours | null

  // Generate tags based on profile data
  const tags = [
    profile.is_verified ? 'מאומת' : null,
    profile.service_type === 'emergency' ? 'זמין 24/6' : null,
  ].filter(Boolean) as string[]

  const getCTAButton = () => {
    switch (serviceType) {
      case 'appointment':
        return (
          <Dialog open={isAppointmentOpen} onOpenChange={setIsAppointmentOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full text-lg py-6 shadow-md bg-secondary text-primary-foreground hover:bg-secondary/90 font-bold">
                <Calendar className="ml-2 h-5 w-5" />
                קביעת תור
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>קביעת תור עם {profile.business_name}</DialogTitle>
                <DialogDescription>מלא את הפרטים ונחזור אליך בהקדם</DialogDescription>
              </DialogHeader>
              <AppointmentForm profileId={profile.id} businessName={profile.business_name} />
            </DialogContent>
          </Dialog>
        )
      
      case 'project':
        return (
          <Dialog open={isLeadOpen} onOpenChange={setIsLeadOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full text-lg py-6 shadow-md bg-secondary text-primary-foreground hover:bg-secondary/90 font-bold">
                <MessageSquare className="ml-2 h-5 w-5" />
                תיאום פגישה
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>בקשה לפגישת ייעוץ</DialogTitle>
                <DialogDescription>ספר לנו על הפרויקט ונחזור אליך</DialogDescription>
              </DialogHeader>
              <LeadForm profileId={profile.id} businessName={profile.business_name} />
            </DialogContent>
          </Dialog>
        )
      
      case 'emergency':
        return (
          <div className="flex flex-col gap-3 w-full">
            <a href={`tel:${profile.phone}`} className="w-full">
              <Button size="lg" variant="destructive" className="w-full text-lg py-6 shadow-md font-bold">
                <Phone className="ml-2 h-5 w-5" />
                התקשר לחירום
              </Button>
            </a>
            {profile.whatsapp && (
              <a href={`https://wa.me/972${profile.whatsapp.replace(/^0/, '').replace(/-/g, '')}`} className="w-full">
                <Button size="lg" variant="outline" className="w-full text-lg py-6 border-green-600 text-green-600 hover:bg-green-50">
                  <MessageSquare className="ml-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
            )}
          </div>
        )
      
      case 'retail':
        return (
          <div className="flex flex-col gap-3 w-full">
            <a 
              href={`https://waze.com/ul?q=${encodeURIComponent((profile.address || '') + ', ' + profile.city)}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button size="lg" className="w-full text-lg py-6 shadow-md bg-blue-500 hover:bg-blue-600 text-white font-bold">
                <Navigation className="ml-2 h-5 w-5" />
                נווט לעסק
              </Button>
            </a>
            <a href={`tel:${profile.phone}`} className="w-full">
              <Button size="lg" variant="outline" className="w-full text-lg py-6 border-primary text-primary hover:bg-primary/5">
                <Phone className="ml-2 h-5 w-5" />
                התקשר
              </Button>
            </a>
          </div>
        )
      
      default:
        return (
          <a href={`tel:${profile.phone}`} className="w-full">
            <Button size="lg" className="w-full text-lg py-6 shadow-md bg-secondary text-primary-foreground hover:bg-secondary/90 font-bold">
              <Phone className="ml-2 h-5 w-5" />
              צור קשר
            </Button>
          </a>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/search" className="text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">פרופיל עסק</h1>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* Cover Area */}
        <div className="h-32 bg-gradient-to-r from-primary to-blue-900 relative">
          <div className="absolute top-4 left-4 flex gap-2">
            <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.business_name} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center text-3xl font-bold text-primary">
                    {profile.business_name[0]}
                  </div>
                )}
              </div>
              {profile.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 fill-white" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{profile.rating}</span>
              <span className="text-xs text-gray-500">ניקוד</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.business_name}</h1>
            <p className="text-gray-600 mb-3">{profile.categories?.join(', ') || 'שירותים'}</p>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="font-normal bg-gray-100 text-gray-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{profile.address ? `${profile.address}, ` : ''}{profile.city}</span>
              </div>
              {openingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {isOpenNow(openingHours) ? 'פתוח עכשיו' : 'סגור כרגע'}
                  </span>
                </div>
              )}
            </div>

            {/* Main CTA - Prominent */}
            {getCTAButton()}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">אודות</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {profile.description || 'אין תיאור זמין.'}
            </p>
          </section>

          {/* Work Video */}
          {profile.media_urls && profile.media_urls.length > 0 && (
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="h-5 w-5 text-secondary" />
                הצצה לעבודה
              </h2>
              <div className="space-y-4">
                {profile.media_urls.map((url, index) => (
                  <div key={index} className="rounded-xl overflow-hidden bg-gray-900 shadow-md">
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
            </section>
          )}

          {/* Contact / Message Section - Private messages only */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">שלח הודעה פרטית</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              ההודעה תישלח ישירות לבעל העסק ולא תפורסם באתר
            </p>
            <PrivateMessageForm profileId={profile.id} businessName={profile.business_name} />
          </section>
        </div>

        {/* Sidebar Info (Desktop) */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">פרטי התקשרות</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${profile.phone}`} className="text-primary hover:underline" dir="ltr">
                  {profile.phone}
                </a>
              </div>
              {profile.whatsapp && (
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <a 
                    href={`https://wa.me/972${profile.whatsapp.replace(/^0/, '').replace(/-/g, '')}`}
                    className="text-green-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>

          {openingHours && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">שעות פתיחה</h3>
              <div className="space-y-3 text-sm">
                {Object.entries(openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{getDayName(day)}</span>
                    <span className={`font-medium ${hours ? 'text-gray-900' : 'text-gray-400'}`}>
                      {hours ? `${hours.open} - ${hours.close}` : 'סגור'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AppointmentForm({ profileId, businessName }: { profileId: string; businessName: string }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>שם מלא</Label>
          <Input placeholder="הזן שם מלא" className="mt-1.5" />
        </div>
        <div className="col-span-2">
          <Label>טלפון</Label>
          <Input type="tel" placeholder="050-0000000" dir="ltr" className="mt-1.5" />
        </div>
        <div>
          <Label>תאריך</Label>
          <Input type="date" className="mt-1.5" />
        </div>
        <div>
          <Label>שעה</Label>
          <Input type="time" className="mt-1.5" />
        </div>
        <div className="col-span-2">
          <Label>הערות</Label>
          <Textarea placeholder="פרטים נוספים..." className="mt-1.5" />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 mt-2">
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
          <Input placeholder="הזן שם מלא" className="mt-1.5" />
        </div>
        <div>
          <Label>טלפון</Label>
          <Input type="tel" placeholder="050-0000000" dir="ltr" className="mt-1.5" />
        </div>
        <div>
          <Label>מה מהות הפניה?</Label>
          <Textarea placeholder="ספר לנו במה נוכל לעזור..." rows={4} className="mt-1.5" />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 mt-2">
        שלח פניה
      </Button>
    </form>
  )
}

function PrivateMessageForm({ profileId, businessName }: { profileId: string; businessName: string }) {
  return (
    <form className="space-y-4">
      <div>
        <Label>שם מלא</Label>
        <Input placeholder="הזן שם מלא" className="mt-1.5" />
      </div>
      <div>
        <Label>טלפון</Label>
        <Input type="tel" placeholder="050-0000000" dir="ltr" className="mt-1.5" />
      </div>
      <div>
        <Label>הודעה</Label>
        <Textarea placeholder="כתוב את ההודעה שלך..." rows={3} className="mt-1.5" />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        <MessageSquare className="ml-2 h-4 w-4" />
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
