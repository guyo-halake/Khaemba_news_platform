'use client'

import { useState, useEffect } from 'react'
import { Category, Article, Video, Ad } from '@/lib/types'
import { isMockEnabled, mockArticles, mockVideos, mockAds } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import {
  Sun,
  Layout,
  Layers,
  Settings,
  Eye,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Sliders,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Smartphone,
  Monitor,
  Menu,
  TrendingUp,
  Film,
  FileText,
  Percent,
  Compass
} from 'lucide-react'

// Define Widget Type
interface Widget {
  id: string
  type: 'hero' | 'grid' | 'trending' | 'videos' | 'ad'
  title: string
  categoryId: string // 'all' or specific category ID
  limit: number
  styleVariant: 'modern' | 'editorial' | 'compact' | 'split'
}

// Preset layouts for the two themes
const MINIMALIST_THEME_WIDGETS: Widget[] = [
  { id: 'w-1', type: 'hero', title: 'Top Story Broadcast', categoryId: 'all', limit: 1, styleVariant: 'modern' },
  { id: 'w-2', type: 'trending', title: 'Trending Dispatches', categoryId: 'all', limit: 4, styleVariant: 'modern' },
  { id: 'w-3', type: 'ad', title: 'Mid Page Advertisement', categoryId: 'homepage_mid', limit: 1, styleVariant: 'modern' },
  { id: 'w-4', type: 'grid', title: 'National & Business Insights', categoryId: 'cat-business', limit: 3, styleVariant: 'modern' },
  { id: 'w-5', type: 'videos', title: 'Featured Documentaries', categoryId: 'all', limit: 3, styleVariant: 'modern' }
]

const EDITORIAL_THEME_WIDGETS: Widget[] = [
  { id: 'w-1', type: 'ad', title: 'Premium Header Sponsor', categoryId: 'homepage_top', limit: 1, styleVariant: 'editorial' },
  { id: 'w-2', type: 'hero', title: 'Editorial Spotlight', categoryId: 'cat-politics', limit: 1, styleVariant: 'split' },
  { id: 'w-3', type: 'grid', title: 'Breaking Updates', categoryId: 'all', limit: 4, styleVariant: 'editorial' },
  { id: 'w-4', type: 'videos', title: 'Investigative Documentaries', categoryId: 'all', limit: 2, styleVariant: 'editorial' },
  { id: 'w-5', type: 'grid', title: 'Sports Special Edition', categoryId: 'cat-sports', limit: 3, styleVariant: 'compact' }
]

interface ThemeCustomizerProps {
  categories: Category[]
  tenantId: string
}

export default function ThemeCustomizer({ categories, tenantId }: ThemeCustomizerProps) {
  const [selectedTheme, setSelectedTheme] = useState<'minimalist' | 'editorial'>('minimalist')
  const [widgets, setWidgets] = useState<Widget[]>(MINIMALIST_THEME_WIDGETS)
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false) // false = Skeleton, true = Live preview with news
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null)
  
  // Real or mock data for live preview
  const [articles, setArticles] = useState<Article[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [accentColor, setAccentColor] = useState<string>('#d99a3f') // Amber default

  // Load preview data
  useEffect(() => {
    const loadPreviewData = async () => {
      if (isMockEnabled()) {
        setArticles(mockArticles as Article[])
        setVideos(mockVideos as Video[])
        setAds(mockAds as Ad[])
        return
      }

      try {
        const supabase = createClient()
        const { data: articlesData } = await supabase
          .from('articles')
          .select('*, category:categories(*)')
          .eq('status', 'published')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false })

        const { data: videosData } = await supabase
          .from('videos')
          .select('*, category:categories(*)')
          .eq('status', 'published')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false })

        const { data: adsData } = await supabase
          .from('ads')
          .select('*')
          .eq('status', 'active')
          .eq('tenant_id', tenantId)

        if (articlesData) setArticles(articlesData as Article[])
        if (videosData) setVideos(videosData as Video[])
        if (adsData) setAds(adsData as Ad[])
      } catch (err) {
        console.error('Error loading preview data:', err)
      }
    }

    loadPreviewData()
  }, [tenantId])

  // Switch presets when changing themes
  const handleThemeChange = (themeName: 'minimalist' | 'editorial') => {
    setSelectedTheme(themeName)
    if (themeName === 'minimalist') {
      setWidgets(MINIMALIST_THEME_WIDGETS)
      setAccentColor('#d99a3f')
    } else {
      setWidgets(EDITORIAL_THEME_WIDGETS)
      setAccentColor('#e11d48') // Rose-600 editorial red
    }
    setEditingWidget(null)
  }

  // Move widget helper
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= widgets.length) return

    const updated = [...widgets]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setWidgets(updated)
  }

  // Delete widget
  const deleteWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id))
    if (editingWidget?.id === id) setEditingWidget(null)
  }

  // Add widget
  const addWidget = (type: 'hero' | 'grid' | 'trending' | 'videos' | 'ad') => {
    const newWidget: Widget = {
      id: `w-${Date.now()}`,
      type,
      title: `New ${type.toUpperCase()} Section`,
      categoryId: 'all',
      limit: type === 'hero' ? 1 : 3,
      styleVariant: 'modern'
    }
    setWidgets([...widgets, newWidget])
    setEditingWidget(newWidget)
  }

  // Save widget changes
  const saveWidgetSettings = (updated: Widget) => {
    setWidgets(widgets.map(w => w.id === updated.id ? updated : w))
    setEditingWidget(null)
  }

  // Filter articles based on widget config
  const getWidgetArticles = (widget: Widget): Article[] => {
    let filtered = articles
    if (widget.categoryId !== 'all') {
      filtered = articles.filter(a => a.category_id === widget.categoryId)
    }
    return filtered.slice(0, widget.limit)
  }

  // Get mock ad for widget position
  const getWidgetAd = (position: string): Ad | null => {
    return ads.find(a => a.position === position) || null
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber/10 text-amber rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
              Dynamic Layout & Theme Canvas
            </h1>
          </div>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400 mt-1">
            Drag, configure, and reorder widgets to publish state-of-the-art layout configurations.
          </p>
        </div>

        {/* Live Preview Toggle */}
        <div className="flex items-center space-x-2 bg-paper-warm/50 dark:bg-gray-850 p-1 border border-ink-navy/5 dark:border-gray-800 rounded-lg">
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              !isPreviewMode
                ? 'bg-amber text-ink-navy font-black shadow'
                : 'text-ink-navy/60 dark:text-gray-400 hover:text-ink-navy'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SKELETON BUILDER</span>
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              isPreviewMode
                ? 'bg-amber text-ink-navy font-black shadow'
                : 'text-ink-navy/60 dark:text-gray-400 hover:text-ink-navy'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>REAL NEWS PREVIEW</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Theme Presets Selector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-ink-navy/70 dark:text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sun className="w-4 h-4 text-amber animate-spin-slow" />
              <span>THEME WORKSPACES</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {/* Minimalist Modern Theme Card */}
              <button
                onClick={() => handleThemeChange('minimalist')}
                className={`text-left p-4 rounded-lg border transition-all relative overflow-hidden group ${
                  selectedTheme === 'minimalist'
                    ? 'border-amber bg-amber/5 shadow-md'
                    : 'border-ink-navy/10 bg-transparent hover:border-ink-navy/35 dark:border-gray-850 hover:bg-paper-warm/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-black uppercase text-amber">Modern Minimalist</span>
                  {selectedTheme === 'minimalist' && (
                    <span className="w-2 h-2 rounded-full bg-amber shadow-glow" />
                  )}
                </div>
                <h4 className="font-headline font-black text-sm text-ink-navy dark:text-white leading-tight">
                  Duncan Khaemba Standard
                </h4>
                <p className="text-[10px] text-ink-navy/55 dark:text-gray-400 mt-1 font-sans leading-relaxed">
                  Clean whitespace, compact lines, sans-serif labels, and thin rules. Ideal for rapid breaking news streams.
                </p>
                <div className="flex items-center space-x-1.5 mt-3 text-[9px] font-mono font-bold text-amber">
                  <span>Accent color:</span>
                  <span className="w-3 h-3 rounded bg-amber border border-white/20" />
                  <span className="text-ink-navy/50">#d99a3f</span>
                </div>
              </button>

              {/* Editorial Bold Theme Card */}
              <button
                onClick={() => handleThemeChange('editorial')}
                className={`text-left p-4 rounded-lg border transition-all relative overflow-hidden group ${
                  selectedTheme === 'editorial'
                    ? 'border-rose-600 bg-rose-600/5 shadow-md'
                    : 'border-ink-navy/10 bg-transparent hover:border-ink-navy/35 dark:border-gray-850 hover:bg-paper-warm/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-black uppercase text-rose-650">Editorial Bold</span>
                  {selectedTheme === 'editorial' && (
                    <span className="w-2 h-2 rounded-full bg-rose-650 shadow-glow" />
                  )}
                </div>
                <h4 className="font-headline font-black text-sm text-ink-navy dark:text-white leading-tight">
                  Magical Kenya & Bold Typography
                </h4>
                <p className="text-[10px] text-ink-navy/55 dark:text-gray-400 mt-1 font-sans leading-relaxed">
                  Heavy borders, large serif headlines, dramatic card splits, and higher-contrast visual branding slots.
                </p>
                <div className="flex items-center space-x-1.5 mt-3 text-[9px] font-mono font-bold text-rose-650">
                  <span>Accent color:</span>
                  <span className="w-3 h-3 rounded bg-rose-600 border border-white/20" />
                  <span className="text-ink-navy/50">#e11d48</span>
                </div>
              </button>
            </div>
          </div>

          {/* Preset Custom Widgets Toolbox */}
          <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-ink-navy/70 dark:text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-amber" />
              <span>LAYOUT WIDGET TOOLBOX</span>
            </h3>
            <p className="text-[10px] text-ink-navy/60 dark:text-gray-400 font-sans leading-relaxed">
              Inject these content blocks directly into your workspace.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addWidget('hero')}
                className="flex flex-col items-center justify-center p-3 border border-dashed border-ink-navy/10 hover:border-amber hover:bg-amber/5 rounded-lg text-center transition-all group"
              >
                <Layout className="w-5 h-5 text-amber mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold text-ink-navy dark:text-gray-300">Hero banner</span>
              </button>
              <button
                onClick={() => addWidget('grid')}
                className="flex flex-col items-center justify-center p-3 border border-dashed border-ink-navy/10 hover:border-amber hover:bg-amber/5 rounded-lg text-center transition-all group"
              >
                <Layers className="w-5 h-5 text-amber mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold text-ink-navy dark:text-gray-300">Article grid</span>
              </button>
              <button
                onClick={() => addWidget('trending')}
                className="flex flex-col items-center justify-center p-3 border border-dashed border-ink-navy/10 hover:border-amber hover:bg-amber/5 rounded-lg text-center transition-all group"
              >
                <TrendingUp className="w-5 h-5 text-amber mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold text-ink-navy dark:text-gray-300">Trending feed</span>
              </button>
              <button
                onClick={() => addWidget('videos')}
                className="flex flex-col items-center justify-center p-3 border border-dashed border-ink-navy/10 hover:border-amber hover:bg-amber/5 rounded-lg text-center transition-all group"
              >
                <Film className="w-5 h-5 text-amber mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold text-ink-navy dark:text-gray-300">Video strip</span>
              </button>
              <div className="col-span-2">
                <button
                  onClick={() => addWidget('ad')}
                  className="w-full flex items-center justify-center space-x-2 p-2.5 border border-dashed border-ink-navy/10 hover:border-amber hover:bg-amber/5 rounded-lg transition-all"
                >
                  <Percent className="w-4 h-4 text-amber" />
                  <span className="text-[10px] font-mono font-bold text-ink-navy dark:text-gray-300">Sponsorship Slot (Ad)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Layout Summary */}
          <div className="bg-white/40 dark:bg-gray-900/30 border border-dashed border-ink-navy/10 dark:border-gray-800 p-4 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-ink-navy/50 dark:text-gray-500 uppercase">ACTIVE CONFIGURATION</span>
            <div className="text-xs font-mono font-black text-ink-navy dark:text-white">
              {widgets.length} Widgets | Theme: {selectedTheme.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Center Canvas: Interactive Skeleton or Live Preview */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Layout Canvas Frame */}
          <div className="bg-paper-warm/30 dark:bg-gray-950/40 border border-ink-navy/10 dark:border-gray-800 rounded-xl p-6 relative min-h-[500px]">
            
            {/* Header simulation */}
            <div className="border-b-2 border-ink-navy dark:border-gray-800 pb-3 mb-6 flex justify-between items-center opacity-45 select-none pointer-events-none">
              <div>
                <span className="font-headline font-black text-sm uppercase text-ink-navy dark:text-white">Khaemba News Portal</span>
                <span className="text-[8px] font-mono ml-2">SIMULATED HEADER</span>
              </div>
              <Menu className="w-4 h-4 text-ink-navy dark:text-white" />
            </div>

            {/* Empty State */}
            {widgets.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-ink-navy/10 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/50">
                <Layout className="w-8 h-8 text-amber/40 mx-auto mb-2" />
                <p className="text-xs font-mono text-ink-navy/50">Your layout is empty. Click widgets in the toolbox to build your site.</p>
              </div>
            )}

            {/* List of active widgets in layout */}
            <div className="space-y-6">
              {widgets.map((widget, index) => {
                const widgetCat = categories.find(c => c.id === widget.categoryId)
                const catName = widget.categoryId === 'all' ? 'All Categories' : (widgetCat?.name || 'Ad Slot')
                const accent = widgetCat?.accent_color || accentColor

                return (
                  <div
                    key={widget.id}
                    className={`relative rounded-xl transition-all ${
                      isPreviewMode
                        ? 'bg-transparent border border-transparent'
                        : 'bg-white dark:bg-gray-900 border border-ink-navy/15 dark:border-gray-800 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Widget Controls Bar (Only shown in Skeleton Builder mode) */}
                    {!isPreviewMode && (
                      <div className="flex items-center justify-between px-4 py-2 bg-paper-warm/40 dark:bg-gray-950/50 border-b border-ink-navy/5 dark:border-gray-800 rounded-t-xl select-none">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 bg-amber/15 text-amber text-[9px] font-mono font-black uppercase rounded">
                            {widget.type}
                          </span>
                          <span className="text-xs font-mono font-black text-ink-navy dark:text-white">
                            {widget.title}
                          </span>
                          <span className="text-[9px] font-mono text-ink-navy/50 dark:text-gray-400">
                            ({catName} • Limit: {widget.limit})
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {/* Reorder Up */}
                          <button
                            onClick={() => moveWidget(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-paper-warm dark:hover:bg-gray-800 rounded text-ink-navy/60 hover:text-ink-navy disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          {/* Reorder Down */}
                          <button
                            onClick={() => moveWidget(index, 'down')}
                            disabled={index === widgets.length - 1}
                            className="p-1 hover:bg-paper-warm dark:hover:bg-gray-800 rounded text-ink-navy/60 hover:text-ink-navy disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {/* Configure */}
                          <button
                            onClick={() => setEditingWidget(widget)}
                            className="p-1 hover:bg-amber/20 hover:text-amber dark:hover:bg-amber/15 rounded text-ink-navy/60"
                            title="Configure Settings"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => deleteWidget(widget.id)}
                            className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded text-ink-navy/40"
                            title="Delete Widget"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rendering Logic: Skeleton Drawing vs Live News Preview */}
                    <div className={isPreviewMode ? '' : 'p-5'}>
                      {!isPreviewMode ? (
                        /* SKELETON WIREFRAME DRAWING */
                        <div className="border border-dashed border-ink-navy/20 dark:border-gray-800 rounded p-4 bg-paper-warm/10 dark:bg-gray-950/20 font-mono text-[10px] space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-ink-navy/40 dark:text-gray-500 uppercase tracking-widest font-black text-[9px] flex items-center space-x-1">
                              <Compass className="w-3 h-3" />
                              <span>{widget.type} Layout: {widget.styleVariant}</span>
                            </span>
                            <span
                              style={{ color: accent }}
                              className="font-bold flex items-center space-x-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: accent }} />
                              <span>{catName} Channel</span>
                            </span>
                          </div>

                          {widget.type === 'hero' && (
                            <div className="flex gap-4">
                              <div className="w-2/3 h-28 bg-ink-navy/5 dark:bg-white/5 border border-ink-navy/10 rounded flex flex-col justify-end p-3 space-y-1">
                                <div className="h-4 bg-ink-navy/15 dark:bg-white/10 w-3/4 rounded" />
                                <div className="h-3 bg-ink-navy/15 dark:bg-white/10 w-1/2 rounded" />
                              </div>
                              <div className="w-1/3 flex flex-col justify-between py-1">
                                <div className="h-3 bg-ink-navy/10 dark:bg-white/5 w-full rounded" />
                                <div className="h-3 bg-ink-navy/10 dark:bg-white/5 w-full rounded" />
                                <div className="h-3 bg-ink-navy/10 dark:bg-white/5 w-2/3 rounded" />
                              </div>
                            </div>
                          )}

                          {widget.type === 'grid' && (
                            <div className="grid grid-cols-3 gap-3">
                              {Array.from({ length: Math.min(widget.limit, 3) }).map((_, i) => (
                                <div key={i} className="border border-ink-navy/5 bg-ink-navy/5 dark:bg-white/5 p-2.5 rounded space-y-2">
                                  <div className="h-16 bg-ink-navy/10 dark:bg-white/10 rounded" />
                                  <div className="h-3 bg-ink-navy/15 dark:bg-white/10 w-5/6 rounded" />
                                  <div className="h-2.5 bg-ink-navy/10 dark:bg-white/5 w-2/3 rounded" />
                                </div>
                              ))}
                            </div>
                          )}

                          {widget.type === 'trending' && (
                            <div className="space-y-2">
                              {Array.from({ length: widget.limit }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-3 border-b border-ink-navy/5 pb-2">
                                  <span className="font-headline font-black text-base text-ink-navy/20">0{i+1}</span>
                                  <div className="flex-grow space-y-1.5">
                                    <div className="h-3 bg-ink-navy/10 dark:bg-white/5 w-2/3 rounded" />
                                    <div className="h-2 bg-ink-navy/5 dark:bg-white/5 w-1/4 rounded" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {widget.type === 'videos' && (
                            <div className="grid grid-cols-3 gap-3">
                              {Array.from({ length: widget.limit }).map((_, i) => (
                                <div key={i} className="relative border border-ink-navy/5 bg-ink-navy/10 dark:bg-white/5 p-2 rounded flex flex-col justify-end h-20">
                                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber rounded-full flex items-center justify-center text-ink-navy text-[8px] font-bold">&#9658;</div>
                                  <div className="h-2.5 bg-white/35 dark:bg-white/10 w-4/5 rounded" />
                                </div>
                              ))}
                            </div>
                          )}

                          {widget.type === 'ad' && (
                            <div className="w-full bg-amber/5 border border-dashed border-amber/30 text-center py-4 rounded font-mono text-[9px] text-amber uppercase font-black tracking-widest">
                              Advertisement Slot : {widget.categoryId || 'General'}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* LIVE NEWS PREVIEW WITH MOCK/REAL DATA */
                        <div className="space-y-4 font-serif">
                          
                          {/* Widget Title Banner */}
                          {widget.type !== 'ad' && (
                            <div className="flex items-center space-x-2 border-b border-ink-navy/15 dark:border-gray-800 pb-1.5">
                              <span
                                style={{ backgroundColor: accent }}
                                className="w-2.5 h-2.5 inline-block"
                              />
                              <h3 className="font-headline font-black text-sm uppercase tracking-wide text-ink-navy dark:text-white">
                                {widget.title}
                              </h3>
                            </div>
                          )}

                          {/* Hero rendering */}
                          {widget.type === 'hero' && (() => {
                            const items = getWidgetArticles(widget)
                            if (items.length === 0) return <p className="text-xs text-ink-navy/40 font-mono">No articles found in this category.</p>
                            const item = items[0]
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                                <div className="md:col-span-8 relative aspect-video bg-gray-100 rounded overflow-hidden">
                                  <img src={item.featured_image_url} alt="" className="object-cover w-full h-full" />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                  <span
                                    style={{ color: accent }}
                                    className="text-[9px] font-mono font-bold uppercase"
                                  >
                                    {item.category?.name || 'News'}
                                  </span>
                                  <h4 className="font-headline font-black text-base text-ink-navy dark:text-white hover:text-amber leading-tight">
                                    {item.title}
                                  </h4>
                                  <p className="text-[11px] text-ink-navy/70 dark:text-gray-300 line-clamp-3 font-sans">
                                    {item.excerpt}
                                  </p>
                                  <div className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500">
                                    BY DUNCAN KHAEMBA
                                  </div>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Grid rendering */}
                          {widget.type === 'grid' && (() => {
                            const items = getWidgetArticles(widget)
                            if (items.length === 0) return <p className="text-xs text-ink-navy/40 font-mono">No articles found in this category.</p>
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {items.map(item => (
                                  <div key={item.id} className="space-y-2 border-b border-ink-navy/5 pb-2">
                                    <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                                      <img src={item.featured_image_url} alt="" className="object-cover w-full h-full" />
                                    </div>
                                    <span
                                      style={{ color: accent }}
                                      className="text-[9px] font-mono font-bold uppercase block"
                                    >
                                      {item.category?.name || 'News'}
                                    </span>
                                    <h5 className="font-headline font-black text-xs text-ink-navy dark:text-white line-clamp-2 leading-tight">
                                      {item.title}
                                    </h5>
                                    <p className="text-[10px] text-ink-navy/60 dark:text-gray-400 line-clamp-2 font-sans">
                                      {item.excerpt}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )
                          })()}

                          {/* Trending rendering */}
                          {widget.type === 'trending' && (() => {
                            const items = getWidgetArticles(widget)
                            if (items.length === 0) return <p className="text-xs text-ink-navy/40 font-mono">No articles found.</p>
                            return (
                              <div className="space-y-2.5">
                                {items.map((item, idx) => (
                                  <div key={item.id} className="flex items-start space-x-3 border-b border-ink-navy/5 pb-2">
                                    <span className="font-headline font-black text-base text-amber/60">0{idx+1}</span>
                                    <div className="space-y-1">
                                      <h5 className="font-headline font-bold text-xs text-ink-navy dark:text-white leading-tight">
                                        {item.title}
                                      </h5>
                                      <div className="text-[9px] font-mono text-ink-navy/40 dark:text-gray-500">
                                        {item.category?.name} • BY DUNCAN KHAEMBA
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )
                          })()}

                          {/* Videos rendering */}
                          {widget.type === 'videos' && (() => {
                            const items = videos.slice(0, widget.limit)
                            if (items.length === 0) return <p className="text-xs text-ink-navy/40 font-mono">No videos found.</p>
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {items.map(item => (
                                  <div key={item.id} className="space-y-2">
                                    <div className="relative aspect-video bg-black rounded overflow-hidden border border-gray-800">
                                      <img src={item.thumbnail_url} alt="" className="object-cover w-full h-full opacity-80" />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="w-7 h-7 bg-amber hover:scale-105 rounded-full flex items-center justify-center text-ink-navy text-[10px] font-bold shadow-md transition-transform">&#9658;</span>
                                      </div>
                                    </div>
                                    <h5 className="font-headline font-bold text-xs text-ink-navy dark:text-white line-clamp-1 leading-tight">
                                      {item.title}
                                    </h5>
                                    <span className="text-[8px] font-mono text-amber block uppercase font-bold">
                                      {Math.floor(item.duration_seconds / 60)}m {item.duration_seconds % 60}s duration
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )
                          })()}

                          {/* Ad rendering */}
                          {widget.type === 'ad' && (() => {
                            const adItem = getWidgetAd(widget.categoryId)
                            if (!adItem) {
                              return (
                                <div className="w-full bg-gray-150 dark:bg-gray-800 text-center py-6 rounded text-xs text-ink-navy/40 font-mono border border-dashed border-ink-navy/15">
                                  Empty Ad Space: {widget.categoryId} (No active ad found)
                                </div>
                              )
                            }
                            return (
                              <div className="w-full relative overflow-hidden bg-gradient-to-r from-teal-900 to-amber-700 p-4 rounded text-white flex justify-between items-center">
                                <div className="space-y-1 max-w-[70%]">
                                  <span className="text-[8px] font-mono bg-black/45 px-1.5 py-0.5 rounded text-amber uppercase font-extrabold">{adItem.client_name}</span>
                                  <h4 className="font-headline font-bold text-xs leading-snug">{adItem.client_name === 'Safaricom PLC' ? 'Experience Ultra-Fast Internet. Go 5G.' : 'Rediscover the Magic. The wild awaits you.'}</h4>
                                </div>
                                <span className="text-[10px] font-mono font-bold bg-amber text-ink-navy px-3 py-1.5 rounded shadow">
                                  Learn More &rarr;
                                </span>
                              </div>
                            )
                          })()}

                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer simulation */}
            <div className="border-t border-ink-navy/10 dark:border-gray-800 pt-3 mt-8 text-center opacity-30 select-none pointer-events-none text-[8px] font-mono">
              DEVELOPED BY P3L DEVELOPERS
            </div>
          </div>
        </div>
      </div>

      {/* Widget Settings Configuration Modal Drawer */}
      {editingWidget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end p-4">
          <div className="bg-white dark:bg-gray-900 border-l border-ink-navy/10 dark:border-gray-800 h-full max-w-md w-full p-6 space-y-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
                <div>
                  <h4 className="font-headline font-black text-base text-ink-navy dark:text-white">
                    Configure Widget
                  </h4>
                  <span className="text-[10px] font-mono text-ink-navy/55 uppercase">
                    Widget ID: {editingWidget.id}
                  </span>
                </div>
                <button
                  onClick={() => setEditingWidget(null)}
                  className="text-xs font-mono font-bold text-ink-navy/40 hover:text-ink-navy border border-ink-navy/10 px-2 py-1 rounded"
                >
                  ESC
                </button>
              </div>

              {/* Title Config */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Section Display Title</label>
                <input
                  type="text"
                  value={editingWidget.title}
                  onChange={(e) => setEditingWidget({ ...editingWidget, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-paper-warm/30 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-bold"
                />
              </div>

              {/* Category / Source Config */}
              {editingWidget.type !== 'ad' ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Article Category Stream</label>
                  <select
                    value={editingWidget.categoryId}
                    onChange={(e) => setEditingWidget({ ...editingWidget, categoryId: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-paper-warm/30 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Ad Position Target</label>
                  <select
                    value={editingWidget.categoryId}
                    onChange={(e) => setEditingWidget({ ...editingWidget, categoryId: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-paper-warm/30 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-bold"
                  >
                    <option value="homepage_top">homepage_top (Premium Leaderboard)</option>
                    <option value="homepage_mid">homepage_mid (Mid Banner)</option>
                    <option value="article_inline">article_inline (Inline Post)</option>
                    <option value="sidebar">sidebar (Sidebar Block)</option>
                  </select>
                </div>
              )}

              {/* Style Variant Config */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Visual Card Layout Style</label>
                <select
                  value={editingWidget.styleVariant}
                  onChange={(e) => setEditingWidget({ ...editingWidget, styleVariant: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 bg-paper-warm/30 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                >
                  <option value="modern">Modern Minimalist Card</option>
                  <option value="editorial">Editorial Bold Card</option>
                  <option value="compact">Compact List Format</option>
                  <option value="split">Split Row Hero Format</option>
                </select>
              </div>

              {/* Post Count Limit Config */}
              {editingWidget.type !== 'ad' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Max Items to Display: {editingWidget.limit}</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={editingWidget.limit}
                    onChange={(e) => setEditingWidget({ ...editingWidget, limit: parseInt(e.target.value) })}
                    className="w-full accent-amber"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-ink-navy/40">
                    <span>1 post</span>
                    <span>10 posts</span>
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber/5 border border-amber/10 rounded-lg space-y-1">
                <span className="text-[9px] font-mono font-black uppercase text-amber flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Real-Time Sync active</span>
                </span>
                <p className="text-[9px] font-sans text-ink-navy/60 dark:text-gray-400 leading-normal">
                  Changes apply immediately on the layout builder board. Click Save to seal settings.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-ink-navy/5">
              <button
                type="button"
                onClick={() => setEditingWidget(null)}
                className="w-1/2 bg-paper-warm dark:bg-gray-800 text-ink-navy dark:text-white font-bold text-xs py-2.5 rounded transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveWidgetSettings(editingWidget)}
                className="w-1/2 bg-amber text-ink-navy hover:bg-amber-hover font-black text-xs py-2.5 rounded transition-all shadow"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
