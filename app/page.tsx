import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import AdWindow from '@/components/public/AdWindow'
import ArticleCard from '@/components/public/ArticleCard'
import VideoCard from '@/components/public/VideoCard'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockVideos, mockCategories } from '@/lib/supabase/mockDb'
import { Article, Video, Category } from '@/lib/types'
import Link from 'next/link'
import { Eye, TrendingUp, Play, ArrowRight } from 'lucide-react'

// Fetch data from Supabase or Mock DB
async function getHomepageData() {
  if (isMockEnabled()) {
    const publishedArticles = mockArticles.filter(a => a.status === 'published')
    const publishedVideos = mockVideos.filter(v => v.status === 'published')
    
    return {
      articles: publishedArticles,
      videos: publishedVideos,
      categories: mockCategories
    }
  }

  try {
    const supabase = createClient()
    
    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('*')

    // Fetch articles
    const { data: articles } = await supabase
      .from('articles')
      .select('*, category:categories(*), author:users(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    // Fetch videos
    const { data: videos } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
      .eq('status', 'published')
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

export default async function HomePage() {
  const { articles, videos, categories } = await getHomepageData()

  // 1. Hero Content
  const leadStory = articles[0]
  const secondaryStories = articles.slice(1, 3)

  // 2. Trending Content (sorted by view_count)
  const trendingStories = [...articles]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 5)

  // 3. Helper to get category specific articles
  const getCategoryArticles = (catSlug: string) => {
    return articles.filter(art => art.category?.slug === catSlug).slice(0, 4)
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-grow space-y-10 w-full">
        {/* HERO SECTION */}
        {leadStory ? (
          <section className="space-y-6">
            <h2 className="text-xs font-mono font-bold tracking-widest text-ink-navy/55 dark:text-gray-400 uppercase flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-amber rounded-full animate-ping" />
              <span>LEAD STORY & TOP HEADLINES</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Lead Story */}
              <div className="lg:col-span-8">
                <ArticleCard article={leadStory} variant="hero" />
              </div>
              
              {/* Secondary Stories Stack */}
              <div className="lg:col-span-4 flex flex-col space-y-6">
                <h3 className="font-mono text-xs font-bold tracking-widest text-ink-navy/60 dark:text-gray-400 border-b border-ink-navy/10 dark:border-gray-800 pb-2 uppercase">
                  DON&apos;T MISS
                </h3>
                {secondaryStories.length > 0 ? (
                  secondaryStories.map(art => (
                    <ArticleCard key={art.id} article={art} variant="horizontal" />
                  ))
                ) : (
                  <p className="text-sm text-ink-navy/50 dark:text-gray-500 font-mono">No other articles available.</p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <div className="py-20 text-center border border-dashed border-ink-navy/10 rounded">
            <p className="text-sm font-mono text-ink-navy/60 dark:text-gray-400">No articles have been published yet.</p>
          </div>
        )}

        {/* AD PLACEMENT: TOP */}
        <AdWindow position="homepage_top" />

        {/* TWO-COLUMN MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SIDE: Category grids */}
          <div className="lg:col-span-8 space-y-12">
            {categories
              .filter(cat => cat.slug !== 'opinion') // We handle opinions differently or show in list
              .map(cat => {
                const catArticles = getCategoryArticles(cat.slug)
                if (catArticles.length === 0) return null

                return (
                  <section key={cat.id} className="space-y-4">
                    <div className="flex justify-between items-baseline border-b border-ink-navy/10 dark:border-gray-800 pb-2">
                      <h3
                        style={{ borderLeftColor: cat.accent_color }}
                        className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm pl-3 border-l-4"
                      >
                        {cat.name}
                      </h3>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-xs font-mono text-amber hover:underline uppercase tracking-wider flex items-center space-x-1"
                      >
                        <span>See all {cat.name}</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {catArticles.map(art => (
                        <ArticleCard key={art.id} article={art} variant="grid" />
                      ))}
                    </div>
                  </section>
                )
              })}
          </div>

          {/* RIGHT SIDE: Sidebar (Trending + Ad + Newsletter Card) */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Trending Section */}
            <section className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-6">
              <h3 className="font-mono text-xs font-bold tracking-widest text-ink-navy dark:text-paper-warm border-b border-ink-navy/10 dark:border-gray-800 pb-3 flex items-center space-x-2 uppercase">
                <TrendingUp className="w-4 h-4 text-amber" />
                <span>TRENDING STORIES</span>
              </h3>
              
              <div className="space-y-5">
                {trendingStories.map((art, index) => (
                  <div key={art.id} className="flex space-x-3 group">
                    <span className="font-headline font-black text-3xl text-amber/40 group-hover:text-amber transition-colors shrink-0 w-8 text-right leading-none">
                      {index + 1}
                    </span>
                    <div className="space-y-1">
                      <Link href={`/articles/${art.slug}`} className="block">
                        <h4 className="font-headline font-bold text-sm sm:text-base text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors">
                          {art.title}
                        </h4>
                      </Link>
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-ink-navy/50 dark:text-gray-500">
                        <span>{art.category?.name}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-0.5">
                          <Eye className="w-3 h-3" />
                          <span>{art.view_count}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AD PLACEMENT: SIDEBAR */}
            <AdWindow position="sidebar" />

            {/* Opinion Column Summary */}
            {getCategoryArticles('opinion').length > 0 && (
              <section className="bg-amber/5 dark:bg-amber/5 border border-amber/20 rounded-lg p-6 space-y-4">
                <h3 className="font-mono text-xs font-bold tracking-widest text-amber dark:text-amber pb-2 border-b border-amber/15 uppercase">
                  EDITORIALS & OPINION
                </h3>
                <div className="space-y-4 divide-y divide-amber/10">
                  {getCategoryArticles('opinion').map((art, idx) => (
                    <div key={art.id} className={`${idx > 0 ? 'pt-3' : ''} space-y-1`}>
                      <Link href={`/articles/${art.slug}`}>
                        <h4 className="font-headline font-bold text-base text-ink-navy dark:text-paper-warm hover:text-amber transition-colors leading-snug">
                          &ldquo;{art.title}&rdquo;
                        </h4>
                      </Link>
                      <p className="text-xs font-mono text-ink-navy/55 dark:text-gray-400">
                        — By {art.author?.full_name}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        {/* AD PLACEMENT: MIDDLE */}
        <AdWindow position="homepage_mid" />

        {/* DOCUMENTARIES HUB SPOTLIGHT */}
        {videos.length > 0 && (
          <section className="space-y-6">
            <div className="flex justify-between items-baseline border-b border-ink-navy/10 dark:border-gray-800 pb-2">
              <h3 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm flex items-center space-x-2.5">
                <span className="p-1 bg-amber text-ink-navy rounded-full">
                  <Play className="w-4 h-4 fill-ink-navy ml-0.5" />
                </span>
                <span>Khaemba Documentaries</span>
              </h3>
              <Link
                href="/documentaries"
                className="text-xs font-mono text-amber hover:underline uppercase tracking-wider flex items-center space-x-1"
              >
                <span>Browse Video Hub</span>
                <span>&rarr;</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.slice(0, 3).map(vid => (
                <VideoCard key={vid.id} video={vid} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
