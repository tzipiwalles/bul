/**
 * Delete a user by email
 * 
 * Run with: npx tsx scripts/delete-user.ts <email>
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

async function deleteUser(email: string) {
  console.log(`🔍 Looking for user: ${email}\n`)
  
  // Find user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error listing users:', listError.message)
    return
  }
  
  const user = users?.find(u => u.email === email)
  
  if (!user) {
    console.log('❌ User not found')
    return
  }
  
  console.log(`Found user: ${user.id}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Created: ${user.created_at}`)
  
  // Check if has profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, business_name')
    .eq('id', user.id)
    .single()
  
  if (profile) {
    console.log(`   Profile: ${profile.business_name}`)
    
    // Delete profile first
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)
    
    if (profileDeleteError) {
      console.error('Error deleting profile:', profileDeleteError.message)
    } else {
      console.log('   ✅ Profile deleted')
    }
  }
  
  // Delete auth user
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
  
  if (deleteError) {
    console.error('Error deleting user:', deleteError.message)
  } else {
    console.log('   ✅ User deleted successfully!')
  }
}

// Get email from command line
const email = process.argv[2]

if (!email) {
  console.log('Usage: npx tsx scripts/delete-user.ts <email>')
  console.log('Example: npx tsx scripts/delete-user.ts tzipi.walles@gmail.com')
  process.exit(1)
}

deleteUser(email).catch(console.error)
