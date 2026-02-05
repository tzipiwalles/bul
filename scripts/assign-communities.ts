/**
 * Assign random communities to existing profiles
 * 
 * Run with: npx tsx scripts/assign-communities.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

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

// Community IDs with weighted distribution (some communities are larger)
const COMMUNITY_WEIGHTS = [
  // Large communities - higher weight
  { id: 'general', weight: 15 },
  { id: 'chabad', weight: 12 },
  { id: 'gur', weight: 10 },
  { id: 'breslov', weight: 8 },
  { id: 'belz', weight: 7 },
  { id: 'vizhnitz', weight: 6 },
  { id: 'sanz', weight: 5 },
  
  // Medium communities
  { id: 'slonim', weight: 4 },
  { id: 'karlin', weight: 4 },
  { id: 'satmar', weight: 4 },
  { id: 'boyan', weight: 3 },
  { id: 'toldos_aharon', weight: 3 },
  { id: 'edah_haredit', weight: 3 },
  
  // Smaller communities
  { id: 'biale', weight: 2 },
  { id: 'sadigura', weight: 2 },
  { id: 'modzitz', weight: 2 },
  { id: 'erlau', weight: 2 },
  { id: 'alexander', weight: 2 },
  { id: 'lelov', weight: 2 },
  { id: 'amshinov', weight: 1 },
  { id: 'nadvorna', weight: 1 },
  { id: 'seret_vizhnitz', weight: 1 },
  { id: 'toldos_avraham', weight: 1 },
  { id: 'darag', weight: 1 },
  { id: 'other', weight: 3 },
]

// Build weighted array for random selection
const weightedCommunities: string[] = []
for (const { id, weight } of COMMUNITY_WEIGHTS) {
  for (let i = 0; i < weight; i++) {
    weightedCommunities.push(id)
  }
}

function getRandomCommunity(): string {
  return weightedCommunities[Math.floor(Math.random() * weightedCommunities.length)]
}

async function assignCommunities() {
  console.log('🏘️ Starting community assignment...\n')
  
  // Get all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, business_name, community')
    .eq('is_active', true)
  
  if (error) {
    console.error('Error fetching profiles:', error.message)
    return
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('No profiles found')
    return
  }
  
  console.log(`Found ${profiles.length} profiles to update\n`)
  
  // Track community distribution
  const communityCount: Record<string, number> = {}
  let updated = 0
  let errors = 0
  
  for (const profile of profiles) {
    const community = getRandomCommunity()
    communityCount[community] = (communityCount[community] || 0) + 1
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ community })
      .eq('id', profile.id)
    
    if (updateError) {
      console.log(`❌ Failed to update ${profile.business_name}: ${updateError.message}`)
      errors++
    } else {
      updated++
    }
  }
  
  console.log(`\n🎉 Community assignment completed!`)
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ❌ Errors: ${errors}`)
  
  console.log('\n📊 Community distribution:')
  Object.entries(communityCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([community, count]) => {
      console.log(`   ${community}: ${count}`)
    })
}

// Run
assignCommunities().catch(console.error)
