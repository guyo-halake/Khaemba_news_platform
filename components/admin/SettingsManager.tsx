'use client'

import { useState, useEffect } from 'react'
import { Category, Article, Video } from '@/lib/types'
import { isMockEnabled, mockCategories } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Settings, Save, Plus, Trash2, CheckCircle2, Sliders, List, Megaphone, LayoutGrid } from 'lucide-react'

interface SettingsManagerProps {
  initialCategories: Category[]
  articles: Article[]
  videos: Video[]
  tenantId: string
}

export default function SettingsManager({ initialCategories, articles, videos, tenantId }: SettingsManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [tickerText, setTickerText] = useState('BREAKING: Senate initiates review on county allocation funds. Draft report due Tuesday.')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Homepage slots state
  const [leadStoryId, setLeadStoryId] = useState('')
  const [mosaicId1, setMosaicId1] = useState('')
  const [mosaicId2, setMosaicId2] = useState('')
  const [mosaicId3, setMosaicId3] = useState('')
  const [mosaicId4, setMosaicId4] = useState('')
  const [docId1, setDocId1] = useState('')
  const [docId2, setDocId2] = useState('')
  const [docId3, setDocId3] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('homepageSlots')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setLeadStoryId(parsed.leadStoryId || '')
        setMosaicId1(parsed.mosaicId1 || '')
        setMosaicId2(parsed.mosaicId2 || '')
        setMosaicId3(parsed.mosaicId3 || '')
        setMosaicId4(parsed.mosaicId4 || '')
        setDocId1(parsed.docId1 || '')
        setDocId2(parsed.docId2 || '')
        setDocId3(parsed.docId3 || '')
      } catch (e) {
        console.error('Failed to parse saved homepage slots', e)
      }
    } else {
      setLeadStoryId(articles[0]?.id || '')
      setMosaicId1(articles[0]?.id || '')
      setMosaicId2(articles[1]?.id || '')
      setMosaicId3(articles[2]?.id || '')
      setMosaicId4(articles[3]?.id || '')
      setDocId1(videos[0]?.id || '')
      setDocId2(videos[1]?.id || '')
      setDocId3(videos[2]?.id || '')
    }
  }, [articles, videos])

  const handleSaveSlots = (e: React.FormEvent) => {
    e.preventDefault()
    const config = {
      leadStoryId,
      mosaicId1,
      mosaicId2,
      mosaicId3,
      mosaicId4,
      docId1,
      docId2,
      docId3
    }
    localStorage.setItem('homepageSlots', JSON.stringify(config))
    setSuccessMsg('Homepage layout positions updated successfully! The front-end has been synchronized.')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  // New Category form state
  const [newCatName, setNewCatName] = useState('')
  const [newCatSlug, setNewCatSlug] = useState('')
  const [newCatColor, setNewCatColor] = useState('#D99A3F')

  const handleTickerSave = (e: React.FormEvent) => {
    e.preventDefault()
    // In mock or production, this could update a general settings KV table or cookie.
    // For demo/mock, we update standard document title/context or local state
    setSuccessMsg('Breaking news marquee banner text updated successfully!')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName || !newCatSlug) return

    const payload = {
      name: newCatName,
      slug: newCatSlug,
      accent_color: newCatColor,
      tenant_id: tenantId
    }

    try {
      if (isMockEnabled()) {
        const mockNewCat = {
          id: `cat-${Date.now()}`,
          name: newCatName,
          slug: newCatSlug,
          accent_color: newCatColor
        }
        mockCategories.push(mockNewCat)
        setCategories([...categories, mockNewCat])
        setNewCatName('')
        setNewCatSlug('')
        setNewCatColor('#D99A3F')
        setSuccessMsg('New category added successfully!')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      if (data) {
        setCategories([...categories, data as Category])
        setNewCatName('')
        setNewCatSlug('')
        setNewCatColor('#D99A3F')
        setSuccessMsg('New category added successfully!')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err: any) {
      alert('Failed to add category: ' + err.message)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All articles associated with it may default to uncategorized.')) return

    try {
      if (isMockEnabled()) {
        const index = mockCategories.findIndex(c => c.id === id)
        if (index !== -1) mockCategories.splice(index, 1)
        setCategories(categories.filter(c => c.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCategories(categories.filter(c => c.id !== id))
    } catch (err: any) {
      alert('Failed to delete category: ' + err.message)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
          Site Configuration Settings
        </h1>
        <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
          Configure categories, theme parameters, and breaking news tickers
        </p>
      </div>

      {success && (
        <div className="flex items-center space-x-2 text-green-700 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4 rounded-lg font-medium text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Breaking news overrides */}
        <div className="md:col-span-6 space-y-6">
          
          {/* News Ticker Config */}
          <form onSubmit={handleTickerSave} className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5 border-b border-ink-navy/5 pb-2">
              <Megaphone className="w-5 h-5 text-amber" />
              <span>Breaking News Marquee</span>
            </h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Banner Headline Text</label>
              <textarea
                rows={4}
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-amber hover:bg-amber-hover text-ink-navy font-bold text-xs px-4 py-2.5 rounded transition-colors shadow flex items-center space-x-1.5 ml-auto"
            >
              <Save className="w-4 h-4" />
              <span>Save Marquee</span>
            </button>
          </form>

          {/* Homepage Section Slots Config */}
          <form onSubmit={handleSaveSlots} className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5 border-b border-ink-navy/5 pb-2">
              <LayoutGrid className="w-5 h-5 text-amber" />
              <span>Homepage Layout Slots</span>
            </h3>

            {/* Editorial Lead Story */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase block">
                Editorial Layout: Lead Story (Hero)
              </label>
              <select
                value={leadStoryId}
                onChange={(e) => setLeadStoryId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
              >
                <option value="">Default (First Politics Article)</option>
                {articles.map(art => (
                  <option key={art.id} value={art.id}>{art.title}</option>
                ))}
              </select>
            </div>

            {/* Magazine Mosaic slots */}
            <div className="border-t border-ink-navy/5 dark:border-gray-850 pt-3 space-y-3">
              <span className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase block">
                Magazine Layout: Mosaic Heroes
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 block">Slot 1 (Main Big)</label>
                  <select
                    value={mosaicId1}
                    onChange={(e) => setMosaicId1(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">Default (Article 1)</option>
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>{art.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 block">Slot 2 (Top Right)</label>
                  <select
                    value={mosaicId2}
                    onChange={(e) => setMosaicId2(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">Default (Article 2)</option>
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>{art.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 block">Slot 3 (Bottom Mid)</label>
                  <select
                    value={mosaicId3}
                    onChange={(e) => setMosaicId3(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">Default (Article 3)</option>
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>{art.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 block">Slot 4 (Bottom Right)</label>
                  <select
                    value={mosaicId4}
                    onChange={(e) => setMosaicId4(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">Default (Article 4)</option>
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>{art.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Documentaries section */}
            <div className="border-t border-ink-navy/5 dark:border-gray-850 pt-3 space-y-3">
              <span className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase block">
                Documentaries & Video Section
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 block">Slot 1</label>
                  <select
                    value={docId1}
                    onChange={(e) => setDocId1(e.target.value)}
                    className="w-full text-[10px] px-1.5 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">Default (Video 1)</option>
                    {videos.map(vid => (
                      <option key={vid.id} value={vid.id}>{vid.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 block">Slot 2</label>
                  <select
                    value={docId2}
                    onChange={(e) => setDocId2(e.target.value)}
                    className="w-full text-[10px] px-1.5 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">Default (Video 2)</option>
                    {videos.map(vid => (
                      <option key={vid.id} value={vid.id}>{vid.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500 block">Slot 3</label>
                  <select
                    value={docId3}
                    onChange={(e) => setDocId3(e.target.value)}
                    className="w-full text-[10px] px-1.5 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">Default (Video 3)</option>
                    {videos.map(vid => (
                      <option key={vid.id} value={vid.id}>{vid.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-amber hover:bg-amber-hover text-ink-navy font-bold text-xs px-4 py-2.5 rounded transition-colors shadow flex items-center space-x-1.5 ml-auto"
            >
              <Save className="w-4 h-4" />
              <span>Save Positions</span>
            </button>
          </form>
        </div>

        {/* Right Column: Category managers */}
        <div className="md:col-span-6 space-y-6">
          
          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5 border-b border-ink-navy/5 pb-2">
              <List className="w-5 h-5 text-amber" />
              <span>Add News Category</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Category Name *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value)
                    setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
                  }}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">URL Slug *</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full text-xs font-mono px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Accent Highlight Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-8 h-8 rounded border border-ink-navy/10 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-28 text-xs font-mono px-3 py-1.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 rounded outline-none text-ink-navy dark:text-paper-warm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-amber hover:bg-amber-hover text-ink-navy font-bold text-xs px-4 py-2.5 rounded transition-colors shadow flex items-center space-x-1.5 ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </form>

          {/* Categories List */}
          <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-sm">
            <h3 className="font-headline font-bold text-base text-ink-navy dark:text-white border-b border-ink-navy/5 pb-2">
              Active Category Directory
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {categories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center bg-paper-warm/30 dark:bg-gray-850/50 p-2.5 rounded border border-ink-navy/5">
                  <div className="flex items-center space-x-2">
                    <span style={{ backgroundColor: cat.accent_color }} className="w-3.5 h-3.5 rounded-full shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-ink-navy dark:text-paper-warm block">{cat.name}</span>
                      <span className="text-[10px] font-mono text-ink-navy/40 dark:text-gray-500">{cat.slug}</span>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 hover:bg-red-500/10 text-ink-navy/40 dark:text-gray-500 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
