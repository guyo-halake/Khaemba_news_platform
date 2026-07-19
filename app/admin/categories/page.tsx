import CategoriesManager from '@/components/admin/CategoriesManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockCategories } from '@/lib/supabase/mockDb'
import { Category } from '@/lib/types'

export const dynamic = 'force-dynamic'

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

export default async function CategoriesAdminPage() {
  const categories = await getCategoriesData()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  return (
    <div className="space-y-6">
      <CategoriesManager initialCategories={categories} tenantId={tenantId} />
    </div>
  )
}
