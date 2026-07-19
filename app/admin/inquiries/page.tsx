import InquiriesManager from '@/components/admin/InquiriesManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockInquiries } from '@/lib/supabase/mockDb'

export const metadata = {
  title: 'Reader Inquiries Inbox | Staff Portal',
}

async function getInquiriesData(tenantId: string) {
  if (isMockEnabled()) {
    return mockInquiries
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    return data || []
  } catch (err) {
    console.error('Failed to load inquiries data:', err)
    return []
  }
}

export default async function AdminInquiriesPage() {
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

  const inquiries = await getInquiriesData(tenantId)

  return (
    <InquiriesManager
      initialInquiries={inquiries}
      tenantId={tenantId}
    />
  )
}
