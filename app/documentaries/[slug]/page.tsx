import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import VideoCard from '@/components/public/VideoCard'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockVideos } from '@/lib/supabase/mockDb'
import { Video } from '@/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Eye, Clock, Calendar, ArrowLeft, Share2, Facebook, Twitter } from 'lucide-react'

interface VideoPageProps {
  params: {
    slug: string
  }
}

async function getVideoDetailData(slug: string) {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

  if (isMockEnabled()) {
    const video = mockVideos.find(v => v.slug === slug && v.status === 'published')
    if (!video) return { video: null, related: [] }

    // Increment views
    video.view_count += 1

    const related = mockVideos
      .filter(v => v.id !== video.id && v.status === 'published')
      .slice(0, 3)

    return { video, related }
  }

  try {
    const supabase = createClient()
    const { data: video, error } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('tenant_id', tenantId)
      .single()

    if (error || !video) {
      return { video: null, related: [] }
    }

    // Increment watch count in Supabase
    await supabase
      .rpc('increment_video_views', { video_id: video.id })
      .catch(() => {
        supabase.from('videos').update({ view_count: video.view_count + 1 }).eq('id', video.id).eq('tenant_id', tenantId)
      })

    // Fetch related videos
    const { data: related } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .eq('tenant_id', tenantId)
      .neq('id', video.id)
      .limit(3)

    return {
      video: video as Video,
      related: (related || []) as Video[]
    }
  } catch (err) {
    console.error('Failed to load video detail:', err)
    return { video: null, related: [] }
  }
}

export default async function DocumentaryDetailPage({ params }: VideoPageProps) {
  const { video, related } = await getVideoDetailData(params.slug)

  if (!video) {
    notFound()
  }

  // Parse embed links
  const getEmbedUrl = (url: string, type: 'youtube' | 'vimeo' | 'uploaded') => {
    if (type === 'youtube') {
      let videoId = ''
      try {
        if (url.includes('youtube.com/watch')) {
          const urlObj = new URL(url)
          videoId = urlObj.searchParams.get('v') || ''
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
        } else if (url.includes('youtube.com/embed/')) {
          return url
        }
      } catch (e) {}
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0` : url
    }
    if (type === 'vimeo') {
      let videoId = ''
      try {
        if (url.includes('vimeo.com/')) {
          videoId = url.split('vimeo.com/')[1]?.split('?')[0] || ''
        }
      } catch (e) {}
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url
    }
    return url // Native MP4 upload path
  }

  const embedUrl = getEmbedUrl(video.video_url, video.video_source_type)

  const dateStr = video.published_at
    ? new Date(video.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Draft'

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8">
        {/* Back Link */}
        <Link href="/documentaries" className="inline-flex items-center space-x-1.5 text-xs font-mono text-ink-navy/60 dark:text-gray-400 hover:text-amber transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO VIDEO HUB</span>
        </Link>

        {/* Video Player Section */}
        <section className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video w-full border border-gray-800 relative">
          {video.video_source_type === 'uploaded' ? (
            <video
              src={video.video_url}
              controls
              className="w-full h-full object-contain"
              poster={video.thumbnail_url}
            />
          ) : (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </section>

        {/* Video Details */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-ink-navy/10 dark:border-gray-850 pb-10">
          <div className="lg:col-span-8 space-y-4">
            {video.category && (
              <span
                style={{ backgroundColor: video.category.accent_color }}
                className="text-[9px] font-mono font-bold text-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wider"
              >
                {video.category.name}
              </span>
            )}
            
            <h1 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-ink-navy dark:text-paper-warm leading-tight">
              {video.title}
            </h1>

            <p className="text-base text-ink-navy/80 dark:text-gray-300 leading-relaxed font-serif">
              {video.description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-5 space-y-4 shadow-sm">
            <h3 className="font-mono text-xs font-bold tracking-widest text-ink-navy dark:text-paper-warm border-b border-ink-navy/5 pb-2 uppercase">
              DOCUMENTARY META
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-ink-navy/50 dark:text-gray-400">Published:</span>
                <span className="font-bold text-ink-navy dark:text-paper-warm flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber shrink-0" />
                  <span>{dateStr}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-navy/50 dark:text-gray-400">Duration:</span>
                <span className="font-bold text-ink-navy dark:text-paper-warm flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber shrink-0" />
                  <span>{formatDuration(video.duration_seconds)}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-navy/50 dark:text-gray-400">Views:</span>
                <span className="font-bold text-ink-navy dark:text-paper-warm flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5 text-amber shrink-0" />
                  <span>{video.view_count.toLocaleString()} views</span>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-ink-navy/5 flex flex-wrap gap-2 justify-center">
              <button className="flex items-center space-x-1 text-[10px] font-mono font-bold bg-ink-navy text-white px-3 py-2 rounded hover:bg-amber hover:text-ink-navy transition-colors">
                <Facebook className="w-3 h-3" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-1 text-[10px] font-mono font-bold bg-ink-navy text-white px-3 py-2 rounded hover:bg-amber hover:text-ink-navy transition-colors">
                <Twitter className="w-3 h-3" />
                <span>Tweet</span>
              </button>
            </div>
          </div>
        </section>

        {/* Related Videos */}
        {related.length > 0 && (
          <section className="space-y-6 pt-4">
            <h3 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm">
              More Documentaries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(vid => (
                <VideoCard key={vid.id} video={vid} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
