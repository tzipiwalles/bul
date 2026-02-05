import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function checkUser(email: string) {
  console.log(`🔍 Checking user: ${email}\n`)
  
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
    
    user = users.find(u => u.email === email || u.email?.toLowerCase().startsWith(email.toLowerCase()))
    
    if (users.length < 100) break
    page++
  }
  
  if (!user) {
    console.log('❌ User not found in auth.users')
    return
  }
  
  console.log('✅ User found in auth.users')
  console.log(`   ID: ${user.id}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Provider: ${user.app_metadata?.provider || 'email'}`)
  console.log(`   Created: ${user.created_at}`)
  console.log(`   Last sign in: ${user.last_sign_in_at || 'Never'}`)
  console.log('')
  
  // Check if admin
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (admin) {
    console.log('✅ User IS an admin')
    console.log(`   Admin since: ${admin.created_at}`)
  } else {
    console.log('❌ User is NOT an admin')
  }
  console.log('')
  
  // Check if has business profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profile) {
    console.log('✅ User HAS a business profile')
    console.log(`   Business name: ${profile.business_name}`)
    console.log(`   City: ${profile.city}`)
    console.log(`   Active: ${profile.is_active}`)
    console.log(`   Verified: ${profile.is_verified}`)
    console.log(`   Gender: ${profile.gender}`)
    console.log(`   Categories: ${profile.categories?.join(', ') || 'None'}`)
  } else {
    console.log('❌ User does NOT have a business profile')
  }
  console.log('')
  
  // Summary
  console.log('📊 Summary:')
  console.log(`   Auth User: ✅`)
  console.log(`   Admin: ${admin ? '✅' : '❌'}`)
  console.log(`   Business Profile: ${profile ? '✅' : '❌'}`)
}

const email = process.argv[2]

if (!email) {
  console.log('Usage: npx tsx scripts/check-user.ts <email>')
  process.exit(1)
}

checkUser(email).catch(console.error)
