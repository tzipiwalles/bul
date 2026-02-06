import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Shield, Users, Home, Settings } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  // Log for debugging
  console.log('[AdminLayout] Admin check:', { admin, adminError, userId: user.id })

  if (adminError || !admin) {
    console.log('[AdminLayout] Not admin or error, redirecting')
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-yellow-400" />
              <span className="font-bold text-lg">לוח בקרה - אדמין</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                <Users className="h-4 w-4" />
                <span>פרופילים</span>
              </Link>
              <Link href="/" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                <Home className="h-4 w-4" />
                <span>לאתר</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
