'use client'

import { motion } from 'framer-motion'
import { Shield, Scale, Camera, Bot, Heart, Copyright, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  const sections = [
    {
      icon: Shield,
      title: 'מהות הפלטפורמה',
      content: 'קנ"ש היא פלטפורמת Discovery (גילוי) שנועדה לחבר בין צרכנים לבעלי עסקים מהמגזר החרדי. האתר משמש כלוח מודעות חכם בלבד.',
    },
    {
      icon: Scale,
      title: 'אי-אחריות מקצועית',
      content: 'הנהלת האתר אינה צד בכל עסקה, הסכם או התקשרות שייחתמו בין המשתמש לבין בעל העסק. כל אחריות על טיב השירות, איכות המוצר, עמידה בלוחות זמנים או תשלומים חלה על הצדדים לעסקה בלבד.',
    },
    {
      icon: Camera,
      title: 'אמינות המידע',
      content: 'כל התכנים, התמונות והסרטונים מועלים על ידי בעלי העסקים ובאחריותם הבלעדית. האתר אינו בודק את אמינות המצגים או את ההסמכות המקצועיות של המפרסמים.',
    },
    {
      icon: Bot,
      title: 'שימוש בטכנולוגיית AI',
      content: 'האתר עושה שימוש בכלי בינה מלאכותית (AI) לחיפוש והתאמת שירותים. ייתכנו אי-דיוקים בתוצאות החיפוש או בהמלצות הצ\'אט, והשימוש בהם הוא באחריות המשתמש.',
    },
    {
      icon: Heart,
      title: 'ערכי הקהילה וסינון תוכן',
      content: 'חל איסור מוחלט על העלאת תוכן שאינו הולם את רוח הקהילה החרדית, לרבות תמונות נשים או שפה שאינה נאותה. הנהלת האתר שומרת לעצמה את הזכות להסיר כל תוכן ללא הודעה מוקדמת.',
    },
    {
      icon: Copyright,
      title: 'קניין רוחני',
      content: 'המשתמש מצהיר כי הוא בעל הזכויות בכל מדיה (תמונה/וידאו) שהוא מעלה לאתר. העלאת תוכן שאינו בבעלות המשתמש מהווה הפרה של תנאי השימוש.',
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
          תנאי שימוש והצהרת אי-אחריות
        </h1>
        <p className="text-lg text-gray-600">
          פלטפורמת קנ"ש - קהילת נותני שירות
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
          ברוכים הבאים לפלטפורמת קנ"ש. השימוש באתר מהווה הסכמה לתנאים המפורטים להלן. 
          אנא קראו בעיון את תנאי השימוש לפני השימוש באתר.
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
        <h3 className="text-xl font-bold text-gray-900 mb-3">יש לכם שאלות?</h3>
        <p className="text-gray-600 mb-6">
          לכל שאלה או הבהרה בנוגע לתנאי השימוש, אנא צרו עמנו קשר
        </p>
        <Link href="/contact">
          <Button variant="outline" size="lg">
            צור קשר
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
        עודכן לאחרונה: פברואר 2026
      </motion.p>
    </div>
  )
}
