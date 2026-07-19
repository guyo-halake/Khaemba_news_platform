'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Article, Video, Category } from '@/lib/types'
import AdWindow from './AdWindow'
import VideoCard from './VideoCard'
import { Eye, Play, ChevronRight, ChevronLeft, Clock, TrendingUp } from 'lucide-react'

interface Props { articles: Article[]; videos: Video[]; categories: Category[] }

function timeAgo(d?: string) {
  if (!d) return ''
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

export default function MagazineHome({ articles, videos }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [slots, setSlots] = useState<{
    leadStoryId?: string
    mosaicId1?: string
    mosaicId2?: string
    mosaicId3?: string
    mosaicId4?: string
    docId1?: string
    docId2?: string
    docId3?: string
  }>({})

  useEffect(() => {
    const saved = localStorage.getItem('homepageSlots')
    if (saved) {
      try {
        setSlots(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const byCategory = (slug: string) => articles.filter(a => a.category?.slug === slug)
  const politics = byCategory('politics')
  const business = byCategory('business')
  const sports = byCategory('sports')
  const national = byCategory('national')
  const opinion = byCategory('opinion')

  const customLead = slots.mosaicId1 ? articles.find(a => a.id === slots.mosaicId1) : (slots.leadStoryId ? articles.find(a => a.id === slots.leadStoryId) : null)
  const lead = customLead || articles[0]

  const customMosaic2 = slots.mosaicId2 ? articles.find(a => a.id === slots.mosaicId2) : null
  const customMosaic3 = slots.mosaicId3 ? articles.find(a => a.id === slots.mosaicId3) : null
  const customMosaic4 = slots.mosaicId4 ? articles.find(a => a.id === slots.mosaicId4) : null

  const heroRight = [
    customMosaic2 || articles[1],
    customMosaic3 || articles[2],
    customMosaic4 || articles[3]
  ].filter(Boolean) as Article[]

  const latest5 = [...articles].sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime()).slice(0, 5)
  const trending = [...articles].sort((a, b) => b.view_count - a.view_count).slice(0, 5)

  // Documentaries slots lookup
  const customDoc1 = slots.docId1 ? videos.find(v => v.id === slots.docId1) : null
  const customDoc2 = slots.docId2 ? videos.find(v => v.id === slots.docId2) : null
  const customDoc3 = slots.docId3 ? videos.find(v => v.id === slots.docId3) : null

  const displayedVideos = [
    customDoc1 || videos[0],
    customDoc2 || videos[1],
    customDoc3 || videos[2]
  ].filter(Boolean) as Video[]

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <main className="flex-grow w-full space-y-10">

      {/* ── 1. HERO MOSAIC ── */}
      {lead && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-auto lg:h-[460px]">
            {/* Lead — left half */}
            <Link href={`/articles/${lead.slug}`} className="group relative block overflow-hidden rounded-xl bg-black h-[300px] lg:h-full">
              <Image src={lead.featured_image_url} alt={lead.title} fill sizes="50vw" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                <span style={{ backgroundColor: lead.category?.accent_color || '#B23A3A' }} className="inline-block text-[9px] font-mono font-black text-white px-2.5 py-1 rounded-full uppercase tracking-wider">{lead.category?.name}</span>
                <h1 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight group-hover:text-amber transition-colors">{lead.title}</h1>
                <p className="text-white/70 text-sm font-serif line-clamp-2 hidden sm:block">{lead.excerpt}</p>
                <div className="flex items-center space-x-3 text-white/50 text-[10px] font-mono">
                  <span>{lead.author?.full_name}</span><span>•</span><span>{timeAgo(lead.published_at)}</span>
                  <span>•</span><span className="flex items-center space-x-1"><Eye className="w-3 h-3" /><span>{lead.view_count.toLocaleString()}</span></span>
                </div>
              </div>
            </Link>

            {/* Right — 3 stacked */}
            <div className="grid grid-rows-3 gap-3 h-[360px] lg:h-full">
              {heroRight.map(art => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="group relative block overflow-hidden rounded-xl bg-black">
                  <Image src={art.featured_image_url} alt={art.title} fill sizes="50vw" className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center p-4">
                    <div className="space-y-1 max-w-[80%]">
                      <span style={{ color: art.category?.accent_color }} className="text-[8px] font-mono font-bold uppercase tracking-wider">{art.category?.name}</span>
                      <h3 className="font-headline font-bold text-sm sm:text-base text-white leading-snug group-hover:text-amber transition-colors line-clamp-2">{art.title}</h3>
                      <p className="text-[9px] font-mono text-white/50">{timeAgo(art.published_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 2. HORIZONTAL LATEST STRIP ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-[10px] font-black tracking-widest text-ink-navy/60 dark:text-gray-400 uppercase flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-amber" /><span>Latest</span>
          </h2>
          <div className="flex space-x-1">
            <button onClick={() => scroll(-1)} className="p-1.5 rounded-full bg-ink-navy/5 dark:bg-gray-800 hover:bg-amber/20 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => scroll(1)} className="p-1.5 rounded-full bg-ink-navy/5 dark:bg-gray-800 hover:bg-amber/20 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div ref={scrollRef} className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {latest5.map(art => (
            <Link key={art.id} href={`/articles/${art.slug}`} className="group flex-none w-[280px] sm:w-[320px] flex space-x-3 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-xl p-3 snap-start hover:shadow-md transition-shadow">
              <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-lg">
                <Image src={art.featured_image_url} alt={art.title} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: art.category?.accent_color }} className="text-[8px] font-mono font-bold uppercase tracking-wider">{art.category?.name}</p>
                <h4 className="font-headline font-bold text-xs text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">{art.title}</h4>
                <p className="text-[9px] font-mono text-ink-navy/40 mt-0.5">{timeAgo(art.published_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. POLITICS: 1 BIG + 2 SMALL ── */}
      {politics.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm flex items-center space-x-2">
              <span className="w-1.5 h-8 bg-category-politics rounded-full inline-block"></span><span>Politics</span>
            </h2>
            <Link href="/category/politics" className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider">More →</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {politics[0] && (
              <Link href={`/articles/${politics[0].slug}`} className="lg:col-span-7 group relative block overflow-hidden rounded-xl bg-black h-[280px] sm:h-[340px]">
                <Image src={politics[0].featured_image_url} alt={politics[0].title} fill sizes="60vw" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <h3 className="font-headline font-black text-xl sm:text-2xl text-white leading-tight group-hover:text-amber transition-colors">{politics[0].title}</h3>
                  <p className="text-white/65 text-xs font-serif line-clamp-2">{politics[0].excerpt}</p>
                  <p className="text-[9px] font-mono text-white/45">{politics[0].author?.full_name} • {timeAgo(politics[0].published_at)}</p>
                </div>
              </Link>
            )}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              {politics.slice(1, 3).map(art => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="group flex space-x-4 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className="relative w-28 h-24 shrink-0 overflow-hidden rounded-lg">
                    <Image src={art.featured_image_url} alt={art.title} fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-category-politics transition-colors line-clamp-2">{art.title}</h3>
                    <p className="text-[10px] text-ink-navy/60 dark:text-gray-400 line-clamp-2 font-serif">{art.excerpt}</p>
                    <p className="text-[9px] font-mono text-ink-navy/40">{art.author?.full_name} • {timeAgo(art.published_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6"><AdWindow position="homepage_top" /></div>

      {/* ── 4. BUSINESS: MIRRORED — 2 SMALL + 1 BIG ── */}
      {business.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm flex items-center space-x-2">
              <span className="w-1.5 h-8 bg-category-business rounded-full inline-block"></span><span>Business</span>
            </h2>
            <Link href="/category/business" className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider">More →</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 grid grid-cols-1 gap-4 order-2 lg:order-1">
              {business.slice(1, 3).map(art => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="group flex space-x-4 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className="relative w-28 h-24 shrink-0 overflow-hidden rounded-lg">
                    <Image src={art.featured_image_url} alt={art.title} fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-category-business transition-colors line-clamp-2">{art.title}</h3>
                    <p className="text-[10px] text-ink-navy/60 dark:text-gray-400 line-clamp-2 font-serif">{art.excerpt}</p>
                    <p className="text-[9px] font-mono text-ink-navy/40">{art.author?.full_name} • {timeAgo(art.published_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
            {business[0] && (
              <Link href={`/articles/${business[0].slug}`} className="lg:col-span-7 order-1 lg:order-2 group relative block overflow-hidden rounded-xl bg-black h-[280px] sm:h-[340px]">
                <Image src={business[0].featured_image_url} alt={business[0].title} fill sizes="60vw" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <h3 className="font-headline font-black text-xl sm:text-2xl text-white leading-tight group-hover:text-amber transition-colors">{business[0].title}</h3>
                  <p className="text-white/65 text-xs font-serif line-clamp-2">{business[0].excerpt}</p>
                  <p className="text-[9px] font-mono text-white/45">{business[0].author?.full_name} • {timeAgo(business[0].published_at)}</p>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── 5. SPORTS: CINEMATIC HERO + 2 BELOW ── */}
      {sports.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm flex items-center space-x-2">
              <span className="w-1.5 h-8 bg-category-sports rounded-full inline-block"></span><span>Sports</span>
            </h2>
            <Link href="/category/sports" className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider">More →</Link>
          </div>
          {sports[0] && (
            <Link href={`/articles/${sports[0].slug}`} className="group relative block overflow-hidden rounded-xl bg-black h-[220px] sm:h-[300px] mb-4">
              <Image src={sports[0].featured_image_url} alt={sports[0].title} fill sizes="100vw" className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center p-6 sm:p-10">
                <div className="max-w-lg space-y-2">
                  <span className="inline-block text-[9px] font-mono font-black text-amber px-2.5 py-1 bg-black/40 rounded-full uppercase tracking-wider">Featured</span>
                  <h3 className="font-headline font-black text-2xl sm:text-3xl text-white leading-tight group-hover:text-amber transition-colors">{sports[0].title}</h3>
                  <p className="text-white/60 text-sm font-serif line-clamp-2 hidden sm:block">{sports[0].excerpt}</p>
                </div>
              </div>
            </Link>
          )}
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6"><AdWindow position="homepage_mid" /></div>

      {/* ── 6. TRENDING + NATIONAL SPLIT ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Trending */}
          <div className="lg:col-span-5">
            <div className="flex items-center space-x-2 mb-4 border-b-2 border-amber pb-2">
              <TrendingUp className="w-4 h-4 text-amber" />
              <h2 className="font-mono text-[10px] font-black tracking-widest text-ink-navy/60 dark:text-gray-400 uppercase">Trending</h2>
            </div>
            <div className="space-y-0">
              {trending.map((art, i) => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="group flex items-start space-x-3 py-3 border-b border-ink-navy/8 dark:border-gray-800 last:border-0">
                  <span className="font-headline font-black text-3xl text-amber/25 group-hover:text-amber transition-colors shrink-0 w-8 leading-none">{i + 1}</span>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">{art.title}</h4>
                    <p className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 mt-1">{art.category?.name} • {timeAgo(art.published_at)} • <Eye className="w-2.5 h-2.5 inline" /> {art.view_count.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* National */}
          {national.length > 0 && (
            <div className="lg:col-span-7">
              <div className="flex items-baseline justify-between mb-4 border-b-2 pb-2" style={{ borderColor: '#8A5A9E' }}>
                <h2 className="font-headline font-black text-xl text-ink-navy dark:text-paper-warm">National</h2>
                <Link href="/category/national" className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider">More →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {national.slice(0, 2).map(art => (
                  <Link key={art.id} href={`/articles/${art.slug}`} className="group relative block overflow-hidden rounded-xl bg-black h-[200px]">
                    <Image src={art.featured_image_url} alt={art.title} fill sizes="35vw" className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
                      <h3 className="font-headline font-bold text-sm text-white leading-snug group-hover:text-amber transition-colors line-clamp-2">{art.title}</h3>
                      <p className="text-[9px] font-mono text-white/50">{art.author?.full_name} • {timeAgo(art.published_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 7. DOCUMENTARIES — DARK CINEMA ROW ── */}
      {displayedVideos.length > 0 && (
        <section className="bg-ink-navy dark:bg-gray-950 py-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-headline font-black text-2xl text-white flex items-center space-x-3">
                <span className="p-1.5 bg-amber text-ink-navy rounded-lg"><Play className="w-4 h-4 fill-ink-navy" /></span>
                <span>Documentaries</span>
              </h2>
              <Link href="/documentaries" className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider">Browse All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {displayedVideos.map(vid => (
                <Link key={vid.id} href={`/documentaries/${vid.slug}`} className="group relative block overflow-hidden rounded-xl bg-black h-[200px]">
                  <Image src={vid.thumbnail_url} alt={vid.title} fill sizes="33vw" className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 fill-ink-navy text-ink-navy ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-headline font-bold text-sm text-white leading-snug line-clamp-2">{vid.title}</h3>
                    <p className="text-[9px] font-mono text-white/40 mt-1">{Math.floor(vid.duration_seconds / 60)} min • {vid.view_count.toLocaleString()} views</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 text-white/80 text-[9px] font-mono px-2 py-0.5 rounded">
                    {Math.floor(vid.duration_seconds / 60)}:{(vid.duration_seconds % 60).toString().padStart(2, '0')}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. OPINION — PULL QUOTE ── */}
      {opinion.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-8">
          <div className="bg-gradient-to-br from-amber/10 to-orange-50/50 dark:from-amber/5 dark:to-gray-900/50 border border-amber/20 rounded-2xl p-8">
            <h2 className="font-mono text-[10px] font-black tracking-widest text-amber uppercase mb-6">Opinion &amp; Editorial</h2>
            {opinion[0] && (
              <Link href={`/articles/${opinion[0].slug}`} className="block mb-6 group">
                <blockquote className="font-headline font-black text-2xl sm:text-3xl text-ink-navy dark:text-paper-warm leading-tight group-hover:text-amber transition-colors">
                  &ldquo;{opinion[0].title}&rdquo;
                </blockquote>
                <p className="text-sm font-mono text-ink-navy/50 dark:text-gray-400 mt-3">— {opinion[0].author?.full_name || 'Duncan Khaemba'}</p>
              </Link>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-amber/20 pt-4">
              {opinion.slice(1, 3).map(art => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="hover:text-amber transition-colors">
                  <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug line-clamp-2">&ldquo;{art.title}&rdquo;</h3>
                  <p className="text-[10px] font-mono text-ink-navy/40 mt-1">— {art.author?.full_name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
