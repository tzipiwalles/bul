import Link from 'next/link'
import { Search, MapPin, Star, ArrowLeft, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">ב</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-l from-blue-600 to-blue-500 bg-clip-text text-transparent">
              בול
            </h1>
          </div>
          <Link href="/login">
            <Button variant="outline" className="gap-2">
              <span>התחברות</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">הפלטפורמה המובילה בקהילה</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            מצא את <span className="bg-gradient-to-l from-blue-600 to-blue-500 bg-clip-text text-transparent">בעל המקצוע</span>
            <br />
            המושלם עבורך
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            אלפי בעלי מקצוע מקצועיים ואמינים בקהילה החרדית<br />
            כל השירותים שאתה צריך, במקום אחד
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="מה אתה מחפש? (שרברב, פייטן, עורך דין...)"
                      className="w-full pr-12 pl-4 py-4 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-lg transition-all"
                    />
                  </div>
                  <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg">
                    חפש
                  </Button>
                </div>

                {/* Location Filter */}
                <div className="mt-3 flex items-center justify-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">ירושלים</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    שנה עיר
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>אמינות מוחלטת</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span>דירוגים אמיתיים</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>אלפי משתמשים מרוצים</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              קטגוריות פופולריות
            </h2>
            <p className="text-gray-600">מצא את מה שאתה מחפש במהירות</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/search?category=${category.id}`}
                className="group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 rounded-2xl transition-all duration-300"></div>
                  
                  <div className="relative">
                    <div className="text-4xl md:text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-center">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                בעלי מקצוע מומלצים
              </h2>
              <p className="text-gray-600">נבחרו במיוחד בשבילך</p>
            </div>
            <Link href="/search">
              <Button variant="outline" className="gap-2 hidden md:flex">
                הצג הכל
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'אברהם הנגר', category: 'שיפוצים ובניה', city: 'ירושלים', rating: 4.9, reviews: 127 },
              { name: 'שרה פייטן', category: 'יופי וטיפוח', city: 'בני ברק', rating: 5.0, reviews: 89 },
              { name: 'דוד השרברב', category: 'אינסטלציה וחירום', city: 'מודיעין עילית', rating: 4.8, reviews: 234 }
            ].map((pro, i) => (
              <Link
                key={i}
                href={`/profile/${i}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {pro.name[0]}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {pro.name}
                      </h3>
                      <p className="text-sm text-gray-600">{pro.category}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-yellow-900">{pro.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({pro.reviews} ביקורות)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{pro.city}</span>
                    </div>
                    <Button size="sm" variant="outline" className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                      צור קשר
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/search">
              <Button variant="outline" className="gap-2 w-full">
                הצג הכל
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">הצטרף לקהילה שלנו</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              הפוך את העסק שלך<br />
              לנגיש לאלפי לקוחות
            </h2>
            <p className="text-xl text-blue-50 mb-10 leading-relaxed">
              הצטרף למאות בעלי מקצוע מובילים בקהילה<br />
              והתחל לקבל פניות כבר היום - ללא עלות
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="px-10 py-6 text-lg bg-white text-blue-600 hover:bg-gray-50 shadow-2xl w-full sm:w-auto">
                  <Sparkles className="ml-2 h-5 w-5" />
                  הרשמה בחינם
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="px-10 py-6 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  גלה עוד
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-blue-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>הצטרפות מהירה</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>ללא עלות</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>תמיכה 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">ב</span>
                </div>
                <span className="text-2xl font-bold text-white">בול</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                הפלטפורמה המובילה לחיפוש בעלי מקצוע אמינים בקהילה החרדית.
                מחברים בין לקוחות לשירותים באמינות ומקצועיות.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">קישורים מהירים</h4>
              <ul className="space-y-2">
                <li><Link href="/search" className="hover:text-white transition-colors">חיפוש</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">הרשמה</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">התחברות</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">צור קשר</h4>
              <ul className="space-y-2">
                <li className="text-sm">info@bul.co.il</li>
                <li className="text-sm">תמיכה: 24/7</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2026 בול. כל הזכויות שמורות.</p>
          </div>
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
