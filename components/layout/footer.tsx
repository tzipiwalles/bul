import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="קנ״ש" 
                className="h-8 w-8 object-contain rounded-lg shadow-sm"
              />
              <span className="text-xl font-bold text-primary">קנ"ש</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              הפלטפורמה המובילה לחיפוש בעלי מקצוע אמינים בקהילה החרדית.
              מחברים בין לקוחות לשירותים באמינות, מקצועיות וצניעות.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">ניווט מהיר</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/search" className="hover:text-primary transition-colors">חיפוש בעלי מקצוע</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">קטגוריות</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">הרשמת בעלי עסקים</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">אזור אישי</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">תמיכה ומידע</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-primary transition-colors">אודות קנ"ש</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">צור קשר</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">תקנון ומדיניות פרטיות</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">צור קשר</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>info@kanash.co.il</li>
              <li>ירושלים, ישראל</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2026 קנ"ש. כל הזכויות שמורות.</p>
          <div className="flex gap-4">
            {/* Social icons placeholder - can be added later if relevant */}
          </div>
        </div>
      </div>
    </footer>
  )
}
