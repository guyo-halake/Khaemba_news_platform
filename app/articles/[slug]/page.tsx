import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import AdWindow from '@/components/public/AdWindow'
import CommentsSection from '@/components/public/CommentsSection'
import ArticleCard from '@/components/public/ArticleCard'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles } from '@/lib/supabase/mockDb'
import { Article, ArticleBlock } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Clock, Eye, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function getArticleData(slug: string) {
  if (isMockEnabled()) {
    const article = mockArticles.find(a => a.slug === slug && a.status === 'published')
    if (!article) return { article: null, related: [] }

    // Increment views in mock database
    article.view_count += 1

    const related = mockArticles
      .filter(a => a.category_id === article.category_id && a.id !== article.id && a.status === 'published')
      .slice(0, 3)

    return { article, related }
  }

  try {
    const supabase = createClient()

    // Fetch primary article
    const { data: article, error } = await supabase
      .from('articles')
      .select('*, category:categories(*), author:users(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !article) {
      return { article: null, related: [] }
    }

    // Increment view count in Supabase
    await supabase
      .rpc('increment_article_views', { article_id: article.id })
      .catch(() => {
        // Fallback standard update if RPC function is missing
        supabase.from('articles').update({ view_count: article.view_count + 1 }).eq('id', article.id)
      })

    // Fetch related articles
    const { data: related } = await supabase
      .from('articles')
      .select('*, category:categories(*), author:users(*)')
      .eq('category_id', article.category_id)
      .eq('status', 'published')
      .neq('id', article.id)
      .limit(3)

    return {
      article: article as Article,
      related: (related || []) as Article[]
    }
  } catch (err) {
    console.error('Failed to load article detail:', err)
    return { article: null, related: [] }
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { article, related } = await getArticleData(params.slug)

  if (!article) {
    notFound()
  }

  const categoryColor = article.category?.accent_color || '#D99A3F'
  const dateStr = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : 'Draft'

  // Render Editor Blocks
  const renderBlocks = (blocks: ArticleBlock[]) => {
    return blocks.map((block, index) => {
      const rendered = (() => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={block.id} className="text-base sm:text-lg leading-relaxed text-ink-navy/85 dark:text-gray-300 mb-6 font-serif">
                {block.value}
              </p>
            )
          case 'heading':
            const Level = block.meta?.level === 1 ? 'h1' : block.meta?.level === 3 ? 'h3' : 'h2'
            const sizeClass = block.meta?.level === 1 ? 'text-3xl' : block.meta?.level === 3 ? 'text-xl' : 'text-2xl'
            return (
              <Level key={block.id} className={`font-headline font-black ${sizeClass} text-ink-navy dark:text-paper-warm mt-8 mb-4`}>
                {block.value}
              </Level>
            )
          case 'quote':
            return (
              <blockquote key={block.id} className="border-l-4 border-amber pl-4 italic text-lg text-ink-navy/80 dark:text-gray-200 my-6 font-headline bg-amber/5 py-4 pr-4 rounded-r">
                &ldquo;{block.value}&rdquo;
              </blockquote>
            )
          case 'image':
            return (
              <figure key={block.id} className="my-8">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={block.value}
                    alt={block.meta?.caption || 'Article image'}
                    className="object-cover w-full h-full"
                  />
                </div>
                {block.meta?.caption && (
                  <figcaption className="text-xs text-center text-ink-navy/50 dark:text-gray-500 font-mono mt-2">
                    {block.meta.caption}
                  </figcaption>
                )}
              </figure>
            )
          case 'video':
          case 'embed':
            if (block.value === 'ad_marker') {
              return <AdWindow key={block.id} position="article_inline" />
            }
            return (
              <div key={block.id} className="my-8 aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  src={block.value}
                  title="Embed Player"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )
          default:
            return null
        }
      })()

      // Automatic ad placement after block index 2 (3rd block) if no explicit ad block exists
      if (index === 2 && !blocks.some(b => b.value === 'ad_marker')) {
        return (
          <div key={`inline-ad-wrapper-${block.id}`} className="space-y-6">
            {rendered}
            <AdWindow position="article_inline" />
          </div>
        )
      }

      return rendered
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono mb-4 text-ink-navy/60 dark:text-gray-400">
          <Link href="/" className="hover:text-amber">HOME</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/category/${article.category?.slug}`} style={{ color: categoryColor }} className="hover:underline font-bold uppercase">
            {article.category?.name}
          </Link>
        </nav>

        {/* Article Header */}
        <article className="space-y-6">
          <h1 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-ink-navy dark:text-paper-warm leading-tight">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-ink-navy/70 dark:text-gray-300 font-serif leading-relaxed italic border-l-2 border-amber/30 pl-4 py-1">
            {article.excerpt}
          </p>

          {/* Author & Metas */}
          <div className="flex flex-wrap items-center justify-between border-t border-b border-ink-navy/10 dark:border-gray-800 py-4 gap-4">
            <div className="flex items-center space-x-3">
              {article.author?.avatar_url && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber/30">
                  <Image
                    src={article.author.avatar_url}
                    alt={article.author.full_name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-ink-navy dark:text-paper-warm">
                  {article.author?.full_name || 'Staff Writer'}
                </p>
                <p className="text-[10px] font-mono text-ink-navy/50 dark:text-gray-500 uppercase tracking-wider">
                  {article.author?.role || 'Contributor'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono text-ink-navy/60 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{dateStr}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-amber" />
                <span>{article.view_count} views</span>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-sm">
            <Image
              src={article.featured_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>

          {/* Share Bar & Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            
            {/* Sticky Share Bar */}
            <div className="md:col-span-1 flex md:flex-col items-center md:items-start space-x-4 md:space-x-0 md:space-y-4 md:sticky md:top-24 h-fit border-b md:border-b-0 pb-4 md:pb-0">
              <span className="text-[10px] font-mono font-bold tracking-wider text-ink-navy/40 dark:text-gray-500 uppercase">
                SHARE
              </span>
              <button className="p-2 rounded bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 text-ink-navy/60 dark:text-gray-400 hover:text-amber transition-colors hover:shadow-sm" aria-label="Share Facebook">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="p-2 rounded bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 text-ink-navy/60 dark:text-gray-400 hover:text-amber transition-colors hover:shadow-sm" aria-label="Share Twitter">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 text-ink-navy/60 dark:text-gray-400 hover:text-amber transition-colors hover:shadow-sm" aria-label="Copy Link">
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Rich Content Render */}
            <div className="md:col-span-11 prose prose-lg dark:prose-invert max-w-none">
              {renderBlocks(article.body)}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <CommentsSection articleId={article.id} />

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-ink-navy/10 dark:border-gray-800">
            <h3 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(art => (
                <ArticleCard key={art.id} article={art} variant="grid" />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
