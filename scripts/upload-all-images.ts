/**
 * Upload all local images to Supabase Storage and update profiles
 * 
 * Handles:
 * - Profile images (profiles/proflies) -> male profiles avatar_url
 * - Logos (profiles/logos) -> female profiles avatar_url
 * - Gallery images (profiles/galary) -> profiles media_urls
 * 
 * Run with: npx tsx scripts/upload-all-images.ts
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
// UPLOAD IMAGE TO SUPABASE STORAGE
// =====================================================

async function uploadImage(
  filePath: string, 
  bucket: string, 
  fileName: string
): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const ext = path.extname(fileName).toLowerCase()
    const mimeType = ext === '.png' ? 'image/png' : 
                     ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                     ext === '.webp' ? 'image/webp' : 'image/png'
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true
      })
    
    if (error) {
      console.error(`   Storage error: ${error.message}`)
      return null
    }
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return urlData.publicUrl
  } catch (error) {
    console.error(`   Upload error:`, error)
    return null
  }
}

// =====================================================
// GET IMAGE FILES FROM DIRECTORY
// =====================================================

function getImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  
  return fs.readdirSync(dir)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort((a, b) => {
      // Sort by number in filename
      const numA = parseInt(a.match(/\d+/)?.[0] || '0')
      const numB = parseInt(b.match(/\d+/)?.[0] || '0')
      return numA - numB
    })
}

// =====================================================
// UPLOAD PROFILE IMAGES (MALE)
// =====================================================

async function uploadProfileImages() {
  console.log('\n👨 Uploading male profile images...\n')
  
  const dir = path.join(process.cwd(), 'profiles', 'proflies')
  const files = getImageFiles(dir)
  
  if (files.length === 0) {
    console.log('   No profile images found')
    return
  }
  
  console.log(`   Found ${files.length} profile images`)
  
  // Get male profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, business_name')
    .eq('gender', 'male')
    .eq('is_active', true)
    .limit(files.length)
  
  if (error || !profiles) {
    console.error('   Error fetching profiles:', error?.message)
    return
  }
  
  console.log(`   Found ${profiles.length} male profiles to update\n`)
  
  let success = 0
  for (let i = 0; i < Math.min(files.length, profiles.length); i++) {
    const file = files[i]
    const profile = profiles[i]
    const filePath = path.join(dir, file)
    
    const uploadFileName = `profile-${profile.id}.png`
    const publicUrl = await uploadImage(filePath, 'avatars', uploadFileName)
    
    if (publicUrl) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)
      
      if (!updateError) {
        console.log(`   ✅ ${profile.business_name}`)
        success++
      }
    }
  }
  
  console.log(`\n   📊 Profile images: ${success}/${files.length} uploaded`)
}

// =====================================================
// UPLOAD LOGOS (FEMALE)
// =====================================================

async function uploadLogos() {
  console.log('\n👩 Uploading female business logos...\n')
  
  const dir = path.join(process.cwd(), 'profiles', 'logos')
  const files = getImageFiles(dir)
  
  if (files.length === 0) {
    console.log('   No logo images found')
    return
  }
  
  console.log(`   Found ${files.length} logo images`)
  
  // Get female profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, business_name')
    .eq('gender', 'female')
    .eq('is_active', true)
    .limit(files.length)
  
  if (error) {
    console.error('   Error fetching profiles:', error?.message)
    return
  }
  
  // If no female profiles exist, create some by updating existing profiles
  if (!profiles || profiles.length === 0) {
    console.log('   No female profiles found. Converting some profiles to female...')
    
    // Get some profiles to convert
    const { data: toConvert } = await supabase
      .from('profiles')
      .select('id, business_name')
      .eq('is_active', true)
      .limit(files.length)
      .range(100, 100 + files.length) // Get profiles after first 100
    
    if (toConvert && toConvert.length > 0) {
      // Convert to female
      for (const p of toConvert) {
        await supabase
          .from('profiles')
          .update({ gender: 'female' })
          .eq('id', p.id)
      }
      console.log(`   Converted ${toConvert.length} profiles to female`)
      
      // Re-fetch
      const { data: femaleProfiles } = await supabase
        .from('profiles')
        .select('id, business_name')
        .eq('gender', 'female')
        .eq('is_active', true)
        .limit(files.length)
      
      if (femaleProfiles) {
        await uploadLogosToProfiles(files, femaleProfiles, dir)
      }
    }
    return
  }
  
  await uploadLogosToProfiles(files, profiles, dir)
}

async function uploadLogosToProfiles(
  files: string[], 
  profiles: Array<{id: string, business_name: string}>,
  dir: string
) {
  console.log(`   Found ${profiles.length} female profiles to update\n`)
  
  let success = 0
  for (let i = 0; i < Math.min(files.length, profiles.length); i++) {
    const file = files[i]
    const profile = profiles[i]
    const filePath = path.join(dir, file)
    
    const uploadFileName = `logo-${profile.id}.png`
    const publicUrl = await uploadImage(filePath, 'avatars', uploadFileName)
    
    if (publicUrl) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)
      
      if (!updateError) {
        console.log(`   ✅ ${profile.business_name}`)
        success++
      }
    }
  }
  
  console.log(`\n   📊 Logos: ${success}/${files.length} uploaded`)
}

// =====================================================
// UPLOAD GALLERY IMAGES
// =====================================================

async function uploadGalleryImages() {
  console.log('\n🖼️ Uploading gallery images...\n')
  
  const dir = path.join(process.cwd(), 'profiles', 'galary')
  const files = getImageFiles(dir)
  
  if (files.length === 0) {
    console.log('   No gallery images found')
    return
  }
  
  console.log(`   Found ${files.length} gallery images`)
  
  // Get profiles without media
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, business_name, media_urls')
    .eq('is_active', true)
    .limit(Math.ceil(files.length / 2)) // 2 images per profile
  
  if (error || !profiles) {
    console.error('   Error fetching profiles:', error?.message)
    return
  }
  
  console.log(`   Will add gallery images to ${profiles.length} profiles\n`)
  
  let success = 0
  let fileIndex = 0
  
  for (const profile of profiles) {
    if (fileIndex >= files.length) break
    
    const newMediaUrls: string[] = []
    
    // Upload 2 images per profile
    for (let j = 0; j < 2 && fileIndex < files.length; j++) {
      const file = files[fileIndex]
      const filePath = path.join(dir, file)
      
      const uploadFileName = `gallery-${profile.id}-${j + 1}.png`
      const publicUrl = await uploadImage(filePath, 'media', uploadFileName)
      
      if (publicUrl) {
        newMediaUrls.push(publicUrl)
      }
      fileIndex++
    }
    
    if (newMediaUrls.length > 0) {
      // Merge with existing media_urls
      const existingMedia = profile.media_urls || []
      const allMedia = [...existingMedia, ...newMediaUrls]
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ media_urls: allMedia })
        .eq('id', profile.id)
      
      if (!updateError) {
        console.log(`   ✅ ${profile.business_name} (+${newMediaUrls.length} images)`)
        success++
      }
    }
  }
  
  console.log(`\n   📊 Gallery: ${success} profiles updated with gallery images`)
}

// =====================================================
// MAIN
// =====================================================

async function main() {
  console.log('🚀 Starting image upload to Supabase...')
  console.log('=' .repeat(50))
  
  await uploadProfileImages()
  await uploadLogos()
  await uploadGalleryImages()
  
  console.log('\n' + '='.repeat(50))
  console.log('🎉 All uploads completed!')
}

main().catch(console.error)
