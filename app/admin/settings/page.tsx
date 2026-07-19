import SettingsManager from '@/components/admin/SettingsManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockCategories, mockArticles, mockVideos } from '@/lib/supabase/mockDb'
import { Category, Article, Video } from '@/lib/types'

export const metadata = {
  title: 'Site Configuration | Staff Portal',
}

async function getSettingsData(tenantId: string) {
  if (isMockEnabled()) {
    return {
      categories: mockCategories,
      articles: mockArticles.filter(a => a.status === 'published') as Article[],
      videos: mockVideos.filter(v => v.status === 'published') as Video[]
    }
  }

  try {
    const supabase = createClient()
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true })

    const { data: articles } = await supabase
      .from('articles')
      .select('id, title, category_id, status, slug')
      .eq('tenant_id', tenantId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    const { data: videos } = await supabase
      .from('videos')
      .select('id, title, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    return {
      categories: (categories || []) as Category[],
      articles: (articles || []) as Article[],
      videos: (videos || []) as Video[]
    }
  } catch (err) {
    console.error('Failed to load settings categories:', err)
    return { categories: [], articles: [], videos: [] }
  }
}

export default async function AdminSettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let tenantId = 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single()
    if (profile?.tenant_id) {
      tenantId = profile.tenant_id
    }
  }

  const { categories, articles, videos } = await getSettingsData(tenantId)

  return (
    <SettingsManager
      initialCategories={categories}
      articles={articles}
      videos={videos}
      tenantId={tenantId}
    />
  )
}
