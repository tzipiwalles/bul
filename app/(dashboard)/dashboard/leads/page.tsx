'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageSquare, Phone, Mail, Clock, CheckCircle, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const MOCK_LEADS = [
  {
    id: 1,
    clientName: 'אברהם ישראלי',
    clientPhone: '050-1111111',
    clientEmail: 'avraham@email.com',
    message: 'שלום, אני מחפש שיפוצניק לדירה של 4 חדרים. האם אפשר לקבל הצעת מחיר?',
    createdAt: '2026-02-04T10:30:00',
    status: 'new'
  },
  {
    id: 2,
    clientName: 'שרה כהן',
    clientPhone: '052-2222222',
    clientEmail: '',
    message: 'מעוניינת בתיקון דלת כניסה. מתי אפשר לתאם?',
    createdAt: '2026-02-03T15:45:00',
    status: 'contacted'
  },
  {
    id: 3,
    clientName: 'יצחק לוי',
    clientPhone: '054-3333333',
    clientEmail: 'yitzhak@email.com',
    message: 'צריך הצעת מחיר לצביעת דירה 3 חדרים + סלון. העיר בני ברק.',
    createdAt: '2026-02-02T09:00:00',
    status: 'new'
  },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: 'חדש', color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'נוצר קשר', color: 'bg-yellow-100 text-yellow-800' },
  converted: { label: 'הפך ללקוח', color: 'bg-green-100 text-green-800' },
  archived: { label: 'בארכיון', color: 'bg-gray-100 text-gray-800' },
}

export default function LeadsPage() {
  const [leads, setLeads] = useState(MOCK_LEADS)

  const handleMarkContacted = (id: number) => {
    setLeads(prev => 
      prev.map(lead => lead.id === id ? { ...lead, status: 'contacted' } : lead)
    )
  }

  const handleArchive = (id: number) => {
    setLeads(prev => 
      prev.map(lead => lead.id === id ? { ...lead, status: 'archived' } : lead)
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">פניות לקוחות</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {leads.filter(l => l.status === 'new').length}
              </p>
              <p className="text-xs text-gray-500">פניות חדשות</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-600">
                {leads.length}
              </p>
              <p className="text-xs text-gray-500">סה"כ פניות</p>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle>כל הפניות</CardTitle>
            <CardDescription>פניות שהתקבלו מלקוחות פוטנציאליים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>אין פניות כרגע</p>
              </div>
            ) : (
              leads.map(lead => (
                <div 
                  key={lead.id}
                  className={`p-4 rounded-xl border ${
                    lead.status === 'new' 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{lead.clientName}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <a href={`tel:${lead.clientPhone}`} className="text-sm text-primary flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.clientPhone}
                        </a>
                        {lead.clientEmail && (
                          <a href={`mailto:${lead.clientEmail}`} className="text-sm text-primary flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.clientEmail}
                          </a>
                        )}
                      </div>
                    </div>
                    <Badge className={statusLabels[lead.status].color}>
                      {statusLabels[lead.status].label}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg mb-3">
                    "{lead.message}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(lead.createdAt)}
                    </div>

                    {lead.status === 'new' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkContacted(lead.id)}
                        >
                          <CheckCircle className="ml-1 h-4 w-4" />
                          סמן כטופל
                        </Button>
                      </div>
                    )}

                    {lead.status === 'contacted' && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleArchive(lead.id)}
                      >
                        <Archive className="ml-1 h-4 w-4" />
                        העבר לארכיון
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
