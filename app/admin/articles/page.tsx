import ArticlesTable from '@/components/admin/ArticlesTable'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockCategories } from '@/lib/supabase/mockDb'
import { Article, Category } from '@/lib/types'

export const metadata = {
  title: 'Manage Articles | Staff Portal',
}

async function getArticlesManagementData(tenantId: string) {
  if (isMockEnabled()) {
    return {
      articles: mockArticles,
      categories: mockCategories
    }
  }

  try {
    const supabase = createClient()
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)

    const { data: articles } = await supabase
      .from('articles')
      .select('*, category:categories(*), author:users(*)')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    return {
      articles: (articles || []) as Article[],
      categories: (categories || []) as Category[]
    }
  } catch (err) {
    console.error('Failed to load articles management data:', err)
    return { articles: [], categories: [] }
  }
}

export default async function AdminArticlesPage() {
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

  const { articles, categories } = await getArticlesManagementData(tenantId)

  return <ArticlesTable initialArticles={articles} categories={categories} tenantId={tenantId} />
}
