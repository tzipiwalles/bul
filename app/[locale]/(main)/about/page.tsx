'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Target, Users, Shield, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const t = useTranslations('about')
  
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
      </div>

      {/* Hero */}
      <div className="bg-primary text-white rounded-2xl p-8 md:p-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('subtitle')}
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            {t('intro')}
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('visionTitle')}</h3>
          <p className="text-gray-600 leading-relaxed">
            {t('visionText')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('communityTitle')}</h3>
          <p className="text-gray-600 leading-relaxed">
            {t('communityText')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('trustTitle')}</h3>
          <p className="text-gray-600 leading-relaxed">
            {t('trustText')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('modestyTitle')}</h3>
          <p className="text-gray-600 leading-relaxed">
            {t('modestyText')}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('joinTitle')}</h3>
        <p className="text-gray-600 mb-6">
          {t('joinText')}
        </p>
        <Link href="/register">
          <Button size="lg">{t('joinButton')}</Button>
        </Link>
      </div>
    </div>
  )
}
