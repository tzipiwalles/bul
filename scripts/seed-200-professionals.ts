/**
 * Comprehensive Seed Script - Generate 200 realistic Haredi professionals
 * 
 * IMPORTANT: Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 * 
 * Run with: npx tsx scripts/seed-200-professionals.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// =====================================================
// DATA POOLS
// =====================================================

// First names for businesses
const MALE_FIRST_NAMES = [
  'משה', 'יוסף', 'יעקב', 'אברהם', 'דוד', 'שלמה', 'יצחק', 'אהרון', 
  'מנחם', 'שמואל', 'בנימין', 'אליעזר', 'חיים', 'ישראל', 'נתן',
  'צבי', 'מאיר', 'ראובן', 'שמעון', 'לוי', 'יהודה', 'נפתלי', 'גד',
  'אשר', 'זבולון', 'יששכר', 'דן', 'אפרים', 'מרדכי', 'פינחס'
]

const LAST_NAMES = [
  'כהן', 'לוי', 'פרידמן', 'גולדשטיין', 'שוורץ', 'רוזנברג', 'קליין',
  'וייס', 'הורוביץ', 'לנדאו', 'שטיין', 'ברגר', 'מילר', 'פישמן',
  'גרינברג', 'רוזן', 'בלום', 'הירש', 'פלד', 'אדלר', 'בקר', 'גוטליב',
  'זילברמן', 'שפירא', 'רוטשילד', 'אייזנברג', 'קורן', 'גליק', 'ולדמן'
]

// Categories with their professionals
const CATEGORIES_WITH_PROFESSIONS = [
  { category: 'חשמלאים', professions: ['חשמל', 'חשמל תעשייתי', 'מערכות חכמות'], serviceType: 'emergency' },
  { category: 'אינסטלטורים', professions: ['אינסטלציה', 'פתיחת סתימות', 'דודי שמש'], serviceType: 'emergency' },
  { category: 'שיפוצים', professions: ['שיפוצים', 'בנייה', 'גבס ושפכטל'], serviceType: 'project' },
  { category: 'צביעה', professions: ['צבע', 'צביעה דקורטיבית', 'איטום'], serviceType: 'project' },
  { category: 'ריהוט', professions: ['נגרות', 'ריהוט מטבח', 'ארונות'], serviceType: 'project' },
  { category: 'מיזוג אוויר', professions: ['מיזוג', 'מערכות קירור', 'תחזוקת מזגנים'], serviceType: 'emergency' },
  { category: 'רואי חשבון', professions: ['רואה חשבון', 'הנהלת חשבונות', 'ייעוץ מס'], serviceType: 'project' },
  { category: 'עורכי דין', professions: ['עורך דין', 'ייעוץ משפטי', 'גירושין'], serviceType: 'project' },
  { category: 'רפואה', professions: ['רפואה משלימה', 'פיזיותרפיה', 'רפואת שיניים'], serviceType: 'appointment' },
  { category: 'טיפולי שיער', professions: ['פאות', 'תספורת', 'צביעת שיער'], serviceType: 'appointment' },
  { category: 'אירועים', professions: ['הפקת אירועים', 'קייטרינג', 'DJ'], serviceType: 'project' },
  { category: 'צילום', professions: ['צילום אירועים', 'צילום מסחרי', 'וידאו'], serviceType: 'project' },
  { category: 'הובלות', professions: ['הובלות', 'פינוי דירות', 'אחסנה'], serviceType: 'project' },
  { category: 'ניקיון', professions: ['ניקיון דירות', 'ניקוי שטיחים', 'ניקוי חלונות'], serviceType: 'project' },
  { category: 'מחשבים', professions: ['תיקון מחשבים', 'שירותי IT', 'אבטחת מידע'], serviceType: 'project' },
  { category: 'לימוד', professions: ['מורה פרטי', 'לימודי קודש', 'אנגלית'], serviceType: 'appointment' },
  { category: 'מוסך', professions: ['מכונאות', 'פחחות', 'חשמל רכב'], serviceType: 'project' },
  { category: 'מזון', professions: ['פיצה', 'בשרים', 'קונדיטוריה'], serviceType: 'retail' },
  { category: 'ביגוד', professions: ['חנות בגדים', 'חליפות', 'נעליים'], serviceType: 'retail' },
  { category: 'ספרים', professions: ['ספרי קודש', 'חנות יודאיקה', 'סופר סת"ם'], serviceType: 'retail' },
]

// Haredi cities with weights (more common cities get more professionals)
const CITIES_WITH_WEIGHTS = [
  { city: 'ירושלים', weight: 25 },
  { city: 'בני ברק', weight: 20 },
  { city: 'מודיעין עילית', weight: 12 },
  { city: 'ביתר עילית', weight: 10 },
  { city: 'אלעד', weight: 8 },
  { city: 'בית שמש', weight: 7 },
  { city: 'אשדוד', weight: 5 },
  { city: 'פתח תקווה', weight: 4 },
  { city: 'רכסים', weight: 3 },
  { city: 'צפת', weight: 3 },
  { city: 'טבריה', weight: 2 },
  { city: 'נתיבות', weight: 1 },
]

// Street names
const STREETS = [
  'הרב קוק', 'רבי עקיבא', 'חזון איש', 'הרב שך', 'בעל שם טוב',
  'הרמב"ם', 'יהודה הנשיא', 'האדמו"ר מגור', 'האר"י', 'הבעש"ט',
  'רש"י', 'הרב עובדיה', 'הסטייפלר', 'מרן', 'בן איש חי'
]

// Business name templates
const BUSINESS_TEMPLATES = [
  '{profession} {lastName}',
  '{lastName} {profession}',
  '{firstName} {lastName} - {profession}',
  '{profession} {firstName} {lastName}',
  'בית {profession} {lastName}',
  '{profession} מקצועי - {lastName}',
  '{lastName} ובניו - {profession}',
]

// Description templates
const DESCRIPTION_TEMPLATES = [
  `בעל מקצוע עם ניסיון של {years} שנים בתחום. מספק שירות מקצועי ואמין לקהילה החרדית. עובד בכל אזור {city} והסביבה. מחירים הוגנים ועבודה איכותית.`,
  `מתמחה ב{profession} עם צוות מקצועי ומיומן. שירות אדיב ומהיר, זמינות גבוהה. ניסיון רב בעבודה עם משפחות ברוכות ילדים. אחריות מלאה על כל עבודה.`,
  `{years} שנות ניסיון בשירות הקהילה החרדית. מומחה ב{profession} עם המלצות מרבנים ואנשי ציבור. עבודה נקייה ומסודרת. זמינות בכל שעות היום.`,
  `שירותי {profession} ברמה הגבוהה ביותר. עסק משפחתי עם מסורת של {years} שנים. מתמחה בעבודה עם הקהילה החרדית. שומר שבת וחגים.`,
  `מציע שירותי {profession} מקצועיים באזור {city}. ניסיון עשיר, מחירים תחרותיים, ושירות אמין. פועל בתיאום מלא עם הלקוח ומקפיד על לוחות זמנים.`,
]

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getWeightedCity(): string {
  const totalWeight = CITIES_WITH_WEIGHTS.reduce((sum, c) => sum + c.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const { city, weight } of CITIES_WITH_WEIGHTS) {
    random -= weight
    if (random <= 0) return city
  }
  
  return CITIES_WITH_WEIGHTS[0].city
}

function generateBusinessName(firstName: string, lastName: string, profession: string): string {
  const template = randomItem(BUSINESS_TEMPLATES)
  return template
    .replace('{firstName}', firstName)
    .replace('{lastName}', lastName)
    .replace('{profession}', profession)
}

function generateDescription(profession: string, city: string): string {
  const template = randomItem(DESCRIPTION_TEMPLATES)
  const years = randomNumber(5, 30)
  return template
    .replace(/{profession}/g, profession)
    .replace(/{city}/g, city)
    .replace(/{years}/g, years.toString())
}

function generatePhone(): string {
  const prefixes = ['050', '052', '053', '054', '055', '058']
  const prefix = randomItem(prefixes)
  const number = randomNumber(1000000, 9999999)
  return `${prefix}-${number}`
}

function generateOpeningHours() {
  const closeHour = randomItem(['17:00', '18:00', '19:00', '20:00'])
  return {
    sunday: { open: '08:00', close: closeHour },
    monday: { open: '08:00', close: closeHour },
    tuesday: { open: '08:00', close: closeHour },
    wednesday: { open: '08:00', close: closeHour },
    thursday: { open: '08:00', close: closeHour },
    friday: { open: '08:00', close: '13:00' },
    saturday: null,
  }
}

function generateAvatarUrl(firstName: string, lastName: string): string {
  const initials = `${firstName[0]}${lastName[0]}`
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=0A2351`
}

// =====================================================
// MAIN GENERATION
// =====================================================

interface ProfessionalData {
  email: string
  business_name: string
  gender: 'male' | 'female'
  role: 'professional' | 'store'
  service_type: 'appointment' | 'project' | 'emergency' | 'retail'
  city: string
  address: string
  phone: string
  whatsapp: string
  description: string
  rating: number
  review_count: number
  is_verified: boolean
  is_active: boolean
  categories: string[]
  avatar_url: string
  media_urls: string[]
  opening_hours: ReturnType<typeof generateOpeningHours>
}

// Transliteration map for Hebrew to English
const HEBREW_TO_ENGLISH: Record<string, string> = {
  'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
  'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm',
  'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ף': 'p',
  'צ': 'tz', 'ץ': 'tz', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't'
}

function transliterate(hebrew: string): string {
  return hebrew.split('').map(char => HEBREW_TO_ENGLISH[char] || '').join('')
}

function generateProfessional(index: number): ProfessionalData {
  const categoryData = randomItem(CATEGORIES_WITH_PROFESSIONS)
  const profession = randomItem(categoryData.professions)
  const firstName = randomItem(MALE_FIRST_NAMES)
  const lastName = randomItem(LAST_NAMES)
  const city = getWeightedCity()
  const street = randomItem(STREETS)
  const streetNumber = randomNumber(1, 120)
  
  const businessName = generateBusinessName(firstName, lastName, profession)
  // Use transliterated names for email
  const emailFirstName = transliterate(firstName)
  const emailLastName = transliterate(lastName)
  const email = `${emailFirstName}.${emailLastName}.${index}@bul-demo.com`
  const phone = generatePhone()
  
  return {
    email,
    business_name: businessName,
    gender: 'male',
    role: categoryData.serviceType === 'retail' ? 'store' : 'professional',
    service_type: categoryData.serviceType as ProfessionalData['service_type'],
    city,
    address: `רח' ${street} ${streetNumber}`,
    phone,
    whatsapp: phone.replace('-', ''),
    description: generateDescription(profession, city),
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // 3.5-5.0
    review_count: randomNumber(5, 300),
    is_verified: Math.random() > 0.3, // 70% verified
    is_active: true,
    categories: [categoryData.category],
    avatar_url: generateAvatarUrl(firstName, lastName),
    media_urls: [],
    opening_hours: generateOpeningHours(),
  }
}

// =====================================================
// SEED EXECUTION
// =====================================================

async function seed(count: number = 200) {
  console.log(`🌱 Starting seed process for ${count} professionals...\n`)
  
  let created = 0
  let errors = 0
  
  for (let i = 0; i < count; i++) {
    const professional = generateProfessional(i)
    
    // Show progress every 10
    if (i % 10 === 0) {
      console.log(`📊 Progress: ${i}/${count}`)
    }
    
    // Check if exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', professional.email)
      .single()
    
    if (existing) {
      continue
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: professional.email,
      password: 'DemoPassword123!',
      email_confirm: true,
    })
    
    if (authError) {
      if (i < 5) {
        console.log(`   ❌ Auth error for ${professional.business_name}: ${authError.message}`)
      }
      errors++
      continue
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        ...professional,
      })
    
    if (profileError) {
      errors++
      await supabase.auth.admin.deleteUser(authData.user.id)
    } else {
      created++
    }
    
    // Rate limit - small delay
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n🎉 Seed completed!`)
  console.log(`   ✅ Created: ${created}`)
  console.log(`   ❌ Errors: ${errors}`)
  
  // Verify
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('city, categories')
  
  if (allProfiles) {
    console.log(`\n📊 Total profiles in database: ${allProfiles.length}`)
    
    // Group by city
    const byCityCount: Record<string, number> = {}
    allProfiles.forEach(p => {
      byCityCount[p.city] = (byCityCount[p.city] || 0) + 1
    })
    
    console.log('\n🏙️ Profiles by city:')
    Object.entries(byCityCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([city, count]) => {
        console.log(`   ${city}: ${count}`)
      })
  }
}

// Run
const count = parseInt(process.argv[2] || '200')
seed(count).catch(console.error)
