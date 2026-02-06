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
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center">
                  {/* WhatsApp Icon SVG */}
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <a href="https://wa.me/972501234567" className="text-[#25D366] hover:underline">
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
