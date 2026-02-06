"use client"

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Calendar, Briefcase, AlertTriangle, Store } from 'lucide-react'
import type { RegistrationData } from '../page'
import type { ServiceType } from '@/types/database'
import { CATEGORIES } from '@/lib/constants'

interface StepBusinessProps {
  data: RegistrationData
  updateData: (updates: Partial<RegistrationData>) => void
  onNext: () => void
  onPrev: () => void
}

const SERVICE_TYPES: { value: ServiceType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'appointment',
    label: 'תורים',
    description: 'פייטנית, מטפל, רופא - לקוחות קובעים תורים',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    value: 'project',
    label: 'פרויקטים',
    description: 'שיפוצניק, עורך דין - פגישות ייעוץ',
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    value: 'emergency',
    label: 'חירום',
    description: 'שרברב, מנעולן - שירות מיידי',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    value: 'retail',
    label: 'קניות ומסחר',
    description: 'חנויות, מסעדות, מאפיות - מיקום פיזי',
    icon: <Store className="h-5 w-5" />,
  },
]

export function StepBusiness({ data, updateData, onNext, onPrev }: StepBusinessProps) {
  const handleServiceTypeChange = (value: ServiceType) => {
    updateData({ serviceType: value })
  }

  const toggleCategory = (categoryId: string) => {
    const current = data.categories
    if (current.includes(categoryId)) {
      updateData({ categories: current.filter(c => c !== categoryId) })
    } else if (current.length < 3) {
      updateData({ categories: [...current, categoryId] })
    }
  }

  const isValid = data.serviceType && data.categories.length > 0

  return (
    <div className="space-y-6">
      {/* Service Type */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">סוג השירות</Label>
        <p className="text-sm text-muted-foreground">
          בחירה זו קובעת את כפתור הפעולה בפרופיל שלך
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleServiceTypeChange(type.value)}
              className={`p-4 rounded-xl border-2 text-right transition-all ${
                data.serviceType === type.value
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  data.serviceType === type.value ? 'bg-primary/10 text-primary' : 'bg-gray-100'
                }`}>
                  {type.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">{type.label}</span>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {type.description}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">קטגוריות (עד 3)</Label>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const isSelected = data.categories.includes(category.id)
            const isDisabled = !isSelected && data.categories.length >= 3
            
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                disabled={isDisabled}
                className={`px-3 py-2 rounded-full text-sm transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary text-white'
                    : isDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-foreground'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">תיאור העסק (אופציונלי)</Label>
        <Textarea
          id="description"
          placeholder="ספר על העסק שלך בכמה משפטים..."
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          className="flex-1"
          size="lg"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          חזור
        </Button>
        
        <Button
          onClick={onNext}
          className="flex-1"
          size="lg"
          disabled={!isValid}
        >
          המשך
        </Button>
      </div>
    </div>
  )
}
