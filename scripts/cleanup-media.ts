/**
 * Script to identify and clean up problematic media files
 * Run with: npx ts-node --skip-project scripts/cleanup-media.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface ImageInfo {
  url: string
  width: number
  height: number
  aspectRatio: number
  isProblematic: boolean
  reason?: string
}

// Check image dimensions by fetching headers or loading image
async function getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  try {
    // For browser/Node.js, we'll use a simple fetch to check if image exists
    const response = await fetch(url, { method: 'HEAD' })
    if (!response.ok) {
      return null
    }
    
    // We can't get dimensions from HEAD, so we'll check file size as a proxy
    const contentLength = response.headers.get('content-length')
    const size = contentLength ? parseInt(contentLength) : 0
    
    // Very small files (< 10KB) are likely thumbnails or broken
    if (size < 10000) {
      return { width: 100, height: 100 } // Mark as small
    }
    
    // We can't easily get dimensions without loading the full image
    // Return null to indicate we need manual review
    return null
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return null
  }
}

// Analyze image URL patterns for problematic files
function analyzeUrl(url: string): { isProblematic: boolean; reason?: string } {
  const lowerUrl = url.toLowerCase()
  
  // Check for screenshot patterns
  if (lowerUrl.includes('screenshot') || lowerUrl.includes('screen_shot')) {
    return { isProblematic: true, reason: 'Screenshot in filename' }
  }
  
  // Check for collage patterns
  if (lowerUrl.includes('collage') || lowerUrl.includes('grid') || lowerUrl.includes('mosaic')) {
    return { isProblematic: true, reason: 'Collage/grid in filename' }
  }
  
  // Check for very long filenames (often auto-generated screenshots)
  const filename = url.split('/').pop() || ''
  if (filename.length > 100) {
    return { isProblematic: true, reason: 'Suspiciously long filename' }
  }
  
  return { isProblematic: false }
}

async function main() {
  console.log('🔍 Fetching all profiles with media...\n')
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, business_name, media_urls, avatar_url')
    .not('media_urls', 'is', null)
  
  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }
  
  console.log(`Found ${profiles?.length || 0} profiles with media\n`)
  
  const problematicProfiles: Array<{
    id: string
    name: string
    problematicUrls: string[]
    reasons: string[]
  }> = []
  
  for (const profile of profiles || []) {
    const mediaUrls = profile.media_urls as string[] || []
    const problematicUrls: string[] = []
    const reasons: string[] = []
    
    for (const url of mediaUrls) {
      const analysis = analyzeUrl(url)
      if (analysis.isProblematic) {
        problematicUrls.push(url)
        reasons.push(analysis.reason || 'Unknown')
      }
    }
    
    // Check for too many images (might indicate bulk upload of thumbnails)
    if (mediaUrls.length > 20) {
      console.log(`⚠️  ${profile.business_name}: Has ${mediaUrls.length} images (unusually high)`)
    }
    
    if (problematicUrls.length > 0) {
      problematicProfiles.push({
        id: profile.id,
        name: profile.business_name,
        problematicUrls,
        reasons
      })
    }
  }
  
  console.log('\n📋 Summary:')
  console.log(`Total profiles checked: ${profiles?.length || 0}`)
  console.log(`Profiles with problematic media: ${problematicProfiles.length}`)
  
  if (problematicProfiles.length > 0) {
    console.log('\n🚨 Problematic profiles:')
    for (const p of problematicProfiles) {
      console.log(`\n  ${p.name} (${p.id}):`)
      p.problematicUrls.forEach((url, i) => {
        console.log(`    - ${p.reasons[i]}: ${url.substring(0, 80)}...`)
      })
    }
  }
  
  // Generate cleanup SQL
  console.log('\n\n📝 To clean up, you can run these updates in Supabase SQL Editor:')
  console.log('-- Review each profile and update media_urls to remove problematic images')
  for (const p of problematicProfiles) {
    console.log(`-- Profile: ${p.name}`)
    console.log(`-- UPDATE profiles SET media_urls = array_remove(media_urls, 'URL_TO_REMOVE') WHERE id = '${p.id}';`)
  }
}

main().catch(console.error)
