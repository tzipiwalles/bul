/**
 * Generate profile images using Google Gemini API
 * 
 * IMPORTANT: Requires GEMINI_API_KEY in .env.local
 * Get it from: https://makersuite.google.com/app/apikey
 * 
 * Run with: npx tsx scripts/generate-images-gemini.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is required in .env.local')
  console.log('   Get it from: https://makersuite.google.com/app/apikey')
  process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// =====================================================
// GEMINI IMAGE GENERATION
// =====================================================

interface GeminiImageResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          mimeType: string
          data: string // base64 encoded image
        }
      }>
    }
  }>
  error?: {
    message: string
  }
}

async function generateImageWithGemini(prompt: string): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      return null
    }
    
    const data: GeminiImageResponse = await response.json()
    
    if (data.error) {
      console.error('Gemini error:', data.error.message)
      return null
    }
    
    // Extract base64 image from response
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      part => part.inlineData?.mimeType?.startsWith('image/')
    )
    
    if (imagePart?.inlineData) {
      return imagePart.inlineData.data
    }
    
    return null
  } catch (error) {
    console.error('Error calling Gemini:', error)
    return null
  }
}

// =====================================================
// UPLOAD TO SUPABASE STORAGE
// =====================================================

async function uploadToStorage(
  base64Image: string, 
  fileName: string, 
  mimeType: string = 'image/png'
): Promise<string | null> {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Image, 'base64')
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true
      })
    
    if (error) {
      console.error('Storage upload error:', error.message)
      return null
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    return urlData.publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

// =====================================================
// GENERATE PROMPT FOR HAREDI PROFESSIONAL
// =====================================================

function generatePrompt(profession: string, city: string): string {
  return `Professional headshot portrait photograph of a Haredi Orthodox Jewish man in his 40s.
  
He should be wearing:
- A black suit with white dress shirt
- A black hat (fedora style or velvet kippah)
- He has a neat, well-groomed beard

His expression should be:
- Warm and approachable
- Professional and trustworthy
- Slight confident smile

Setting:
- Clean, neutral studio background (light gray or white)
- Professional lighting, soft and flattering
- High quality business portrait style

This is for a professional directory listing for a ${profession} based in ${city}, Israel.
The image should convey trust, expertise, and professionalism.
Style: Professional business headshot, photorealistic, high quality.`
}

// =====================================================
// MAIN EXECUTION
// =====================================================

async function generateImagesForProfessionals(limit: number = 5) {
  console.log(`🖼️ Starting image generation for ${limit} professionals...\n`)
  
  // Get profiles without avatar images (or with placeholder avatars)
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, business_name, categories, city, avatar_url')
    .eq('gender', 'male')
    .eq('is_active', true)
    .or('avatar_url.is.null,avatar_url.like.%dicebear%')
    .limit(limit)
  
  if (error) {
    console.error('Error fetching profiles:', error.message)
    return
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('No profiles found that need images')
    return
  }
  
  console.log(`Found ${profiles.length} profiles to generate images for\n`)
  
  let success = 0
  let failed = 0
  
  for (const profile of profiles) {
    console.log(`\n📸 Generating image for: ${profile.business_name}`)
    
    const profession = profile.categories?.[0] || 'בעל מקצוע'
    const prompt = generatePrompt(profession, profile.city)
    
    console.log('   Calling Gemini API...')
    const base64Image = await generateImageWithGemini(prompt)
    
    if (!base64Image) {
      console.log('   ❌ Failed to generate image')
      failed++
      continue
    }
    
    console.log('   ✅ Image generated, uploading to storage...')
    
    const fileName = `profile-${profile.id}.png`
    const publicUrl = await uploadToStorage(base64Image, fileName)
    
    if (!publicUrl) {
      console.log('   ❌ Failed to upload image')
      failed++
      continue
    }
    
    console.log('   ✅ Uploaded, updating profile...')
    
    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', profile.id)
    
    if (updateError) {
      console.log(`   ❌ Failed to update profile: ${updateError.message}`)
      failed++
    } else {
      console.log(`   ✅ Profile updated with new image!`)
      success++
    }
    
    // Rate limit - wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  console.log(`\n🎉 Image generation completed!`)
  console.log(`   ✅ Success: ${success}`)
  console.log(`   ❌ Failed: ${failed}`)
}

// Run
const limit = parseInt(process.argv[2] || '5')
generateImagesForProfessionals(limit).catch(console.error)
