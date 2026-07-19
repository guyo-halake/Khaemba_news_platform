import ArticleForm from '@/components/admin/ArticleForm'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockCategories } from '@/lib/supabase/mockDb'
import { Category } from '@/lib/types'

export const metadata = {
  title: 'Write New Article | Staff Portal',
}

async function getCategoriesData(tenantId: string) {
  if (isMockEnabled()) {
    return mockCategories
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)
    return (data || []) as Category[]
  } catch (err) {
    console.error('Failed to load categories for compose:', err)
    return []
  }
}

export default async function NewArticlePage() {
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

  const categories = await getCategoriesData(tenantId)

  return <ArticleForm categories={categories} tenantId={tenantId} authorId={authorId} />
}
