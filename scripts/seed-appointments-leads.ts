import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Hebrew first names
const FIRST_NAMES_MALE = ['אברהם', 'יצחק', 'יעקב', 'משה', 'אהרן', 'דוד', 'שלמה', 'יוסף', 'בנימין', 'שמעון', 'לוי', 'יהודה', 'דניאל', 'אליהו', 'חיים', 'מאיר', 'נחמן', 'צבי', 'ישראל', 'מנחם']
const FIRST_NAMES_FEMALE = ['שרה', 'רבקה', 'רחל', 'לאה', 'מרים', 'חנה', 'דבורה', 'אסתר', 'רות', 'נעמי', 'ציפורה', 'בתיה', 'מלכה', 'פייגא', 'גיטל', 'חיה', 'ריבקה', 'שושנה', 'פנינה', 'יוכבד']
const LAST_NAMES = ['כהן', 'לוי', 'ישראלי', 'פרידמן', 'גולדשטיין', 'רוזנברג', 'שפירא', 'קליין', 'שוורץ', 'וייס', 'הורוביץ', 'ברגר', 'פישמן', 'גרינברג', 'זילברמן', 'אדלר', 'שטיין', 'בלום', 'קצנלבוגן', 'אשכנזי']

// Messages by category
const LEADS_BY_CATEGORY: Record<string, string[]> = {
  'בריאות': [
    'שלום, אשמח לקבוע תור לבדיקה',
    'מחפש/ת רופא לייעוץ, מתי יש לכם פנוי?',
    'האם מקבלים מבוטחי קופת חולים?',
    'צריך/ה המלצה לטיפול, אפשר לדבר?',
  ],
  'יופי וטיפוח': [
    'היי, רוצה לקבוע תור לתספורת',
    'מעוניינת בטיפול פנים, מה המחירון?',
    'האם יש לך פנוי השבוע?',
    'מחפשת מניקור פדיקור לאירוע',
  ],
  'בית ושיפוצים': [
    'צריך הצעת מחיר לשיפוץ מטבח',
    'מחפש שיפוצניק לדירה 4 חדרים',
    'דלת נשברה, האם אתה יכול לבוא לתקן?',
    'מעוניין בצביעת דירה, מה העלויות?',
  ],
  'חינוך והוראה': [
    'מחפש מורה פרטי למתמטיקה לבן שלי',
    'האם יש שיעורים קבוצתיים?',
    'מעוניינת בהכנה לבגרות באנגלית',
    'כמה עולה שיעור פרטי?',
  ],
  'טכנולוגיה': [
    'המחשב לא נדלק, אפשר עזרה?',
    'צריך להקים אתר לעסק שלי',
    'מעוניין בתמיכה טכנית קבועה',
    'האם אתה מתקן גם מחשבים ניידים?',
  ],
  'אירועים ושמחות': [
    'מתכננים בר מצווה, מחפשים הצעת מחיר',
    'האם אתם פנויים בתאריך X?',
    'כמה עולה אולם ל-200 מוזמנים?',
    'מעוניינים בקייטרינג לשבת חתן',
  ],
  'צילום ווידאו': [
    'מחפש צלם לחתונה',
    'כמה עולה צילום בר מצווה?',
    'האם יש לך תיק עבודות?',
    'מעוניינת בצילומי משפחה',
  ],
  'משפטי ופיננסי': [
    'צריך ייעוץ משפטי בנושא נדל"ן',
    'מחפש רואה חשבון לעסק קטן',
    'האם אתה מטפל בתיקי גירושין?',
    'צריך עזרה בהגשת מס הכנסה',
  ],
  'הסעות ותחבורה': [
    'צריך הסעה לחתונה ב-',
    'מחפש הסעות לבית ספר',
    'כמה עולה הסעה לשדה התעופה?',
    'האם יש לכם אוטובוס ל-50 נוסעים?',
  ],
  'מזון ומסעדות': [
    'האם יש משלוחים לאזור שלי?',
    'מעוניין להזמין קייטרינג לשבת',
    'מה תפריט האוכל המוכן?',
    'האם הכל בהכשר מהודר?',
  ],
}

// Default messages for categories not listed
const DEFAULT_LEAD_MESSAGES = [
  'שלום, מעוניין/ת בשירותים שלכם',
  'האם אפשר לקבל פרטים נוספים?',
  'מחפש/ת הצעת מחיר',
  'מתי אפשר לתאם פגישה?',
  'האם אתם עובדים באזור שלי?',
]

// Appointment notes by service type
const APPOINTMENT_NOTES: Record<string, string[]> = {
  'appointment': [
    'תור ראשון',
    'לקוח חוזר',
    'ביקש/ה תור מוקדם',
    'הגיע/ה בהמלצה',
    '',
    '',
  ],
  'project': [
    'פגישת הערכה',
    'הצגת הצעת מחיר',
    'סיור באתר',
    'פגישת סגירה',
  ],
  'emergency': [
    'קריאת חירום',
    'תיקון דחוף',
    '',
  ],
  'retail': [
    'איסוף הזמנה',
    'התאמה ומדידה',
    'החלפה',
    '',
  ],
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPhone(): string {
  const prefixes = ['050', '052', '053', '054', '055', '058']
  const prefix = randomItem(prefixes)
  const number = Math.floor(Math.random() * 9000000) + 1000000
  return `${prefix}-${number}`
}

function randomDate(daysFromNow: number, daysRange: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow + Math.floor(Math.random() * daysRange))
  return date.toISOString().split('T')[0]
}

function randomTime(): string {
  const hours = Math.floor(Math.random() * 10) + 8 // 8:00 - 18:00
  const minutes = randomItem(['00', '15', '30', '45'])
  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

function getLeadMessages(category: string): string[] {
  return LEADS_BY_CATEGORY[category] || DEFAULT_LEAD_MESSAGES
}

async function seedAppointmentsAndLeads() {
  console.log('🌱 Starting to seed appointments and leads...\n')

  // Get all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, business_name, gender, service_type, categories')
    .eq('is_active', true)

  if (profilesError || !profiles) {
    console.error('Error fetching profiles:', profilesError)
    return
  }

  console.log(`Found ${profiles.length} active profiles\n`)

  let totalAppointments = 0
  let totalLeads = 0

  for (const profile of profiles) {
    const category = profile.categories?.[0] || 'אחר'
    const serviceType = profile.service_type || 'project'
    const leadMessages = getLeadMessages(category)
    const appointmentNotes = APPOINTMENT_NOTES[serviceType] || APPOINTMENT_NOTES['project']

    // Determine number of appointments and leads (random 0-5 each)
    const numAppointments = Math.floor(Math.random() * 5)
    const numLeads = Math.floor(Math.random() * 4)

    // Create appointments
    for (let i = 0; i < numAppointments; i++) {
      const isMale = Math.random() > 0.5
      const firstName = isMale ? randomItem(FIRST_NAMES_MALE) : randomItem(FIRST_NAMES_FEMALE)
      const lastName = randomItem(LAST_NAMES)
      
      const appointment = {
        profile_id: profile.id,
        customer_name: `${firstName} ${lastName}`,
        customer_phone: randomPhone(),
        requested_date: randomDate(-3, 14), // From 3 days ago to 11 days from now
        requested_time: randomTime(),
        status: randomItem(['pending', 'pending', 'confirmed', 'confirmed', 'completed']),
        notes: randomItem(appointmentNotes),
      }

      const { error } = await supabase.from('appointments').insert(appointment)
      if (error) {
        console.error(`Error creating appointment for ${profile.business_name}:`, error.message)
      } else {
        totalAppointments++
      }
    }

    // Create leads
    for (let i = 0; i < numLeads; i++) {
      const isMale = Math.random() > 0.5
      const firstName = isMale ? randomItem(FIRST_NAMES_MALE) : randomItem(FIRST_NAMES_FEMALE)
      const lastName = randomItem(LAST_NAMES)
      
      const lead = {
        profile_id: profile.id,
        customer_name: `${firstName} ${lastName}`,
        customer_phone: randomPhone(),
        customer_email: Math.random() > 0.5 ? `${firstName.toLowerCase()}@email.com` : null,
        message: randomItem(leadMessages),
        status: randomItem(['new', 'new', 'new', 'contacted', 'converted']),
      }

      const { error } = await supabase.from('leads').insert(lead)
      if (error) {
        console.error(`Error creating lead for ${profile.business_name}:`, error.message)
      } else {
        totalLeads++
      }
    }

    if (numAppointments > 0 || numLeads > 0) {
      console.log(`✅ ${profile.business_name}: ${numAppointments} appointments, ${numLeads} leads`)
    }
  }

  console.log(`\n🎉 Done! Created ${totalAppointments} appointments and ${totalLeads} leads`)
}

seedAppointmentsAndLeads().catch(console.error)
