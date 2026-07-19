import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ArticleCard from '@/components/public/ArticleCard'
import VideoCard from '@/components/public/VideoCard'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockVideos } from '@/lib/supabase/mockDb'
import { Article, Video } from '@/lib/types'
import { Search } from 'lucide-react'

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

async function performSearch(query: string) {
  const normalized = query.toLowerCase().trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  if (isMockEnabled()) {
    const articles = mockArticles.filter(
      a =>
        a.status === 'published' &&
        (a.title.toLowerCase().includes(normalized) ||
          a.excerpt.toLowerCase().includes(normalized) ||
          a.tags.some(t => t.toLowerCase().includes(normalized)))
    )

    const videos = mockVideos.filter(
      v =>
        v.status === 'published' &&
        (v.title.toLowerCase().includes(normalized) ||
          v.description.toLowerCase().includes(normalized))
    )

    return { articles, videos }
  }

  try {
    const supabase = createClient()

    const { data: articles } = await supabase
      .from('articles')
      .select('*, category:categories(*), author:users(*)')
      .eq('status', 'published')
      .eq('tenant_id', tenantId)
      .or(`title.ilike.%${normalized}%,excerpt.ilike.%${normalized}%`)
      .order('published_at', { ascending: false })

    const { data: videos } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .eq('tenant_id', tenantId)
      .or(`title.ilike.%${normalized}%,description.ilike.%${normalized}%`)
      .order('created_at', { ascending: false })

    return {
      articles: (articles || []) as Article[],
      videos: (videos || []) as Video[]
    }
  } catch (err) {
    console.error('Failed to perform search:', err)
    return { articles: [], videos: [] }
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const { articles, videos } = query ? await performSearch(query) : { articles: [], videos: [] }
  const totalCount = articles.length + videos.length

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex-grow w-full space-y-8">
        {/* Header Title */}
        <div className="flex items-center space-x-3 border-b border-ink-navy/10 dark:border-gray-800 pb-4">
          <Search className="w-8 h-8 text-amber shrink-0" />
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-ink-navy dark:text-paper-warm">
              Search Results
            </h1>
            <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
              Query: &ldquo;{query}&rdquo; — {totalCount} matches found
            </p>
          </div>
        </div>

        {/* Results Sections */}
        {!query ? (
          <div className="text-center py-20">
            <p className="text-sm font-mono text-ink-navy/50 dark:text-gray-500">
              Enter a search query in the header to browse articles and videos.
            </p>
          </div>
        ) : totalCount === 0 ? (
          <div className="text-center py-20 border border-dashed border-ink-navy/10 dark:border-gray-800 rounded">
            <p className="text-sm font-mono text-ink-navy/60 dark:text-gray-400">
              No results found matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Articles Results */}
            {articles.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-headline font-black text-xl text-ink-navy dark:text-paper-warm border-b border-ink-navy/5 pb-1">
                  Articles ({articles.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map(art => (
                    <ArticleCard key={art.id} article={art} variant="grid" />
                  ))}
                </div>
              </section>
            )}

            {/* Video Results */}
            {videos.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-headline font-black text-xl text-ink-navy dark:text-paper-warm border-b border-ink-navy/5 pb-1">
                  Documentaries ({videos.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(vid => (
                    <VideoCard key={vid.id} video={vid} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
