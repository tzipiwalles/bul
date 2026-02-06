'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

export default function PrivacyPage() {
  const t = useTranslations('privacy')

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 prose prose-gray max-w-none">
        <p className="text-sm text-gray-500 mb-6">{t('lastUpdated')}</p>

        <h2>{t('intro_title')}</h2>
        <p>{t('intro_text')}</p>

        <h2>{t('collect_title')}</h2>
        <p>{t('collect_text')}</p>
        <ul>
          {t('collect_items').split('|').map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2>{t('use_title')}</h2>
        <p>{t('use_text')}</p>
        <ul>
          {t('use_items').split('|').map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2>{t('sharing_title')}</h2>
        <p>{t('sharing_text')}</p>
        <ul>
          {t('sharing_items').split('|').map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2>{t('security_title')}</h2>
        <p>{t('security_text')}</p>

        <h2>{t('cookies_title')}</h2>
        <p>{t('cookies_text')}</p>

        <h2>{t('rights_title')}</h2>
        <p>{t('rights_text')}</p>
        <ul>
          {t('rights_items').split('|').map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h2>{t('retention_title')}</h2>
        <p>{t('retention_text')}</p>

        <h2>{t('changes_title')}</h2>
        <p>{t('changes_text')}</p>

        <h2>{t('contact_title')}</h2>
        <p>
          {t('contact_text')}{' '}
          <a href="mailto:privacy@bul.co.il" className="text-primary hover:underline">privacy@bul.co.il</a>
        </p>
      </div>
    </div>
  )
}
