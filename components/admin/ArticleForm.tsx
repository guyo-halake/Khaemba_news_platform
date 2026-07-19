'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Article, Category, ArticleBlock } from '@/lib/types'
import { isMockEnabled, createArticle, updateArticle } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import BlockEditor from './BlockEditor'
import { Save, ArrowLeft, Eye, HelpCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface ArticleFormProps {
  article?: Article
  categories: Category[]
  tenantId: string
  authorId: string
}

export default function ArticleForm({ article, categories, tenantId, authorId }: ArticleFormProps) {
  const router = useRouter()
  const isEditing = !!article

  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [categoryId, setCategoryId] = useState(article?.category_id || categories[0]?.id || '')
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featured_image_url || '')
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status || 'draft')
  const [tagsInput, setTagsInput] = useState(article?.tags?.join(', ') || '')
  const [blocks, setBlocks] = useState<ArticleBlock[]>(article?.body || [])

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  // Auto-generate slug from title (if not custom edited)
  useEffect(() => {
    if (!isEditing && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setSlug(generated)
    }
  }, [title, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !categoryId || !featuredImageUrl) {
      alert('Please fill out all required fields: Title, Slug, Category, and Featured Image.')
      return
    }

    setSaving(true)
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    const payload = {
      title,
      slug,
      excerpt,
      category_id: categoryId,
      featured_image_url: featuredImageUrl,
      status,
      tags,
      body: blocks,
    }

    try {
      if (isMockEnabled()) {
        if (isEditing && article) {
          updateArticle(article.id, payload)
        } else {
          createArticle({
            ...payload,
            author_id: 'mock-staff',
            view_count: 0
          })
        }
        
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/articles')
          router.refresh()
        }, 1000)
        return
      }

      // Supabase Save pipeline
      const supabase = createClient()
      
      if (isEditing && article) {
        const { error } = await supabase
          .from('articles')
          .update({
            ...payload,
            updated_at: new Date().toISOString()
          })
          .eq('id', article.id)
          .eq('tenant_id', tenantId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('articles')
          .insert({
            ...payload,
            author_id: authorId || null,
            tenant_id: tenantId,
            view_count: 0,
            published_at: status === 'published' ? new Date().toISOString() : null
          })

        if (error) throw error
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/articles')
        router.refresh()
      }, 1000)

    } catch (err: any) {
      console.error(err)
      alert('Save operation failed: ' + (err.message || err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/articles"
            className="p-2 hover:bg-white dark:hover:bg-gray-800 border border-ink-navy/10 dark:border-gray-800 rounded text-ink-navy/60 dark:text-gray-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white leading-none">
              {isEditing ? 'Modify Article' : 'Write New Article'}
            </h1>
            <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400 mt-1">
              {isEditing ? 'Editing existing publication details' : 'Drafting new county intelligence dispatch'}
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-center space-x-2 text-green-700 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4 rounded-lg font-medium text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>Article saved successfully! Redirecting back to management index...</span>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Core Details + Block Composition */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-sm">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Devolution Funding Stalemate Blocks Sub-County Infrastructure"
                className="w-full text-base font-headline font-bold px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Slug / URI Path *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="devolution-funding-stalemate"
                  className="w-full text-xs font-mono px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Summary Excerpt / Subheading</label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief overview displayed in grids and index feeds to attract readers..."
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm resize-none"
              />
            </div>
          </div>

          {/* Block-based Compositions */}
          <div className="space-y-3">
            <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white pl-1">
              Article Content Blocks
            </h3>
            <BlockEditor initialBlocks={blocks} onChange={setBlocks} />
          </div>
        </div>

        {/* Right Column: Settings & Meta Parameters */}
        <aside className="lg:col-span-4 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-6 shadow-sm">
          <h3 className="font-mono text-xs font-bold tracking-widest text-ink-navy dark:text-paper-warm border-b border-ink-navy/5 pb-2 uppercase">
            Publication Params
          </h3>

          {/* Status Settings */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Status</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`flex-1 text-center py-2 text-xs font-mono font-bold rounded border ${
                  status === 'draft'
                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30'
                    : 'bg-transparent border-ink-navy/10 dark:border-gray-700 text-ink-navy/70 dark:text-gray-400 hover:bg-paper-warm/40 dark:hover:bg-gray-800'
                }`}
              >
                DRAFT
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`flex-1 text-center py-2 text-xs font-mono font-bold rounded border ${
                  status === 'published'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
                    : 'bg-transparent border-ink-navy/10 dark:border-gray-700 text-ink-navy/70 dark:text-gray-400 hover:bg-paper-warm/40 dark:hover:bg-gray-800'
                }`}
              >
                PUBLISHED
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Featured Image URL *</label>
            <input
              type="text"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/photo-..."
              className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
              required
            />
            {featuredImageUrl && (
              <div className="relative aspect-video w-full rounded overflow-hidden mt-2 border border-ink-navy/5">
                <img src={featuredImageUrl} alt="Featured Preview" className="object-cover w-full h-full" />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="devolution, budget, treasury, governance"
              className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
            />
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-amber hover:bg-amber-hover text-ink-navy font-bold text-xs py-3 rounded transition-colors shadow flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-ink-navy border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Publication</span>
              </>
            )}
          </button>
        </aside>
      </form>
    </div>
  )
}
