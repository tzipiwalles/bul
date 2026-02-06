import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  Eye, 
  MessageSquare, 
  Settings, 
  LogOut,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react'
import type { Profile } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null }

  if (!profile) {
    // User is authenticated but doesn't have a profile yet
    redirect('/register')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">קנ"ש</Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="icon" type="submit">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            שלום, {profile.business_name}
          </h1>
          <p className="text-muted-foreground">
            ברוכים הבאים לאזור הניהול שלך
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.rating?.toFixed(1) || '5.0'}</p>
                  <p className="text-xs text-muted-foreground">דירוג</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.review_count || 0}</p>
                  <p className="text-xs text-muted-foreground">ביקורות</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">פניות</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">צפיות</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">פעולות מהירות</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href={`/profile/${user.id}`}>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="ml-2 h-4 w-4" />
                צפה בפרופיל
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="ml-2 h-4 w-4" />
                ערוך פרטים
              </Button>
            </Link>
            {profile.service_type === 'appointment' && (
              <Link href="/dashboard/appointments">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="ml-2 h-4 w-4" />
                  ניהול תורים
                </Button>
              </Link>
            )}
            <Link href="/dashboard/leads">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="ml-2 h-4 w-4" />
                פניות לקוחות
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Profile Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">סטטוס הפרופיל</CardTitle>
            <CardDescription>
              בדוק שכל הפרטים מעודכנים כדי למשוך יותר לקוחות
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ProfileCheckItem 
                label="תמונה / לוגו" 
                completed={!!profile.avatar_url} 
              />
              <ProfileCheckItem 
                label="תיאור העסק" 
                completed={!!profile.description} 
              />
              <ProfileCheckItem 
                label="טלפון" 
                completed={!!profile.phone} 
              />
              <ProfileCheckItem 
                label="עיר" 
                completed={!!profile.city} 
              />
              <ProfileCheckItem 
                label="קטגוריות" 
                completed={profile.categories?.length > 0} 
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function ProfileCheckItem({ label, completed }: { label: string; completed: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm">{label}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${
        completed 
          ? 'bg-green-100 text-green-700' 
          : 'bg-amber-100 text-amber-700'
      }`}>
        {completed ? 'הושלם' : 'חסר'}
      </span>
    </div>
  )
}
