import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function deleteBusinessProfile(email: string) {
  console.log(`🔍 Looking for user: ${email}\n`)
  
  // Find user
  let page = 1
  let user = null
  
  while (!user) {
    const { data: { users }, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100
    })
    
    if (error) {
      console.error('Error:', error.message)
      return
    }
    
    if (!users || users.length === 0) break
    
    user = users.find(u => u.email === email)
    
    if (users.length < 100) break
    page++
  }
  
  if (!user) {
    console.log('❌ User not found')
    return
  }
  
  console.log(`✅ Found user: ${user.id}`)
  console.log(`   Email: ${user.email}\n`)
  
  // Check if has business profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile) {
    console.log('ℹ️  No business profile found - nothing to delete')
    return
  }
  
  console.log(`📋 Found business profile: ${profile.business_name}`)
  console.log('')
  
  // Delete business profile
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id)
  
  if (deleteError) {
    console.error('❌ Error deleting profile:', deleteError.message)
    return
  }
  
  console.log('✅ Business profile deleted successfully!')
  console.log('')
  console.log('📊 User status now:')
  console.log('   Auth User: ✅ (kept)')
  console.log('   Admin: ✅ (kept)')
  console.log('   Business Profile: ❌ (deleted)')
}

const email = process.argv[2]

if (!email) {
  console.log('Usage: npx tsx scripts/delete-business-profile.ts <email>')
  process.exit(1)
}

deleteBusinessProfile(email).catch(console.error)
