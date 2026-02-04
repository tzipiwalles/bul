"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, User, Phone, MapPin } from 'lucide-react'
import type { RegistrationData } from '../page'
import type { Gender } from '@/types/database'

interface StepProfileProps {
  data: RegistrationData
  updateData: (updates: Partial<RegistrationData>) => void
  onNext: () => void
  onPrev: () => void
}

const CITIES = [
  'ירושלים',
  'בני ברק',
  'מודיעין עילית',
  'ביתר עילית',
  'אלעד',
  'בית שמש',
  'אשדוד',
  'פתח תקווה',
  'רכסים',
  'צפת',
  'טבריה',
  'נתניה',
  'חיפה',
  'תל אביב',
  'אחר',
]

export function StepProfile({ data, updateData, onNext, onPrev }: StepProfileProps) {
  const handleGenderChange = (value: string) => {
    updateData({ gender: value as Gender })
  }

  const handleCityChange = (value: string) => {
    updateData({ city: value })
  }

  const isValid = data.businessName && data.phone && data.city && data.gender

  const handleNext = () => {
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="businessName">שם העסק / בעל המקצוע</Label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="businessName"
            type="text"
            placeholder="לדוגמה: אברהם הנגר"
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
            className="pr-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">טלפון</Label>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="050-1234567"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            className="pr-10"
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">עיר</Label>
        <Select value={data.city} onValueChange={handleCityChange}>
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="בחר עיר" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CRITICAL: Gender Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          מגדר <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          בחירה זו משפיעה על סוג המדיה שתוכל להעלות
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleGenderChange('male')}
            className={`p-4 rounded-xl border-2 transition-all ${
              data.gender === 'male'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <span className="text-3xl block mb-2">👨</span>
              <span className="font-medium">גבר</span>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => handleGenderChange('female')}
            className={`p-4 rounded-xl border-2 transition-all ${
              data.gender === 'female'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <span className="text-3xl block mb-2">👩</span>
              <span className="font-medium">אישה</span>
            </div>
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
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
          onClick={handleNext}
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
