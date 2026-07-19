'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Newspaper, Key, Mail, ShieldAlert, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { isMockEnabled } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('razakwako45@gmail.com')
  const [password, setPassword] = useState('guyesa10333')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [mockActive, setMockActive] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    setMockActive(isMockEnabled())
  }, [])

  const handleMockLogin = (role: 'admin' | 'editor' | 'contributor', name: string, userId: string) => {
    // Set mock cookies
    document.cookie = `mock_logged_in=true; path=/; max-age=86400`
    document.cookie = `mock_user_role=${role}; path=/; max-age=86400`
    document.cookie = `mock_user_name=${name}; path=/; max-age=86400`
    document.cookie = `mock_user_id=${userId}; path=/; max-age=86400`
    
    router.push('/admin')
    router.refresh()
  }

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    if (mockActive) {
      // Check for developer credentials
      if (email === 'razakwako45@gmail.com' && password === 'guyesa10333') {
        handleMockLogin('admin', 'Razak Developer', 'u-dev')
        return
      }
      // Fallback to default admin
      handleMockLogin('admin', 'Wanjala Khaemba', 'u-1')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.')
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
        {/* Main Login Card */}
        <div className="bg-white dark:bg-gray-900 border border-ink-navy/5 dark:border-gray-800 rounded-2xl p-8 space-y-6 shadow-xl backdrop-blur-sm">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 bg-gradient-to-br from-amber/20 to-orange-100/20 dark:from-amber/10 dark:to-orange-900/10 rounded-full text-amber mx-auto">
              <Newspaper className="w-8 h-8" />
            </div>
            <h1 className="font-headline font-black text-4xl text-ink-navy dark:text-paper-warm">
              Khaemba News
            </h1>
            <p className="text-sm text-ink-navy/60 dark:text-gray-400 font-medium">
              Editorial Staff Dashboard
            </p>
          </div>

          {/* Errors */}
          {errorMsg && (
            <div className="flex items-start space-x-3 text-red-700 dark:text-red-300 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-lg font-medium">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
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
                required={!mockActive}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-ink-navy dark:text-gray-300 flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>Password</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-amber focus:border-transparent text-ink-navy dark:text-paper-warm placeholder-gray-500 dark:placeholder-gray-400 transition-all pr-12"
                  required={!mockActive}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber focus:ring-amber"
                />
                <span className="text-sm text-ink-navy/60 dark:text-gray-400">Remember me</span>
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-sm text-amber hover:text-orange-700 dark:hover:text-amber font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-ink-navy to-blue-800 dark:from-amber dark:to-orange-500 text-white dark:text-ink-navy hover:shadow-lg hover:scale-105 font-bold text-sm py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white dark:border-ink-navy border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mock Quick Logins */}
          {mockActive && (
            <div className="border-t border-ink-navy/5 dark:border-gray-800 pt-6 space-y-4">
              <div className="flex items-center space-x-2 text-sm text-amber font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Test Accounts</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleMockLogin('admin', 'Razak Developer', 'u-dev')}
                  className="bg-gradient-to-br from-amber/20 to-orange-100/20 hover:from-amber hover:to-orange-300 text-ink-navy dark:text-amber dark:hover:text-ink-navy font-bold text-xs py-2 rounded-lg transition-all hover:shadow-md"
                >
                  DEVELOPER
                </button>
                <button
                  type="button"
                  onClick={() => handleMockLogin('admin', 'Wanjala Khaemba', 'u-1')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-ink-navy dark:text-paper-warm font-bold text-xs py-2 rounded-lg transition-all hover:shadow-md"
                >
                  ADMIN
                </button>
                <button
                  type="button"
                  onClick={() => handleMockLogin('editor', 'Sarah Jepchirchir', 'u-2')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-ink-navy dark:text-paper-warm font-bold text-xs py-2 rounded-lg transition-all hover:shadow-md"
                >
                  EDITOR
                </button>
              </div>
              <p className="text-xs text-center text-ink-navy/40 dark:text-gray-500">
                *Mock mode active. Use test accounts or enter credentials above.
              </p>
            </div>
          )}

          {/* Footer Links */}
          <div className="border-t border-ink-navy/5 dark:border-gray-800 pt-6 space-y-3">
            <div className="text-center space-y-2">
              <p className="text-sm text-ink-navy/60 dark:text-gray-400">
                Don't have staff access?
              </p>
              <Link
                href="/reader-signup"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-amber hover:text-orange-700 dark:hover:text-amber transition-colors group"
              >
                <span>Sign up as a reader</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-ink-navy/40 dark:text-gray-500 mt-6 space-y-2">
          <p>© {new Date().getFullYear()} Khaemba News Group. All rights reserved.</p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/privacy" className="hover:text-amber transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-amber transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-amber transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
