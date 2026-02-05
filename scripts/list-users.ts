import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function listUsers() {
  console.log('Listing all users (with pagination)...\n')
  
  let page = 1
  let allUsers: any[] = []
  
  while (true) {
    const { data: { users }, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100
    })
    
    if (error) {
      console.error('Error:', error.message)
      return
    }
    
    if (!users || users.length === 0) break
    
    allUsers = [...allUsers, ...users]
    console.log(`Page ${page}: ${users.length} users`)
    
    if (users.length < 100) break
    page++
  }
  
  console.log(`\nTotal: ${allUsers.length} users\n`)
  
  // Show Google users first
  const googleUsers = allUsers.filter(u => u.app_metadata?.provider === 'google')
  if (googleUsers.length > 0) {
    console.log('Google users:')
    googleUsers.forEach(u => console.log(`- ${u.email} (${u.id})`))
    console.log('')
  }
  
  // Show last 10 users
  console.log('Last 10 users:')
  allUsers.slice(-10).forEach(u => {
    console.log(`- ${u.email} (${u.id}) - ${u.app_metadata?.provider || 'email'}`)
  })
}

listUsers().catch(console.error)
