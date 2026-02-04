/**
 * Seed Script - Add realistic Haredi professionals to the database
 * 
 * IMPORTANT: You need to set SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Get it from: Supabase Dashboard > Settings > API > service_role key
 * 
 * Run with: npx tsx scripts/seed-professionals.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required in .env.local')
  console.log('   Get it from: Supabase Dashboard > Settings > API > service_role key')
  process.exit(1)
}

// Use service role to bypass RLS and create auth users
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 3 Realistic Haredi Professionals
const professionals = [
  {
    id: crypto.randomUUID(),
    email: 'moshe.goldstein.electric@example.com',
    business_name: 'חשמל גולדשטיין - שירות מקצועי',
    gender: 'male' as const,
    role: 'professional' as const,
    service_type: 'emergency' as const,
    city: 'בני ברק',
    address: 'רחוב רבי עקיבא 45',
    phone: '052-1234567',
    whatsapp: '972521234567',
    description: 'חשמלאי מוסמך עם 20 שנות ניסיון. מתמחה בתיקוני חשמל דחופים, התקנת מערכות תאורה, והתאמת מערכות חשמל לשבת. זמין 24/7 לקריאות חירום. עובד עם כל חברות הביטוח. מחירים הוגנים ושירות אמין.',
    rating: 4.8,
    review_count: 127,
    is_verified: true,
    is_active: true,
    categories: ['חשמלאים'],
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=מג&backgroundColor=0A2351',
    media_urls: [],
    opening_hours: {
      sunday: { open: '08:00', close: '20:00' },
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '13:00' },
      saturday: null
    }
  },
  {
    id: crypto.randomUUID(),
    email: 'yosef.friedman.plumbing@example.com',
    business_name: 'אינסטלציה פרידמן ובניו',
    gender: 'male' as const,
    role: 'professional' as const,
    service_type: 'appointment' as const,
    city: 'ירושלים',
    address: 'שכונת גאולה, רחוב מאה שערים 12',
    phone: '053-9876543',
    whatsapp: '972539876543',
    description: 'עסק משפחתי בדור שלישי. מתמחים בכל עבודות האינסטלציה: תיקון נזילות, פתיחת סתימות, התקנת דודי שמש, שיפוץ חדרי אמבטיה ושירותים. אחריות על כל עבודה. מומלץ על ידי רבנים מובילים בירושלים.',
    rating: 4.9,
    review_count: 89,
    is_verified: true,
    is_active: true,
    categories: ['אינסטלטורים'],
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=יפ&backgroundColor=0A2351',
    media_urls: [],
    opening_hours: {
      sunday: { open: '07:30', close: '19:00' },
      monday: { open: '07:30', close: '19:00' },
      tuesday: { open: '07:30', close: '19:00' },
      wednesday: { open: '07:30', close: '19:00' },
      thursday: { open: '07:30', close: '19:00' },
      friday: { open: '07:30', close: '12:00' },
      saturday: null
    }
  },
  {
    id: crypto.randomUUID(),
    email: 'avraham.levy.accounting@example.com',
    business_name: 'משרד רואי חשבון לוי את שותפיו',
    gender: 'male' as const,
    role: 'professional' as const,
    service_type: 'project' as const,
    city: 'מודיעין עילית',
    address: 'מרכז העסקים, בניין א׳ קומה 3',
    phone: '02-5551234',
    whatsapp: '972505551234',
    description: 'רואה חשבון מוסמך עם התמחות בעסקים קטנים ובינוניים בציבור החרדי. שירותים: הנהלת חשבונות, דוחות שנתיים, ייעוץ מס, פתיחת עוסקים, וליווי עסקי. מחירים תחרותיים ושירות אישי. דובר עברית, אידיש ואנגלית.',
    rating: 4.7,
    review_count: 56,
    is_verified: true,
    is_active: true,
    categories: ['רואי חשבון'],
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=אל&backgroundColor=0A2351',
    media_urls: [],
    opening_hours: {
      sunday: { open: '09:00', close: '18:00' },
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '13:00' },
      saturday: null
    }
  }
]

async function seed() {
  console.log('🌱 Starting seed process...\n')

  for (const professional of professionals) {
    console.log(`\n📝 Adding: ${professional.business_name}`)
    
    // First check if profile already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', professional.email)
      .single()
    
    if (existing) {
      console.log(`   ⏭️ Skipping (already exists)`)
      continue
    }
    
    // Step 1: Create auth user
    console.log(`   1️⃣ Creating auth user...`)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: professional.email,
      password: 'TempPassword123!', // Temporary password
      email_confirm: true, // Auto-confirm email
    })
    
    if (authError) {
      console.error(`   ❌ Auth error: ${authError.message}`)
      continue
    }
    
    const userId = authData.user.id
    console.log(`   ✅ Auth user created: ${userId}`)
    
    // Step 2: Create profile with the auth user's ID
    console.log(`   2️⃣ Creating profile...`)
    const profileData = {
      ...professional,
      id: userId, // Use the auth user's ID
    }
    delete (profileData as any).email // Remove email from profile data if it's not a column
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: professional.email,
        business_name: professional.business_name,
        gender: professional.gender,
        role: professional.role,
        service_type: professional.service_type,
        city: professional.city,
        address: professional.address,
        phone: professional.phone,
        whatsapp: professional.whatsapp,
        description: professional.description,
        rating: professional.rating,
        review_count: professional.review_count,
        is_verified: professional.is_verified,
        is_active: professional.is_active,
        categories: professional.categories,
        avatar_url: professional.avatar_url,
        media_urls: professional.media_urls,
        opening_hours: professional.opening_hours,
      })
    
    if (profileError) {
      console.error(`   ❌ Profile error: ${profileError.message}`)
      // Clean up: delete the auth user if profile creation failed
      await supabase.auth.admin.deleteUser(userId)
    } else {
      console.log(`   ✅ Profile created successfully!`)
    }
  }

  console.log('\n🎉 Seed completed!')
  
  // Verify
  const { data: allProfiles, error: fetchError } = await supabase
    .from('profiles')
    .select('id, business_name, city, categories')
  
  if (fetchError) {
    console.error('Error fetching profiles:', fetchError.message)
  } else {
    console.log(`\n📊 Total profiles in database: ${allProfiles?.length || 0}`)
    allProfiles?.forEach(p => {
      console.log(`  - ${p.business_name} (${p.city}) - ${p.categories?.join(', ')}`)
    })
  }
}

seed().catch(console.error)
