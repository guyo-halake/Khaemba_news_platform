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

async function getArticleEditData(id: string, tenantId: string) {
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
      .eq('tenant_id', tenantId)

    const { data: article } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
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
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let tenantId = 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'
  let authorId = ''

  if (user) {
    authorId = user.id
    const { data: profile } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single()
    if (profile?.tenant_id) {
      tenantId = profile.tenant_id
    }
  }

  const { article, categories } = await getArticleEditData(params.id, tenantId)

  if (!article) {
    notFound()
  }

  return <ArticleForm article={article} categories={categories} tenantId={tenantId} authorId={authorId} />
}
