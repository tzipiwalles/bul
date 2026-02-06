'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Search, Menu, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { UserMenu } from './user-menu'
import { LanguageSwitcher } from '@/components/language-switcher'
import { LocationSelector } from '@/components/location-selector'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const router = useRouter()
  const t = useTranslations('header')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/20 shadow-sm">
      <div className="container flex h-18 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://www.assetbridge.app/api/assets/Kanash/svg" 
            alt={t('logo')}
            className="h-12 w-12 rounded-xl shadow-md"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xl font-bold text-primary">{t('logo')}</span>
            <span className="text-xs text-gray-500">{t('subtitle')}</span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} className="hidden flex-1 items-center justify-center px-8 md:flex">
          <div className="relative w-full max-w-lg group">
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-full border-gray-200/50 bg-white/70 pr-11 pl-4 focus:bg-white focus:ring-2 focus:ring-secondary/30 focus:border-secondary/50 transition-all"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            <Link 
              href="/search" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-all"
            >
              {t('navProfessionals')}
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-all"
            >
              {t('navAbout')}
            </Link>
          </nav>

          <LocationSelector />
          <LanguageSwitcher />

          <div className="flex items-center gap-2">
            <UserMenu />
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-10 w-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
        isMobileMenuOpen ? "max-h-60 border-t border-gray-100" : "max-h-0"
      )}>
        <div className="p-4 space-y-3 bg-white/95 backdrop-blur">
          {/* Mobile Search */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder={t('searchPlaceholderShort')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl pr-10 bg-gray-50"
              />
            </div>
          </form>
          
          {/* Mobile Nav Links */}
          <nav className="flex flex-col gap-1">
            <Link 
              href="/search" 
              className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navProfessionals')}
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navAbout')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
