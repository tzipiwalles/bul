import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, Star, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BottomNav } from '@/components/layout/bottom-nav'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CITIES = [
  'כל הערים',
  'ירושלים',
  'בני ברק',
  'מודיעין עילית',
  'ביתר עילית',
  'אלעד',
  'בית שמש',
]

const CATEGORIES = [
  { id: 'all', name: 'כל הקטגוריות', icon: '📋' },
  { id: 'health', name: 'בריאות', icon: '🏥' },
  { id: 'beauty', name: 'יופי וטיפוח', icon: '💇' },
  { id: 'home', name: 'בית ושיפוצים', icon: '🏠' },
  { id: 'food', name: 'מזון ומסעדות', icon: '🍕' },
  { id: 'education', name: 'חינוך', icon: '📚' },
  { id: 'legal', name: 'משפטי', icon: '⚖️' },
  { id: 'events', name: 'אירועים', icon: '🎉' },
  { id: 'tech', name: 'טכנולוגיה', icon: '💻' },
  { id: 'transport', name: 'הסעות', icon: '🚗' },
]

const MOCK_RESULTS = [
  {
    id: 1,
    name: 'אברהם הנגר',
    category: 'שיפוצים ובניה',
    city: 'ירושלים',
    rating: 4.9,
    reviews: 127,
    serviceType: 'project',
    description: 'מומחה לשיפוצים ובניה עם ניסיון של 15 שנה',
    isVerified: true,
  },
  {
    id: 2,
    name: 'שרה פייטן',
    category: 'יופי וטיפוח',
    city: 'בני ברק',
    rating: 5.0,
    reviews: 89,
    serviceType: 'appointment',
    description: 'פייטן מקצועית למראה מושלם לכל אירוע',
    isVerified: true,
  },
  {
    id: 3,
    name: 'דוד השרברב',
    category: 'אינסטלציה וחירום',
    city: 'מודיעין עילית',
    rating: 4.8,
    reviews: 234,
    serviceType: 'emergency',
    description: 'שירות אינסטלציה מהיר וזמין 24/7',
    isVerified: true,
  },
  {
    id: 4,
    name: 'פיצה בלאגן',
    category: 'מסעדות',
    city: 'ירושלים',
    rating: 4.7,
    reviews: 456,
    serviceType: 'retail',
    description: 'הפיצה הכי טעימה בעיר, כשר למהדרין',
    isVerified: false,
  },
]

export default function SearchPage() {
  return (
    <>
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">ב</span>
              </div>
              <span className="text-xl font-bold text-gray-900">בול</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                אזור אישי
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="מה אתה מחפש?"
                className="pr-10 h-12"
              />
            </div>
            <Button size="lg" className="gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              <span className="hidden md:inline">פילטרים</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 space-y-6">
            {/* City Filter */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                עיר
              </h3>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">קטגוריות</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors text-right"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="flex-1 text-sm font-medium text-gray-700">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">דירוג מינימלי</h3>
              <div className="space-y-2">
                {[5, 4, 3].map((rating) => (
                  <button
                    key={rating}
                    className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-700">ומעלה</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                תוצאות חיפוש
              </h1>
              <p className="text-gray-600">
                נמצאו {MOCK_RESULTS.length} בעלי מקצוע
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_RESULTS.map((result) => (
                <Link
                  key={result.id}
                  href={`/profile/${result.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex-shrink-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-blue-600">
                            {result.name[0]}
                          </span>
                        </div>
                        {result.isVerified && (
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-3 border-white flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                          {result.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{result.category}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-yellow-900">
                              {result.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({result.reviews} ביקורות)
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {result.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{result.city}</span>
                      </div>
                      
                      {result.serviceType === 'emergency' ? (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 gap-2">
                          <Phone className="h-4 w-4" />
                          חירום
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="gap-2 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                          <MessageSquare className="h-4 w-4" />
                          צור קשר
                        </Button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
    <BottomNav />
    </>
  )
}
