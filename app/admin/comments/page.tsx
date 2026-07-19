import CommentsModerator from '@/components/admin/CommentsModerator'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockComments } from '@/lib/supabase/mockDb'
import { Comment } from '@/lib/types'

export const metadata = {
  title: 'Moderation Queue | Staff Portal',
}

async function getCommentsModerationData(tenantId: string) {
  if (isMockEnabled()) {
    // Sort descending by created_at
    const sorted = [...mockComments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return sorted
  }

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    return (data || []) as Comment[]
  } catch (err) {
    console.error('Failed to load comments moderation data:', err)
    return []
  }
}

export default async function AdminCommentsPage() {
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

  const comments = await getCommentsModerationData(tenantId)

  return <CommentsModerator initialComments={comments} tenantId={tenantId} />
}
