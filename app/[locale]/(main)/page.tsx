'use client'

import { useState, useEffect, useMemo } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
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
  Star,
  X,
  Grid3X3
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CATEGORIES, CITIES } from '@/lib/constants'
import { StoriesBar, StoriesBarSkeleton } from '@/components/features/stories-bar'
import { createClient } from '@/lib/supabase/client'

// Category groups for the dialog - matching actual database values
// Title is a translation key; categories are actual Hebrew DB values (do NOT translate)
function getCategoryGroups(tCatGroups: (key: string) => string) {
  return [
    {
      title: tCatGroups('homeAndRenovation'),
      categories: ['אינסטלטורים', 'חשמלאים', 'שיפוצים', 'צביעה', 'מיזוג אוויר', 'ריהוט', 'ניקיון'],
    },
    {
      title: tCatGroups('foodAndEvents'),
      categories: ['מזון', 'אירועים', 'צילום', 'בימוי והפקה', 'דרמה ומשחק', 'כוריאוגרפיה ומחול', 'איור'],
    },
    {
      title: tCatGroups('educationAndKids'),
      categories: ['לימוד', 'ילדים ונוער'],
    },
    {
      title: tCatGroups('freeProfessions'),
      categories: ['עורכי דין', 'רואי חשבון', 'ייעוץ משכנתאות', 'החזרי מס ומימוש זכויות', 'הנהלת חשבונות', 'אדריכלות ועיצוב פנים'],
    },
    {
      title: tCatGroups('consultingAndTherapy'),
      categories: ['ייעוץ זוגי ושלום בית', 'הדרכת הורים', 'ייעוץ שינה', 'אבחון דידקטי', 'קלינאות תקשורת וריפוי בעיסוק', 'יועצות הנקה'],
    },
    {
      title: tCatGroups('freelanceAndOffice'),
      categories: ['כתיבה שיווקית וקופירייטינג', 'קלדנות ותמלול', 'תרגום', 'עריכת וידאו ומצגות', 'אפיון ועיצוב חווית משתמש', 'בניית אתרים ודפי נחיתה', 'מזכירות מרחוק וניהול משרד'],
    },
    {
      title: tCatGroups('techAndTransport'),
      categories: ['מחשבים', 'הובלות', 'מוסך'],
    },
    {
      title: tCatGroups('fashionAndHealth'),
      categories: ['ביגוד', 'טיפולי שיער', 'רפואה'],
    },
    {
      title: tCatGroups('booksAndReligious'),
      categories: ['ספרים', 'מעבדות שעטנז', 'כריכיות'],
    },
  ]
}

// Main service type categories (simplified for homepage - 2 main types)
function getMainServiceTypes(tService: (key: string) => string) {
  return [
    {
      id: 'services', // Combined: appointment + project + emergency
      name: tService('services'),
      description: tService('servicesDesc'),
      icon: Wrench,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      examples: tService('servicesExamples').split(', '),
    },
    {
      id: 'retail',
      name: tService('retail'),
      description: tService('retailDesc'),
      icon: Store,
      gradient: 'from-purple-500 to-violet-600',
      lightBg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      examples: tService('retailExamples').split(', '),
    },
  ]
}

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
  const t = useTranslations('home')
  const tService = useTranslations('serviceTypes')
  const tCatGroups = useTranslations('categoryGroups')
  const tStats = useTranslations('stats')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [storyProfiles, setStoryProfiles] = useState<StoryProfile[]>([])
  const [stats, setStats] = useState({ professionals: 0, categories: 40, cities: 50 })
  const [isFocused, setIsFocused] = useState(false)
  const [isLoadingStories, setIsLoadingStories] = useState(true)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')

  const CATEGORY_GROUPS = useMemo(() => getCategoryGroups(tCatGroups), [tCatGroups])
  const MAIN_SERVICE_TYPES = useMemo(() => getMainServiceTypes(tService), [tService])

  // Filter categories based on search
  const filteredCategoryGroups = useMemo(() => {
    if (!categorySearch) return CATEGORY_GROUPS
    
    const searchLower = categorySearch.toLowerCase()
    return CATEGORY_GROUPS.map(group => ({
      ...group,
      categories: group.categories.filter(cat => {
        const category = CATEGORIES.find(c => c.name === cat)
        return cat.toLowerCase().includes(searchLower) ||
               category?.description?.toLowerCase().includes(searchLower)
      })
    })).filter(group => group.categories.length > 0)
  }, [categorySearch, CATEGORY_GROUPS])

  const handleCategorySelect = (categoryName: string) => {
    setIsCategoriesOpen(false)
    setCategorySearch('')
    router.push(`/search?category=${encodeURIComponent(categoryName)}`)
  }

  // Fetch stories and stats immediately on mount
  useEffect(() => {
    const supabase = createClient()
    
    // Fetch profiles with videos for stories - run immediately
    const fetchStoryProfiles = async () => {
      console.log('Starting to fetch story profiles...')
      const startTime = Date.now()
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, business_name, avatar_url, media_urls, categories, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(30)

        console.log(`Fetch completed in ${Date.now() - startTime}ms`)

        if (error) {
          console.error('Error fetching story profiles:', error)
          setIsLoadingStories(false)
          return
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
    const fetchStats = async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
      
      if (count) {
        setStats(prev => ({ ...prev, professionals: count }))
      }
    }

    // Execute both fetches in parallel
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
              <span className="text-sm text-white/90">{t('badge')}</span>
            </motion.div>

            <h1 className="text-display text-white mb-4">
              {t('heroTitle')}
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl">
              {t('heroSubtitle')}
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
                    placeholder={t('searchPlaceholder')}
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
                        <SelectValue placeholder={t('allCountry')} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">{t('allCountry')}</SelectItem>
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
                  {t('searchButton')}
                </Button>
              </div>
              {/* AI Disclaimer */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 mt-3">
                <span>💡</span>
                <span>{t('aiDisclaimer')}</span>
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
                <span>{`${stats.professionals}+ ${t('statsProfessionals')}`}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Star className="h-5 w-5 text-secondary" />
                <span>{t('statsReviews')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-5 w-5 text-secondary" />
                <span>{t('statsAvailability')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stories Bar - Live Updates - Always visible */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoadingStories ? (
          <StoriesBarSkeleton />
        ) : storyProfiles.length > 0 ? (
          <StoriesBar profiles={storyProfiles} />
        ) : (
          // Empty state - still show the section header
          <div className="relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
                <h2 className="font-bold text-gray-400">{t('liveUpdates')}</h2>
              </div>
              <span className="text-sm text-gray-400">{t('noUpdates')}</span>
            </div>
          </div>
        )}
      </motion.section>

      {/* Service Types - Visual Cards (2 Main Categories) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline text-gray-900">{t('whatDoYouNeed')}</h2>
          <Link href="/search" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
            {t('allServices')}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {MAIN_SERVICE_TYPES.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Link 
                  href={`/search?serviceType=${service.id}`}
                  className="group block relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 transition-all hover:shadow-premium hover:-translate-y-1 border border-gray-100"
                >
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${service.iconBg} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-base text-gray-500 mb-4">
                    {service.description}
                  </p>
                  
                  {/* Example Tags */}
                  <div className="flex flex-wrap gap-2">
                    {service.examples.map((example) => (
                      <span 
                        key={example}
                        className={`px-3 py-1.5 ${service.lightBg} text-gray-700 text-sm rounded-full`}
                      >
                        {example}
                      </span>
                    ))}
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                    <ArrowLeft className="h-6 w-6" />
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
            <h2 className="text-xl font-bold text-gray-900">{t('popularCategories')}</h2>
          </div>
          <button 
            onClick={() => setIsCategoriesOpen(true)}
            className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
          >
            {t('allCategories')}
            <Grid3X3 className="h-4 w-4" />
          </button>
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
            { value: `${stats.professionals}+`, label: tStats('professionals') },
            { value: '40+', label: tStats('categories') },
            { value: '50+', label: tStats('cities') },
            { value: '24/6', label: tStats('emergencyService') },
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
        <h2 className="text-headline text-gray-900 text-center mb-10">{t('howItWorks')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: t('step1Title'), desc: t('step1Desc') },
            { icon: CheckCircle2, title: t('step2Title'), desc: t('step2Desc') },
            { icon: Phone, title: t('step3Title'), desc: t('step3Desc') },
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
            {t('ctaTitle')}
          </h2>
          <p className="text-white/90 mb-8 max-w-md mx-auto text-lg">
            {t('ctaSubtitle')}
          </p>
          <Link href="/register-business">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold shadow-xl px-10 h-14 text-lg">
              {t('ctaButton')}
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* All Categories Dialog */}
      <Dialog open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('allCategories')}</DialogTitle>
          </DialogHeader>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchCategories')}
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="pr-9"
              autoFocus
            />
            {categorySearch && (
              <button
                onClick={() => setCategorySearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Categories Grid */}
          <div className="overflow-y-auto flex-1 mt-4 -mx-6 px-6">
            {filteredCategoryGroups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('noCategoriesFound')}
              </div>
            ) : (
              <div className="space-y-6 pb-4">
                {filteredCategoryGroups.map(group => (
                  <div key={group.title}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                      {group.title}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {group.categories.map(catName => {
                        const category = CATEGORIES.find(c => c.name === catName)
                        if (!category) return null
                        
                        return (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category.name)}
                            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 text-right transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm"
                          >
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-medium text-sm truncate">{category.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
