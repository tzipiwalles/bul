'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calendar,
  Clock,
  Navigation,
  Share2,
  Heart,
  Shield,
  ArrowRight
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

// Mock data - will be replaced with real Supabase data
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
  service_type: 'project', // appointment | project | emergency | retail
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
}

const MOCK_REVIEWS = [
  { id: 1, rating: 5, reviewer: 'יוסי כהן', date: '2025-12-15' },
  { id: 2, rating: 5, reviewer: 'משה לוי', date: '2025-12-10' },
  { id: 3, rating: 4, reviewer: 'דוד אברהם', date: '2025-12-05' },
]

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [isLeadOpen, setIsLeadOpen] = useState(false)
  
  const profile = MOCK_PROFILE
  const serviceType = profile.service_type

  const getCTAButton = () => {
    switch (serviceType) {
      case 'appointment':
        return (
          <Dialog open={isAppointmentOpen} onOpenChange={setIsAppointmentOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto gap-2 text-lg py-6 px-8 shadow-lg">
                <Calendar className="h-5 w-5" />
                קביעת תור
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>קביעת תור עם {profile.name}</DialogTitle>
                <DialogDescription>
                  מלא את הפרטים ונחזור אליך בהקדם
                </DialogDescription>
              </DialogHeader>
              <AppointmentForm profile={profile} />
            </DialogContent>
          </Dialog>
        )
      
      case 'project':
        return (
          <Dialog open={isLeadOpen} onOpenChange={setIsLeadOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto gap-2 text-lg py-6 px-8 shadow-lg">
                <MessageSquare className="h-5 w-5" />
                תיאום פגישה
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>בקשה לפגישת ייעוץ</DialogTitle>
                <DialogDescription>
                  ספר לנו על הפרויקט ונחזור אליך
                </DialogDescription>
              </DialogHeader>
              <LeadForm profile={profile} />
            </DialogContent>
          </Dialog>
        )
      
      case 'emergency':
        return (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <a href={`tel:${profile.phone}`} className="flex-1">
              <Button size="lg" variant="destructive" className="w-full gap-2 text-lg py-6 shadow-lg">
                <Phone className="h-5 w-5" />
                התקשר עכשיו
              </Button>
            </a>
            {profile.whatsapp && (
              <a href={`https://wa.me/972${profile.whatsapp.replace(/^0/, '').replace(/-/g, '')}`} className="flex-1">
                <Button size="lg" className="w-full gap-2 text-lg py-6 bg-green-600 hover:bg-green-700 shadow-lg">
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
            )}
          </div>
        )
      
      case 'retail':
        return (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <a 
              href={`https://waze.com/ul?q=${encodeURIComponent(profile.address + ', ' + profile.city)}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button size="lg" className="w-full gap-2 text-lg py-6 shadow-lg">
                <Navigation className="h-5 w-5" />
                נווט ב-Waze
              </Button>
            </a>
            <a href={`tel:${profile.phone}`} className="flex-1">
              <Button size="lg" variant="outline" className="w-full gap-2 text-lg py-6">
                <Phone className="h-5 w-5" />
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/search" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowRight className="h-5 w-5" />
            <span>חזרה לחיפוש</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-blue-600">
                      {profile.name[0]}
                    </span>
                  </div>
                  {profile.is_verified && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {profile.name}
                    </h1>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-3">{profile.business_name}</p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-bold text-yellow-900">{profile.rating}</span>
                      </div>
                      <span className="text-gray-600">({profile.review_count} ביקורות)</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span>{profile.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-100">
                {getCTAButton()}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">אודות</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.description}
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ביקורות</h2>
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{review.reviewer}</span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">פרטי התקשרות</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <a href={`tel:${profile.phone}`} className="hover:text-blue-600">
                    {profile.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>{profile.address}, {profile.city}</span>
                </div>
              </div>

              {/* Opening Hours */}
              {serviceType === 'retail' && profile.opening_hours && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">שעות פתיחה</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(profile.opening_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600">{getDayName(day)}</span>
                        <span className="font-medium text-gray-900">
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
      </div>
    </div>
  )
}

function AppointmentForm({ profile }: { profile: typeof MOCK_PROFILE }) {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">שם מלא</Label>
        <Input id="name" placeholder="הזן שם" />
      </div>
      <div>
        <Label htmlFor="phone">טלפון</Label>
        <Input id="phone" type="tel" placeholder="050-1234567" dir="ltr" />
      </div>
      <div>
        <Label htmlFor="date">תאריך מועדף</Label>
        <Input id="date" type="date" />
      </div>
      <div>
        <Label htmlFor="time">שעה מועדפת</Label>
        <Input id="time" type="time" />
      </div>
      <div>
        <Label htmlFor="notes">הערות</Label>
        <Textarea id="notes" placeholder="פרטים נוספים..." rows={3} />
      </div>
      <Button type="submit" className="w-full" size="lg">
        שלח בקשה
      </Button>
    </form>
  )
}

function LeadForm({ profile }: { profile: typeof MOCK_PROFILE }) {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">שם מלא</Label>
        <Input id="name" placeholder="הזן שם" />
      </div>
      <div>
        <Label htmlFor="phone">טלפון</Label>
        <Input id="phone" type="tel" placeholder="050-1234567" dir="ltr" />
      </div>
      <div>
        <Label htmlFor="email">אימייל (אופציונלי)</Label>
        <Input id="email" type="email" placeholder="your@email.com" dir="ltr" />
      </div>
      <div>
        <Label htmlFor="message">פרטי הפרויקט</Label>
        <Textarea 
          id="message" 
          placeholder="ספר לנו על הפרויקט - מה צריך לעשות, לוחות זמנים וכו'..." 
          rows={5}
        />
      </div>
      <Button type="submit" className="w-full" size="lg">
        שלח בקשה
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
