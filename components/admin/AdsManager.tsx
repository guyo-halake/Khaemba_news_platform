'use client'

import { useState } from 'react'
import { Ad } from '@/lib/types'
import { isMockEnabled, addAd, editAd, deleteAd } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Image as AdIcon, Plus, Edit, Trash2, X, Save, Eye, MousePointer, Percent, Calendar } from 'lucide-react'

interface AdsManagerProps {
  initialAds: Ad[]
  tenantId: string
}

export default function AdsManager({ initialAds, tenantId }: AdsManagerProps) {
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Form states
  const [clientName, setClientName] = useState('')
  const [position, setPosition] = useState<Ad['position']>('homepage_top')
  const [imageUrl, setImageUrl] = useState('')
  const [targetLink, setTargetLink] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<Ad['status']>('active')

  const resetForm = () => {
    setClientName('')
    setPosition('homepage_top')
    setImageUrl('')
    setTargetLink('')
    setStartDate('')
    setEndDate('')
    setStatus('active')
    setEditingAd(null)
  }

  const openNewForm = () => {
    resetForm()
    const today = new Date().toISOString().split('T')[0]
    const nextMonthObj = new Date()
    nextMonthObj.setMonth(nextMonthObj.getMonth() + 1)
    const nextMonth = nextMonthObj.toISOString().split('T')[0]

    setStartDate(today)
    setEndDate(nextMonth)
    setIsFormOpen(true)
  }

  const openEditForm = (ad: Ad) => {
    setEditingAd(ad)
    setClientName(ad.client_name)
    setPosition(ad.position)
    setImageUrl(ad.image_url)
    setTargetLink(ad.target_link)
    setStartDate(ad.start_date)
    setEndDate(ad.end_date)
    setStatus(ad.status)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently end and delete this campaign?')) return

    try {
      if (isMockEnabled()) {
        deleteAd(id)
        setAds(ads.filter(a => a.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) {
        alert('Failed to delete ad: ' + error.message)
      } else {
        setAds(ads.filter(a => a.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !imageUrl || !targetLink || !startDate || !endDate) {
      alert('Please fill out all required fields.')
      return
    }

    const payload = {
      client_name: clientName,
      position,
      image_url: imageUrl,
      target_link: targetLink,
      start_date: startDate,
      end_date: endDate,
      status,
      tenant_id: tenantId
    }

    try {
      if (isMockEnabled()) {
        if (editingAd) {
          editAd(editingAd.id, payload)
          setAds(ads.map(a => (a.id === editingAd.id ? { ...a, ...payload } : a)))
        } else {
          const newAd = addAd({
            ...payload,
            impressions_count: 0,
            clicks_count: 0
          })
          setAds([newAd, ...ads])
        }
        setIsFormOpen(false)
        return
      }

      const supabase = createClient()

      if (editingAd) {
        const { error } = await supabase
          .from('ads')
          .update({
            client_name: clientName,
            position,
            image_url: imageUrl,
            target_link: targetLink,
            start_date: startDate,
            end_date: endDate,
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAd.id)
          .eq('tenant_id', tenantId)

        if (error) throw error
        setAds(ads.map(a => (a.id === editingAd.id ? { ...a, ...payload } : a)))
      } else {
        const { data, error } = await supabase
          .from('ads')
          .insert({
            ...payload,
            impressions_count: 0,
            clicks_count: 0
          })
          .select()
          .single()

        if (error) throw error
        if (data) setAds([data as Ad, ...ads])
      }

      setIsFormOpen(false)
    } catch (err: any) {
      alert('Failed to save ad campaign: ' + (err.message || err))
    }
  }

  // Calculate CTR
  const calculateCTR = (impressions: number, clicks: number) => {
    if (!impressions) return '0.0%'
    return `${((clicks / impressions) * 100).toFixed(2)}%`
  }

  const getPositionLabel = (pos: Ad['position']) => {
    switch (pos) {
      case 'homepage_top': return 'Home Top'
      case 'homepage_mid': return 'Home Mid'
      case 'article_inline': return 'Article Inline'
      case 'sidebar': return 'Sidebar Sticky'
      default: return pos
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
            Ad Campaign Windows
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
            Schedule on-site advertisements and track client metrics
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded shadow transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Ad Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Ads Table */}
        <div className={`bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm ${
          isFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                  <th className="px-6 py-4">Client & Slot</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Schedules</th>
                  <th className="px-6 py-4 hidden md:table-cell">Impressions</th>
                  <th className="px-6 py-4 hidden md:table-cell">Clicks</th>
                  <th className="px-6 py-4 hidden sm:table-cell">CTR</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
                {ads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-500">
                      No ad campaigns scheduled.
                    </td>
                  </tr>
                ) : (
                  ads.map(ad => (
                    <tr key={ad.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                      {/* Client */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-8 bg-black rounded overflow-hidden shrink-0">
                            <img src={ad.image_url} alt={ad.client_name} className="object-cover w-full h-full" />
                          </div>
                          <div>
                            <span className="font-bold text-ink-navy dark:text-paper-warm block truncate">
                              {ad.client_name}
                            </span>
                            <span className="text-[9px] font-mono text-amber uppercase font-semibold">
                              {getPositionLabel(ad.position)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-6 py-4 hidden sm:table-cell font-mono text-[10px] text-ink-navy/70 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-amber" />
                          <span>{ad.start_date} to {ad.end_date}</span>
                        </div>
                      </td>

                      {/* Impressions */}
                      <td className="px-6 py-4 hidden md:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-amber" />
                          <span>{ad.impressions_count}</span>
                        </span>
                      </td>

                      {/* Clicks */}
                      <td className="px-6 py-4 hidden md:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <MousePointer className="w-3.5 h-3.5 text-amber" />
                          <span>{ad.clicks_count}</span>
                        </span>
                      </td>

                      {/* CTR */}
                      <td className="px-6 py-4 hidden sm:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Percent className="w-3.5 h-3.5 text-amber" />
                          <span>{calculateCTR(ad.impressions_count, ad.clicks_count)}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          ad.status === 'active'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {ad.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(ad)}
                            className="p-1.5 hover:bg-amber/15 text-ink-navy/60 dark:text-gray-400 hover:text-amber rounded transition-colors"
                            title="Edit Campaign"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ad.id)}
                            className="p-1.5 hover:bg-red-500/10 text-ink-navy/60 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Delete Campaign"
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

        {/* Campaign Form Drawer (Right) */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-md sticky top-6"
          >
            <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
              <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5">
                <AdIcon className="w-5 h-5 text-amber" />
                <span>{editingAd ? 'Edit Campaign' : 'New Campaign Contract'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-paper-warm/80 dark:hover:bg-gray-850 rounded text-ink-navy/40 dark:text-gray-550"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Client / Partner Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Ad Placement Slot *</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
              >
                <option value="homepage_top">Homepage Top (970x90 px / 728x90 px)</option>
                <option value="homepage_mid">Homepage Mid (970x250 px / 728x90 px)</option>
                <option value="article_inline">Article Inline (728x90 px / 300x255 px)</option>
                <option value="sidebar">Sidebar Square (300x250 px / 300x300 px)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Creative Image URL *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Hosted banner PNG/JPG path"
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Target Redirect Link *</label>
              <input
                type="text"
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                placeholder="https://client-landingpage.com"
                className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">End Date *</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Status</span>
              <div className="flex gap-2">
                {['active', 'paused'].map(st => (
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
              <span>Save Campaign Settings</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
