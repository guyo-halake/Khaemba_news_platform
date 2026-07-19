import VideosManager from '@/components/admin/VideosManager'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockVideos, mockCategories } from '@/lib/supabase/mockDb'
import { Video, Category } from '@/lib/types'

export const metadata = {
  title: 'Manage Videos | Staff Portal',
}

async function getVideosManagementData() {
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

    const { data: videos } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
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
  const { videos, categories } = await getVideosManagementData()

  return <VideosManager initialVideos={videos} categories={categories} />
}
