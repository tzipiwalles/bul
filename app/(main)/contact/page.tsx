'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSending(false)
    setSent(true)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">צור קשר</h1>
          <p className="text-gray-500">נשמח לשמוע ממך</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">אימייל</h3>
                  <a href="mailto:info@bul.co.il" className="text-primary hover:underline">
                    info@bul.co.il
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">טלפון</h3>
                  <a href="tel:03-123-4567" className="text-primary hover:underline" dir="ltr">
                    03-123-4567
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <a href="https://wa.me/972501234567" className="text-primary hover:underline">
                    שלח הודעה
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">כתובת</h3>
                  <p className="text-gray-600">ירושלים, ישראל</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>שלח לנו הודעה</CardTitle>
              <CardDescription>מלא את הטופס ונחזור אליך בהקדם</CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">ההודעה נשלחה!</h3>
                  <p className="text-gray-600 mb-4">תודה על פנייתך. נחזור אליך בהקדם האפשרי.</p>
                  <Button variant="outline" onClick={() => setSent(false)}>
                    שלח הודעה נוספת
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">שם מלא</Label>
                      <Input id="name" placeholder="השם שלך" required className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="email">אימייל</Label>
                      <Input id="email" type="email" placeholder="your@email.com" dir="ltr" required className="mt-1.5" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">טלפון (אופציונלי)</Label>
                    <Input id="phone" type="tel" placeholder="050-0000000" dir="ltr" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="subject">נושא</Label>
                    <Input id="subject" placeholder="במה נוכל לעזור?" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="message">הודעה</Label>
                    <Textarea 
                      id="message" 
                      placeholder="פרט את פנייתך..."
                      rows={5}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={isSending}>
                    {isSending ? 'שולח...' : (
                      <>
                        <Send className="ml-2 h-5 w-5" />
                        שלח הודעה
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
