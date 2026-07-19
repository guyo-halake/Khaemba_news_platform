import UsersManager from '@/components/admin/UsersManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockUsers } from '@/lib/supabase/mockDb'
import { User } from '@/lib/types'

export const metadata = {
  title: 'Staff Directory | Staff Portal',
}

async function getUsersManagementData(tenantId: string) {
  if (isMockEnabled()) {
    return mockUsers
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('full_name', { ascending: true })

    return (data || []) as User[]
  } catch (err) {
    console.error('Failed to load users management data:', err)
    return []
  }
}

export default async function AdminUsersPage() {
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

  const users = await getUsersManagementData(tenantId)

  return <UsersManager initialUsers={users} tenantId={tenantId} />
}
