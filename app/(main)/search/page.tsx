'use client'

import React from 'react'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProfessionalCard, Professional } from '@/components/cards/professional-card'
import { SponsoredCard } from '@/components/ads/sponsored-card'
import { MOCK_ADS } from '@/lib/ads-data'
import { CITIES } from '@/lib/constants'

const MOCK_RESULTS: Professional[] = [
  {
    id: 1,
    name: 'אברהם הנגר',
    category: 'שיפוצים ובניה',
    city: 'ירושלים',
    rating: 4.9,
    reviews: 127,
    description: 'מומחה לשיפוצים ובניה עם ניסיון של 15 שנה. מבצע עבודות גבס, צבע, אינסטלציה וחשמל ברמה הגבוהה ביותר.',
    isVerified: true,
    tags: ['זמין עכשיו', 'שומר שבת', 'מחיר הוגן']
  },
  {
    id: 2,
    name: 'שרה פייטן',
    category: 'יופי וטיפוח',
    city: 'בני ברק',
    rating: 5.0,
    reviews: 89,
    description: 'פייטן מקצועית למראה מושלם לכל אירוע. איפור ערב, כלות וערב. שימוש במוצרים איכותיים ועמידים.',
    isVerified: true,
    tags: ['מאפרת מוסמכת', 'הגעה לבית הלקוח']
  },
  {
    id: 3,
    name: 'דוד השרברב',
    category: 'אינסטלציה וחירום',
    city: 'מודיעין עילית',
    rating: 4.8,
    reviews: 234,
    description: 'שירות אינסטלציה מהיר וזמין 24/7. פתיחת סתימות, תיקון פיצוצים, איתור נזילות במצלמה תרמית.',
    isVerified: true,
    tags: ['24/6', 'חירום', 'וותק 20 שנה']
  },
  {
    id: 4,
    name: 'פיצה בלאגן',
    category: 'מסעדות',
    city: 'ירושלים',
    rating: 4.7,
    reviews: 456,
    description: 'הפיצה הכי טעימה בעיר, כשר למהדרין בד"ץ. מבחר תוספות ענק, בצק דק ופריך.',
    isVerified: false,
    tags: ['כשר למהדרין', 'משלוחים']
  },
  {
    id: 5,
    name: 'משה חשמלאי',
    category: 'חשמל',
    city: 'אלעד',
    rating: 4.9,
    reviews: 56,
    description: 'חשמלאי מוסמך לכל סוגי העבודות. התקנת גופי תאורה, לוחות חשמל, בדיקות בטיחות.',
    isVerified: true,
    tags: ['מוסמך', 'אמין']
  },
  {
    id: 6,
    name: 'נועה עיצובים',
    category: 'עיצוב גרפי',
    city: 'ביתר עילית',
    rating: 4.6,
    reviews: 34,
    description: 'עיצוב גרפי ומיתוג לעסקים. עיצוב לוגו, כרטיסי ביקור, מודעות פרסום ודפי נחיתה.',
    isVerified: true,
    tags: ['עיצוב לוגו', 'מיתוג']
  }
]

export default function SearchPage() {
  const feedAds = MOCK_ADS.filter(ad => ad.placement === 'feed')

  // Function to inject ads into the results list
  const renderResultsWithAds = () => {
    const items: React.ReactNode[] = []
    let adIndex = 0

    MOCK_RESULTS.forEach((result, index) => {
      items.push(<ProfessionalCard key={`pro-${result.id}`} pro={result} />)

      // Inject ad every 5 items (or just for demo purposes, insert one after the 2nd item)
      if ((index + 1) % 2 === 0 && adIndex < feedAds.length) { // Demo: every 2 items
        items.push(
          <div key={`ad-${feedAds[adIndex].id}`} className="md:hidden">
            <SponsoredCard ad={feedAds[adIndex]} />
          </div>
        )
        adIndex++
      }
    })

    return items
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile Search Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-20 z-10 md:static md:top-0">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="חיפוש..."
              className="pr-10 h-10 bg-gray-50 border-0 focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <Button size="icon" variant="outline" className="border-gray-200">
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        
        {/* Quick Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <Button size="sm" variant="secondary" className="rounded-full px-4 flex-shrink-0 bg-primary/10 text-primary hover:bg-primary/20 border-0">
            כל התוצאות
          </Button>
          <Button size="sm" variant="outline" className="rounded-full px-4 flex-shrink-0 border-gray-200 text-gray-600">
            זמין עכשיו
          </Button>
          <Button size="sm" variant="outline" className="rounded-full px-4 flex-shrink-0 border-gray-200 text-gray-600">
            דירוג גבוה
          </Button>
          <Button size="sm" variant="outline" className="rounded-full px-4 flex-shrink-0 border-gray-200 text-gray-600">
            קרוב אלי
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Results */}
        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              תוצאות חיפוש
              <span className="text-sm font-normal text-gray-500 mr-2">({MOCK_RESULTS.length} תוצאות)</span>
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            {renderResultsWithAds()}
          </div>
        </main>
      </div>
    </div>
  )
}
