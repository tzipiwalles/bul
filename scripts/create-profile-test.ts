import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createTestProfile() {
  const userId = '46eadf48-f517-497a-993a-a2e24bdc5a5d' // iqtonai@gmail.com
  
  console.log('Creating profile for user:', userId)
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: 'iqtonai@gmail.com',
      business_name: 'עסק לדוגמה',
      phone: '050-1234567',
      city: 'ירושלים',
      gender: 'female',
      role: 'professional',
      service_type: 'project',
      categories: ['טכנולוגיה'],
      description: 'תיאור העסק',
      is_active: true,
    })
    .select()

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success! Profile created:', data)
  }
}

createTestProfile().catch(console.error)
