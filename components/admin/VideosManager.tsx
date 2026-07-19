'use client'

import { useState } from 'react'
import { Video, Category } from '@/lib/types'
import { isMockEnabled, addVideo, editVideo, deleteVideo } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Film, Plus, Edit, Trash2, X, Save, Eye, Clock, Upload, Loader2 } from 'lucide-react'

interface VideosManagerProps {
  initialVideos: Video[]
  categories: Category[]
  tenantId: string
}

export default function VideosManager({ initialVideos, categories, tenantId }: VideosManagerProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [videoSourceType, setVideoSourceType] = useState<'youtube' | 'vimeo' | 'uploaded' | 'cloudflare_stream'>('youtube')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [durationSeconds, setDurationSeconds] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [series, setSeries] = useState('')

  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setDescription('')
    setCategoryId('')
    setVideoSourceType('youtube')
    setVideoUrl('')
    setThumbnailUrl('')
    setDurationSeconds('')
    setStatus('draft')
    setSeries('')
    setEditingVideo(null)
    setIsFormOpen(false)
    setUploadProgress(null)
    setIsUploading(false)
  }

  const openNewForm = () => {
    resetForm()
    setCategoryId(categories[0]?.id || '')
    setDurationSeconds('600')
    setIsFormOpen(true)
  }

  const openEditForm = (v: Video) => {
    setEditingVideo(v)
    setTitle(v.title)
    setSlug(v.slug)
    setDescription(v.description)
    setCategoryId(v.category_id || '')
    setVideoSourceType(v.video_source_type)
    setVideoUrl(v.video_url)
    setThumbnailUrl(v.thumbnail_url)
    setDurationSeconds(String(v.duration_seconds))
    setStatus(v.status)
    setSeries(v.series || '')
    setIsFormOpen(true)
  }

  // Auto-extract youtube thumbnail & details on link paste
  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url)
    if (videoSourceType === 'youtube') {
      let videoId = ''
      try {
        if (url.includes('youtube.com/watch')) {
          const urlObj = new URL(url)
          videoId = urlObj.searchParams.get('v') || ''
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
        } else if (url.includes('youtube.com/embed/')) {
          videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || ''
        }
      } catch (e) {}

      if (videoId) {
        setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
      }
    }
  }

  // Handle video file upload to cloudflare stream or local mock folder
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/videos/upload', true)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          setVideoUrl(result.video_url)
          setThumbnailUrl(result.thumbnail_url)
          setDurationSeconds(String(result.duration || 300))
          alert('Video file uploaded successfully!')
        } else {
          alert('Upload failed: ' + xhr.statusText)
        }
        setIsUploading(false)
        setUploadProgress(null)
      }

      xhr.onerror = () => {
        alert('An error occurred during upload.')
        setIsUploading(false)
        setUploadProgress(null)
      }

      xhr.send(formData)
    } catch (err: any) {
      console.error(err)
      alert('Upload failed: ' + err.message)
      setIsUploading(false)
      setUploadProgress(null)
    }
  }

  // Handle manual thumbnail image upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setThumbnailUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      if (result.success) {
        setThumbnailUrl(result.video_url)
        alert('Thumbnail uploaded successfully!')
      } else {
        alert('Failed to upload thumbnail: ' + result.error)
      }
    } catch (err: any) {
      console.error(err)
      alert('Failed to upload thumbnail: ' + err.message)
    } finally {
      setThumbnailUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      if (isMockEnabled()) {
        await deleteVideo(id)
        setVideos(videos.filter(v => v.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) throw error
      setVideos(videos.filter(v => v.id !== id))
    } catch (err: any) {
      alert('Failed to delete video: ' + err.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !videoUrl || !thumbnailUrl) {
      alert('Please fill in all required fields.')
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
      series: series || null,
      tenant_id: tenantId
    }

    try {
      if (isMockEnabled()) {
        if (editingVideo) {
          await editVideo(editingVideo.id, payload)
          setVideos(videos.map(v => (v.id === editingVideo.id ? { ...v, ...payload } : v)))
        } else {
          const newVid = await addVideo({
            ...payload,
            view_count: 0
          })
          setVideos([newVid, ...videos])
        }
        resetForm()
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
          .eq('tenant_id', tenantId)

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

      resetForm()
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
                  <th className="px-6 py-4 hidden sm:table-cell">Duration</th>
                  <th className="px-6 py-4 hidden md:table-cell">Views</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
                {videos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-555">
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
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-[10px] font-mono text-amber uppercase font-semibold">
                                {vid.video_source_type}
                              </span>
                              {vid.series && (
                                <span className="text-[9px] font-mono bg-paper-warm text-ink-navy/70 dark:bg-gray-800 dark:text-gray-300 px-1.5 py-0.2 rounded font-bold">
                                  {vid.series}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 hidden sm:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber" />
                          <span>{formatDuration(vid.duration_seconds)}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 hidden md:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
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
            className="lg:col-span-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-md sticky top-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
              <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5">
                <Film className="w-5 h-5 text-amber" />
                <span>{editingVideo ? 'Edit Documentary' : 'Upload Documentary'}</span>
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="p-1.5 hover:bg-paper-warm/80 dark:hover:bg-gray-850 rounded text-ink-navy/40 dark:text-gray-555"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Series / Playlist</label>
                <input
                  type="text"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  placeholder="e.g. NTV Investigates"
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Duration (Seconds)</label>
                <input
                  type="number"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                  required
                />
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

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Source Provider</label>
              <select
                value={videoSourceType}
                onChange={(e) => setVideoSourceType(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
              >
                <option value="youtube">YouTube Embed</option>
                <option value="vimeo">Vimeo Embed</option>
                <option value="cloudflare_stream">Cloudflare Stream (Real Upload)</option>
                <option value="uploaded">Self Hosted Video (MP4)</option>
              </select>
            </div>

            {/* If Cloudflare Stream chosen: Show Direct File Upload UI */}
            {videoSourceType === 'cloudflare_stream' ? (
              <div className="border border-dashed border-ink-navy/15 dark:border-gray-800 rounded-lg p-4 bg-paper-warm/30 dark:bg-gray-950/20 space-y-3">
                <span className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase block">Cloudflare Video File Upload</span>
                
                {isUploading ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center space-x-1.5 text-ink-navy/70 dark:text-gray-450">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber" />
                        <span>Uploading file...</span>
                      </span>
                      <span className="font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-paper-warm dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-6 border border-dashed border-ink-navy/20 dark:border-gray-700 rounded cursor-pointer hover:bg-paper-warm/50 dark:hover:bg-gray-850/50 transition-colors">
                    <Upload className="w-6 h-6 text-amber mb-1.5" />
                    <span className="text-xs font-bold text-ink-navy dark:text-paper-warm">Choose Video File</span>
                    <span className="text-[10px] text-ink-navy/40 dark:text-gray-500 font-mono mt-0.5">MP4, WebM up to 500MB</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {videoUrl && (
                  <div className="text-[10px] font-mono text-ink-navy/60 dark:text-gray-400 break-all bg-white dark:bg-gray-900 border border-ink-navy/5 p-2 rounded">
                    <span className="font-bold block text-[9px] uppercase text-amber">Active playback URL:</span>
                    {videoUrl}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Video URL *</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder={videoSourceType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'Video source URL'}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                  required
                />
              </div>
            )}

            {/* Thumbnail Upload & Preview */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase block">Thumbnail Cover Image *</label>
              
              <div className="flex gap-4 items-start">
                {thumbnailUrl && (
                  <div className="w-24 aspect-video bg-black border border-ink-navy/10 dark:border-gray-800 rounded overflow-hidden shrink-0">
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Cover Image URL"
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                    required
                  />

                  <label className="inline-flex items-center space-x-1 bg-paper-warm hover:bg-paper-warm/80 dark:bg-gray-800 dark:hover:bg-gray-700 text-ink-navy dark:text-white px-3 py-1.5 rounded cursor-pointer transition-colors border border-ink-navy/5 text-[10px] font-mono font-bold">
                    {thumbnailUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-amber" />
                        <span>Upload Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
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
              disabled={isUploading}
              className="w-full bg-ink-navy dark:bg-white text-white dark:text-ink-navy hover:bg-amber dark:hover:bg-amber dark:hover:text-ink-navy hover:text-ink-navy font-bold text-xs py-3 rounded transition-colors shadow flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
