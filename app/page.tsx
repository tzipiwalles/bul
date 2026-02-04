import Link from 'next/link'
import { Search, MapPin, Star, ArrowLeft } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">בול</h1>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            התחברות
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            מצא בעלי מקצוע אמינים
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            המדריך המוביל לשירותים בקהילה החרדית
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="חפש שירות או בעל מקצוע..."
                className="w-full pr-12 pl-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg"
              />
            </div>

            {/* Location Filter */}
            <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>כל הערים</span>
              <button className="text-primary hover:underline text-sm">
                שנה מיקום
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h3 className="text-xl font-semibold mb-6">קטגוריות פופולריות</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/search?category=${category.id}`}
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-3">{category.icon}</span>
                <span className="text-sm font-medium text-center text-foreground group-hover:text-primary">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">בעלי מקצוע מובילים</h3>
            <Link
              href="/search"
              className="text-primary text-sm flex items-center gap-1 hover:underline"
            >
              הצג הכל
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Placeholder cards - will be replaced with real data */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">
                      שם העסק
                    </h4>
                    <p className="text-sm text-muted-foreground">קטגוריה</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">5.0</span>
                      <span className="text-xs text-muted-foreground">
                        (24 ביקורות)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>ירושלים</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">יש לך עסק?</h3>
          <p className="text-muted-foreground mb-6">
            הצטרף למאות בעלי מקצוע שכבר משתמשים בבול
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            הרשמה בחינם
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-lg font-bold text-white mb-2">בול</p>
          <p className="text-sm">מדריך בעלי מקצוע לקהילה החרדית</p>
          <p className="text-xs mt-4">© 2026 בול. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  )
}

const categories = [
  { id: 'health', name: 'בריאות', icon: '🏥' },
  { id: 'beauty', name: 'יופי וטיפוח', icon: '💇' },
  { id: 'home', name: 'בית ושיפוצים', icon: '🏠' },
  { id: 'food', name: 'מזון ומסעדות', icon: '🍕' },
  { id: 'education', name: 'חינוך', icon: '📚' },
  { id: 'legal', name: 'משפטי', icon: '⚖️' },
  { id: 'events', name: 'אירועים', icon: '🎉' },
  { id: 'tech', name: 'טכנולוגיה', icon: '💻' },
  { id: 'transport', name: 'הסעות', icon: '🚗' },
  { id: 'other', name: 'אחר', icon: '📋' },
]
