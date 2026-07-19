import { MetadataRoute } from 'next'
import { isMockEnabled, mockArticles, mockCategories } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khaembanews.com'

  let articles: any[] = []
  let categories: any[] = []

  if (isMockEnabled()) {
    articles = mockArticles.filter(a => a.status === 'published')
    categories = mockCategories
  } else {
    try {
      const supabase = createClient()
      const { data: art } = await supabase
        .from('articles')
        .select('slug, updated_at')
        .eq('status', 'published')
      articles = art || []

      const { data: cat } = await supabase
        .from('categories')
        .select('slug')
      categories = cat || []
    } catch (e) {
      console.error('Failed to load sitemap records:', e)
    }
  }

  // Base routes
  const routes = [
    '',
    '/documentaries',
    '/about',
    '/contact',
    '/advertise'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8
  }))

  // Article routes
  const articleRoutes = articles.map(art => ({
    url: `${baseUrl}/articles/${art.slug}`,
    lastModified: art.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }))

  // Category routes
  const categoryRoutes = categories.map(cat => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.7
  }))

  return [...routes, ...articleRoutes, ...categoryRoutes]
}
