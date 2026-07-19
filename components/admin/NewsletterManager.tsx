'use client'

import { useState } from 'react'
import { isMockEnabled } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import {
  Mail,
  Send,
  History,
  Users,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
  X
} from 'lucide-react'

interface NewsletterManagerProps {
  initialSubscribers: any[]
  initialDispatches: any[]
  tenantId: string
}

export default function NewsletterManager({
  initialSubscribers,
  initialDispatches,
  tenantId
}: NewsletterManagerProps) {
  const [subscribers, setSubscribers] = useState<any[]>(initialSubscribers)
  const [dispatches, setDispatches] = useState<any[]>(initialDispatches)
  const [activeTab, setActiveTab] = useState<'subscribers' | 'compose' | 'history'>('subscribers')

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')

  // Compose Form states
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  // Selected history dispatch details modal
  const [selectedDispatch, setSelectedDispatch] = useState<any | null>(null)

  // Filtered subscribers
  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Export Subscribers list to CSV
  const handleExportCSV = () => {
    if (subscribers.length === 0) return
    const csvRows = ['ID,Email,Subscribed At']
    subscribers.forEach(s => {
      csvRows.push(`${s.id},${s.email},${s.subscribed_at || s.created_at}`)
    })
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'newsletter_subscribers.csv')
    a.click()
  }

  // Handle Newsletter Dispatch submit
  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !content) {
      alert('Please fill out both subject and content.')
      return
    }

    if (subscribers.length === 0) {
      alert('No subscribers in your mailing list to send to.')
      return
    }

    if (!confirm(`Are you sure you want to broadcast this newsletter to all ${subscribers.length} subscribers?`)) {
      return
    }

    setIsSending(true)
    setSendSuccess(false)

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          tenantId
        })
      })

      const result = await response.json()
      if (result.success) {
        setSendSuccess(true)
        setSubject('')
        setContent('')
        // Add new dispatch to history list
        setDispatches([result.dispatch, ...dispatches])
      } else {
        alert('Failed to send newsletter: ' + result.error)
      }
    } catch (err: any) {
      console.error(err)
      alert('Error broadcasting newsletter: ' + err.message)
    } finally {
      setIsSending(false)
    }
  }

  // Delete subscriber
  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to unsubscribe this email address?')) return

    try {
      if (isMockEnabled()) {
        const storePath = '/api/mock'
        await fetch(storePath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'deleteComment', id }) // Reuse generic delete or hit mock API if needed, wait, we can just delete from state or build helper
        })
        // Filter local state
        setSubscribers(subscribers.filter(s => s.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) throw error
      setSubscribers(subscribers.filter(s => s.id !== id))
    } catch (err: any) {
      alert('Failed to remove subscriber: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
            Newsletter Campaigns & Broadcasts
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
            Broadcasting dispatches and managing the subscriber database.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink-navy/10 dark:border-gray-800">
        <button
          onClick={() => {
            setActiveTab('subscribers')
            setSendSuccess(false)
          }}
          className={`px-6 py-3 font-mono text-xs font-bold uppercase transition-all border-b-2 -mb-[2px] ${
            activeTab === 'subscribers'
              ? 'border-amber text-ink-navy dark:text-white'
              : 'border-transparent text-ink-navy/40 dark:text-gray-555 hover:text-ink-navy/70'
          }`}
        >
          Subscriber Mailing List ({subscribers.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('compose')
            setSendSuccess(false)
          }}
          className={`px-6 py-3 font-mono text-xs font-bold uppercase transition-all border-b-2 -mb-[2px] ${
            activeTab === 'compose'
              ? 'border-amber text-ink-navy dark:text-white'
              : 'border-transparent text-ink-navy/40 dark:text-gray-555 hover:text-ink-navy/70'
          }`}
        >
          Compose Broadcast
        </button>
        <button
          onClick={() => {
            setActiveTab('history')
            setSendSuccess(false)
          }}
          className={`px-6 py-3 font-mono text-xs font-bold uppercase transition-all border-b-2 -mb-[2px] ${
            activeTab === 'history'
              ? 'border-amber text-ink-navy dark:text-white'
              : 'border-transparent text-ink-navy/40 dark:text-gray-555 hover:text-ink-navy/70'
          }`}
        >
          Sent Archives ({dispatches.length})
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 gap-6">

        {/* Tab 1: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 p-4 rounded-lg">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-ink-navy/40 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                />
              </div>

              <button
                onClick={handleExportCSV}
                disabled={subscribers.length === 0}
                className="w-full sm:w-auto bg-ink-navy dark:bg-white text-white dark:text-ink-navy hover:bg-amber dark:hover:bg-amber dark:hover:text-ink-navy hover:text-ink-navy font-bold text-xs px-4 py-2 rounded transition-colors shadow flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV List</span>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                      <th className="px-6 py-4">Subscriber Email</th>
                      <th className="px-6 py-4">Date Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
                    {filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-500">
                          No subscribers found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map(s => (
                        <tr key={s.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-ink-navy dark:text-paper-warm font-mono">
                            {s.email}
                          </td>
                          <td className="px-6 py-4 font-mono text-ink-navy/70 dark:text-gray-400">
                            {new Date(s.subscribed_at || s.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(s.id)}
                              className="p-1.5 hover:bg-red-500/10 text-ink-navy/60 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                              title="Remove Subscriber"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: COMPOSE */}
        {activeTab === 'compose' && (
          <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 max-w-3xl mx-auto w-full space-y-6">
            <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white flex items-center space-x-1.5 border-b border-ink-navy/5 pb-3">
              <Mail className="w-5 h-5 text-amber" />
              <span>Compose Corporate Broadcast</span>
            </h3>

            {sendSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded flex items-start space-x-3 text-green-600 dark:text-green-400 text-xs">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold block">Broadcast complete!</span>
                  Your newsletter dispatch has been successfully recorded and sent to the subscribers.
                </div>
              </div>
            )}

            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Weekly Roundup: Democratic Oversight & Politics"
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Newsletter Body (HTML/Text) *</label>
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear Readers, here is this week's newsletter update..."
                  className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm font-body resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending || subscribers.length === 0}
                className="w-full bg-amber hover:bg-amber-hover text-ink-navy disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs py-3 rounded transition-colors shadow flex items-center justify-center space-x-1.5"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to {subscribers.length} recipients...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Broadcast (Mailing List)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: SENT ARCHIVES */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Sent Date</th>
                    <th className="px-6 py-4">Recipients</th>
                    <th className="px-6 py-4 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
                  {dispatches.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-500">
                        No previous broadcasts sent.
                      </td>
                    </tr>
                  ) : (
                    dispatches.map(disp => (
                      <tr key={disp.id} className="hover:bg-paper-warm/15 dark:hover:bg-gray-850/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-ink-navy dark:text-paper-warm">
                          {disp.subject}
                        </td>
                        <td className="px-6 py-4 font-mono text-ink-navy/70 dark:text-gray-400">
                          {new Date(disp.sent_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-mono text-ink-navy/70 dark:text-gray-400">
                          {disp.recipients_count} Readers
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedDispatch(disp)}
                            className="bg-paper-warm hover:bg-amber dark:bg-gray-800 dark:hover:bg-gray-700 text-ink-navy dark:text-white px-3 py-1 rounded transition-colors text-[10px] font-mono font-bold border border-ink-navy/5"
                          >
                            Open Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Selected Dispatch Detail Modal */}
      {selectedDispatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-ink-navy/15 dark:border-gray-800 rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-ink-navy/5 pb-3">
              <div>
                <h4 className="font-headline font-black text-lg text-ink-navy dark:text-white">
                  {selectedDispatch.subject}
                </h4>
                <span className="text-[10px] font-mono text-ink-navy/40 dark:text-gray-500 uppercase">
                  Broadcasted: {new Date(selectedDispatch.sent_at).toLocaleString()} | {selectedDispatch.recipients_count} Recipients
                </span>
              </div>
              <button
                onClick={() => setSelectedDispatch(null)}
                className="p-1 hover:bg-paper-warm dark:hover:bg-gray-850 rounded"
              >
                <X className="w-5 h-5 text-ink-navy/50" />
              </button>
            </div>

            <div className="text-xs font-body leading-relaxed text-ink-navy/80 dark:text-gray-300 whitespace-pre-wrap border border-ink-navy/5 p-4 rounded bg-paper-warm/20 dark:bg-gray-950/20">
              {selectedDispatch.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDispatch(null)}
                className="bg-ink-navy text-white dark:bg-white dark:text-ink-navy px-4 py-2 rounded text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
