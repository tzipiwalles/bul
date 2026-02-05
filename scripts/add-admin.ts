/**
 * Add a user as admin by email
 * 
 * Run with: npx tsx scripts/add-admin.ts <email>
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

async function addAdmin(email: string) {
  console.log(`🔍 Looking for user: ${email}\n`)
  
  // Find user by email (with pagination)
  let page = 1
  let user = null
  
  while (!user) {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100
    })
    
    if (listError) {
      console.error('Error listing users:', listError.message)
      return
    }
    
    if (!users || users.length === 0) break
    
    user = users.find(u => u.email === email)
    
    if (users.length < 100) break
    page++
  }
  
  if (!user) {
    console.log('❌ User not found. They need to login first.')
    return
  }
  
  console.log(`Found user: ${user.id}`)
  console.log(`   Email: ${user.email}`)
  
  // Check if already admin
  const { data: existingAdmin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()
  
  if (existingAdmin) {
    console.log('   ⚠️ User is already an admin')
    return
  }
  
  // Add as admin
  const { error: insertError } = await supabase
    .from('admins')
    .insert({ user_id: user.id })
  
  if (insertError) {
    console.error('Error adding admin:', insertError.message)
    return
  }
  
  console.log('   ✅ User added as admin successfully!')
}

// Get email from command line
const email = process.argv[2]

if (!email) {
  console.log('Usage: npx tsx scripts/add-admin.ts <email>')
  console.log('Example: npx tsx scripts/add-admin.ts tzipi.walles@gmail.com')
  process.exit(1)
}

addAdmin(email).catch(console.error)
