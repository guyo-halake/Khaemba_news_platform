'use client'

import { useState } from 'react'
import { Comment } from '@/lib/types'
import { isMockEnabled, updateCommentStatus, deleteComment } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Check, X, Trash2, ShieldAlert, CheckCircle, MessageSquare } from 'lucide-react'

interface CommentsProps {
  initialComments: Comment[];
  tenantId?: string;
}

export default function CommentsModerator({ initialComments, tenantId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      if (isMockEnabled()) {
        await updateCommentStatus(id, status)
        setComments(comments.map(c => (c.id === id ? { ...c, status } : c)))
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', id)

      if (error) {
        alert('Failed to update comment status: ' + error.message)
      } else {
        setComments(comments.map(c => (c.id === id ? { ...c, status } : c)))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this comment?')) return

    try {
      if (isMockEnabled()) {
        await deleteComment(id)
        setComments(comments.filter(c => c.id !== id))
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Failed to delete comment: ' + error.message)
      } else {
        setComments(comments.filter(c => c.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredComments = comments.filter(c => filter === 'all' || c.status === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline font-black text-2xl text-ink-navy dark:text-white">
          Comment Moderation Queue
        </h1>
        <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
          Moderate public feedback on published dispatches
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-ink-navy/10 dark:border-gray-800 pb-px">
        {[
          { id: 'pending', label: `PENDING (${comments.filter(c => c.status === 'pending').length})` },
          { id: 'approved', label: 'APPROVED' },
          { id: 'rejected', label: 'REJECTED' },
          { id: 'all', label: 'ALL COMMENTS' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`text-xs font-mono font-bold px-4 py-2.5 -mb-px border-b-2 transition-all ${
              filter === tab.id
                ? 'border-amber text-amber font-black'
                : 'border-transparent text-ink-navy/55 dark:text-gray-400 hover:text-ink-navy dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-ink-navy/10 dark:border-gray-800 rounded bg-white dark:bg-gray-900/50">
            <p className="text-sm font-mono text-ink-navy/40 dark:text-gray-500">
              No comments found in this queue.
            </p>
          </div>
        ) : (
          filteredComments.map(comment => (
            <div
              key={comment.id}
              className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-5 flex flex-col md:flex-row md:items-start gap-4 shadow-sm"
            >
              {/* Comment Content */}
              <div className="flex-grow space-y-3">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-ink-navy/50 dark:text-gray-550">
                  <span className="font-bold text-ink-navy dark:text-paper-warm text-xs font-sans">{comment.author_name}</span>
                  <span>•</span>
                  <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="text-amber">Article ID: {comment.article_id}</span>
                </div>
                <p className="text-xs text-ink-navy/80 dark:text-gray-300 leading-relaxed font-serif">
                  {comment.body}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 self-end md:self-start shrink-0">
                {comment.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(comment.id, 'approved')}
                    className="p-1.5 bg-green-50 dark:bg-green-950/20 hover:bg-green-500 hover:text-white text-green-600 dark:text-green-400 border border-green-500/20 rounded transition-all"
                    title="Approve Comment"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {comment.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(comment.id, 'rejected')}
                    className="p-1.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 border border-red-500/20 rounded transition-all"
                    title="Reject Comment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="p-1.5 hover:bg-red-500/10 text-ink-navy/55 dark:text-gray-400 hover:text-red-500 rounded transition-colors"
                  title="Delete Comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
