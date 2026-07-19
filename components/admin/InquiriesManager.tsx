'use client'

import { useState } from 'react'
import { isMockEnabled, updateInquiryStatus, deleteInquiry } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import {
  Inbox,
  Mail,
  Trash2,
  X,
  Search,
  MessageSquare,
  BadgeAlert,
  BadgeCheck,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

interface InquiriesManagerProps {
  initialInquiries: any[]
  tenantId: string
}

export default function InquiriesManager({
  initialInquiries,
  tenantId
}: InquiriesManagerProps) {
  const [inquiries, setInquiries] = useState<any[]>(initialInquiries)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'contact' | 'advertise'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all')

  // Selected inquiry detail modal
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null)

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === 'all' || inq.type === selectedType
    const matchesStatus = selectedStatus === 'all' || inq.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  // Update status (mark read, replied, etc.)
  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      if (isMockEnabled()) {
        await updateInquiryStatus(id, newStatus)
        setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i))
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus })
        }
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) throw error
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i))
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus })
      }
    } catch (err: any) {
      alert('Failed to update inquiry status: ' + err.message)
    }
  }

  // Delete inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inbox inquiry?')) return

    try {
      if (isMockEnabled()) {
        await deleteInquiry(id)
        setInquiries(inquiries.filter(i => i.id !== id))
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null)
        }
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId)

      if (error) throw error
      setInquiries(inquiries.filter(i => i.id !== id))
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null)
      }
    } catch (err: any) {
      alert('Delete failed: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
          Inquiries Inbox
        </h1>
        <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
          Manage reader tips, advertiser requests, and editorial contact messages.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 p-4 rounded-lg">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-ink-navy/40 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="text-xs bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded px-3 py-2 text-ink-navy dark:text-paper-warm outline-none focus:border-amber"
          >
            <option value="all">All Inquiries</option>
            <option value="contact">Contact Forms</option>
            <option value="advertise">Sponsorship Inquiries</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="text-xs bg-paper-warm/50 dark:bg-gray-850 border border-ink-navy/10 dark:border-gray-700 rounded px-3 py-2 text-ink-navy dark:text-paper-warm outline-none focus:border-amber"
          >
            <option value="all">All Statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Inbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Table List */}
        <div className={`bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm ${
          selectedInquiry ? 'lg:col-span-6' : 'lg:col-span-12'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink-navy/10 dark:border-gray-800 bg-paper-warm/30 dark:bg-gray-950/40 text-[10px] font-mono font-bold uppercase text-ink-navy/55 dark:text-gray-400">
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Subject & Excerpt</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-navy/5 dark:divide-gray-800/85 text-xs">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 font-mono text-ink-navy/40 dark:text-gray-500">
                      Inbox is empty.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map(inq => (
                    <tr
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq)
                        if (inq.status === 'unread') {
                          handleUpdateStatus(inq.id, 'read')
                        }
                      }}
                      className={`cursor-pointer transition-colors ${
                        selectedInquiry?.id === inq.id
                          ? 'bg-amber/10 dark:bg-amber/5'
                          : inq.status === 'unread'
                          ? 'bg-paper-warm/10 dark:bg-gray-950/20 font-bold'
                          : 'hover:bg-paper-warm/15 dark:hover:bg-gray-850/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="block text-ink-navy dark:text-paper-warm">
                          {inq.name}
                        </span>
                        <span className="text-[10px] font-mono text-ink-navy/50 dark:text-gray-500 truncate block max-w-[120px]">
                          {inq.email}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="block text-ink-navy dark:text-paper-warm truncate max-w-[200px]">
                          {inq.subject}
                        </span>
                        <span className="text-[10px] text-ink-navy/60 dark:text-gray-400 block truncate max-w-[200px]">
                          {inq.message}
                        </span>
                      </td>

                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          inq.type === 'advertise'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        }`}>
                          {inq.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          inq.status === 'unread'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : inq.status === 'read'
                            ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
                            : 'bg-green-500/10 text-green-600 border border-green-500/20'
                        }`}>
                          {inq.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 hover:bg-red-500/10 text-ink-navy/60 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-ink-navy/30" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview Details pane */}
        {selectedInquiry && (
          <div className="lg:col-span-6 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-6 shadow-md sticky top-6">
            <div className="flex justify-between items-start border-b border-ink-navy/5 pb-3">
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase mb-2 ${
                  selectedInquiry.type === 'advertise'
                    ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                    : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                }`}>
                  {selectedInquiry.type} Request
                </span>
                <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white leading-tight">
                  {selectedInquiry.subject}
                </h3>
                <span className="text-[10px] font-mono text-ink-navy/40 dark:text-gray-500 uppercase block mt-1">
                  Received: {new Date(selectedInquiry.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 hover:bg-paper-warm dark:hover:bg-gray-855 rounded"
              >
                <X className="w-4 h-4 text-ink-navy/40" />
              </button>
            </div>

            {/* Sender card */}
            <div className="bg-paper-warm/30 dark:bg-gray-950/20 p-3.5 rounded border border-ink-navy/5 flex justify-between items-center text-xs">
              <div>
                <span className="block font-bold text-ink-navy dark:text-paper-warm">{selectedInquiry.name}</span>
                <span className="block text-ink-navy/60 dark:text-gray-400 font-mono text-[10px] mt-0.5">{selectedInquiry.email}</span>
              </div>

              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                onClick={() => {
                  if (selectedInquiry.status !== 'replied') {
                    handleUpdateStatus(selectedInquiry.id, 'replied')
                  }
                }}
                className="inline-flex items-center space-x-1 bg-amber hover:bg-amber-hover text-ink-navy px-3 py-1.5 rounded font-mono font-bold text-[10px] shadow transition-colors"
              >
                <span>Draft Email Response</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Message Content</span>
              <div className="text-xs font-body leading-relaxed text-ink-navy/85 dark:text-gray-300 whitespace-pre-wrap border border-ink-navy/5 p-4 rounded bg-paper-warm/15 dark:bg-gray-950/10 min-h-[120px]">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Actions panel */}
            <div className="flex gap-2 border-t border-ink-navy/5 pt-4">
              <button
                onClick={() => handleUpdateStatus(selectedInquiry.id, 'unread')}
                disabled={selectedInquiry.status === 'unread'}
                className="flex-1 bg-transparent hover:bg-paper-warm border border-ink-navy/10 text-ink-navy dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 text-center py-2 text-xs font-mono font-bold rounded uppercase transition-colors"
              >
                Mark Unread
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedInquiry.id, 'replied')}
                disabled={selectedInquiry.status === 'replied'}
                className="flex-1 bg-transparent hover:bg-paper-warm border border-ink-navy/10 text-ink-navy dark:text-white dark:hover:bg-gray-800 disabled:opacity-50 text-center py-2 text-xs font-mono font-bold rounded uppercase transition-colors"
              >
                Mark Replied
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
