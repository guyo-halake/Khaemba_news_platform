import AdsManager from '@/components/admin/AdsManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockAds } from '@/lib/supabase/mockDb'
import { Ad } from '@/lib/types'

export const metadata = {
  title: 'Ad Campaigns Manager | Staff Portal',
}

async function getAdsManagementData() {
  if (isMockEnabled()) {
    return mockAds
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false })

    return (data || []) as Ad[]
  } catch (err) {
    console.error('Failed to load ads management data:', err)
    return []
  }
}

export default async function AdminAdsPage() {
  const ads = await getAdsManagementData()

  return <AdsManager initialAds={ads} />
}
