export interface Ad {
  id: string
  title: string
  description: string
  image_url: string
  link_url: string
  placement: 'sidebar' | 'feed'
  advertiser_name?: string
}

export const MOCK_ADS: Ad[] = [
  {
    id: '1',
    title: 'הלוואות לכל מטרה',
    description: 'ריביות אטרקטיביות ופריסת תשלומים נוחה ללקוחות בול.',
    image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60',
    link_url: '#',
    placement: 'sidebar',
    advertiser_name: 'בנק הקהילה'
  },
  {
    id: '2',
    title: 'ריהוט יוקרה לבית',
    description: 'מבצעי סוף שנה על כל מחלקת הסלונים. משלוח חינם!',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
    link_url: '#',
    placement: 'feed',
    advertiser_name: 'רהיטי פאר'
  },
  {
    id: '3',
    title: 'ביטוח משכנתא',
    description: 'ההצעה המשתלמת ביותר בשוק. בדקו אותנו.',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=60',
    link_url: '#',
    placement: 'sidebar',
    advertiser_name: 'ביטוח ישיר'
  },
  {
    id: '4',
    title: 'קורס תכנות לגברים',
    description: 'הכשרה מעשית והשמה בחברות מובילות. מסלול ערב.',
    image_url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60',
    link_url: '#',
    placement: 'feed',
    advertiser_name: 'TechCode'
  }
]
