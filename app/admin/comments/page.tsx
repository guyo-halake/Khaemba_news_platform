import CommentsModerator from '@/components/admin/CommentsModerator'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockComments } from '@/lib/supabase/mockDb'
import { Comment } from '@/lib/types'

export const metadata = {
  title: 'Moderation Queue | Staff Portal',
}

async function getCommentsModerationData() {
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
      .order('created_at', { ascending: false })

    return (data || []) as Comment[]
  } catch (err) {
    console.error('Failed to load comments moderation data:', err)
    return []
  }
}

export default async function AdminCommentsPage() {
  const comments = await getCommentsModerationData()

  return <CommentsModerator initialComments={comments} />
}
