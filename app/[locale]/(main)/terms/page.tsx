'use client'

import { motion } from 'framer-motion'
import { Shield, Scale, Camera, Bot, Heart, Copyright, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  const t = useTranslations('terms')

  const sections = [
    {
      icon: Shield,
      title: t('platformNature'),
      content: t('platformNatureText'),
    },
    {
      icon: Scale,
      title: t('noLiability'),
      content: t('noLiabilityText'),
    },
    {
      icon: Camera,
      title: t('infoReliability'),
      content: t('infoReliabilityText'),
    },
    {
      icon: Bot,
      title: t('aiUsage'),
      content: t('aiUsageText'),
    },
    {
      icon: Heart,
      title: t('communityValues'),
      content: t('communityValuesText'),
    },
    {
      icon: Copyright,
      title: t('intellectualProperty'),
      content: t('intellectualPropertyText'),
    },
  ]

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <Scale className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('pageTitle')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('pageSubtitle')}
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8"
      >
        <p className="text-gray-700 leading-relaxed">
          {t('intro')} {t('readCarefully')}
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {index + 1}. {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-gray-50 rounded-2xl p-8 text-center"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('questionsTitle')}</h3>
        <p className="text-gray-600 mb-6">
          {t('questionsText')}
        </p>
        <Link href="/contact">
          <Button variant="outline" size="lg">
            {t('contactLink')}
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Last Updated */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-gray-400 mt-8"
      >
        {t('lastUpdated')}
      </motion.p>
    </div>
  )
}
