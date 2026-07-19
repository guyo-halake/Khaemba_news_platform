import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import DemoContentWrapper from '@/components/public/DemoContentWrapper'
import HomeContent from '@/components/public/HomeContent'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockVideos, mockCategories } from '@/lib/supabase/mockDb'
import { Article, Video, Category } from '@/lib/types'

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

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { articles, videos, categories } = await getHomepageData()

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />
      <DemoContentWrapper>
        <HomeContent articles={articles} videos={videos} categories={categories} />
        <Footer />
      </DemoContentWrapper>
    </div>
  )
}
