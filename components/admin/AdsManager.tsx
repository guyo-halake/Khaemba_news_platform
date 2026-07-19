'use client'

import { useState } from 'react'
import { Ad } from '@/lib/types'
import {
  isMockEnabled,
  addAd,
  editAd,
  deleteAd,
  addAdClient,
  editAdClient,
  deleteAdClient,
  addAdPayment,
  editAdPayment,
  deleteAdPayment
} from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import {
  Image as AdIcon,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Eye,
  MousePointer,
  Percent,
  Calendar,
  DollarSign,
  Users,
  Coins,
  Upload,
  Loader2,
  TrendingUp
} from 'lucide-react'

interface AdsManagerProps {
  initialAds: Ad[]
  initialClients: any[]
  initialPayments: any[]
  tenantId: string
}

export default function AdsManager({
  initialAds,
  initialClients,
  initialPayments,
  tenantId
} : AdsManagerProps) {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'clients' | 'payments'>('campaigns')
  
  // Data States
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [clients, setClients] = useState<any[]>(initialClients)
  const [payments, setPayments] = useState<any[]>(initialPayments)

  // Drawer / Form visibility
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isClientFormOpen, setIsClientFormOpen] = useState(false)
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false)

  // Edit states
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [editingClient, setEditingClient] = useState<any | null>(null)
  const [editingPayment, setEditingPayment] = useState<any | null>(null)

  // Campaign Form states
  const [clientId, setClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [position, setPosition] = useState<Ad['position']>('homepage_top')
  const [imageUrl, setImageUrl] = useState('')
  const [targetLink, setTargetLink] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<Ad['status']>('active')

  // Client Form states
  const [cName, setCName] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cPhone, setCPhone] = useState('')

  // Payment Form states
  const [payClientId, setPayClientId] = useState('')
  const [payAdId, setPayAdId] = useState('')
  const [payAmount, setPayAmount] = useState('')
  const [payDate, setPayDate] = useState('')
  const [payMethod, setPayMethod] = useState<'M-Pesa' | 'Bank Transfer' | 'Card' | 'Cash'>('M-Pesa')
  const [payStatus, setPayStatus] = useState<'pending' | 'completed' | 'refunded'>('pending')

  // Upload state
  const [isUploading, setIsUploading] = useState(false)

  // Reset helper functions
  const resetAdForm = () => {
    setClientId('')
    setClientName('')
    setPosition('homepage_top')
    setImageUrl('')
    setTargetLink('')
    setStartDate('')
    setEndDate('')
    setStatus('active')
    setEditingAd(null)
    setIsFormOpen(false)
  }

  const resetClientForm = () => {
    setCName('')
    setCEmail('')
    setCPhone('')
    setEditingClient(null)
    setIsClientFormOpen(false)
  }

  const resetPaymentForm = () => {
    setPayClientId('')
    setPayAdId('')
    setPayAmount('')
    setPayDate('')
    setPayMethod('M-Pesa')
    setPayStatus('pending')
    setEditingPayment(null)
    setIsPaymentFormOpen(false)
  }

  // Campaign Form Openers
  const openNewAdForm = () => {
    resetAdForm()
    const today = new Date().toISOString().split('T')[0]
    const nextMonthObj = new Date()
    nextMonthObj.setMonth(nextMonthObj.getMonth() + 1)
    const nextMonth = nextMonthObj.toISOString().split('T')[0]

    setStartDate(today)
    setEndDate(nextMonth)
    setIsFormOpen(true)
  }

  const openEditAdForm = (ad: Ad) => {
    setEditingAd(ad)
    setClientId(ad.client_id || '')
    setClientName(ad.client_name)
    setPosition(ad.position)
    setImageUrl(ad.image_url)
    setTargetLink(ad.target_link)
    setStartDate(ad.start_date)
    setEndDate(ad.end_date)
    setStatus(ad.status)
    setIsFormOpen(true)
  }

  // Client Form Openers
  const openNewClientForm = () => {
    resetClientForm()
    setIsClientFormOpen(true)
  }

  const openEditClientForm = (client: any) => {
    setEditingClient(client)
    setCName(client.name)
    setCEmail(client.email || '')
    setCPhone(client.phone || '')
    setIsClientFormOpen(true)
  }

  // Payment Form Openers
  const openNewPaymentForm = () => {
    resetPaymentForm()
    setPayDate(new Date().toISOString().split('T')[0])
    setIsPaymentFormOpen(true)
  }

  const openEditPaymentForm = (pay: any) => {
    setEditingPayment(pay)
    setPayClientId(pay.client_id)
    setPayAdId(pay.ad_id || '')
    setPayAmount(String(pay.amount))
    setPayDate(pay.payment_date)
    setPayMethod(pay.payment_method)
    setPayStatus(pay.status)
    setIsPaymentFormOpen(true)
  }

  // Image Upload handler for Creative Ad banner
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      if (result.success) {
        setImageUrl(result.video_url)
        alert('Creative banner image uploaded successfully!')
      } else {
        alert('Failed to upload image: ' + result.error)
      }
    } catch (err: any) {
      console.error(err)
      alert('Upload failed: ' + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  // CRUD Operations - Ads/Campaigns
  const handleAdDelete = async (id: string) => {
    if (!confirm('Are you sure you want to end and delete this campaign?')) return

    try {
      if (isMockEnabled()) {
        await deleteAd(id)
        setAds(ads.filter(a => a.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase.from('ads').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
      setAds(ads.filter(a => a.id !== id))
    } catch (err: any) {
      alert('Delete failed: ' + err.message)
    }
  }

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !imageUrl || !targetLink || !startDate || !endDate) {
      alert('Please fill out all required fields.')
      return
    }

    const payload = {
      client_id: clientId || null,
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
          await editAd(editingAd.id, payload)
          setAds(ads.map(a => (a.id === editingAd.id ? { ...a, ...payload } : a)))
        } else {
          const newAd = await addAd({
            ...payload,
            impressions_count: 0,
            clicks_count: 0
          })
          setAds([newAd, ...ads])
        }
        resetAdForm()
        return
      }

      const supabase = createClient()
      if (editingAd) {
        const { error } = await supabase
          .from('ads')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingAd.id)
          .eq('tenant_id', tenantId)
        if (error) throw error
        setAds(ads.map(a => (a.id === editingAd.id ? { ...a, ...payload } : a)))
      } else {
        const { data, error } = await supabase
          .from('ads')
          .insert({ ...payload, impressions_count: 0, clicks_count: 0 })
          .select()
          .single()
        if (error) throw error
        if (data) setAds([data as Ad, ...ads])
      }
      resetAdForm()
    } catch (err: any) {
      alert('Save failed: ' + err.message)
    }
  }

  // CRUD Operations - Clients
  const handleClientDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor client? This will delete linked payments and campaigns.')) return

    try {
      if (isMockEnabled()) {
        await deleteAdClient(id)
        setClients(clients.filter(c => c.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase.from('ad_clients').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
      setClients(clients.filter(c => c.id !== id))
    } catch (err: any) {
      alert('Delete failed: ' + err.message)
    }
  }

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cName) {
      alert('Client Name is required.')
      return
    }

    const payload = {
      name: cName,
      email: cEmail || null,
      phone: cPhone || null,
      tenant_id: tenantId
    }

    try {
      if (isMockEnabled()) {
        if (editingClient) {
          await editAdClient(editingClient.id, payload)
          setClients(clients.map(c => (c.id === editingClient.id ? { ...c, ...payload } : c)))
        } else {
          const newCli = await addAdClient(payload)
          setClients([newCli, ...clients])
        }
        resetClientForm()
        return
      }

      const supabase = createClient()
      if (editingClient) {
        const { error } = await supabase
          .from('ad_clients')
          .update(payload)
          .eq('id', editingClient.id)
          .eq('tenant_id', tenantId)
        if (error) throw error
        setClients(clients.map(c => (c.id === editingClient.id ? { ...c, ...payload } : c)))
      } else {
        const { data, error } = await supabase
          .from('ad_clients')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        if (data) setClients([data, ...clients])
      }
      resetClientForm()
    } catch (err: any) {
      alert('Save failed: ' + err.message)
    }
  }

  // CRUD Operations - Payments
  const handlePaymentDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment log?')) return

    try {
      if (isMockEnabled()) {
        await deleteAdPayment(id)
        setPayments(payments.filter(p => p.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase.from('ad_payments').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
      setPayments(payments.filter(p => p.id !== id))
    } catch (err: any) {
      alert('Delete failed: ' + err.message)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payClientId || !payAmount || !payDate) {
      alert('Please fill out all required fields.')
      return
    }

    const payload = {
      client_id: payClientId,
      ad_id: payAdId || null,
      amount: Number(payAmount),
      payment_date: payDate,
      payment_method: payMethod,
      status: payStatus,
      tenant_id: tenantId
    }

    try {
      if (isMockEnabled()) {
        if (editingPayment) {
          await editAdPayment(editingPayment.id, payload)
          setPayments(payments.map(p => (p.id === editingPayment.id ? { ...p, ...payload } : p)))
        } else {
          const newPay = await addAdPayment(payload)
          setPayments([newPay, ...payments])
        }
        resetPaymentForm()
        return
      }

      const supabase = createClient()
      if (editingPayment) {
        const { error } = await supabase
          .from('ad_payments')
          .update(payload)
          .eq('id', editingPayment.id)
          .eq('tenant_id', tenantId)
        if (error) throw error
        setPayments(payments.map(p => (p.id === editingPayment.id ? { ...p, ...payload } : p)))
      } else {
        const { data, error } = await supabase
          .from('ad_payments')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        if (data) setPayments([data, ...payments])
      }
      resetPaymentForm()
    } catch (err: any) {
      alert('Save failed: ' + err.message)
    }
  }

  // Calculate CTR helper
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

  // Total earnings aggregator
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
            Ad Space & Revenue Ledger
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
            Manage corporate sponsorships, schedules, creatives, and payment tracking.
          </p>
        </div>
        
        {activeTab === 'campaigns' && (
          <button
            onClick={openNewAdForm}
            className="bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded shadow transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Campaign</span>
          </button>
        )}
        {activeTab === 'clients' && (
          <button
            onClick={openNewClientForm}
            className="bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded shadow transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sponsor Client</span>
          </button>
        )}
        {activeTab === 'payments' && (
          <button
            onClick={openNewPaymentForm}
            className="bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded shadow transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Payment Receipt</span>
          </button>
        )}
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Total Confirmed Revenue</span>
            <span className="text-xl font-headline font-black text-ink-navy dark:text-white">KES {totalRevenue.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-green-500/10 text-green-600 rounded-full">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Active Sponsors</span>
            <span className="text-xl font-headline font-black text-ink-navy dark:text-white">{clients.length} Clients</span>
          </div>
          <div className="p-3 bg-amber/10 text-amber rounded-full">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-ink-navy/55 dark:text-gray-500 uppercase block font-bold">Active Campaigns</span>
            <span className="text-xl font-headline font-black text-ink-navy dark:text-white">{ads.filter(a => a.status === 'active').length} Live Slots</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-full">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink-navy/10 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-6 py-3 font-mono text-xs font-bold uppercase transition-all border-b-2 -mb-[2px] ${
            activeTab === 'campaigns'
              ? 'border-amber text-ink-navy dark:text-white'
              : 'border-transparent text-ink-navy/40 dark:text-gray-500 hover:text-ink-navy/70'
          }`}
        >
          Campaign Contracts ({ads.length})
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-6 py-3 font-mono text-xs font-bold uppercase transition-all border-b-2 -mb-[2px] ${
            activeTab === 'clients'
              ? 'border-amber text-ink-navy dark:text-white'
              : 'border-transparent text-ink-navy/40 dark:text-gray-555 hover:text-ink-navy/70'
          }`}
        >
          Sponsor Database ({clients.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-6 py-3 font-mono text-xs font-bold uppercase transition-all border-b-2 -mb-[2px] ${
            activeTab === 'payments'
              ? 'border-amber text-ink-navy dark:text-white'
              : 'border-transparent text-ink-navy/40 dark:text-gray-555 hover:text-ink-navy/70'
          }`}
        >
          Revenue Ledger ({payments.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* TAB 1: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <>
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
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative w-12 h-8 bg-black rounded overflow-hidden shrink-0 border border-ink-navy/5">
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

                          <td className="px-6 py-4 hidden sm:table-cell font-mono text-[10px] text-ink-navy/70 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-amber" />
                              <span>{ad.start_date} to {ad.end_date}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 hidden md:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3.5 h-3.5 text-amber" />
                              <span>{ad.impressions_count || 0}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 hidden md:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <MousePointer className="w-3.5 h-3.5 text-amber" />
                              <span>{ad.clicks_count || 0}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 hidden sm:table-cell font-mono text-[11px] text-ink-navy/70 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Percent className="w-3.5 h-3.5 text-amber" />
                              <span>{calculateCTR(ad.impressions_count || 0, ad.clicks_count || 0)}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              ad.status === 'active'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                            }`}>
                              {ad.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => openEditAdForm(ad)}
                                className="p-1.5 hover:bg-amber/15 text-ink-navy/60 dark:text-gray-400 hover:text-amber rounded transition-colors"
                                title="Edit Campaign"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleAdDelete(ad.id)}
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

            {/* Campaign Form Drawer */}
            {isFormOpen && (
              <form
                onSubmit={handleAdSubmit}
                className="lg:col-span-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-md sticky top-6 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
                  <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5">
                    <AdIcon className="w-5 h-5 text-amber" />
                    <span>{editingAd ? 'Edit Campaign' : 'New Campaign Contract'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={resetAdForm}
                    className="p-1.5 hover:bg-paper-warm/80 dark:hover:bg-gray-850 rounded text-ink-navy/40 dark:text-gray-550"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Sponsor Client Database Link</label>
                  <select
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value)
                      const matched = clients.find(c => c.id === e.target.value)
                      if (matched) setClientName(matched.name)
                    }}
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">-- Choose Corporate Client (Optional) --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Client / Partner Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Sponsor Name"
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

                {/* Creative banner image upload / paste URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase block">Creative Image / Banner Banner *</label>
                  <div className="flex gap-4 items-start">
                    {imageUrl && (
                      <div className="w-16 h-12 bg-black border border-ink-navy/10 dark:border-gray-800 rounded overflow-hidden shrink-0">
                        <img src={imageUrl} alt="Creative banner" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow space-y-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Creative Image URL"
                        className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                        required
                      />

                      <label className="inline-flex items-center space-x-1 bg-paper-warm hover:bg-paper-warm/80 dark:bg-gray-800 dark:hover:bg-gray-700 text-ink-navy dark:text-white px-3 py-1.5 rounded cursor-pointer transition-colors border border-ink-navy/5 text-[10px] font-mono font-bold">
                        {isUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading Banner...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-amber" />
                            <span>Upload Banner File</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
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
                      className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">End Date *</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
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
          </>
        )}

        {/* TAB 2: CLIENTS */}
        {activeTab === 'clients' && (
          <>
            <div className={`bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm ${
              isClientFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                      <th className="px-6 py-4">Client Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4 hidden sm:table-cell">Created At</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-500">
                          No corporate sponsors in database.
                        </td>
                      </tr>
                    ) : (
                      clients.map(client => (
                        <tr key={client.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-ink-navy dark:text-paper-warm">
                            {client.name}
                          </td>
                          <td className="px-6 py-4 text-ink-navy/70 dark:text-gray-400 font-mono">
                            {client.email || '--'}
                          </td>
                          <td className="px-6 py-4 text-ink-navy/70 dark:text-gray-400 font-mono">
                            {client.phone || '--'}
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell font-mono text-[10px] text-ink-navy/55 dark:text-gray-500">
                            {new Date(client.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => openEditClientForm(client)}
                                className="p-1.5 hover:bg-amber/15 text-ink-navy/60 dark:text-gray-400 hover:text-amber rounded transition-colors"
                                title="Edit Client"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleClientDelete(client.id)}
                                className="p-1.5 hover:bg-red-500/10 text-ink-navy/60 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                                title="Delete Client"
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

            {/* Client Form Drawer */}
            {isClientFormOpen && (
              <form
                onSubmit={handleClientSubmit}
                className="lg:col-span-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-md sticky top-6"
              >
                <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
                  <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5">
                    <Users className="w-5 h-5 text-amber" />
                    <span>{editingClient ? 'Edit Sponsor Details' : 'New Sponsor Profile'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={resetClientForm}
                    className="p-1.5 hover:bg-paper-warm/80 dark:hover:bg-gray-850 rounded text-ink-navy/40 dark:text-gray-550"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Sponsor Company / Client Name *</label>
                  <input
                    type="text"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    placeholder="e.g. Kenya Airways"
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Contact Email</label>
                  <input
                    type="email"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="corporate@client.co.ke"
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Contact Phone Number</label>
                  <input
                    type="text"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-ink-navy dark:bg-white text-white dark:text-ink-navy hover:bg-amber dark:hover:bg-amber dark:hover:text-ink-navy hover:text-ink-navy font-bold text-xs py-3 rounded transition-colors shadow flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Sponsor Details</span>
                </button>
              </form>
            )}
          </>
        )}

        {/* TAB 3: PAYMENTS */}
        {activeTab === 'payments' && (
          <>
            <div className={`bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm ${
              isPaymentFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                      <th className="px-6 py-4">Sponsor / Client</th>
                      <th className="px-6 py-4">Campaign / Contract</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment Date</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-555">
                          No payment transactions registered.
                        </td>
                      </tr>
                    ) : (
                      payments.map(pay => {
                        const clientNameStr = clients.find(c => c.id === pay.client_id)?.name || 'Unknown Client'
                        const adNameStr = ads.find(a => a.id === pay.ad_id)?.client_name || 'General Sponsorship'
                        
                        return (
                          <tr key={pay.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-ink-navy dark:text-paper-warm">
                              {clientNameStr}
                            </td>
                            <td className="px-6 py-4 text-ink-navy/70 dark:text-gray-400 italic">
                              {adNameStr}
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-ink-navy dark:text-white">
                              KES {Number(pay.amount).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 font-mono text-[10px] text-ink-navy/70 dark:text-gray-400">
                              {pay.payment_date}
                            </td>
                            <td className="px-6 py-4 font-mono text-[10px] text-ink-navy/60 dark:text-gray-500">
                              {pay.payment_method}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                pay.status === 'completed'
                                  ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                                  : pay.status === 'pending'
                                  ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                              }`}>
                                {pay.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => openEditPaymentForm(pay)}
                                  className="p-1.5 hover:bg-amber/15 text-ink-navy/60 dark:text-gray-400 hover:text-amber rounded transition-colors"
                                  title="Edit Payment"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handlePaymentDelete(pay.id)}
                                  className="p-1.5 hover:bg-red-500/10 text-ink-navy/60 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                                  title="Delete Payment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Form Drawer */}
            {isPaymentFormOpen && (
              <form
                onSubmit={handlePaymentSubmit}
                className="lg:col-span-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-md sticky top-6"
              >
                <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
                  <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5">
                    <DollarSign className="w-5 h-5 text-amber" />
                    <span>{editingPayment ? 'Edit Payment Log' : 'Log Sponsor Payment'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={resetPaymentForm}
                    className="p-1.5 hover:bg-paper-warm/80 dark:hover:bg-gray-850 rounded text-ink-navy/40 dark:text-gray-550"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Sponsor Client *</label>
                  <select
                    value={payClientId}
                    onChange={(e) => setPayClientId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                    required
                  >
                    <option value="">Select Corporate Client</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Linked Campaign (Contract)</label>
                  <select
                    value={payAdId}
                    onChange={(e) => setPayAdId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                  >
                    <option value="">-- General / Non-targeted Sponsorship --</option>
                    {ads
                      .filter(a => !payClientId || a.client_id === payClientId)
                      .map(a => (
                        <option key={a.id} value={a.id}>{a.client_name} - {getPositionLabel(a.position)}</option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Transaction Amount (KES) *</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Payment Receipt Date *</label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Payment Method *</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as any)}
                      className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                    >
                      <option value="M-Pesa">M-Pesa</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Status *</label>
                    <select
                      value={payStatus}
                      onChange={(e) => setPayStatus(e.target.value as any)}
                      className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-ink-navy dark:bg-white text-white dark:text-ink-navy hover:bg-amber dark:hover:bg-amber dark:hover:text-ink-navy hover:text-ink-navy font-bold text-xs py-3 rounded transition-colors shadow flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Log Payment Receipt</span>
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  )
}
