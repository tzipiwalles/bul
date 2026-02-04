import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function check() {
  const { data, error } = await supabase
    .from('profiles')
    .select('business_name, avatar_url')
    .limit(20)

  if (error) {
    console.log('Error:', error.message)
    return
  }

  console.log('Total profiles found:', data.length)
  console.log('\n--- Profile Images ---\n')
  
  let realImageCount = 0
  let placeholderCount = 0
  
  data.forEach(p => {
    const hasRealImage = p.avatar_url && !p.avatar_url.includes('dicebear') && !p.avatar_url.includes('api.dicebear')
    if (hasRealImage) {
      realImageCount++
      console.log('✓ REAL IMAGE: ' + p.business_name)
      console.log('  URL: ' + p.avatar_url)
    } else {
      placeholderCount++
      console.log('✗ Placeholder: ' + p.business_name)
    }
  })
  
  console.log('\n--- Summary ---')
  console.log('Real images:', realImageCount)
  console.log('Placeholders:', placeholderCount)
}

check()
