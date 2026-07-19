'use client'

import { useState } from 'react'
import { Article, Category } from '@/lib/types'
import { isMockEnabled, deleteArticle, updateArticleStatus } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Edit, Trash2, Search, Filter, Plus, CheckCircle, Clock, Eye, AlertCircle } from 'lucide-react'

interface ArticlesTableProps {
  initialArticles: Article[]
  categories: Category[]
  tenantId?: string
}

export default function ArticlesTable({ initialArticles, categories, tenantId }: ArticlesTableProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return

    try {
      if (isMockEnabled()) {
        deleteArticle(id)
        setArticles(articles.filter(a => a.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Failed to delete: ' + error.message)
      } else {
        setArticles(articles.filter(a => a.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusToggle = async (id: string, currentStatus: 'draft' | 'published') => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    try {
      if (isMockEnabled()) {
        updateArticleStatus(id, nextStatus)
        setArticles(articles.map(a => (a.id === id ? { ...a, status: nextStatus } : a)))
        return
      }

      const supabase = createClient()
      const updateData: any = { status: nextStatus }
      if (nextStatus === 'published') {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)

      if (error) {
        alert('Failed to update status: ' + error.message)
      } else {
        setArticles(articles.map(a => (a.id === id ? { ...a, status: nextStatus, published_at: updateData.published_at || a.published_at } : a)))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || art.category_id === selectedCategory
    const matchesStatus = selectedStatus === 'all' || art.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
            Manage Articles
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
            Publish and edit news dispatches
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded shadow transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-4 shadow-sm">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink-navy/40 dark:text-gray-550" />
          <input
            type="text"
            placeholder="Search article titles & excerpts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                <th className="px-6 py-4">Title & Excerpt</th>
                <th className="px-6 py-4 hidden sm:table-cell">Category</th>
                <th className="px-6 py-4 hidden md:table-cell">Views</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 hidden lg:table-cell">Published Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/80 text-xs">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-550">
                    No articles found matching filters.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(art => (
                  <tr key={art.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                    {/* Title */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="space-y-1">
                        <Link href={`/articles/${art.slug}`} target="_blank" className="font-headline font-bold text-sm text-ink-navy dark:text-paper-warm hover:text-amber transition-colors line-clamp-1">
                          {art.title}
                        </Link>
                        <p className="text-[10px] text-ink-navy/60 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span
                        style={{ borderLeftColor: art.category?.accent_color || '#d99a3f' }}
                        className="pl-2 border-l-2 text-[10px] font-mono font-bold text-ink-navy/70 dark:text-gray-300 uppercase"
                      >
                        {art.category?.name || 'Unassigned'}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 hidden md:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5 text-amber" />
                        <span>{art.view_count}</span>
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(art.id, art.status)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                          art.status === 'published'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 hover:bg-green-500/25'
                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/25'
                        }`}
                      >
                        {art.status === 'published' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Published Date */}
                    <td className="px-6 py-4 hidden lg:table-cell font-mono text-[10px] text-ink-navy/50 dark:text-gray-500">
                      {art.published_at
                        ? new Date(art.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/articles/${art.id}`}
                          className="p-1.5 hover:bg-amber/15 text-ink-navy/60 dark:text-gray-400 hover:text-amber rounded transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-ink-navy/60 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
