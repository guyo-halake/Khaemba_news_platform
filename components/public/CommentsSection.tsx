'use client'

import { useState, useEffect } from 'react'
import { Comment } from '@/lib/types'
import { isMockEnabled, mockComments, addComment } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, MessageSquare, Send } from 'lucide-react'

interface CommentsSectionProps {
  articleId: string
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const fetchComments = async () => {
    try {
      if (isMockEnabled()) {
        const approved = mockComments.filter(
          c => c.article_id === articleId && c.status === 'approved'
        )
        setComments(approved)
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Comments fetch error:', error)
      } else {
        setComments(data as Comment[])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !body.trim()) return

    setSubmitting(true)
    try {
      if (isMockEnabled()) {
        addComment({ article_id: articleId, author_name: name, body })
        setSuccess(true)
        setName('')
        setBody('')
        setTimeout(() => setSuccess(false), 5000)
        return
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          author_name: name,
          body,
          status: 'pending'
        })

      if (error) {
        console.error('Comment submit error:', error)
        alert('Failed to submit comment: ' + error.message)
      } else {
        setSuccess(true)
        setName('')
        setBody('')
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 pt-8 border-t border-ink-navy/10 dark:border-gray-800">
      <h3 className="font-headline font-bold text-xl sm:text-2xl text-ink-navy dark:text-paper-warm mb-6 flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-amber" />
        <span>Discussion ({comments.length})</span>
      </h3>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-5 mb-8 space-y-4 shadow-sm">
        <h4 className="text-xs font-mono font-bold tracking-wider text-ink-navy/60 dark:text-gray-400 uppercase">
          Leave a comment
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            className="w-full text-sm px-4 py-2 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber dark:focus:border-amber text-ink-navy dark:text-paper-warm placeholder-ink-navy/35"
            required
          />
        </div>
        <textarea
          rows={4}
          placeholder="Write your thoughts..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={submitting}
          className="w-full text-sm px-4 py-3 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber dark:focus:border-amber text-ink-navy dark:text-paper-warm placeholder-ink-navy/35 resize-y"
          required
        />
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-ink-navy/45 dark:text-gray-500 font-mono">
            *Comments are moderated before being displayed.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-1.5 bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-3.5 h-3.5 border-2 border-ink-navy border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Post Comment</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
        {success && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-xs font-medium bg-green-50 dark:bg-green-950/20 p-3 rounded">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your comment has been submitted and is awaiting moderation.</span>
          </div>
        )}
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-16 bg-white dark:bg-gray-900 border border-ink-navy/5 rounded animate-skeleton" />
          <div className="h-16 bg-white dark:bg-gray-900 border border-ink-navy/5 rounded animate-skeleton" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-navy/50 dark:text-gray-500 text-center py-6 border border-dashed border-ink-navy/10 dark:border-gray-800 rounded bg-white/20 dark:bg-gray-900/10">
          No approved comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-gray-900/60 border border-ink-navy/5 dark:border-gray-800/80 rounded-lg p-5">
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-headline font-bold text-ink-navy dark:text-paper-warm text-sm">
                  {comment.author_name}
                </span>
                <span className="text-[10px] font-mono text-ink-navy/40 dark:text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-ink-navy/80 dark:text-gray-300 leading-relaxed">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
