import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format phone number for WhatsApp link (Israel format)
 */
export function formatWhatsAppLink(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  // Add Israel country code if not present
  const withCountry = cleaned.startsWith('972') ? cleaned : `972${cleaned.replace(/^0/, '')}`
  return `https://wa.me/${withCountry}`
}

/**
 * Format phone number for tel: link
 */
export function formatPhoneLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  return `tel:+972${cleaned.replace(/^0/, '')}`
}

/**
 * Format address for Waze navigation
 */
export function formatWazeLink(address: string, city: string): string {
  const query = encodeURIComponent(`${address}, ${city}, Israel`)
  return `https://waze.com/ul?q=${query}&navigate=yes`
}

/**
 * Get service type display name in Hebrew
 */
export function getServiceTypeLabel(serviceType: string): string {
  const labels: Record<string, string> = {
    appointment: 'תורים',
    project: 'פרויקטים',
    emergency: 'חירום',
    retail: 'חנות/מסעדה',
  }
  return labels[serviceType] || serviceType
}

/**
 * Get CTA text based on service type
 */
export function getCTAText(serviceType: string): string {
  const ctaTexts: Record<string, string> = {
    appointment: 'קביעת תור',
    project: 'תיאום פגישה',
    emergency: 'התקשר עכשיו',
    retail: 'נווט לעסק',
  }
  return ctaTexts[serviceType] || 'צור קשר'
}
