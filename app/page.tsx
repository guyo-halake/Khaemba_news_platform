import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import AdWindow from '@/components/public/AdWindow'
import ArticleCard from '@/components/public/ArticleCard'
import VideoCard from '@/components/public/VideoCard'
import DemoContentWrapper from '@/components/public/DemoContentWrapper'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockVideos, mockCategories } from '@/lib/supabase/mockDb'
import { Article, Video, Category } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, TrendingUp, Play, ArrowRight, Clock, ChevronRight } from 'lucide-react'

async function getHomepageData() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  if (isMockEnabled()) {
    const publishedArticles = mockArticles.filter(a => a.status === 'published')
    const publishedVideos = mockVideos.filter(v => v.status === 'published')
    return { articles: publishedArticles, videos: publishedVideos, categories: mockCategories }
  }

  try {
    const supabase = createClient()
    const { data: categories } = await supabase.from('categories').select('*').eq('tenant_id', tenantId)
    const { data: articles } = await supabase
      .from('articles')
      .select('*, category:categories(*), author:users(*)')
      .eq('status', 'published')
      .eq('tenant_id', tenantId)
      .order('published_at', { ascending: false })
    const { data: videos } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    return {
      articles: (articles || []) as Article[],
      videos: (videos || []) as Video[],
      categories: (categories || []) as Category[]
    }
  } catch (err) {
    console.error('Failed to fetch homepage data:', err)
    return { articles: [], videos: [], categories: [] }
  }
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return ''
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return `${Math.floor(diff / 86400)} days ago`
}

function MiniCard({ article }: { article: Article }) {
  const color = article.category?.accent_color || '#D99A3F'
  return (
    <Link href={`/articles/${article.slug}`} className="group flex items-start space-x-3 py-2.5 border-b border-ink-navy/8 dark:border-gray-800 last:border-0">
      <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
        <Image src={article.featured_image_url} alt={article.title} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ color }} className="text-[9px] font-mono font-bold uppercase tracking-wider mb-0.5">{article.category?.name}</p>
        <h4 className="font-headline font-bold text-xs sm:text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">{article.title}</h4>
        <p className="text-[9px] font-mono text-ink-navy/45 dark:text-gray-500 mt-0.5">{timeAgo(article.published_at)}</p>
      </div>
    </Link>
  )
}

function HeadlineCard({ article }: { article: Article }) {
  const color = article.category?.accent_color || '#D99A3F'
  return (
    <Link href={`/articles/${article.slug}`} className="group block space-y-2 py-3 border-b border-ink-navy/8 dark:border-gray-800 last:border-0">
      <p style={{ color }} className="text-[9px] font-mono font-bold uppercase tracking-wider">{article.category?.name}</p>
      <h4 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">{article.title}</h4>
      <div className="flex items-center space-x-2 text-[9px] font-mono text-ink-navy/45 dark:text-gray-500">
        <span>By {article.author?.full_name || 'Staff'}</span>
        <span>•</span>
        <span>{timeAgo(article.published_at)}</span>
      </div>
    </Link>
  )
}

function SectionHeader({ title, color, slug }: { title: string; color: string; slug: string }) {
  return (
    <div className="flex items-baseline justify-between mb-4 border-b-2 pb-2" style={{ borderColor: color }}>
      <h2 className="font-headline font-black text-xl text-ink-navy dark:text-paper-warm" style={{ borderLeftColor: color }}>{title}</h2>
      <Link href={`/category/${slug}`} className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider flex items-center space-x-1">
        <span>More</span><ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

export default async function HomePage() {
  const { articles, videos, categories } = await getHomepageData()

  const byCategory = (slug: string) => articles.filter(a => a.category?.slug === slug)
  const politics = byCategory('politics')
  const business = byCategory('business')
  const sports = byCategory('sports')
  const county = byCategory('county')
  const opinion = byCategory('opinion')

  const leadStory = politics[0] || articles[0]
  const dontMiss = [
    ...politics.slice(1, 3),
    ...sports.slice(0, 1),
    ...business.slice(0, 1),
  ].slice(0, 4)

  const latest = [...articles]
    .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime())
    .slice(0, 8)

  const trending = [...articles]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <DemoContentWrapper>
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex-grow w-full space-y-8">

          {/* ── HERO: LEAD + DON'T MISS ── */}
          {leadStory && (
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                <span className="text-[10px] font-mono font-black tracking-widest text-ink-navy/60 dark:text-gray-400 uppercase">Lead Story & Headlines</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Hero Card */}
                <div className="lg:col-span-8">
                  <Link href={`/articles/${leadStory.slug}`} className="group relative block overflow-hidden rounded-lg bg-black shadow-lg">
                    <div className="relative h-[300px] sm:h-[420px]">
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

                {/* Don't Miss */}
                <div className="lg:col-span-4">
                  <h3 className="font-mono text-[10px] font-black tracking-widest text-ink-navy/55 dark:text-gray-400 border-b-2 border-amber pb-2 mb-3 uppercase">Don&apos;t Miss</h3>
                  <div className="space-y-0">
                    {dontMiss.length > 0 ? dontMiss.map(art => (
                      <MiniCard key={art.id} article={art} />
                    )) : articles.slice(1, 5).map(art => (
                      <MiniCard key={art.id} article={art} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── LATEST + TRENDING STRIP ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-3 border-b border-ink-navy/10 dark:border-gray-800 pb-2">
                <h2 className="font-mono text-[10px] font-black tracking-widest text-ink-navy/60 dark:text-gray-400 uppercase">Latest Stories</h2>
                <span className="flex items-center space-x-1 text-[9px] font-mono text-amber"><Clock className="w-3 h-3" /><span>Updated now</span></span>
              </div>
              <div className="divide-y divide-ink-navy/8 dark:divide-gray-800">
                {latest.map(art => <HeadlineCard key={art.id} article={art} />)}
              </div>
            </div>
            <aside className="lg:col-span-4">
              <div className="mb-3 border-b border-ink-navy/10 dark:border-gray-800 pb-2 flex items-center space-x-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber" />
                <h2 className="font-mono text-[10px] font-black tracking-widest text-ink-navy/60 dark:text-gray-400 uppercase">Trending</h2>
              </div>
              <div className="space-y-0">
                {trending.map((art, i) => (
                  <Link key={art.id} href={`/articles/${art.slug}`} className="group flex items-start space-x-3 py-2.5 border-b border-ink-navy/8 dark:border-gray-800 last:border-0">
                    <span className="font-headline font-black text-2xl text-amber/30 group-hover:text-amber transition-colors shrink-0 w-7 leading-none">{i + 1}</span>
                    <div>
                      <h4 className="font-headline font-bold text-xs text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">{art.title}</h4>
                      <p className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 mt-0.5">{art.category?.name} • {timeAgo(art.published_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </section>

          {/* ── AD: TOP VIDEO AD ── */}
          {isMockEnabled() ? (
            <div className="w-full rounded-lg overflow-hidden border border-ink-navy/10 dark:border-gray-800 relative bg-black" style={{ height: '180px' }}>
              <div className="absolute top-2 right-3 z-10 font-mono text-[9px] text-white/60 bg-black/50 px-1.5 py-0.5 rounded uppercase tracking-wider">Sponsored</div>
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                poster="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80"
                autoPlay muted loop playsInline
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6">
                <div className="text-white space-y-1">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-amber">Kenya Tourism Board</p>
                  <p className="font-headline font-black text-xl leading-tight">Tembelea Kenya.<br />Discover Yourself.</p>
                  <a href="#" className="inline-block mt-2 text-[10px] font-mono font-bold bg-amber text-ink-navy px-3 py-1 rounded hover:bg-amber/90 transition-colors">Learn More →</a>
                </div>
              </div>
            </div>
          ) : (
            <AdWindow position="homepage_top" />
          )}

          {/* ── POLITICS: 4 HORIZONTAL CARDS ── */}
          {politics.length > 0 && (
            <section>
              <SectionHeader title="Politics" color="#B23A3A" slug="politics" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {politics.slice(0, 4).map(art => (
                  <Link key={art.id} href={`/articles/${art.slug}`} className="group block bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-36 overflow-hidden">
                      <Image src={art.featured_image_url} alt={art.title} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-3 space-y-1.5">
                      <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2">{art.title}</h3>
                      <div className="flex items-center justify-between text-[9px] font-mono text-ink-navy/45 dark:text-gray-500">
                        <span>By {art.author?.full_name || 'Duncan Khaemba'}</span>
                        <span>{timeAgo(art.published_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── SPORTS + BUSINESS SIDE BY SIDE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sports - 2 cards */}
            {sports.length > 0 && (
              <section>
                <SectionHeader title="Sports & World Cup" color="#2E5FA3" slug="sports" />
                <div className="space-y-4">
                  {sports.slice(0, 2).map((art, i) => (
                    <Link key={art.id} href={`/articles/${art.slug}`} className="group flex space-x-3 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="relative w-24 h-20 shrink-0 overflow-hidden rounded">
                        <Image src={art.featured_image_url} alt={art.title} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        {i === 0 && <div className="absolute top-1 left-1 bg-amber text-ink-navy text-[8px] font-black px-1.5 py-0.5 rounded font-mono uppercase">Top</div>}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{art.title}</h3>
                        <p className="text-[10px] text-ink-navy/65 dark:text-gray-400 line-clamp-2 font-serif">{art.excerpt}</p>
                        <p className="text-[9px] font-mono text-ink-navy/40">By {art.author?.full_name} • {timeAgo(art.published_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Business - 2 cards */}
            {business.length > 0 && (
              <section>
                <SectionHeader title="Business" color="#3A7D44" slug="business" />
                <div className="space-y-4">
                  {business.slice(0, 2).map(art => (
                    <Link key={art.id} href={`/articles/${art.slug}`} className="group flex space-x-3 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="relative w-24 h-20 shrink-0 overflow-hidden rounded">
                        <Image src={art.featured_image_url} alt={art.title} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm leading-snug group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2">{art.title}</h3>
                        <p className="text-[10px] text-ink-navy/65 dark:text-gray-400 line-clamp-2 font-serif">{art.excerpt}</p>
                        <p className="text-[9px] font-mono text-ink-navy/40">By {art.author?.full_name} • {timeAgo(art.published_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── AD MID ── */}
          <AdWindow position="homepage_mid" />

          {/* ── COUNTY NEWS: 2 CARDS ── */}
          {county.length > 0 && (
            <section>
              <SectionHeader title="Counties" color="#8A5A9E" slug="county" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {county.slice(0, 2).map(art => (
                  <Link key={art.id} href={`/articles/${art.slug}`} className="group relative block overflow-hidden rounded-lg bg-black shadow">
                    <div className="relative h-44">
                      <Image src={art.featured_image_url} alt={art.title} fill sizes="50vw" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
                        <span style={{ backgroundColor: '#8A5A9E' }} className="inline-block text-[9px] font-mono font-black text-white px-2 py-0.5 rounded uppercase tracking-wider">County</span>
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
          {videos.length > 0 && (
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
                {videos.slice(0, 3).map(vid => <VideoCard key={vid.id} video={vid} />)}
              </div>
            </section>
          )}

          {/* ── OPINION ── */}
          {opinion.length > 0 && (
            <section className="bg-amber/5 dark:bg-amber/5 border border-amber/20 rounded-lg p-6">
              <div className="flex items-baseline justify-between mb-4 border-b border-amber/20 pb-2">
                <h2 className="font-mono text-[10px] font-black tracking-widest text-amber uppercase">Editorials & Opinion</h2>
                <Link href="/category/opinion" className="text-[10px] font-mono font-bold text-amber hover:underline uppercase tracking-wider">More →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-amber/10">
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

        <Footer />
      </DemoContentWrapper>
    </div>
  )
}
