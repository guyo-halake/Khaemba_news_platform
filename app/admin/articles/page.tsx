import ArticlesTable from '@/components/admin/ArticlesTable'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockCategories } from '@/lib/supabase/mockDb'
import { Article, Category } from '@/lib/types'

export const metadata = {
  title: 'Manage Articles | Staff Portal',
}

async function getArticlesManagementData() {
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

    const { data: articles } = await supabase
      .from('articles')
      .select('*, category:categories(*), author:users(*)')
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
  const { articles, categories } = await getArticlesManagementData()

  return <ArticlesTable initialArticles={articles} categories={categories} />
}
