// All cities in Israel - sorted alphabetically in Hebrew
export const CITIES = [
  'אבו גוש',
  'אופקים',
  'אור יהודה',
  'אור עקיבא',
  'אילת',
  'אלעד',
  'אריאל',
  'אשדוד',
  'אשקלון',
  'באר יעקב',
  'באר שבע',
  'בית שאן',
  'בית שמש',
  'ביתר עילית',
  'בני ברק',
  'בת ים',
  'גבעת זאב',
  'גבעת שמואל',
  'גבעתיים',
  'גדרה',
  'גני תקווה',
  'דימונה',
  'הוד השרון',
  'הרצליה',
  'זכרון יעקב',
  'חדרה',
  'חולון',
  'חיפה',
  'חריש',
  'טבריה',
  'טירת כרמל',
  'יבנה',
  'יהוד-מונוסון',
  'יקנעם עילית',
  'ירושלים',
  'כפר יונה',
  'כפר סבא',
  'כרמיאל',
  'לוד',
  'מבשרת ציון',
  'מגדל העמק',
  'מודיעין עילית',
  'מודיעין-מכבים-רעות',
  'מעלה אדומים',
  'מעלות-תרשיחא',
  'נהריה',
  'נס ציונה',
  'נצרת',
  'נצרת עילית (נוף הגליל)',
  'נתיבות',
  'נתניה',
  'עכו',
  'עפולה',
  'עראבה',
  'ערד',
  'פתח תקווה',
  'צפת',
  'קדימה-צורן',
  'קרית אונו',
  'קרית אתא',
  'קרית ביאליק',
  'קרית גת',
  'קרית ים',
  'קרית מוצקין',
  'קרית מלאכי',
  'קרית שמונה',
  'ראש העין',
  'ראשון לציון',
  'רהט',
  'רחובות',
  'רמלה',
  'רמת גן',
  'רמת השרון',
  'רעננה',
  'שדרות',
  'שפרעם',
  'תל אביב-יפו',
]

// Categories for the marketplace - matching actual database values
export const CATEGORIES = [
  // בית ושיפוצים
  { id: 'plumbers', name: 'אינסטלטורים', icon: '🔧', description: 'אינסטלציה, צנרת, ביוב' },
  { id: 'electricians', name: 'חשמלאים', icon: '⚡', description: 'חשמל, תאורה, לוחות חשמל' },
  { id: 'renovations', name: 'שיפוצים', icon: '🏠', description: 'שיפוצים, בניה, קבלנות' },
  { id: 'painting', name: 'צביעה', icon: '🎨', description: 'צביעה, טפטים, גבס' },
  { id: 'aircon', name: 'מיזוג אוויר', icon: '❄️', description: 'מזגנים, התקנה, תיקון' },
  { id: 'furniture', name: 'ריהוט', icon: '🛋️', description: 'רהיטים, נגרות, עיצוב' },
  { id: 'cleaning', name: 'ניקיון', icon: '🧹', description: 'ניקיון בתים, משרדים' },
  
  // מזון
  { id: 'food', name: 'מזון', icon: '🍕', description: 'מסעדות, קייטרינג, מזון מוכן' },
  
  // חינוך וילדים
  { id: 'education', name: 'לימוד', icon: '📚', description: 'שיעורים פרטיים, עזרה בלימודים' },
  { id: 'children', name: 'ילדים ונוער', icon: '👶', description: 'הפעלות, חוגים, פעילויות' },
  
  // אירועים ותרבות
  { id: 'events', name: 'אירועים', icon: '🎉', description: 'אולמות, הפקות, שירותי אירועים' },
  { id: 'photography', name: 'צילום', icon: '📸', description: 'צילום, וידאו, עריכה' },
  { id: 'directing', name: 'בימוי והפקה', icon: '🎬', description: 'בימוי, הפקת אירועים ווידאו' },
  { id: 'drama', name: 'דרמה ומשחק', icon: '🎭', description: 'משחק, תיאטרון, דרמה' },
  { id: 'choreography', name: 'כוריאוגרפיה ומחול', icon: '💃', description: 'ריקוד, מחול, כוריאוגרפיה' },
  { id: 'illustration', name: 'איור', icon: '✏️', description: 'איור, ציור, גרפיקה' },
  
  // מקצועות חופשיים
  { id: 'lawyers', name: 'עורכי דין', icon: '⚖️', description: 'ייעוץ משפטי, ליווי משפטי' },
  { id: 'accountants', name: 'רואי חשבון', icon: '📊', description: 'הנהלת חשבונות, מיסים' },
  { id: 'mortgage', name: 'ייעוץ משכנתאות', icon: '🏦', description: 'משכנתאות, ייעוץ פיננסי' },
  { id: 'tax', name: 'החזרי מס ומימוש זכויות', icon: '💰', description: 'מיסים, זכויות, החזרים' },
  { id: 'bookkeeping', name: 'הנהלת חשבונות', icon: '📒', description: 'הנהלת חשבונות, שכר' },
  { id: 'architecture', name: 'אדריכלות ועיצוב פנים', icon: '📐', description: 'אדריכלות, עיצוב פנים' },
  
  // טכנולוגיה
  { id: 'computers', name: 'מחשבים', icon: '💻', description: 'תיקון מחשבים, IT, תוכנה' },
  
  // תחבורה
  { id: 'moving', name: 'הובלות', icon: '🚚', description: 'הובלות, העברות דירה' },
  { id: 'garage', name: 'מוסך', icon: '🚗', description: 'תיקון רכב, טיפולים' },
  
  // אופנה
  { id: 'fashion', name: 'ביגוד', icon: '👔', description: 'חנויות בגדים, תפירה' },
  { id: 'hair', name: 'טיפולי שיער', icon: '💇', description: 'ספרים, עיצוב שיער, פאות' },
  
  // בריאות
  { id: 'health', name: 'רפואה', icon: '🏥', description: 'רופאים, מטפלים, קליניקות' },
  
  // ספרים
  { id: 'books', name: 'ספרים', icon: '📖', description: 'הוצאות ספרים, עיתונים, כתיבה' },
  
  // ייעוץ וטיפול
  { id: 'couples', name: 'ייעוץ זוגי ושלום בית', icon: '💑', description: 'ייעוץ זוגי, שלום בית, גישור' },
  { id: 'parenting', name: 'הדרכת הורים', icon: '👨‍👩‍👧', description: 'הדרכת הורים, חינוך ילדים' },
  { id: 'sleep', name: 'ייעוץ שינה', icon: '😴', description: 'ייעוץ שינה לתינוקות וילדים' },
  { id: 'didactic', name: 'אבחון דידקטי', icon: '🧩', description: 'אבחון לקויות למידה' },
  { id: 'speech', name: 'קלינאות תקשורת וריפוי בעיסוק', icon: '🗣️', description: 'קלינאות תקשורת, ריפוי בעיסוק' },
  { id: 'lactation', name: 'יועצות הנקה', icon: '🍼', description: 'ייעוץ הנקה, ליווי אחרי לידה' },
  
  // פרילנס ושירותי משרד
  { id: 'copywriting', name: 'כתיבה שיווקית וקופירייטינג', icon: '✍️', description: 'קופירייטינג, תוכן שיווקי' },
  { id: 'typing', name: 'קלדנות ותמלול', icon: '⌨️', description: 'קלדנות, תמלול, הקלדה' },
  { id: 'translation', name: 'תרגום', icon: '🌐', description: 'תרגום מסמכים, שפות' },
  { id: 'videoEdit', name: 'עריכת וידאו ומצגות', icon: '🎞️', description: 'עריכת וידאו, מצגות' },
  { id: 'uxui', name: 'אפיון ועיצוב חווית משתמש', icon: '🖌️', description: 'UX/UI, עיצוב אפליקציות' },
  { id: 'webdev', name: 'בניית אתרים ודפי נחיתה', icon: '🌐', description: 'בניית אתרים, דפי נחיתה' },
  { id: 'virtualAssistant', name: 'מזכירות מרחוק וניהול משרד', icon: '📋', description: 'עוזרת אישית, ניהול משרד' },
  
  // שירותי דת
  { id: 'shatnez', name: 'מעבדות שעטנז', icon: '🔬', description: 'בדיקת שעטנז, תיקון בגדים' },
  { id: 'bookbinding', name: 'כריכיות', icon: '📚', description: 'כריכת ספרים, תיקון ספרים' },
]
