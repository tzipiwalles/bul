import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { id: 'health', name: 'בריאות', icon: '🏥', description: 'רופאים, מטפלים, פיזיותרפיה ועוד', count: 120 },
  { id: 'beauty', name: 'יופי וטיפוח', icon: '💇', description: 'פייטנים, ספרים, קוסמטיקאים', count: 85 },
  { id: 'home', name: 'בית ושיפוצים', icon: '🏠', description: 'שיפוצניקים, חשמלאים, שרברבים', count: 200 },
  { id: 'food', name: 'מזון ומסעדות', icon: '🍕', description: 'מסעדות, קייטרינג, אספקה', count: 150 },
  { id: 'education', name: 'חינוך והוראה', icon: '📚', description: 'מורים פרטיים, גננות, שיעורי עזר', count: 90 },
  { id: 'legal', name: 'משפטי ופיננסי', icon: '⚖️', description: 'עורכי דין, רואי חשבון, יועצים', count: 45 },
  { id: 'events', name: 'אירועים ושמחות', icon: '🎉', description: 'אולמות, צלמים, תזמורות, הסעות', count: 110 },
  { id: 'tech', name: 'טכנולוגיה', icon: '💻', description: 'מחשבים, טלפונים, בניית אתרים', count: 60 },
  { id: 'transport', name: 'הסעות ותחבורה', icon: '🚗', description: 'נהגים, הסעות, משלוחים', count: 75 },
  { id: 'cleaning', name: 'ניקיון ותחזוקה', icon: '🧹', description: 'חברות ניקיון, מתקנים', count: 95 },
  { id: 'fashion', name: 'אופנה והלבשה', icon: '👔', description: 'חנויות בגדים, תופרים, חייטים', count: 55 },
  { id: 'pets', name: 'חיות מחמד', icon: '🐕', description: 'וטרינרים, מספרות, מזון', count: 30 },
  { id: 'furniture', name: 'ריהוט וציוד', icon: '🛋️', description: 'חנויות רהיטים, נגרים', count: 65 },
  { id: 'photography', name: 'צילום ווידאו', icon: '📸', description: 'צלמים, עורכי וידאו', count: 80 },
  { id: 'music', name: 'מוזיקה ונגינה', icon: '🎵', description: 'להקות, זמרים, DJ, מורים לנגינה', count: 70 },
]

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">כל הקטגוריות</h1>
          <p className="text-gray-500">בחר קטגוריה כדי למצוא בעלי מקצוע</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => (
          <Link 
            key={category.id}
            href={`/search?category=${category.id}`}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {category.description}
                </p>
                <span className="text-xs text-primary font-medium">
                  {category.count}+ בעלי מקצוע
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
