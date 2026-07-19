import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ArticleCard from '@/components/public/ArticleCard'
import AdWindow from '@/components/public/AdWindow'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockCategories } from '@/lib/supabase/mockDb'
import { Article, Category } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function getCategoryData(slug: string) {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  if (isMockEnabled()) {
    const category = mockCategories.find(c => c.slug === slug)
    if (!category) return { category: null, articles: [] }

    const articles = mockArticles.filter(
      a => a.category_id === category.id && a.status === 'published'
    )
    return { category, articles }
  }

  try {
    const supabase = createClient()
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('tenant_id', tenantId)
      .single()

    if (!category) return { category: null, articles: [] }

    const { data: articles } = await supabase
      .from('articles')
      .select('*, category:categories(*), author:users(*)')
      .eq('category_id', category.id)
      .eq('status', 'published')
      .eq('tenant_id', tenantId)
      .order('published_at', { ascending: false })

    const result = {
      category: category as Category,
      articles: (articles || []) as Article[]
    }

    if (result.articles.length === 0) {
      const mockCat = mockCategories.find(c => c.slug === slug)
      if (mockCat) {
        return {
          category: mockCat,
          articles: mockArticles.filter(a => a.category_id === mockCat.id && a.status === 'published')
        }
      }
    }

    return result
  } catch (err) {
    console.error('Failed to load category page data:', err)
    const mockCat = mockCategories.find(c => c.slug === slug)
    if (mockCat) {
      return {
        category: mockCat,
        articles: mockArticles.filter(a => a.category_id === mockCat.id && a.status === 'published')
      }
    }
    return { category: null, articles: [] }
  }
}

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, articles } = await getCategoryData(params.slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex-grow w-full space-y-10">
        {/* Category Header Banner */}
        <section
          style={{ borderLeftColor: category.accent_color }}
          className="border-l-4 pl-4 py-2 space-y-2 bg-white/20 dark:bg-gray-900/10"
        >
          <h1 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-ink-navy dark:text-paper-warm">
            {category.name}
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400 uppercase tracking-widest">
            Reporting on {category.name} topics & county dispatches
          </p>
        </section>

        {/* Content & Sidebar split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main List */}
          <div className="lg:col-span-8 space-y-8">
            {articles.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-ink-navy/10 rounded">
                <p className="text-sm font-mono text-ink-navy/65 dark:text-gray-400">
                  No articles have been published under {category.name} yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(art => (
                  <ArticleCard key={art.id} article={art} variant="grid" />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <AdWindow position="sidebar" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
