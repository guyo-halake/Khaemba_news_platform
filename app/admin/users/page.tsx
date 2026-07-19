import UsersManager from '@/components/admin/UsersManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockUsers } from '@/lib/supabase/mockDb'
import { User } from '@/lib/types'

export const metadata = {
  title: 'Staff Directory | Staff Portal',
}

async function getUsersManagementData() {
  if (isMockEnabled()) {
    return mockUsers
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('full_name', { ascending: true })

    return (data || []) as User[]
  } catch (err) {
    console.error('Failed to load users management data:', err)
    return []
  }
}

export default async function AdminUsersPage() {
  const users = await getUsersManagementData()

  return <UsersManager initialUsers={users} />
}
