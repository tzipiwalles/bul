import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Working direct MP4 video URLs from Pexels (these are publicly accessible)
const workingVideos = [
  // Construction/Tools
  'https://videos.pexels.com/video-files/5974086/5974086-sd_640_360_30fps.mp4',
  // Cooking/Food preparation
  'https://videos.pexels.com/video-files/4253729/4253729-sd_640_360_30fps.mp4',
  // Professional office work
  'https://videos.pexels.com/video-files/3252117/3252117-sd_640_360_24fps.mp4',
  // Handcraft/Workshop
  'https://videos.pexels.com/video-files/4708748/4708748-sd_640_360_25fps.mp4',
  // Cleaning/Service
  'https://videos.pexels.com/video-files/4099354/4099354-sd_640_360_25fps.mp4',
  // Plumbing/pipes work
  'https://videos.pexels.com/video-files/6474098/6474098-sd_640_360_25fps.mp4',
  // Photography
  'https://videos.pexels.com/video-files/3045163/3045163-sd_640_360_24fps.mp4',
  // Delivery/driving
  'https://videos.pexels.com/video-files/5793637/5793637-sd_640_360_25fps.mp4',
]

async function fixVideos() {
  console.log('🔍 Checking profiles with videos...\n')

  // Get profiles that have media_urls
  const { data: profilesWithVideos, error: fetchError } = await supabase
    .from('profiles')
    .select('id, business_name, media_urls')
    .not('media_urls', 'is', null)
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('Error fetching profiles:', fetchError.message)
    return
  }

  console.log(`Found ${profilesWithVideos?.length || 0} profiles with videos\n`)

  if (!profilesWithVideos || profilesWithVideos.length === 0) {
    console.log('No profiles have videos yet. Running fill script...')
    
    // Get all profiles and add videos to ~30%
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('id, business_name')
      .order('created_at', { ascending: true })
    
    if (allError || !allProfiles) {
      console.error('Error fetching all profiles:', allError?.message)
      return
    }

    let videoCount = 0
    for (let i = 0; i < allProfiles.length; i++) {
      // Add video to every 3rd profile
      if (i % 3 === 0) {
        const videoUrl = workingVideos[videoCount % workingVideos.length]
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ media_urls: [videoUrl] })
          .eq('id', allProfiles[i].id)
        
        if (!updateError) {
          console.log(`✓ Added video to: ${allProfiles[i].business_name}`)
          videoCount++
        }
      }
    }
    
    console.log(`\n✅ Added videos to ${videoCount} profiles`)
    return
  }

  // Fix existing video URLs with working ones
  console.log('Updating video URLs to working Pexels videos...\n')
  
  let fixedCount = 0
  for (let i = 0; i < profilesWithVideos.length; i++) {
    const profile = profilesWithVideos[i]
    const currentUrl = profile.media_urls?.[0]
    
    // Check if URL is a Vimeo URL (these don't work as direct sources)
    const isVimeoUrl = currentUrl?.includes('vimeo.com')
    
    if (isVimeoUrl || !currentUrl) {
      const newVideoUrl = workingVideos[i % workingVideos.length]
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ media_urls: [newVideoUrl] })
        .eq('id', profile.id)
      
      if (!updateError) {
        console.log(`✓ Fixed: ${profile.business_name}`)
        console.log(`  Old: ${currentUrl?.substring(0, 50)}...`)
        console.log(`  New: ${newVideoUrl}`)
        fixedCount++
      }
    } else {
      console.log(`○ OK: ${profile.business_name} - ${currentUrl?.substring(0, 60)}...`)
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} video URLs`)
  console.log(`📹 Total profiles with videos: ${profilesWithVideos.length}`)
}

fixVideos()
