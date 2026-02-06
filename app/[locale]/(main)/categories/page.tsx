import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">כל הקטגוריות</h1>
          <p className="text-gray-500">בחר קטגוריה כדי למצוא בעלי מקצוע</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => (
          <Link 
            key={category.id}
            href={`/search?category=${category.id}`}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
