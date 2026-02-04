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
  Shield,
  ArrowRight,
  Clock,
  CheckCircle2
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

// Mock data
const MOCK_PROFILE = {
  id: 1,
  name: 'אברהם הנגר',
  business_name: 'שיפוצי אברהם',
  category: 'שיפוצים ובניה',
  city: 'ירושלים',
  address: 'רח\' הרב קוק 15',
  phone: '050-1234567',
  whatsapp: '050-1234567',
  rating: 4.9,
  review_count: 127,
  service_type: 'project',
  description: 'מומחה לשיפוצים מקיפים של דירות ובתים. ניסיון של מעל 15 שנה בתחום. עבודה מקצועית, מהירה ואמינה. מבצע כל סוגי השיפוצים: חשמל, אינסטלציה, גבס, צביעה ועוד.',
  is_verified: true,
  is_active: true,
  gender: 'male',
  opening_hours: {
    sunday: { open: '08:00', close: '18:00' },
    monday: { open: '08:00', close: '18:00' },
    tuesday: { open: '08:00', close: '18:00' },
    wednesday: { open: '08:00', close: '18:00' },
    thursday: { open: '08:00', close: '14:00' },
    friday: null,
    saturday: null,
  },
  media_urls: [],
  avatar_url: null,
  tags: ['זמין עכשיו', 'שומר שבת', 'מחיר הוגן', 'וותק 15 שנה']
}

const MOCK_REVIEWS = [
  { id: 1, rating: 5, reviewer: 'יוסי כהן', date: '2025-12-15', text: 'עבודה מצוינת! אברהם הגיע בזמן, עבד נקי ומסודר ולקח מחיר הוגן. ממליץ בחום.' },
  { id: 2, rating: 5, reviewer: 'משה לוי', date: '2025-12-10', text: 'מקצוען אמיתי. פתר בעיה ששלושה בעלי מקצוע לפניו לא הצליחו.' },
  { id: 3, rating: 4, reviewer: 'דוד אברהם', date: '2025-12-05', text: 'שירות טוב מאוד, קצת יקר אבל שווה את המחיר.' },
]

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [isLeadOpen, setIsLeadOpen] = useState(false)
  
  // In Next.js 15, params is a Promise - but since we use mock data, we don't need to await it yet
  // When connecting to Supabase, use: const { id } = await params; (and make the component async)
  
  const profile = MOCK_PROFILE
  const serviceType = profile.service_type

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
                <DialogTitle>קביעת תור עם {profile.name}</DialogTitle>
                <DialogDescription>מלא את הפרטים ונחזור אליך בהקדם</DialogDescription>
              </DialogHeader>
              <AppointmentForm profile={profile} />
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
              <LeadForm profile={profile} />
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
              href={`https://waze.com/ul?q=${encodeURIComponent(profile.address + ', ' + profile.city)}&navigate=yes`}
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
        return null
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
                <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center text-3xl font-bold text-primary">
                  {profile.name[0]}
                </div>
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
              <span className="text-xs text-gray-500">({profile.review_count})</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
            <p className="text-gray-600 mb-3">{profile.business_name}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="font-normal bg-gray-100 text-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{profile.address}, {profile.city}</span>
              </div>
              {profile.opening_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>פתוח היום עד 18:00</span>
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
              {profile.description}
            </p>
          </section>

          {/* Reviews */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">ביקורות</h2>
              <Button variant="outline" size="sm">כתוב ביקורת</Button>
            </div>
            
            <div className="space-y-6">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{review.reviewer}</div>
                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('he-IL')}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" className="mb-2" />
                  <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info (Desktop) */}
        <div className="space-y-6">
          {profile.opening_hours && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">שעות פתיחה</h3>
              <div className="space-y-3 text-sm">
                {Object.entries(profile.opening_hours).map(([day, hours]) => (
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

function AppointmentForm({ profile }: { profile: typeof MOCK_PROFILE }) {
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

function LeadForm({ profile }: { profile: typeof MOCK_PROFILE }) {
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
