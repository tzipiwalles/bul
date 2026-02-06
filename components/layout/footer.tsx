'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('footer')
  
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="Kanash" 
                className="h-8 w-8 object-contain rounded-lg shadow-sm"
              />
              <span className="text-xl font-bold text-primary">{t('description').substring(0, 5) === 'The l' ? 'Kanash' : 'קנ"ש'}</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t('description')}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('quickNav')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/search" className="hover:text-primary transition-colors">{t('searchProfessionals')}</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">{t('categories')}</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">{t('registerBusiness')}</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">{t('personalArea')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('supportAndInfo')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-primary transition-colors">{t('aboutKanash')}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t('contactUs')}</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">{t('termsAndPrivacy')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t('contactTitle')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>info@kanash.co.il</li>
              <li>{t('location')}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">{t('copyright')}</p>
          <div className="flex gap-4">
            {/* Social icons placeholder */}
          </div>
        </div>
      </div>
    </footer>
  )
}
