'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Article, Video, Category } from '@/lib/types'
import AdWindow from './AdWindow'
import VideoCard from './VideoCard'
import { Eye, Clock, ChevronRight, Play } from 'lucide-react'
import { isMockEnabled } from '@/lib/supabase/mockDb'

interface Props { articles: Article[]; videos: Video[]; categories: Category[] }

function timeAgo(d?: string) {
  if (!d) return ''
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`
  return `${Math.floor(s / 86400)} days ago`
}

function SectionHeader({ title, color, slug }: { title: string; color: string; slug: string }) {
  return (
    <div className="flex items-baseline justify-between mb-4 border-b-2 pb-2" style={{ borderColor: color }}>
      <h2 className="font-headline font-black text-xl text-ink-navy dark:text-paper-warm">{title}</h2>
      <Link href={`/category/${slug}`} className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider flex items-center space-x-1">
        <span>More</span><ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

import { useState, useEffect } from 'react'

export default function EditorialHome({ articles, videos }: Props) {
  const [slots, setSlots] = useState<{
    leadStoryId?: string
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

  const customLead = slots.leadStoryId ? articles.find(a => a.id === slots.leadStoryId) : null
  const leadStory = customLead || politics[0] || articles[0]
  const leadId = leadStory?.id

  // Latest 5 for hero sidebar (exclude lead)
  const latest5 = [...articles]
    .filter(a => a.id !== leadId)
    .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime())
    .slice(0, 5)

  // Documentaries slots lookup
  const customDoc1 = slots.docId1 ? videos.find(v => v.id === slots.docId1) : null
  const customDoc2 = slots.docId2 ? videos.find(v => v.id === slots.docId2) : null
  const customDoc3 = slots.docId3 ? videos.find(v => v.id === slots.docId3) : null

  const displayedVideos = [
    customDoc1 || videos[0],
    customDoc2 || videos[1],
    customDoc3 || videos[2]
  ].filter(Boolean) as Video[]

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex-grow w-full space-y-8">

      {/* ── HERO: LEAD + LATEST 5 ── */}
      {leadStory && (
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="text-[10px] font-mono font-black tracking-widest text-ink-navy/60 dark:text-gray-400 uppercase">Lead Story</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hero Card */}
            <div className="lg:col-span-8">
              <Link href={`/articles/${leadStory.slug}`} className="group relative block overflow-hidden rounded-lg bg-black shadow-lg">
                <div className="relative h-[280px] sm:h-[400px]">
                  <Image src={leadStory.featured_image_url} alt={leadStory.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover opacity-85 group-hover:scale-103 transition-transform duration-700" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 space-y-2">
                    <span style={{ backgroundColor: leadStory.category?.accent_color || '#B23A3A' }} className="inline-block text-[9px] font-mono font-black text-white px-2.5 py-1 rounded uppercase tracking-wider">
                      {leadStory.category?.name || 'Politics'}
                    </span>
                    <h1 className="font-headline font-black text-xl sm:text-3xl text-white leading-tight group-hover:text-amber transition-colors">
                      {leadStory.title}
                    </h1>
                    <p className="text-white/75 text-xs sm:text-sm font-serif line-clamp-2 leading-relaxed">{leadStory.excerpt}</p>
                    <div className="flex items-center space-x-3 text-white/60 text-[10px] font-mono pt-1">
                      <span>By {leadStory.author?.full_name || 'Duncan Khaemba'}</span>
                      <span>•</span>
                      <span>{timeAgo(leadStory.published_at)}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1"><Eye className="w-3 h-3" /><span>{leadStory.view_count.toLocaleString()}</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Latest 5 Sidebar */}
            <div className="lg:col-span-4">
              <div className="flex items-center justify-between border-b-2 border-amber pb-2 mb-3">
                <h3 className="font-mono text-[10px] font-black tracking-widest text-ink-navy/55 dark:text-gray-400 uppercase flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-amber" /><span>Latest News</span>
                </h3>
              </div>
              <div className="space-y-0">
                {latest5.map(art => {
                  const color = art.category?.accent_color || '#D99A3F'
                  return (
                    <Link key={art.id} href={`/articles/${art.slug}`} className="group flex items-start space-x-3 py-2.5 border-b border-ink-navy/8 dark:border-gray-800 last:border-0">
                      <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                        <Image src={art.featured_image_url} alt={art.title} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ color }} className="text-[9px] font-mono font-bold uppercase tracking-wider mb-0.5">{art.category?.name}</p>
                        <h4 className="font-headline font-bold text-xs sm:text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">{art.title}</h4>
                        <p className="text-[9px] font-mono text-ink-navy/45 dark:text-gray-500 mt-0.5">{timeAgo(art.published_at)}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
              {articles.length > 6 && (
                <Link href="/search" className="block text-center mt-3 text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider">
                  Read More Stories →
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── AD ── */}
      {isMockEnabled() ? (
        <div className="w-full rounded-lg overflow-hidden border border-ink-navy/10 dark:border-gray-800 relative bg-black" style={{ height: '140px' }}>
          <div className="absolute top-2 right-3 z-10 font-mono text-[9px] text-white/60 bg-black/50 px-1.5 py-0.5 rounded uppercase tracking-wider">Sponsored</div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink-navy/90 to-ink-navy/40 flex items-center p-6">
            <div className="text-white space-y-1">
              <p className="font-mono text-[9px] uppercase tracking-widest text-amber">Kenya Tourism Board</p>
              <p className="font-headline font-black text-lg leading-tight">Tembelea Kenya.<br />Discover Yourself.</p>
              <a href="#" className="inline-block mt-2 text-[10px] font-mono font-bold bg-amber text-ink-navy px-3 py-1 rounded hover:bg-amber/90 transition-colors">Learn More →</a>
            </div>
          </div>
        </div>
      ) : (
        <AdWindow position="homepage_top" />
      )}

      {/* ── POLITICS ── */}
      {politics.length > 0 && (
        <section>
          <SectionHeader title="Politics" color="#B23A3A" slug="politics" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {politics.slice(0, 4).map(art => (
              <Link key={art.id} href={`/articles/${art.slug}`} className="group flex space-x-4 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="relative w-32 h-24 sm:w-40 sm:h-28 shrink-0 overflow-hidden rounded">
                  <Image src={art.featured_image_url} alt={art.title} fill sizes="160px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <h3 className="font-headline font-bold text-sm sm:text-base text-ink-navy dark:text-paper-warm leading-snug group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2">{art.title}</h3>
                  <p className="text-[11px] text-ink-navy/65 dark:text-gray-400 line-clamp-2 font-serif hidden sm:block">{art.excerpt}</p>
                  <div className="flex items-center text-[9px] font-mono text-ink-navy/45 dark:text-gray-500 space-x-2">
                    <span>By {art.author?.full_name || 'Duncan Khaemba'}</span>
                    <span>•</span>
                    <span>{timeAgo(art.published_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── SPORTS + BUSINESS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sports.length > 0 && (
          <section>
            <SectionHeader title="Sports" color="#2E5FA3" slug="sports" />
            <div className="space-y-4">
              {sports.slice(0, 2).map((art, i) => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="group flex space-x-3 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="relative w-28 h-22 shrink-0 overflow-hidden rounded">
                    <Image src={art.featured_image_url} alt={art.title} fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    {i === 0 && <div className="absolute top-1 left-1 bg-amber text-ink-navy text-[8px] font-black px-1.5 py-0.5 rounded font-mono uppercase">Top</div>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{art.title}</h3>
                    <p className="text-[10px] text-ink-navy/65 dark:text-gray-400 line-clamp-2 font-serif">{art.excerpt}</p>
                    <p className="text-[9px] font-mono text-ink-navy/40">{timeAgo(art.published_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        {business.length > 0 && (
          <section>
            <SectionHeader title="Business" color="#3A7D44" slug="business" />
            <div className="space-y-4">
              {business.slice(0, 2).map(art => (
                <Link key={art.id} href={`/articles/${art.slug}`} className="group flex space-x-3 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="relative w-28 h-22 shrink-0 overflow-hidden rounded">
                    <Image src={art.featured_image_url} alt={art.title} fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2">{art.title}</h3>
                    <p className="text-[10px] text-ink-navy/65 dark:text-gray-400 line-clamp-2 font-serif">{art.excerpt}</p>
                    <p className="text-[9px] font-mono text-ink-navy/40">{timeAgo(art.published_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <AdWindow position="homepage_mid" />

      {/* ── NATIONAL ── */}
      {national.length > 0 && (
        <section>
          <SectionHeader title="National" color="#8A5A9E" slug="national" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {national.slice(0, 2).map(art => (
              <Link key={art.id} href={`/articles/${art.slug}`} className="group relative block overflow-hidden rounded-lg bg-black shadow">
                <div className="relative h-44">
                  <Image src={art.featured_image_url} alt={art.title} fill sizes="50vw" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
                    <span style={{ backgroundColor: '#8A5A9E' }} className="inline-block text-[9px] font-mono font-black text-white px-2 py-0.5 rounded uppercase tracking-wider">National</span>
                    <h3 className="font-headline font-bold text-base text-white leading-snug group-hover:text-amber transition-colors line-clamp-2">{art.title}</h3>
                    <p className="text-[9px] font-mono text-white/55">By {art.author?.full_name || 'Duncan Khaemba'} • {timeAgo(art.published_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── DOCUMENTARIES ── */}
      {displayedVideos.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-4 border-b-2 border-ink-navy pb-2 dark:border-gray-700">
            <h2 className="font-headline font-black text-xl text-ink-navy dark:text-paper-warm flex items-center space-x-2">
              <span className="p-1 bg-amber text-ink-navy rounded"><Play className="w-3.5 h-3.5 fill-ink-navy ml-0.5" /></span>
              <span>Documentaries</span>
            </h2>
            <Link href="/documentaries" className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider flex items-center space-x-1">
              <span>Browse all</span><ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {displayedVideos.map(vid => <VideoCard key={vid.id} video={vid} />)}
          </div>
        </section>
      )}

      {/* ── OPINION ── */}
      {opinion.length > 0 && (
        <section className="bg-amber/5 dark:bg-amber/5 border border-amber/20 rounded-lg p-6">
          <div className="flex items-baseline justify-between mb-4 border-b border-amber/20 pb-2">
            <h2 className="font-mono text-[10px] font-black tracking-widest text-amber uppercase">Editorials &amp; Opinion</h2>
            <Link href="/category/opinion" className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider">More →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opinion.slice(0, 4).map(art => (
              <div key={art.id} className="space-y-1 py-3 md:py-0 md:px-4 first:md:pl-0 last:md:pr-0">
                <Link href={`/articles/${art.slug}`}>
                  <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm hover:text-amber transition-colors leading-snug line-clamp-2">
                    &ldquo;{art.title}&rdquo;
                  </h3>
                </Link>
                <p className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-400">— By {art.author?.full_name || 'Duncan Khaemba'}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
