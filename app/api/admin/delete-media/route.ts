import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Create admin client with service role key (bypasses RLS)
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  try {
    // Verify user is admin
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // Check if user is admin
    const { data: admin } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .single()
    
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    
    // Get request data
    const { profileId, urlToDelete } = await request.json()
    
    if (!profileId || !urlToDelete) {
      return NextResponse.json({ error: 'Missing profileId or urlToDelete' }, { status: 400 })
    }
    
    // Use admin client to update profile
    const adminClient = createAdminClient()
    
    // Get current profile media
    const { data: profile, error: fetchError } = await adminClient
      .from('profiles')
      .select('media_urls')
      .eq('id', profileId)
      .single()
    
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    
    // Remove the URL from array
    const currentUrls = profile?.media_urls || []
    const newUrls = currentUrls.filter((url: string) => url !== urlToDelete)
    
    // Update profile
    const { error: updateError } = await adminClient
      .from('profiles')
      .update({ media_urls: newUrls })
      .eq('id', profileId)
    
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    
    // Try to delete from storage
    try {
      const urlParts = urlToDelete.split('/media/')
      if (urlParts[1]) {
        const filePath = decodeURIComponent(urlParts[1])
        await adminClient.storage.from('media').remove([filePath])
      }
    } catch (storageError) {
      console.warn('Could not delete from storage:', storageError)
    }
    
    return NextResponse.json({ success: true, remainingUrls: newUrls })
  } catch (error) {
    console.error('Admin delete error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
