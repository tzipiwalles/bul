'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Star
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
import { StoriesBar, StoriesBarSkeleton } from '@/components/features/stories-bar'
import { createClient } from '@/lib/supabase/client'
import { AnimatePresence } from 'framer-motion'

// Service type definitions with visual styling
const SERVICE_TYPES = [
  {
    id: 'appointment',
    name: 'קביעת תור',
    description: 'רופאים, ספרים, מטפלים',
    icon: Calendar,
    gradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    examples: ['רופא שיניים', 'ספר', 'קוסמטיקאית'],
  },
  {
    id: 'project',
    name: 'פרויקטים',
    description: 'שיפוצניקים, צלמים, גרפיקאים',
    icon: Wrench,
    gradient: 'from-green-500 to-emerald-600',
    lightBg: 'bg-green-50',
    iconBg: 'bg-green-500',
    examples: ['שיפוצניק', 'צלם אירועים', 'מעצב גרפי'],
  },
  {
    id: 'emergency',
    name: 'שירות חירום',
    description: 'אינסטלטורים, חשמלאים',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-rose-600',
    lightBg: 'bg-red-50',
    iconBg: 'bg-red-500',
    examples: ['אינסטלטור', 'חשמלאי', 'מנעולן'],
  },
  {
    id: 'retail',
    name: 'חנויות',
    description: 'מזון, בגדים, יודאיקה',
    icon: Store,
    gradient: 'from-purple-500 to-violet-600',
    lightBg: 'bg-purple-50',
    iconBg: 'bg-purple-500',
    examples: ['חנות בגדים', 'מאפייה', 'יודאיקה'],
  },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface StoryProfile {
  id: string
  name: string
  avatarUrl: string | null
  hasVideo: boolean
  videoUrl?: string
  category: string
  isNew?: boolean
}

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [storyProfiles, setStoryProfiles] = useState<StoryProfile[]>([])
  const [stats, setStats] = useState({ professionals: 0, categories: 40, cities: 50 })
  const [isFocused, setIsFocused] = useState(false)
  const [isLoadingStories, setIsLoadingStories] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Fetch profiles with videos for stories
    async function fetchStoryProfiles() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, business_name, avatar_url, media_urls, categories, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Error fetching story profiles:', error)
        }

        if (data) {
          // Filter for profiles that actually have media content
          const stories: StoryProfile[] = data
            .filter(p => p.media_urls && Array.isArray(p.media_urls) && p.media_urls.length > 0)
            .map(p => ({
              id: p.id,
              name: p.business_name,
              avatarUrl: p.avatar_url,
              hasVideo: true,
              videoUrl: p.media_urls?.[0],
              category: p.categories?.[0] || 'עסק',
              isNew: new Date(p.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
            }))
          console.log('Story profiles found:', stories.length)
          setStoryProfiles(stories)
        }
      } catch (err) {
        console.error('Failed to fetch story profiles:', err)
      } finally {
        setIsLoadingStories(false)
      }
    }

    // Fetch stats
    async function fetchStats() {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
      
      if (count) {
        setStats(prev => ({ ...prev, professionals: count }))
      }
    }

    fetchStoryProfiles()
    fetchStats()
  }, [])

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
    <div className="flex flex-col gap-10 relative">
      {/* Search Focus Overlay */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setIsFocused(false)}
          />
        )}
      </AnimatePresence>
      {/* Hero Section - Premium Glassmorphism */}
      <section className="relative overflow-hidden rounded-3xl min-h-[400px] md:min-h-[480px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80')" 
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/90 to-primary/80" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative px-6 py-12 md:px-12 md:py-16 lg:py-20">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm text-white/90">הפלטפורמה המובילה לקהילה החרדית</span>
            </motion.div>

            <h1 className="text-display text-white mb-4">
              מצא את <span className="text-secondary">בעל המקצוע</span>
              <br />
              המושלם עבורך
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl">
              מאות בעלי מקצוע מאומתים, ביקורות אמיתיות, ושירות מותאם לקהילה.
            </p>

            {/* Glassmorphism Search Bar */}
            <motion.div 
              className={`glass p-2 rounded-2xl shadow-2xl transition-all duration-300 ${
                isFocused ? 'ring-2 ring-secondary shadow-glow-secondary relative z-50 scale-[1.02]' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="מה אתה מחפש? (רופא שיניים, שיפוצניק...)" 
                    className="border-0 bg-white/50 h-14 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 px-12 rounded-xl text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </div>
                <div className="w-full md:w-52">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="border-0 bg-white/50 h-14 focus:ring-0 text-gray-600 rounded-xl">
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
                  className="h-14 px-10 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold shadow-lg text-base"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5 ml-2" />
                  חפש
                </Button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="flex flex-wrap gap-6 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>{stats.professionals}+ בעלי מקצוע</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Star className="h-5 w-5 text-secondary" />
                <span>ביקורות מאומתות</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-5 w-5 text-secondary" />
                <span>זמינות 24/6</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stories Bar - Live Updates */}
      {(isLoadingStories || storyProfiles.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isLoadingStories ? (
            <StoriesBarSkeleton />
          ) : (
            <StoriesBar profiles={storyProfiles} />
          )}
        </motion.div>
      )}

      {/* Service Types - Visual Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline text-gray-900">מה אתה צריך היום?</h2>
          <Link href="/search" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
            לכל השירותים
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {SERVICE_TYPES.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Link 
                  href={`/search?serviceType=${service.id}`}
                  className="group block relative overflow-hidden rounded-2xl bg-white p-5 md:p-6 transition-all hover:shadow-premium hover:-translate-y-1 border border-gray-100"
                >
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${service.iconBg} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {service.description}
                  </p>
                  
                  {/* Example Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.examples.map((example) => (
                      <span 
                        key={example}
                        className={`px-2.5 py-1 ${service.lightBg} text-gray-700 text-xs rounded-full`}
                      >
                        {example}
                      </span>
                    ))}
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-5 left-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                    <ArrowLeft className="h-5 w-5" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Popular Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-secondary" />
            <h2 className="text-xl font-bold text-gray-900">קטגוריות פופולריות</h2>
          </div>
          <Link href="/search" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
            הכל
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {CATEGORIES.slice(0, 8).map((cat, index) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link 
                href={`/search?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-50 transition-all hover:-translate-y-0.5 flex items-center gap-3"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-dots opacity-50" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: `${stats.professionals}+`, label: 'בעלי מקצוע' },
            { value: '40+', label: 'קטגוריות' },
            { value: '50+', label: 'ערים' },
            { value: '24/6', label: 'שירות חירום' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <section className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12">
        <h2 className="text-headline text-gray-900 text-center mb-10">איך זה עובד?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: '1. חפש', desc: 'בחר קטגוריה או חפש את מה שאתה צריך' },
            { icon: CheckCircle2, title: '2. השווה', desc: 'צפה בפרופילים, סרטונים וביקורות' },
            { icon: Phone, title: '3. צור קשר', desc: 'פנה ישירות לבעל המקצוע' },
          ].map((step, i) => (
            <motion.div 
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <step.icon className="h-9 w-9 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA for Business Owners */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-r from-secondary via-secondary to-amber-500 rounded-3xl p-8 md:p-12 text-center"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-grid-white\/10" />
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            בעל עסק? הצטרף אלינו!
          </h2>
          <p className="text-white/90 mb-8 max-w-md mx-auto text-lg">
            הגע לאלפי לקוחות פוטנציאליים בקהילה. הרשמה חינמית.
          </p>
          <Link href="/register-business">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold shadow-xl px-10 h-14 text-lg">
              צור פרופיל עסקי בחינם
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
