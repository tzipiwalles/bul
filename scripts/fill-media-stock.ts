import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Stock photos from Unsplash - professional looking images by category
// Using Unsplash's direct URL format for reliability
const categoryImages: Record<string, string[]> = {
  'חשמלאי': [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop&crop=face',
  ],
  'אינסטלטור': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop&crop=face',
  ],
  'רואה חשבון': [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  ],
  'עורך דין': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1556157382-97edd2f9e3a8?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  ],
  'מטפל/ת': [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
  ],
  'קייטרינג': [
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=face',
  ],
  'צלם/ת': [
    'https://images.unsplash.com/photo-1552168324-d612d77725e3?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=face',
  ],
  'מורה/מדריך': [
    'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face',
  ],
  'נהג/שליח': [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
  ],
  'קבלן שיפוצים': [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
  ],
}

// Default images for categories not specifically mapped
const defaultImages = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
]

// Work videos from Pexels (free stock videos) - by category
// These are real work demonstration videos
const categoryVideos: Record<string, string[]> = {
  'חשמלאי': [
    'https://player.vimeo.com/external/371835479.sd.mp4?s=236da2f3c0a9bc55eba3d3c4e0d1e5e0d7e8f9a0&profile_id=164&oauth2_token_id=57447761',
  ],
  'אינסטלטור': [
    'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1eca2c7e0&profile_id=164&oauth2_token_id=57447761',
  ],
  'קייטרינג': [
    'https://player.vimeo.com/external/370331493.sd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=139&oauth2_token_id=57447761',
  ],
  'צלם/ת': [
    'https://player.vimeo.com/external/449759244.sd.mp4?s=d5f3da46ddc17aa69b38ba37d92a8a461d1a2e50&profile_id=139&oauth2_token_id=57447761',
  ],
  'קבלן שיפוצים': [
    'https://player.vimeo.com/external/403559547.sd.mp4?s=e80a4e5d65b19a5e0e0b3a51a22c0eb3d4a9e5d0&profile_id=164&oauth2_token_id=57447761',
  ],
}

// Pexels free video URLs (direct MP4 links that work)
const workVideos = [
  // Construction/renovation
  'https://videos.pexels.com/video-files/5974086/5974086-sd_640_360_30fps.mp4',
  // Cooking/catering
  'https://videos.pexels.com/video-files/4253729/4253729-sd_640_360_30fps.mp4',
  // Office/professional
  'https://videos.pexels.com/video-files/3252117/3252117-sd_640_360_24fps.mp4',
  // Workshop/crafts
  'https://videos.pexels.com/video-files/4708748/4708748-sd_640_360_25fps.mp4',
  // Cleaning
  'https://videos.pexels.com/video-files/4099354/4099354-sd_640_360_25fps.mp4',
]

async function fillMedia() {
  console.log('🖼️  Filling profiles with stock media...\n')

  // Get all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, business_name, categories, gender')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching profiles:', error.message)
    return
  }

  console.log(`Found ${profiles.length} profiles to update\n`)

  let imageCount = 0
  let videoCount = 0

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i]
    
    // Get primary category from categories array or infer from business name
    const primaryCategory = profile.categories?.[0] || ''
    
    // Try to match category from business name
    let matchedCategory = ''
    const businessLower = profile.business_name.toLowerCase()
    
    if (businessLower.includes('חשמל')) matchedCategory = 'חשמלאי'
    else if (businessLower.includes('אינסטל') || businessLower.includes('צנרת')) matchedCategory = 'אינסטלטור'
    else if (businessLower.includes('חשבון') || businessLower.includes('הנהל')) matchedCategory = 'רואה חשבון'
    else if (businessLower.includes('עורך דין') || businessLower.includes('משפט')) matchedCategory = 'עורך דין'
    else if (businessLower.includes('טיפול') || businessLower.includes('פיזיו') || businessLower.includes('רפואה')) matchedCategory = 'מטפל/ת'
    else if (businessLower.includes('קייטרינג') || businessLower.includes('אוכל') || businessLower.includes('פיצה')) matchedCategory = 'קייטרינג'
    else if (businessLower.includes('צילום') || businessLower.includes('צלם') || businessLower.includes('וידאו')) matchedCategory = 'צלם/ת'
    else if (businessLower.includes('מורה') || businessLower.includes('לימוד') || businessLower.includes('חינוך')) matchedCategory = 'מורה/מדריך'
    else if (businessLower.includes('הסעות') || businessLower.includes('נהג') || businessLower.includes('שליח')) matchedCategory = 'נהג/שליח'
    else if (businessLower.includes('שיפוץ') || businessLower.includes('קבלן') || businessLower.includes('בנייה')) matchedCategory = 'קבלן שיפוצים'
    
    // Get image based on matched category
    const categoryImgs = categoryImages[matchedCategory] || defaultImages
    const imageUrl = categoryImgs[i % categoryImgs.length]
    
    // Determine if this profile should get a video (about 30% of profiles)
    const shouldHaveVideo = i % 3 === 0
    let videoUrl: string | null = null
    
    if (shouldHaveVideo) {
      // Get video based on category or use generic work video
      const categoryVids = categoryVideos[matchedCategory]
      if (categoryVids) {
        videoUrl = categoryVids[0]
      } else {
        videoUrl = workVideos[i % workVideos.length]
      }
      videoCount++
    }

    // Update profile - use media_urls array for videos
    const updateData: Record<string, string | string[]> = {
      avatar_url: imageUrl,
    }
    
    if (videoUrl) {
      updateData.media_urls = [videoUrl]
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', profile.id)

    if (updateError) {
      console.error(`❌ Error updating ${profile.business_name}:`, updateError.message)
    } else {
      imageCount++
      const videoIcon = videoUrl ? ' + 🎬' : ''
      if (i < 20 || i % 20 === 0) {
        console.log(`✓ ${profile.business_name}${videoIcon}`)
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Updated ${imageCount} profiles with images`)
  console.log(`🎬 Added videos to ${videoCount} profiles`)
  console.log('='.repeat(50))
}

fillMedia()
