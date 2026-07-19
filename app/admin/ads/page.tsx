import AdsManager from '@/components/admin/AdsManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockAds, mockAdClients, mockAdPayments } from '@/lib/supabase/mockDb'
import { Ad } from '@/lib/types'

export const metadata = {
  title: 'Ad Campaigns & Revenue Ledger | Staff Portal',
}

async function getAdsManagementData(tenantId: string) {
  if (isMockEnabled()) {
    return {
      ads: mockAds,
      clients: mockAdClients,
      payments: mockAdPayments
    }
  }

  try {
    const supabase = createClient()
    
    // Fetch Ads
    const { data: ads } = await supabase
      .from('ads')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    // Fetch Clients
    const { data: clients } = await supabase
      .from('ad_clients')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    // Fetch Payments
    const { data: payments } = await supabase
      .from('ad_payments')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    return {
      ads: (ads || []) as Ad[],
      clients: (clients || []) as any[],
      payments: (payments || []) as any[]
    }
  } catch (err) {
    console.error('Failed to load ads management data:', err)
    return { ads: [], clients: [], payments: [] }
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

  const { ads, clients, payments } = await getAdsManagementData(tenantId)

  return (
    <AdsManager
      initialAds={ads}
      initialClients={clients}
      initialPayments={payments}
      tenantId={tenantId}
    />
  )
}
