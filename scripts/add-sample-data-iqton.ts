import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function addSampleData() {
  const profileId = '46eadf48-f517-497a-993a-a2e24bdc5a5d' // IQton
  
  console.log('Adding sample appointments and leads for IQton...\n')

  // Add appointments
  const appointments = [
    {
      profile_id: profileId,
      customer_name: 'רבקה גולדשטיין',
      customer_phone: '052-1234567',
      requested_date: '2026-02-06',
      requested_time: '10:00',
      status: 'confirmed',
      notes: 'מעוניינת במנוי שנתי'
    },
    {
      profile_id: profileId,
      customer_name: 'שרה כהן',
      customer_phone: '050-9876543',
      requested_date: '2026-02-07',
      requested_time: '14:30',
      status: 'pending',
      notes: 'פגישה להצגת העיתון'
    },
    {
      profile_id: profileId,
      customer_name: 'חיים לוי',
      customer_phone: '054-5555555',
      requested_date: '2026-02-08',
      requested_time: '11:00',
      status: 'pending',
      notes: 'מנהל גן ילדים - מעוניין בהזמנה קבוצתית'
    }
  ]

  for (const apt of appointments) {
    const { error } = await supabase.from('appointments').insert(apt)
    if (error) {
      console.error('Error adding appointment:', error.message)
    } else {
      console.log(`✅ Added appointment: ${apt.customer_name}`)
    }
  }

  // Add leads
  const leads = [
    {
      profile_id: profileId,
      customer_name: 'מרים פרידמן',
      customer_phone: '053-1111111',
      customer_email: 'miriam@email.com',
      message: 'שלום, אני מנהלת גן ילדים ומעוניינת במנוי לגן. כמה ילדים יש מינימום?',
      status: 'new'
    },
    {
      profile_id: profileId,
      customer_name: 'אברהם שטיין',
      customer_phone: '050-2222222',
      message: 'האם יש גיליון לדוגמה שאפשר לראות? הילדים שלי בגילאי 5-8',
      status: 'new'
    },
    {
      profile_id: profileId,
      customer_name: 'דבורה רוזנברג',
      customer_phone: '052-3333333',
      customer_email: 'dvora.r@email.com',
      message: 'מעוניינת בפרסום עסק שלי בעיתון. מה העלויות?',
      status: 'contacted'
    },
    {
      profile_id: profileId,
      customer_name: 'יעקב הורוביץ',
      customer_phone: '054-4444444',
      message: 'רוצה לרכוש מנוי שנתי לילדים. האם יש הנחה למנוי ארוך?',
      status: 'new'
    }
  ]

  for (const lead of leads) {
    const { error } = await supabase.from('leads').insert(lead)
    if (error) {
      console.error('Error adding lead:', error.message)
    } else {
      console.log(`✅ Added lead: ${lead.customer_name}`)
    }
  }

  console.log('\n🎉 Done!')
}

addSampleData().catch(console.error)
