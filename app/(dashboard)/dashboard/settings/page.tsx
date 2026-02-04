'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Save, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CITIES, CATEGORIES } from '@/lib/constants'
export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('הפרטים נשמרו בהצלחה!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">הגדרות פרופיל</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle>תמונה / לוגו</CardTitle>
              <CardDescription>תמונה שתוצג בפרופיל שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center text-3xl font-bold text-primary">
                  א
                </div>
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="ml-2 h-4 w-4" />
                    העלה תמונה
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="ml-2 h-4 w-4" />
                    הסר תמונה
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>פרטים בסיסיים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">שם העסק</Label>
                <Input id="businessName" placeholder="שם העסק שלך" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">טלפון</Label>
                <Input id="phone" type="tel" placeholder="050-0000000" dir="ltr" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="city">עיר</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="בחר עיר" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address">כתובת (אופציונלי)</Label>
                <Input id="address" placeholder="רחוב ומספר" className="mt-1.5" />
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>פרטי העסק</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">קטגוריה ראשית</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">תיאור העסק</Label>
                <Textarea 
                  id="description" 
                  placeholder="ספר על העסק שלך, הניסיון והשירותים שאתה מציע..."
                  rows={5}
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
            {isSaving ? (
              'שומר...'
            ) : (
              <>
                <Save className="ml-2 h-5 w-5" />
                שמור שינויים
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  )
}
