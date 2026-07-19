import Sidebar from '@/components/admin/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled } from '@/lib/supabase/mockDb'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

async function getAdminSession() {
  const cookieStore = cookies()

  if (isMockEnabled()) {
    const isLoggedIn = cookieStore.get('mock_logged_in')?.value === 'true'
    if (!isLoggedIn) return null

    const role = (cookieStore.get('mock_user_role')?.value || 'admin') as 'admin' | 'editor' | 'contributor'
    const name = cookieStore.get('mock_user_name')?.value || 'Guest Admin'

    return {
      user: {
        id: 'mock-staff',
        name,
        role,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      }
    }
  }

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
      .from('users')
      .select('full_name, role, avatar_url')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    return {
      user: {
        id: user.id,
        name: profile.full_name,
        role: profile.role as 'admin' | 'editor' | 'contributor',
        avatar: profile.avatar_url || undefined
      }
    }
  } catch (err) {
    console.error('Admin layout auth catch:', err)
    return null
  }
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = headers().get('x-pathname') || ''

  // Bypass authentication redirection and sidebar frame if we are on the login page
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  const session = await getAdminSession()

  // Redirect to login if unauthenticated
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="flex bg-paper-warm dark:bg-paper-dark min-h-screen text-ink-navy dark:text-gray-100 transition-colors duration-200">
      {/* Admin Navigation Sidebar */}
      <Sidebar user={session.user} />

      {/* Main Admin Workspace Panel */}
      <div className="flex-grow h-screen overflow-y-auto p-6 md:p-10">
        {children}
      </div>
    </div>
  )
}
