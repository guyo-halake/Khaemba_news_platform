'use client'

import { useState } from 'react'
import { Video, Category } from '@/lib/types'
import { isMockEnabled, addVideo, editVideo, deleteVideo } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Film, Plus, Edit, Trash2, X, Save, Eye, Clock, CheckCircle } from 'lucide-react'

interface VideosManagerProps {
  initialVideos: Video[]
  categories: Category[]
}

export default function VideosManager({ initialVideos, categories }: VideosManagerProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [videoSourceType, setVideoSourceType] = useState<'youtube' | 'vimeo' | 'uploaded'>('youtube')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')

  const openNewForm = () => {
    setEditingVideo(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setCategoryId(categories[0]?.id || '')
    setVideoSourceType('youtube')
    setVideoUrl('')
    setThumbnailUrl('')
    setDurationSeconds(600)
    setStatus('draft')
    setIsFormOpen(true)
  }

  const openEditForm = (vid: Video) => {
    setEditingVideo(vid)
    setTitle(vid.title)
    setSlug(vid.slug)
    setDescription(vid.description)
    setCategoryId(vid.category_id || '')
    setVideoSourceType(vid.video_source_type)
    setVideoUrl(vid.video_url)
    setThumbnailUrl(vid.thumbnail_url)
    setDurationSeconds(vid.duration_seconds)
    setStatus(vid.status)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this video?')) return

    try {
      if (isMockEnabled()) {
        deleteVideo(id)
        setVideos(videos.filter(v => v.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Failed to delete video: ' + error.message)
      } else {
        setVideos(videos.filter(v => v.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !videoUrl || !thumbnailUrl) {
      alert('Please fill out all required fields.')
      return
    }

    const payload = {
      title,
      slug,
      description,
      category_id: categoryId || null,
      video_source_type: videoSourceType,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      duration_seconds: Number(durationSeconds),
      status,
    }

    try {
      if (isMockEnabled()) {
        if (editingVideo) {
          editVideo(editingVideo.id, payload)
          setVideos(videos.map(v => (v.id === editingVideo.id ? { ...v, ...payload } : v)))
        } else {
          const newVid = addVideo({
            ...payload,
            view_count: 0
          })
          setVideos([newVid, ...videos])
        }
        setIsFormOpen(false)
        return
      }

      const supabase = createClient()

      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update({
            ...payload,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingVideo.id)

        if (error) throw error
        setVideos(videos.map(v => (v.id === editingVideo.id ? { ...v, ...payload } : v)))
      } else {
        const { data, error } = await supabase
          .from('videos')
          .insert({
            ...payload,
            view_count: 0,
            published_at: status === 'published' ? new Date().toISOString() : null
          })
          .select()
          .single()

        if (error) throw error
        if (data) setVideos([data as Video, ...videos])
      }

      setIsFormOpen(false)
    } catch (err: any) {
      alert('Failed to save: ' + (err.message || err))
    }
  }

  // Format helper
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
            Documentaries & Videos
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
            Publish and manage long-form visual reports
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded shadow transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Documentary</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Videos Table */}
        <div className={`bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm ${
          isFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                  <th className="px-6 py-4">Title & Details</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
                {videos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-500">
                      No documentaries uploaded yet.
                    </td>
                  </tr>
                ) : (
                  videos.map(vid => (
                    <tr key={vid.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-16 aspect-video bg-black rounded overflow-hidden shrink-0">
                            <img src={vid.thumbnail_url} alt={vid.title} className="object-cover w-full h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <span className="font-bold text-ink-navy dark:text-paper-warm block truncate">
                              {vid.title}
                            </span>
                            <span className="text-[10px] font-mono text-amber uppercase font-semibold">
                              {vid.video_source_type}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber" />
                          <span>{formatDuration(vid.duration_seconds)}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-amber" />
                          <span>{vid.view_count}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          vid.status === 'published'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {vid.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(vid)}
                            className="p-1.5 hover:bg-amber/15 text-ink-navy/60 dark:text-gray-400 hover:text-amber rounded transition-colors"
                            title="Edit Video"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(vid.id)}
                            className="p-1.5 hover:bg-red-500/10 text-ink-navy/60 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Delete Video"
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

        {/* Form Drawer (Right) */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-md sticky top-6"
          >
            <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
              <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5">
                <Film className="w-5 h-5 text-amber" />
                <span>{editingVideo ? 'Edit Documentary' : 'Upload Documentary'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-paper-warm/80 dark:hover:bg-gray-850 rounded text-ink-navy/40 dark:text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Video Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!editingVideo) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
                  }
                }}
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-xs font-mono px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Description / Caption</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Source Provider</label>
                <select
                  value={videoSourceType}
                  onChange={(e) => setVideoSourceType(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                >
                  <option value="youtube">YouTube Embed</option>
                  <option value="vimeo">Vimeo Embed</option>
                  <option value="uploaded">Self Hosted Video (MP4)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Duration (Seconds)</label>
                <input
                  type="number"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Video URL *</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube watch link or direct MP4 URL"
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Thumbnail Image URL *</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                required
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Status</span>
              <div className="flex gap-2">
                {['draft', 'published'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st as any)}
                    className={`flex-1 text-center py-2 text-xs font-mono font-bold rounded border uppercase ${
                      status === st
                        ? 'bg-amber text-ink-navy border-amber shadow-sm'
                        : 'bg-transparent border-ink-navy/10 dark:border-gray-700 text-ink-navy/70 dark:text-gray-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-ink-navy dark:bg-white text-white dark:text-ink-navy hover:bg-amber dark:hover:bg-amber dark:hover:text-ink-navy hover:text-ink-navy font-bold text-xs py-3 rounded transition-colors shadow flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Documentary</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
