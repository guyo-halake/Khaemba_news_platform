'use client'

import { useState } from 'react'
import { Video, Category } from '@/lib/types'
import VideoCard from './VideoCard'
import { Play, Filter, Clock, Eye, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface DocumentariesHubProps {
  initialVideos: Video[]
  categories: Category[]
}

export default function DocumentariesHub({ initialVideos, categories }: DocumentariesHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDuration, setSelectedDuration] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest')

  // Find featured video (most viewed or first published)
  const featuredVideo = initialVideos[0]

  // Filter and sort videos
  const filteredVideos = initialVideos
    .filter(vid => {
      // Category Filter
      const matchesCategory = selectedCategory === 'all' || vid.category_id === selectedCategory
      
      // Duration Filter
      let matchesDuration = true
      if (selectedDuration === 'short') {
        matchesDuration = vid.duration_seconds < 900 // < 15 mins
      } else if (selectedDuration === 'medium') {
        matchesDuration = vid.duration_seconds >= 900 && vid.duration_seconds <= 1800 // 15-30 mins
      } else if (selectedDuration === 'feature') {
        matchesDuration = vid.duration_seconds > 1800 // > 30 mins
      }

      return matchesCategory && matchesDuration
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.view_count - a.view_count
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-12">
      {/* 1. FEATURED DOCUMENTARY HERO */}
      {featuredVideo && (
        <section className="bg-ink-navy dark:bg-gray-950 rounded-xl overflow-hidden shadow-xl border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Thumbnail & Play Overlay */}
            <div className="lg:col-span-7 relative aspect-video bg-black group overflow-hidden">
              <Image
                src={featuredVideo.thumbnail_url}
                alt={featuredVideo.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-103 group-hover:opacity-90"
              />
              <Link href={`/documentaries/${featuredVideo.slug}`} className="absolute inset-0 flex items-center justify-center">
                <div className="p-5 bg-amber hover:bg-amber-hover text-ink-navy rounded-full transform scale-95 group-hover:scale-100 transition-all shadow-2xl duration-300">
                  <Play className="w-8 h-8 fill-ink-navy ml-1" />
                </div>
              </Link>
              <div className="absolute bottom-4 right-4 bg-black/85 text-white text-xs font-mono px-3 py-1 rounded flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber" />
                <span>{formatDuration(featuredVideo.duration_seconds)}</span>
              </div>
            </div>

            {/* Right: Info Box */}
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between text-paper-warm">
              <div className="space-y-4">
                <span className="flex items-center space-x-1.5 text-amber text-xs font-mono font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber animate-pulse" />
                  <span>Featured Documentary</span>
                </span>
                
                <h2 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                  {featuredVideo.title}
                </h2>
                
                <p className="text-sm text-paper-warm/85 leading-relaxed font-light">
                  {featuredVideo.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-paper-warm/60">
                <span className="flex items-center space-x-1.5">
                  <Eye className="w-4 h-4 text-amber" />
                  <span>{featuredVideo.view_count.toLocaleString()} views</span>
                </span>
                <Link
                  href={`/documentaries/${featuredVideo.slug}`}
                  className="bg-amber text-ink-navy hover:bg-amber-hover transition-colors font-bold px-4 py-2.5 rounded font-sans uppercase tracking-wider"
                >
                  Watch Documentary
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. FILTERS AND CONTROLS */}
      <section className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-ink-navy dark:text-paper-warm border-b border-ink-navy/10 dark:border-gray-800 pb-3">
          <Filter className="w-4 h-4 text-amber" />
          <span>Filter & Sort Documentaries</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          {/* Category Chips */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Category</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-xs px-3.5 py-1.5 rounded transition-colors font-mono ${
                  selectedCategory === 'all'
                    ? 'bg-amber text-ink-navy font-bold shadow-sm'
                    : 'bg-paper-warm/60 dark:bg-gray-800 hover:bg-amber/15 dark:hover:bg-gray-700 text-ink-navy dark:text-paper-warm'
                }`}
              >
                ALL
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded transition-colors font-mono ${
                    selectedCategory === cat.id
                      ? 'bg-amber text-ink-navy font-bold shadow-sm'
                      : 'bg-paper-warm/60 dark:bg-gray-800 hover:bg-amber/15 dark:hover:bg-gray-700 text-ink-navy dark:text-paper-warm'
                  }`}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Chips */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Duration</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'ALL' },
                { id: 'short', label: 'SHORT (<15m)' },
                { id: 'medium', label: 'MEDIUM (15-30m)' },
                { id: 'feature', label: 'FEATURE (>30m)' }
              ].map(dur => (
                <button
                  key={dur.id}
                  onClick={() => setSelectedDuration(dur.id)}
                  className={`text-xs px-3.5 py-1.5 rounded transition-colors font-mono ${
                    selectedDuration === dur.id
                      ? 'bg-amber text-ink-navy font-bold shadow-sm'
                      : 'bg-paper-warm/60 dark:bg-gray-800 hover:bg-amber/15 dark:hover:bg-gray-700 text-ink-navy dark:text-paper-warm'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2 lg:w-48">
            <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs w-full bg-paper-warm/60 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded px-3 py-2 text-ink-navy dark:text-paper-warm outline-none focus:border-amber"
            >
              <option value="newest">Newest Releases</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. DOCUMENTARIES LIST GRID */}
      <section className="space-y-6">
        <h3 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm">
          All Documentaries ({filteredVideos.length})
        </h3>
        
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-ink-navy/10 dark:border-gray-800 rounded bg-white dark:bg-gray-900/50">
            <p className="text-sm font-mono text-ink-navy/50 dark:text-gray-500">
              No documentaries match the chosen filters. Try widening your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map(vid => (
              <VideoCard key={vid.id} video={vid} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
