'use client'

import { useState, useMemo } from 'react'
import { Search, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CATEGORIES } from '@/lib/constants'

// Group categories for better organization
const CATEGORY_GROUPS = [
  {
    title: 'בית ומשפחה',
    categories: ['בריאות', 'יופי וטיפוח', 'בית ושיפוצים', 'מזון ומסעדות', 'ניקיון ותחזוקה', 'ריהוט וציוד', 'גינון ונוף'],
  },
  {
    title: 'ילדים וחינוך',
    categories: ['חינוך והוראה', 'ילדים ונוער', 'שיעורים פרטיים', 'מעונות וגנים'],
  },
  {
    title: 'אירועים ושמחות',
    categories: ['אירועים ושמחות', 'צילום ווידאו', 'מוזיקה ונגינה', 'קייטרינג', 'פרחים ועיצוב'],
  },
  {
    title: 'מקצועות חופשיים',
    categories: ['משפטי ופיננסי', 'ביטוח', 'נדל"ן'],
  },
  {
    title: 'טכנולוגיה ותקשורת',
    categories: ['טכנולוגיה', 'דפוס והדפסה', 'תקשורת ופרסום', 'עיצוב גרפי'],
  },
  {
    title: 'תחבורה ולוגיסטיקה',
    categories: ['הסעות ותחבורה', 'הובלות', 'משלוחים'],
  },
  {
    title: 'אופנה וטקסטיל',
    categories: ['אופנה והלבשה', 'פאות ושיער', 'תכשיטים'],
  },
  {
    title: 'יודאיקה וספרים',
    categories: ['יודאיקה', 'ספרים והוצאה לאור', 'סת"ם'],
  },
  {
    title: 'שירותים נוספים',
    categories: ['חיות מחמד', 'אבטחה', 'מיזוג אוויר', 'מכשירי חשמל', 'תיירות ונופש', 'ספורט וכושר', 'טיפול רגשי', 'רפואה משלימה'],
  },
]

interface CategoryPickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CategoryPicker({ value, onChange, placeholder = 'בחר קטגוריה' }: CategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedCategory = CATEGORIES.find(c => c.name === value)

  const filteredGroups = useMemo(() => {
    if (!search) return CATEGORY_GROUPS

    const searchLower = search.toLowerCase()
    return CATEGORY_GROUPS.map(group => ({
      ...group,
      categories: group.categories.filter(cat => {
        const category = CATEGORIES.find(c => c.name === cat)
        return cat.toLowerCase().includes(searchLower) ||
               category?.description?.toLowerCase().includes(searchLower)
      })
    })).filter(group => group.categories.length > 0)
  }, [search])

  const handleSelect = (categoryName: string) => {
    onChange(categoryName)
    setOpen(false)
    setSearch('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between mt-1.5 h-10 px-3 font-normal"
        >
          {selectedCategory ? (
            <span className="flex items-center gap-2">
              <span>{selectedCategory.icon}</span>
              <span>{selectedCategory.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <span className="text-muted-foreground">▼</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>בחר קטגוריה</DialogTitle>
        </DialogHeader>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש קטגוריה..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
            autoFocus
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="overflow-y-auto flex-1 mt-4 -mx-6 px-6">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              לא נמצאו קטגוריות מתאימות
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {filteredGroups.map(group => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {group.categories.map(catName => {
                      const category = CATEGORIES.find(c => c.name === catName)
                      if (!category) return null
                      
                      const isSelected = value === category.name
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleSelect(category.name)}
                          className={`
                            flex items-center gap-2 p-3 rounded-lg border text-right transition-all
                            ${isSelected 
                              ? 'border-primary bg-primary/10 ring-2 ring-primary' 
                              : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span className="text-xl">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{category.name}</div>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected indicator */}
        {value && (
          <div className="pt-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              נבחר: <strong>{value}</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
            >
              נקה בחירה
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
