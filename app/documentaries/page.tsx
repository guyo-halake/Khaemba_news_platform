import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import DocumentariesHub from '@/components/public/DocumentariesHub'
import DemoContentWrapper from '@/components/public/DemoContentWrapper'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockVideos, mockCategories } from '@/lib/supabase/mockDb'
import { Video, Category } from '@/lib/types'

export const metadata = {
  title: 'Documentaries Hub',
  description: 'Explore high-production, independent investigative documentaries detailing local devolution, county culture, and systemic issues.',
}

async function getVideosData() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  if (isMockEnabled()) {
    const publishedVideos = mockVideos.filter(v => v.status === 'published')
    return {
      videos: publishedVideos,
      categories: mockCategories
    }
  }

  try {
    const supabase = createClient()
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)

    const { data: videos } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    return {
      videos: (videos || []) as Video[],
      categories: (categories || []) as Category[]
    }
  } catch (err) {
    console.error('Failed to load documentaries data:', err)
    return { videos: [], categories: [] }
  }
}

export const dynamic = 'force-dynamic'

export default async function DocumentariesPage() {
  const { videos, categories } = await getVideosData()

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <DemoContentWrapper>
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex-grow w-full">
          {/* Intro */}
          <div className="space-y-3 mb-10">
            <h1 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-ink-navy dark:text-paper-warm">
              Documentaries & Video Reports
            </h1>
            <p className="text-sm sm:text-base text-ink-navy/70 dark:text-gray-400 max-w-3xl leading-relaxed">
              Unraveling truth through the lens of local journalists. View in-depth, long-form documentary films covering county leadership, natural resources, community stories, and sporting excellence.
            </p>
          </div>

          {/* Hub Client Component */}
          <DocumentariesHub initialVideos={videos} categories={categories} />
        </main>

        <Footer />
      </DemoContentWrapper>
    </div>
  )
}
