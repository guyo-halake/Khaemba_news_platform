"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/types'
import { Clock, Eye, Heart, Bookmark } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ArticleCardProps {
  article: Article
  variant?: 'hero' | 'grid' | 'horizontal'
  cardStyle?: 'minimalist' | 'bold' | 'editorial'
}

export default function ArticleCard({ article, variant = 'grid', cardStyle = 'minimalist' }: ArticleCardProps) {
  const { title, slug, excerpt, featured_image_url, category, published_at, view_count, id } = article
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [stylePreference, setStylePreference] = useState(cardStyle)

  useEffect(() => {
    const savedCardStyle = localStorage.getItem('cardStyle')
    if (savedCardStyle === 'minimalist' || savedCardStyle === 'bold' || savedCardStyle === 'editorial') {
      setStylePreference(savedCardStyle)
    }

    // Load like/save state from localStorage
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]')
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]')
    setIsLiked(likedArticles.includes(id))
    setIsSaved(savedArticles.includes(id))
  }, [id])

  const activeCardStyle = stylePreference

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]')
    if (isLiked) {
      const filtered = likedArticles.filter((art: string) => art !== id)
      localStorage.setItem('likedArticles', JSON.stringify(filtered))
      setIsLiked(false)
    } else {
      likedArticles.push(id)
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles))
      setIsLiked(true)
    }
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]')
    if (isSaved) {
      const filtered = savedArticles.filter((art: string) => art !== id)
      localStorage.setItem('savedArticles', JSON.stringify(filtered))
      setIsSaved(false)
    } else {
      savedArticles.push(id)
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles))
      setIsSaved(true)
    }
  }

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
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-all ${
                  isLiked 
                    ? 'bg-red-100 dark:bg-red-950/30 text-red-500' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-ink-navy/50 dark:text-gray-500'
                }`}
                title="Like this article"
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-all ${
                  isSaved 
                    ? 'bg-amber/20 dark:bg-amber/10 text-amber' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-ink-navy/50 dark:text-gray-500'
                }`}
                title="Save for later"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'horizontal') {
    if (activeCardStyle === 'minimalist') {
    return (
      <article className="group flex space-x-3 py-2 bg-transparent border-none rounded-none shadow-none">
        <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={featured_image_url}
            alt={title}
            fill
            sizes="64px"
            className="object-cover grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-103"
          />
        </div>
        <div className="flex flex-col justify-between py-0.5 w-full">
          <Link href={`/articles/${slug}`} className="block">
            <h3 className="font-sans font-bold text-xs sm:text-sm text-ink-navy dark:text-paper-warm leading-snug hover:underline line-clamp-2">
              {title}
            </h3>
          </Link>
          <span className="text-[8px] font-mono text-gray-500 uppercase">
            {dateStr}
          </span>
        </div>
      </article>
    )
  }

  if (activeCardStyle === 'bold') {
    return (
      <article className="group flex space-x-3 bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-ink-navy/10 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-md">
          <Image
            src={featured_image_url}
            alt={title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-between py-0.5 w-full">
          <div className="space-y-1">
            <span
              style={{ color: categoryColor }}
              className="text-[8px] font-mono font-bold uppercase tracking-wider"
            >
              {category?.name || 'News'}
            </span>
            <Link href={`/articles/${slug}`} className="block">
              <h3 className="font-headline font-bold text-xs sm:text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono text-ink-navy/50 dark:text-gray-500">
            <span>{dateStr}</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-2.5 h-2.5" />
              <span>{view_count}</span>
            </span>
          </div>
        </div>
      </article>
    )
  }

  // Default: Editorial
  return (
    <article className="group flex space-x-3 bg-transparent py-2.5 border-b border-dashed border-ink-navy/15 dark:border-gray-800 rounded-none shadow-none">
      <div className="relative w-18 h-18 shrink-0 overflow-hidden border border-ink-navy/10 dark:border-gray-800 p-0.5">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={featured_image_url}
            alt={title}
            fill
            sizes="72px"
            className="object-cover transition-transform duration-500 group-hover:scale-102"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between py-0.5 w-full font-serif">
        <div className="space-y-0.5">
          <span className="text-[8px] uppercase tracking-widest text-ink-navy/60 dark:text-gray-400 font-bold" style={{ color: categoryColor }}>
            {category?.name || 'News'}
          </span>
          <Link href={`/articles/${slug}`} className="block">
            <h3 className="font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug hover:text-amber transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
        </div>
        <div className="flex justify-between items-center text-[9px] text-ink-navy/50 dark:text-gray-500 font-mono">
          <span>{dateStr}</span>
        </div>
      </div>
    </article>
  )
}

// =========================================================================
// GRID VARIANT (DEFAULT)
// =========================================================================
if (activeCardStyle === 'minimalist') {
  return (
    <article className="group flex flex-col bg-transparent border-none rounded-none shadow-none">
      <div className="relative h-32 sm:h-36 overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
        <Image
          src={featured_image_url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-101"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow space-y-1">
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
          {category?.name || 'News'}
        </span>
        <Link href={`/articles/${slug}`} className="block">
          <h3 className="font-sans font-bold text-sm sm:text-base text-ink-navy dark:text-paper-warm leading-tight hover:underline">
            {title}
          </h3>
        </Link>
        <p className="text-[11px] text-ink-navy/70 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {excerpt}
        </p>
        <div className="pt-2 text-[9px] font-mono text-gray-500">
          {dateStr} • By {article.author?.full_name || 'Staff'}
        </div>
      </div>
    </article>
  )
}

if (activeCardStyle === 'bold') {
  return (
    <article className="group flex flex-col bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative h-36 sm:h-40 overflow-hidden">
        <Image
          src={featured_image_url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-750 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5">
          <span
            style={{ backgroundColor: categoryColor }}
            className="text-[8px] font-mono font-bold text-white px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider"
          >
            {category?.name || 'News'}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-[9px] font-mono text-ink-navy/55 dark:text-gray-400">
            <span>{dateStr}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-2.5 h-2.5" />
              <span>{view_count} views</span>
            </span>
          </div>
          <Link href={`/articles/${slug}`} className="block">
            <h3 className="font-headline font-bold text-sm sm:text-base text-ink-navy dark:text-paper-warm leading-tight group-hover:text-amber transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-[11px] text-ink-navy/70 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        </div>
        <div className="pt-3 mt-3 border-t border-ink-navy/5 dark:border-gray-800 flex items-center justify-between text-[10px]">
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

// Default: Editorial
return (
  <article className="group flex flex-col bg-paper-warm/50 dark:bg-paper-dark/30 border border-ink-navy/15 dark:border-gray-800 p-3 rounded-none shadow-none">
    <div className="relative h-32 sm:h-36 border border-ink-navy/10 dark:border-gray-800 p-0.5 mb-3">
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={featured_image_url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-750 group-hover:scale-102"
        />
      </div>
    </div>
    <div className="flex flex-col justify-between flex-grow font-serif">
      <div className="space-y-1.5">
        <span className="text-[8px] uppercase tracking-widest text-ink-navy/70 dark:text-gray-400 font-bold" style={{ color: categoryColor }}>
          {category?.name || 'News'}
        </span>
        <Link href={`/articles/${slug}`} className="block">
          <h3 className="font-black text-sm sm:text-base text-ink-navy dark:text-paper-warm leading-tight hover:text-amber transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-[11px] font-serif text-ink-navy/80 dark:text-gray-300 leading-relaxed italic line-clamp-2">
          {excerpt}
        </p>
      </div>
      <div className="pt-2 mt-3 border-t border-dashed border-ink-navy/15 dark:border-gray-800 flex items-center justify-between text-[10px]">
        <span className="text-ink-navy/55 dark:text-gray-500">
          By <span className="font-bold">{article.author?.full_name || 'Staff Writer'}</span>
        </span>
        <span className="font-mono text-[9px] text-ink-navy/40">
          {dateStr}
        </span>
      </div>
    </div>
  </article>
)
}
