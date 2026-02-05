import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use ANON key to simulate real user
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAdminCheck(email: string) {
  console.log(`🧪 Testing admin check for: ${email}\n`)
  
  // First, we need to get the user ID using service key
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  
  let page = 1
  let user = null
  
  while (!user) {
    const { data: { users }, error } = await adminSupabase.auth.admin.listUsers({
      page,
      perPage: 100
    })
    
    if (error || !users || users.length === 0) break
    
    user = users.find(u => u.email === email)
    if (users.length < 100) break
    page++
  }
  
  if (!user) {
    console.log('❌ User not found')
    return
  }
  
  console.log(`✅ User found: ${user.id}\n`)
  
  // Now test as if the user is logged in - simulate by checking with service key
  // but with the user's perspective
  console.log('Testing admin check query...\n')
  
  // Test 1: Can we see our own admin row? (using service key to simulate)
  const { data: adminCheck1, error: error1 } = await adminSupabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()
  
  console.log('Test 1: Direct query for user admin status')
  console.log(`  Result: ${adminCheck1 ? '✅ Found' : '❌ Not found'}`)
  if (error1) console.log(`  Error: ${error1.message}`)
  console.log('')
  
  // Test 2: Check the RLS policy
  console.log('Test 2: Checking RLS policies on admins table')
  const { data: policies, error: policyError } = await adminSupabase
    .rpc('pg_policies')
    .eq('tablename', 'admins')
  
  console.log('  Checking if policy exists...')
  console.log('')
  
  // Test 3: Try the is_admin function
  console.log('Test 3: Testing is_admin() function')
  const { data: isAdminResult, error: isAdminError } = await adminSupabase
    .rpc('is_admin', { user_uuid: user.id })
  
  console.log(`  Result: ${isAdminResult ? '✅ Is Admin' : '❌ Not Admin'}`)
  if (isAdminError) console.log(`  Error: ${isAdminError.message}`)
  console.log('')
  
  console.log('📊 Summary:')
  console.log(`  Direct query: ${adminCheck1 ? '✅' : '❌'}`)
  console.log(`  is_admin() function: ${isAdminResult ? '✅' : '❌'}`)
}

const email = process.argv[2] || 'tzipi.walles@gmail.com'

testAdminCheck(email).catch(console.error)
