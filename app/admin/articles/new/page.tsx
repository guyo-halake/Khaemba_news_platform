import ArticleForm from '@/components/admin/ArticleForm'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockCategories } from '@/lib/supabase/mockDb'
import { Category } from '@/lib/types'

export const metadata = {
  title: 'Write New Article | Staff Portal',
}

async function getCategoriesData() {
  if (isMockEnabled()) {
    return mockCategories
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
    return (data || []) as Category[]
  } catch (err) {
    console.error('Failed to load categories for compose:', err)
    return []
  }
}

export default async function NewArticlePage() {
  const categories = await getCategoriesData()

  return <ArticleForm categories={categories} />
}
