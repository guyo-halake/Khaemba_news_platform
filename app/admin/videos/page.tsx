import VideosManager from '@/components/admin/VideosManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockVideos, mockCategories } from '@/lib/supabase/mockDb'
import { Video, Category } from '@/lib/types'

export const metadata = {
  title: 'Manage Videos | Staff Portal',
}

async function getVideosManagementData(tenantId: string) {
  if (isMockEnabled()) {
    return {
      videos: mockVideos,
      categories: mockCategories
    }
  }

  try {
    const supabase = createClient()
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)

    const { data: videos } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    return {
      videos: (videos || []) as Video[],
      categories: (categories || []) as Category[]
    }
  } catch (err) {
    console.error('Failed to load videos management data:', err)
    return { videos: [], categories: [] }
  }
}

export default async function AdminVideosPage() {
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

  const { videos, categories } = await getVideosManagementData(tenantId)

  return <VideosManager initialVideos={videos} categories={categories} tenantId={tenantId} />
}
