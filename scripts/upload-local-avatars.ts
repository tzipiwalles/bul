/**
 * Upload local profile images to Supabase Storage
 * 
 * Run with: npx tsx scripts/upload-local-avatars.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// =====================================================
// UPLOAD LOCAL IMAGE TO SUPABASE STORAGE
// =====================================================

async function uploadLocalImage(filePath: string, fileName: string): Promise<string | null> {
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(filePath)
    
    // Determine mime type
    const ext = path.extname(fileName).toLowerCase()
    const mimeType = ext === '.png' ? 'image/png' : 
                     ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                     ext === '.webp' ? 'image/webp' : 'image/png'
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true
      })
    
    if (error) {
      console.error(`   Storage upload error: ${error.message}`)
      return null
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    return urlData.publicUrl
  } catch (error) {
    console.error(`   Upload error:`, error)
    return null
  }
}

// =====================================================
// MAIN EXECUTION
// =====================================================

async function uploadAvatars() {
  const profilesDir = path.join(process.cwd(), 'profiles')
  
  // Check if directory exists
  if (!fs.existsSync(profilesDir)) {
    console.error('❌ profiles directory not found')
    return
  }
  
  // Get all image files
  const files = fs.readdirSync(profilesDir).filter(f => 
    /\.(png|jpg|jpeg|webp)$/i.test(f)
  )
  
  if (files.length === 0) {
    console.log('No image files found in profiles directory')
    return
  }
  
  console.log(`🖼️ Found ${files.length} images to upload\n`)
  
  // Get profiles to update with real images (prioritize those with placeholder/stock images)
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, business_name, avatar_url')
    .eq('gender', 'male')
    .eq('is_active', true)
    .limit(files.length)
  
  if (error) {
    console.error('Error fetching profiles:', error.message)
    return
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('No profiles found that need avatar updates')
    return
  }
  
  console.log(`Found ${profiles.length} profiles to update\n`)
  
  let success = 0
  let failed = 0
  
  for (let i = 0; i < Math.min(files.length, profiles.length); i++) {
    const file = files[i]
    const profile = profiles[i]
    const filePath = path.join(profilesDir, file)
    
    console.log(`📸 Uploading ${file} for: ${profile.business_name}`)
    
    // Upload with unique filename
    const uploadFileName = `profile-${profile.id}${path.extname(file)}`
    const publicUrl = await uploadLocalImage(filePath, uploadFileName)
    
    if (!publicUrl) {
      console.log('   ❌ Failed to upload')
      failed++
      continue
    }
    
    console.log(`   ✅ Uploaded: ${publicUrl}`)
    
    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', profile.id)
    
    if (updateError) {
      console.log(`   ❌ Failed to update profile: ${updateError.message}`)
      failed++
    } else {
      console.log(`   ✅ Profile updated!`)
      success++
    }
  }
  
  console.log(`\n🎉 Upload completed!`)
  console.log(`   ✅ Success: ${success}`)
  console.log(`   ❌ Failed: ${failed}`)
}

// Run
uploadAvatars().catch(console.error)
