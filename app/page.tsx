'use client'

import Link from 'next/link'
import { Search, MapPin, Star, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES } from '@/lib/constants'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <div className="container mx-auto px-4 flex-1 py-6">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-3xl bg-primary text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80"></div>
            
            <div className="relative px-6 py-16 md:px-12 md:py-24">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold leading-tight md:text-6xl mb-6">
                  מצא את <span className="text-secondary">בעל המקצוע</span>
                  <br />
                  המושלם עבורך
                </h1>
                <p className="mb-8 text-lg text-blue-100 md:text-xl">
                  הפלטפורמה המובילה לחיפוש שירותים בקהילה החרדית.
                  אלפי בעלי מקצוע אמינים, זמינים ומקצועיים.
                </p>

                {/* Main Search Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="מה אתה מחפש? (שרברב, עורך דין...)" 
                      className="border-0 bg-transparent h-12 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 px-12"
                    />
                  </div>
                  <div className="w-full md:w-48 border-t md:border-t-0 md:border-r border-gray-100">
                    <Select>
                      <SelectTrigger className="border-0 bg-transparent h-12 focus:ring-0 text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <SelectValue placeholder="כל הארץ" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jerusalem">ירושלים</SelectItem>
                        <SelectItem value="bnei-brak">בני ברק</SelectItem>
                        <SelectItem value="modiin-illit">מודיעין עילית</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Link href="/search">
                    <Button size="lg" className="h-12 px-8 rounded-xl bg-secondary hover:bg-secondary/90 text-primary-foreground font-bold shadow-lg w-full">
                      חפש
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">קטגוריות פופולריות</h2>
              <Link href="/categories" className="text-primary hover:underline text-sm font-medium">
                לכל הקטגוריות
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/search?category=${cat.id}`}
                  className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Professionals */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">מומלצים בקהילה</h2>
              <Link href="/search" className="text-primary hover:underline text-sm font-medium">
                הצג הכל
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                          {i === 1 ? 'א' : i === 2 ? 'ש' : 'ד'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate">
                          {i === 1 ? 'אברהם הנגר' : i === 2 ? 'שרה פייטן' : 'דוד השרברב'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {i === 1 ? 'שיפוצים ובניה' : i === 2 ? 'יופי וטיפוח' : 'אינסטלציה'}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="font-bold text-sm text-gray-900">4.9</span>
                          <span className="text-xs text-gray-400">(120 ביקורות)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">זמין עכשיו</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">שומר שבת</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">ירושלים</span>
                    </div>

                    <Link href="/search">
                      <Button className="w-full bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 shadow-none">
                        צור קשר
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
      <BottomNav />
    </div>
  )
}
