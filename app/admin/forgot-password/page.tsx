'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Newspaper, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
      } else {
        setSubmitted(true)
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper-warm via-white to-blue-50 dark:from-paper-dark dark:via-gray-900 dark:to-gray-800 flex flex-col justify-center items-center p-4 font-body transition-colors duration-200">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-gray-900 border border-ink-navy/5 dark:border-gray-800 rounded-2xl p-8 space-y-6 shadow-xl">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 bg-gradient-to-br from-amber/20 to-orange-100/20 dark:from-amber/10 dark:to-orange-900/10 rounded-full text-amber mx-auto">
              <Mail className="w-8 h-8" />
            </div>
            <h1 className="font-headline font-black text-3xl text-ink-navy dark:text-paper-warm">
              Reset Password
            </h1>
            <p className="text-sm text-ink-navy/60 dark:text-gray-400">
              {submitted ? 'Check your email for reset instructions' : 'Enter your email to receive password reset instructions'}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-start space-x-3 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Check your email</p>
                  <p className="text-green-600 dark:text-green-400 mt-1">We've sent password reset instructions to <strong>{email}</strong></p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">If you don't see the email, check your spam folder.</p>
                </div>
              </div>

              {/* Back to Login */}
              <Link
                href="/admin/login"
                className="w-full inline-flex items-center justify-center space-x-2 bg-ink-navy dark:bg-amber text-white dark:text-ink-navy hover:shadow-lg font-bold text-sm py-3 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>

              {/* Additional Help */}
              <div className="text-center text-sm text-ink-navy/60 dark:text-gray-400">
                <p>Password reset link expires in 24 hours.</p>
                <p className="mt-2">Need help? <Link href="/contact" className="text-amber hover:text-orange-700 font-semibold">Contact support</Link></p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start space-x-3 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-lg text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-ink-navy dark:text-gray-300 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@khaembanews.com"
                  className="w-full text-sm px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-amber focus:border-transparent text-ink-navy dark:text-paper-warm placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-ink-navy to-blue-800 dark:from-amber dark:to-orange-500 text-white dark:text-ink-navy hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm py-3 rounded-lg transition-all duration-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-ink-navy border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="border-t border-ink-navy/5 dark:border-gray-800 pt-6 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-amber hover:text-orange-700 dark:hover:text-amber transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-ink-navy/40 dark:text-gray-500 mt-6">
          © {new Date().getFullYear()} Khaemba News Group
        </div>
      </div>
    </div>
  )
}
