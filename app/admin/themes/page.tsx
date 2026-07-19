import ThemeCustomizer from '@/components/admin/ThemeCustomizer'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockCategories } from '@/lib/supabase/mockDb'
import { Category } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Theme & Layout Customizer | Staff Portal',
}

async function getCategoriesData() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  if (isMockEnabled()) {
    return mockCategories
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true })

    return (data || []) as Category[]
  } catch (err) {
    console.error('Failed to load categories:', err)
    return mockCategories
  }
}

export default async function AdminThemesPage() {
  const categories = await getCategoriesData()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  return <ThemeCustomizer categories={categories} tenantId={tenantId} />
}
