import AdsManager from '@/components/admin/AdsManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockAds } from '@/lib/supabase/mockDb'
import { Ad } from '@/lib/types'

export const metadata = {
  title: 'Ad Campaigns Manager | Staff Portal',
}

async function getAdsManagementData(tenantId: string) {
  if (isMockEnabled()) {
    return mockAds
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('ads')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    return (data || []) as Ad[]
  } catch (err) {
    console.error('Failed to load ads management data:', err)
    return []
  }
}

export default async function AdminAdsPage() {
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

  const ads = await getAdsManagementData(tenantId)

  return <AdsManager initialAds={ads} tenantId={tenantId} />
}
