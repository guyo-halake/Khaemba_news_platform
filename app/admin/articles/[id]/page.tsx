import ArticleForm from '@/components/admin/ArticleForm'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockCategories } from '@/lib/supabase/mockDb'
import { Article, Category } from '@/lib/types'
import { notFound } from 'next/navigation'

interface EditArticlePageProps {
  params: {
    id: string
  }
}

async function getArticleEditData(id: string) {
  if (isMockEnabled()) {
    const article = mockArticles.find(a => a.id === id)
    return {
      article: article || null,
      categories: mockCategories
    }
  }

  try {
    const supabase = createClient()
    const { data: categories } = await supabase
      .from('categories')
      .select('*')

    const { data: article } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    return {
      article: article as Article || null,
      categories: (categories || []) as Category[]
    }
  } catch (err) {
    console.error('Failed to load edit article page:', err)
    return { article: null, categories: [] }
  }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { article, categories } = await getArticleEditData(params.id)

  if (!article) {
    notFound()
  }

  return <ArticleForm article={article} categories={categories} />
}
