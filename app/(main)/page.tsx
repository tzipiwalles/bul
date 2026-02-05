'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Wrench, 
  AlertTriangle, 
  Store,
  ArrowLeft,
  Clock,
  Phone,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, CITIES } from '@/lib/constants'

// Service type definitions with visual styling
const SERVICE_TYPES = [
  {
    id: 'appointment',
    name: 'קביעת תור',
    description: 'רופאים, ספרים, מטפלים, יועצים',
    icon: Calendar,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    hoverBg: 'hover:bg-blue-100',
    examples: ['רופא שיניים', 'ספר', 'פסיכולוג', 'קוסמטיקאית'],
  },
  {
    id: 'project',
    name: 'פרויקטים והצעות מחיר',
    description: 'שיפוצניקים, קבלנים, צלמים, גרפיקאים',
    icon: Wrench,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    hoverBg: 'hover:bg-green-100',
    examples: ['שיפוצניק', 'צלם אירועים', 'מעצב גרפי', 'קבלן'],
  },
  {
    id: 'emergency',
    name: 'שירות חירום 24/6',
    description: 'אינסטלטורים, חשמלאים, מנעולנים',
    icon: AlertTriangle,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    hoverBg: 'hover:bg-red-100',
    examples: ['אינסטלטור', 'חשמלאי', 'מנעולן', 'מכונאי'],
  },
  {
    id: 'retail',
    name: 'חנויות ומסחר',
    description: 'מזון, בגדים, יודאיקה, ספרים',
    icon: Store,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    hoverBg: 'hover:bg-purple-100',
    examples: ['חנות בגדים', 'מאפייה', 'חנות ספרים', 'יודאיקה'],
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCity && selectedCity !== '__all__') params.set('city', selectedCity)
    router.push(`/search?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden rounded-3xl bg-primary text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80"></div>
        
        <div className="relative px-6 py-12 md:px-12 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold leading-tight md:text-5xl mb-4">
              מצא את <span className="text-secondary">בעל המקצוע</span>
              <br />
              המושלם עבורך
            </h1>
            <p className="mb-6 text-base text-blue-100 md:text-lg">
              הפלטפורמה המובילה לחיפוש שירותים בקהילה החרדית.
            </p>

            {/* Main Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="מה אתה מחפש? (שרברב, עורך דין...)" 
                  className="border-0 bg-transparent h-12 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 px-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="w-full md:w-48 border-t md:border-t-0 md:border-r border-gray-100">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="border-0 bg-transparent h-12 focus:ring-0 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <SelectValue placeholder="כל הארץ" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">כל הארץ</SelectItem>
                    {CITIES.slice(0, 20).map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                size="lg" 
                className="h-12 px-8 rounded-xl bg-secondary hover:bg-secondary/90 text-primary-foreground font-bold shadow-lg"
                onClick={handleSearch}
              >
                חפש
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Types - Main Navigation */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">מה אתה צריך?</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_TYPES.map((service) => {
            const Icon = service.icon
            return (
              <Link 
                key={service.id} 
                href={`/search?serviceType=${service.id}`}
                className={`group relative overflow-hidden rounded-2xl border-2 ${service.borderColor} ${service.bgColor} p-6 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Icon Badge */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${service.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7" />
                </div>
                
                {/* Content */}
                <h3 className={`font-bold text-lg mb-2 ${service.textColor}`}>
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {service.description}
                </p>
                
                {/* Examples */}
                <div className="flex flex-wrap gap-1.5">
                  {service.examples.slice(0, 3).map((example) => (
                    <span 
                      key={example}
                      className="px-2 py-0.5 bg-white/70 text-gray-600 text-xs rounded-full"
                    >
                      {example}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className={`absolute top-6 left-6 ${service.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <ArrowLeft className="h-5 w-5" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-1">200+</div>
            <div className="text-sm text-gray-600">בעלי מקצוע פעילים</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">40+</div>
            <div className="text-sm text-gray-600">קטגוריות שונות</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-gray-600">ערים ויישובים</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">24/6</div>
            <div className="text-sm text-gray-600">שירותי חירום</div>
          </div>
        </div>
      </section>

      {/* Categories - Secondary */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">קטגוריות פופולריות</h2>
          <Link href="/search" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
            לכל הקטגוריות
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link 
              key={cat.id} 
              href={`/search?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all hover:-translate-y-0.5 flex items-center gap-3"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">איך זה עובד?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">1. חפש</h3>
            <p className="text-gray-600 text-sm">
              בחר סוג שירות, קטגוריה או חפש ישירות את מה שאתה צריך
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">2. השווה</h3>
            <p className="text-gray-600 text-sm">
              צפה בפרופילים, ביקורות ודירוגים כדי לבחור את המתאים
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">3. צור קשר</h3>
            <p className="text-gray-600 text-sm">
              פנה ישירות לבעל המקצוע בטלפון או דרך המערכת
            </p>
          </div>
        </div>
      </section>

      {/* CTA for Business Owners */}
      <section className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-6 md:p-8 text-center">
        <h2 className="text-2xl font-bold text-primary-foreground mb-3">
          בעל עסק? הצטרף אלינו!
        </h2>
        <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
          הגע ללקוחות חדשים בקהילה החרדית. הרשמה פשוטה ומהירה.
        </p>
        <Link href="/register-business">
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 font-bold shadow-lg">
            צור פרופיל עסקי בחינם
          </Button>
        </Link>
      </section>
    </div>
  )
}
