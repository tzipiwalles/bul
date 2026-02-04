'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, UserCircle, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-blue-900/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="hidden text-2xl font-bold text-primary sm:inline-block">בול</span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden flex-1 items-center justify-center px-6 md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="חפש בעל מקצוע..."
              className="h-10 w-full rounded-full border-gray-200 bg-gray-50 pr-10 focus:bg-white focus:ring-2 focus:ring-secondary/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <Link href="/search" className="transition-colors hover:text-primary">
              בעלי מקצוע
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              אודות
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="hidden text-gray-600 hover:text-primary sm:flex">
                התחברות
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-md shadow-blue-900/10 rounded-full px-6">
                הצטרפות
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
