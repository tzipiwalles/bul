import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function checkProfileData(profileId: string) {
  console.log(`🔍 Checking data for profile: ${profileId}\n`)

  // Get profile info
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name, categories')
    .eq('id', profileId)
    .single()

  if (profile) {
    console.log(`📊 Business: ${profile.business_name}`)
    console.log(`   Categories: ${profile.categories?.join(', ') || 'None'}\n`)
  }

  // Get appointments
  const { data: appointments, error: aptError } = await supabase
    .from('appointments')
    .select('*')
    .eq('profile_id', profileId)
    .order('requested_date', { ascending: true })

  console.log(`📅 Appointments: ${appointments?.length || 0}`)
  if (appointments && appointments.length > 0) {
    appointments.forEach(apt => {
      console.log(`   - ${apt.customer_name} | ${apt.requested_date} ${apt.requested_time} | ${apt.status}`)
    })
  }
  console.log('')

  // Get leads
  const { data: leads, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  console.log(`📩 Leads: ${leads?.length || 0}`)
  if (leads && leads.length > 0) {
    leads.forEach(lead => {
      console.log(`   - ${lead.customer_name} | ${lead.status} | "${lead.message?.substring(0, 40)}..."`)
    })
  }
}

const profileId = process.argv[2] || '46eadf48-f517-497a-993a-a2e24bdc5a5d' // Default to IQton

checkProfileData(profileId).catch(console.error)
