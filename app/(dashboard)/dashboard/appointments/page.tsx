'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Phone, CheckCircle, XCircle, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    clientName: 'יוסי כהן',
    clientPhone: '050-1234567',
    date: '2026-02-05',
    time: '10:00',
    status: 'pending',
    notes: 'תור ראשון'
  },
  {
    id: 2,
    clientName: 'משה לוי',
    clientPhone: '052-9876543',
    date: '2026-02-05',
    time: '14:00',
    status: 'confirmed',
    notes: ''
  },
  {
    id: 3,
    clientName: 'דוד אברהם',
    clientPhone: '054-5555555',
    date: '2026-02-06',
    time: '09:30',
    status: 'pending',
    notes: 'ביקש תור מוקדם'
  },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'ממתין לאישור', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'מאושר', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'בוטל', color: 'bg-red-100 text-red-800' },
  completed: { label: 'הושלם', color: 'bg-gray-100 text-gray-800' },
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)

  const handleConfirm = (id: number) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status: 'confirmed' } : apt)
    )
  }

  const handleCancel = (id: number) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">ניהול תורים</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500">ממתינים</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
              <p className="text-xs text-gray-500">מאושרים</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-600">
                {appointments.length}
              </p>
              <p className="text-xs text-gray-500">סה"כ</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>תורים קרובים</CardTitle>
            <CardDescription>נהל את התורים שנקבעו איתך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>אין תורים כרגע</p>
              </div>
            ) : (
              appointments.map(apt => (
                <div 
                  key={apt.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{apt.clientName}</h3>
                      <a href={`tel:${apt.clientPhone}`} className="text-sm text-primary flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {apt.clientPhone}
                      </a>
                    </div>
                    <Badge className={statusLabels[apt.status].color}>
                      {statusLabels[apt.status].label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(apt.date).toLocaleDateString('he-IL')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {apt.time}
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-sm text-gray-500 mb-3">"{apt.notes}"</p>
                  )}

                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleConfirm(apt.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="ml-1 h-4 w-4" />
                        אשר
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCancel(apt.id)}
                        className="flex-1 text-destructive"
                      >
                        <XCircle className="ml-1 h-4 w-4" />
                        בטל
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
