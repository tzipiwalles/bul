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
    
    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const profileId = formData.get('profileId') as string
    
    if (!file || !profileId) {
      return NextResponse.json({ error: 'Missing file or profileId' }, { status: 400 })
    }
    
    const adminClient = createAdminClient()
    
    // Get current profile to check for existing avatar
    const { data: profile } = await adminClient
      .from('profiles')
      .select('avatar_url')
      .eq('id', profileId)
      .single()
    
    // Delete old avatar if exists
    if (profile?.avatar_url) {
      try {
        const urlParts = profile.avatar_url.split('/avatars/')
        if (urlParts[1]) {
          const oldFilePath = decodeURIComponent(urlParts[1])
          await adminClient.storage.from('avatars').remove([oldFilePath])
          console.log('Old avatar deleted:', oldFilePath)
        }
      } catch (deleteError) {
        console.warn('Could not delete old avatar:', deleteError)
      }
    }
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Generate filename
    const fileName = `${profileId}/avatar-${Date.now()}.webp`
    
    // Upload to storage
    const { error: uploadError } = await adminClient.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: 'image/webp',
        upsert: true,
      })
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }
    
    // Get public URL
    const { data: urlData } = adminClient.storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    // Update profile with new avatar URL
    const { error: updateError } = await adminClient
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', profileId)
    
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      avatarUrl: urlData.publicUrl 
    })
  } catch (error) {
    console.error('Admin avatar upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
