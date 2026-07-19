import Link from 'next/link'
import Image from 'next/image'
import { Video } from '@/lib/types'
import { Play, Clock, Eye } from 'lucide-react'

interface VideoCardProps {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  const { title, slug, description, thumbnail_url, duration_seconds, view_count, category } = video

  // Format duration (e.g., 1450 seconds -> 24:10)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <article className="group bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      {/* Thumbnail Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <Image
          src={thumbnail_url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-103 group-hover:opacity-100"
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/45 transition-colors duration-300">
          <div className="p-3.5 bg-amber text-ink-navy rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <Play className="w-5 h-5 fill-ink-navy ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center space-x-1 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-white">
          <Clock className="w-3 h-3 text-amber" />
          <span>{formatDuration(duration_seconds)}</span>
        </div>

        {/* Category badge */}
        {category && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              style={{ backgroundColor: category.accent_color }}
              className="text-[9px] font-mono font-bold text-white px-2 py-0.5 rounded shadow-md uppercase"
            >
              {category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="space-y-1.5">
          <Link href={`/documentaries/${slug}`} className="block">
            <h3 className="font-headline font-bold text-base sm:text-lg text-ink-navy dark:text-paper-warm leading-snug group-hover:text-amber transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-ink-navy/70 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-3.5 mt-3.5 border-t border-ink-navy/5 dark:border-gray-800 flex items-center justify-between text-[10px] font-mono text-ink-navy/50 dark:text-gray-500">
          <span className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{view_count.toLocaleString()} views</span>
          </span>
          <Link
            href={`/documentaries/${slug}`}
            className="font-bold text-amber hover:text-amber-hover transition-colors font-sans uppercase tracking-wider text-[9px]"
          >
            Watch Now &rarr;
          </Link>
        </div>
      </div>
    </article>
  )
}
