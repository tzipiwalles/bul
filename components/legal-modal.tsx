'use client'

import { useState } from 'react'
import { Shield, Scale, Camera, Bot, Heart, Copyright, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface LegalModalProps {
  trigger?: React.ReactNode
  onAccept?: () => void
  showAcceptButton?: boolean
}

export function LegalModal({ trigger, onAccept, showAcceptButton = false }: LegalModalProps) {
  const [open, setOpen] = useState(false)

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
      content: 'המשתמש מצהיר כי הוא בעל הזכויות בכל מדיה (תמונה/וידאו) שהוא מעלה לאתר.',
    },
  ]

  const handleAccept = () => {
    setOpen(false)
    onAccept?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="text-primary hover:underline text-sm">
            תנאי השימוש
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-5 w-5 text-primary" />
            תנאי שימוש והצהרת אי-אחריות
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-6 px-6 py-4">
          <p className="text-gray-600 mb-6 text-sm">
            השימוש באתר מהווה הסכמה לתנאים המפורטים להלן:
          </p>

          <div className="space-y-4">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <div
                  key={section.title}
                  className="bg-gray-50 rounded-xl p-4"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {index + 1}. {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showAcceptButton && (
          <div className="pt-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              סגור
            </Button>
            <Button onClick={handleAccept}>
              אני מסכים/ה לתנאי השימוש
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// AI Disclaimer component for search inputs
export function AIDisclaimer() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
      <Bot className="h-3 w-3" />
      <span>התוצאות מופקות באמצעות AI ומיועדות לגילוי שירותים בלבד</span>
    </div>
  )
}

// Terms consent checkbox for registration
interface TermsConsentProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}

export function TermsConsent({ checked, onChange, error }: TermsConsentProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm text-gray-600 leading-relaxed">
          אני מסכים/ה ל
          <LegalModal
            trigger={
              <button type="button" className="text-primary hover:underline mx-1">
                תנאי השימוש
              </button>
            }
          />
          ומאשר/ת שהעסק שלי תואם את ערכי הקהילה החרדית
        </span>
      </label>
      {error && (
        <p className="text-sm text-red-500 mr-7">{error}</p>
      )}
    </div>
  )
}
