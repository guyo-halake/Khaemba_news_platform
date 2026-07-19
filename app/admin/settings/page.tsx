import SettingsManager from '@/components/admin/SettingsManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockCategories } from '@/lib/supabase/mockDb'
import { Category } from '@/lib/types'

export const metadata = {
  title: 'Site Configuration | Staff Portal',
}

async function getSettingsCategoriesData() {
  if (isMockEnabled()) {
    return mockCategories
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    return (data || []) as Category[]
  } catch (err) {
    console.error('Failed to load settings categories:', err)
    return []
  }
}

export default async function AdminSettingsPage() {
  const categories = await getSettingsCategoriesData()

  return <SettingsManager initialCategories={categories} />
}
