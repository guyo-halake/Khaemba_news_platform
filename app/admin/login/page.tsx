'use client'

import { useState, useEffect } from 'react'
import { Newspaper, Eye, EyeOff, Loader2 } from 'lucide-react'
import { isMockEnabled } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('razakwako45@gmail.com')
  const [password, setPassword] = useState('guyesa10333')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [mockActive, setMockActive] = useState(false)

  useEffect(() => {
    setMockActive(isMockEnabled())
  }, [])

  const handleMockLogin = (role: 'admin' | 'editor' | 'contributor', name: string, userId: string) => {
    document.cookie = `mock_logged_in=true; path=/; max-age=86400`
    document.cookie = `mock_user_role=${role}; path=/; max-age=86400`
    document.cookie = `mock_user_name=${name}; path=/; max-age=86400`
    document.cookie = `mock_user_id=${userId}; path=/; max-age=86400`
    window.location.href = '/admin'
  }

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    if (mockActive) {
      // Mock mode: login developer or admin automatically
      if (emailOrPhone.includes('razakwako45')) {
        handleMockLogin('admin', 'Razak Developer', 'u-dev')
      } else {
        handleMockLogin('admin', 'Wanjala Khaemba', 'u-1')
      }
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: emailOrPhone,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        window.location.href = '/admin'
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper-warm dark:bg-paper-dark flex flex-col justify-between items-center py-12 px-4 font-body transition-colors duration-200">
      <div /> {/* Spacer */}

      <div className="w-full max-w-sm space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-ink-navy/5 dark:bg-white/5 rounded-full text-ink-navy dark:text-amber">
            <Newspaper className="w-6 h-6" />
          </div>
          <h1 className="font-headline font-black text-3xl tracking-tight text-ink-navy dark:text-white">
            KHAEMBA NEWS
          </h1>
          <p className="text-xs text-ink-navy/50 dark:text-gray-400 font-mono tracking-widest uppercase">
            Staff Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-xl p-8 space-y-6 shadow-sm">
          {errorMsg && (
            <div className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 p-3.5 rounded font-mono text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            {/* Email/Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/50 dark:text-gray-400 uppercase tracking-wider">
                Email or Phone
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="email@example.com"
                className="w-full text-sm px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-ink-navy/50 dark:text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm placeholder-gray-400 dark:placeholder-gray-500 transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink-navy dark:bg-amber hover:opacity-90 text-white dark:text-ink-navy font-bold text-xs py-3 rounded tracking-wider uppercase transition-opacity flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col items-center space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <a
              href="/admin/forgot-password"
              className="text-xs text-amber hover:underline font-mono"
            >
              Forgot password?
            </a>
            <span className="text-[10px] text-gray-300 dark:text-gray-700">|</span>
            <a
              href="/reader-signup"
              className="text-xs text-amber hover:underline font-mono"
            >
              Create a reader account
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] font-mono text-ink-navy/40 dark:text-gray-500 mt-8 space-y-1">
        <p>DEVELOPED BY P3L DEVELOPERS</p>
        <p className="opacity-60">© {new Date().getFullYear()} KHAEMBA NEWS GROUP. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  )
}
