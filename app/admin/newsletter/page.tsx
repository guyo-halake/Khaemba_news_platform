import NewsletterManager from '@/components/admin/NewsletterManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockSubscribers, mockNewsletters } from '@/lib/supabase/mockDb'

export const metadata = {
  title: 'Newsletter Dispatch | Staff Portal',
}

async function getNewsletterData(tenantId: string) {
  if (isMockEnabled()) {
    return {
      subscribers: mockSubscribers,
      dispatches: mockNewsletters
    }
  }

  try {
    const supabase = createClient()

    const { data: subscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('subscribed_at', { ascending: false })

    const { data: dispatches } = await supabase
      .from('newsletter_sent')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('sent_at', { ascending: false })

    return {
      subscribers: subscribers || [],
      dispatches: dispatches || []
    }
  } catch (err) {
    console.error('Failed to load newsletter data:', err)
    return { subscribers: [], dispatches: [] }
  }
}

export default async function AdminNewsletterPage() {
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

  const { subscribers, dispatches } = await getNewsletterData(tenantId)

  return (
    <NewsletterManager
      initialSubscribers={subscribers}
      initialDispatches={dispatches}
      tenantId={tenantId}
    />
  )
}
