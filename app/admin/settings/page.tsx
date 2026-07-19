import SettingsManager from '@/components/admin/SettingsManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockCategories } from '@/lib/supabase/mockDb'
import { Category } from '@/lib/types'

export const metadata = {
  title: 'Site Configuration | Staff Portal',
}

async function getSettingsCategoriesData(tenantId: string) {
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
    console.error('Failed to load settings categories:', err)
    return []
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

  const categories = await getSettingsCategoriesData(tenantId)

  return <SettingsManager initialCategories={categories} tenantId={tenantId} />
}
