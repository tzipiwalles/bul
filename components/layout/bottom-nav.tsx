"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'ראשי', icon: Home },
  { href: '/search', label: 'חיפוש', icon: Search },
  { href: '/add', label: 'פרסם', icon: Plus, highlight: true },
  { href: '/dashboard', label: 'אזור אישי', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                item.highlight 
                  ? "text-white" 
                  : isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
              )}
            >
              {item.highlight ? (
                <div className="flex items-center justify-center w-12 h-12 -mt-4 bg-primary rounded-full shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>
              ) : (
                <>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
