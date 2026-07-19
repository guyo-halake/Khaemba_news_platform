import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/types'
import { Clock, Eye } from 'lucide-react'

interface ArticleCardProps {
  article: Article
  variant?: 'hero' | 'grid' | 'horizontal'
}

export default function ArticleCard({ article, variant = 'grid' }: ArticleCardProps) {
  const { title, slug, excerpt, featured_image_url, category, published_at, view_count } = article
  
  // Format published date
  const dateStr = published_at 
    ? new Date(published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Draft'

  // Get accent color for category
  const categoryColor = category?.accent_color || '#D99A3F'

  if (variant === 'hero') {
    return (
      <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="lg:col-span-7 relative h-[250px] sm:h-[350px] lg:h-[420px] overflow-hidden">
          <Image
            src={featured_image_url}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 group-hover:scale-103"
          />
          <div className="absolute top-4 left-4">
            <span
              style={{ backgroundColor: categoryColor }}
              className="text-[10px] font-mono font-bold text-white px-2.5 py-1 rounded shadow-sm uppercase tracking-wider"
            >
              {category?.name || 'News'}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs font-mono text-ink-navy/60 dark:text-gray-400">
              <span>{dateStr}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{view_count} views</span>
              </span>
            </div>
            
            <Link href={`/articles/${slug}`} className="block">
              <h2 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-ink-navy dark:text-paper-warm leading-tight group-hover:text-amber transition-colors duration-200">
                {title}
              </h2>
            </Link>

            <p className="text-sm text-ink-navy/75 dark:text-gray-300 leading-relaxed">
              {excerpt}
            </p>
          </div>

          <div className="pt-6 border-t border-ink-navy/5 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-ink-navy/50 dark:text-gray-400">
              By {article.author?.full_name || 'Khaemba Staff'}
            </span>
            <Link
              href={`/articles/${slug}`}
              className="text-xs font-bold text-amber hover:text-amber-hover transition-colors flex items-center space-x-1"
            >
              <span>Read Article</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex space-x-4 bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-ink-navy/5 dark:border-gray-800/40 hover:border-ink-navy/15 dark:hover:border-gray-700 transition-colors duration-200">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded">
          <Image
            src={featured_image_url}
            alt={title}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-between py-1 w-full">
          <div className="space-y-1">
            <span
              style={{ color: categoryColor }}
              className="text-[9px] font-mono font-bold uppercase tracking-wider"
            >
              {category?.name || 'News'}
            </span>
            <Link href={`/articles/${slug}`} className="block">
              <h3 className="font-headline font-bold text-sm sm:text-base text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-ink-navy/50 dark:text-gray-500">
            <span>{dateStr}</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{view_count}</span>
            </span>
          </div>
        </div>
      </article>
    )
  }

  // Default: Grid Card
  return (
    <article className="group flex flex-col bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <Image
          src={featured_image_url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-750 group-hover:scale-104"
        />
        <div className="absolute top-3 left-3">
          <span
            style={{ backgroundColor: categoryColor }}
            className="text-[9px] font-mono font-bold text-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wider"
          >
            {category?.name || 'News'}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between p-5 flex-grow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[10px] font-mono text-ink-navy/55 dark:text-gray-400">
            <span>{dateStr}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{view_count} views</span>
            </span>
          </div>

          <Link href={`/articles/${slug}`} className="block">
            <h3 className="font-headline font-bold text-lg sm:text-xl text-ink-navy dark:text-paper-warm leading-tight group-hover:text-amber transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          <p className="text-xs text-ink-navy/70 dark:text-gray-300 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-ink-navy/5 dark:border-gray-800 flex items-center justify-between text-[11px]">
          <span className="font-mono text-ink-navy/50 dark:text-gray-500">
            By {article.author?.full_name || 'Staff Writer'}
          </span>
          <Link
            href={`/articles/${slug}`}
            className="font-bold text-amber hover:text-amber-hover transition-colors"
          >
            Read More &rarr;
          </Link>
        </div>
      </div>
    </article>
  )
}
