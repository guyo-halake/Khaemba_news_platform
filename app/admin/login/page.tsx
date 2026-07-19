'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Newspaper, Key, Mail, ShieldAlert, Sparkles } from 'lucide-react'
import { isMockEnabled } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [mockActive, setMockActive] = useState(false)

  useEffect(() => {
    setMockActive(isMockEnabled())
  }, [])

  const handleMockLogin = (role: 'admin' | 'editor' | 'contributor', name: string) => {
    // Set mock cookies
    document.cookie = `mock_logged_in=true; path=/; max-age=86400`
    document.cookie = `mock_user_role=${role}; path=/; max-age=86400`
    document.cookie = `mock_user_name=${name}; path=/; max-age=86400`
    
    router.push('/admin')
    router.refresh()
  }

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    if (mockActive) {
      // Allow fallback if they type credentials in mock mode
      handleMockLogin('admin', 'Wanjala Khaemba')
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
    <div className="min-h-screen bg-paper-warm dark:bg-paper-dark flex flex-col justify-center items-center p-4 font-body transition-colors duration-200">
      
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-xl p-8 space-y-6 shadow-lg">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-amber/10 dark:bg-amber/5 rounded-full text-amber mx-auto mb-2">
            <Newspaper className="w-8 h-8" />
          </div>
          <h1 className="font-headline font-black text-3xl text-ink-navy dark:text-paper-warm">
            Newsroom Portal
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400 uppercase tracking-widest">
            Editorial Staff Login
          </p>
        </div>

        {/* Errors */}
        {errorMsg && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3 rounded font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@khaembanews.com"
              className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
              required={!mockActive}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase flex items-center space-x-1">
              <Key className="w-3.5 h-3.5" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
              required={!mockActive}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink-navy dark:bg-white text-white dark:text-ink-navy hover:bg-amber dark:hover:bg-amber dark:hover:text-ink-navy hover:text-ink-navy font-bold text-xs py-3 rounded transition-colors shadow-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white dark:border-ink-navy border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Mock Quick Logins */}
        {mockActive && (
          <div className="border-t border-ink-navy/5 dark:border-gray-800 pt-6 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs text-amber font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Quick Role Selection (Mock Active)</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleMockLogin('admin', 'Wanjala Khaemba')}
                className="bg-amber/15 hover:bg-amber text-ink-navy dark:text-amber dark:hover:text-ink-navy font-bold text-[10px] py-2 rounded transition-colors"
              >
                ADMIN
              </button>
              <button
                type="button"
                onClick={() => handleMockLogin('editor', 'Sarah Jepchirchir')}
                className="bg-amber/15 hover:bg-amber text-ink-navy dark:text-amber dark:hover:text-ink-navy font-bold text-[10px] py-2 rounded transition-colors"
              >
                EDITOR
              </button>
              <button
                type="button"
                onClick={() => handleMockLogin('contributor', 'Dennis Omondi')}
                className="bg-amber/15 hover:bg-amber text-ink-navy dark:text-amber dark:hover:text-ink-navy font-bold text-[10px] py-2 rounded transition-colors"
              >
                WRITER
              </button>
            </div>
            <p className="text-[9px] text-center text-ink-navy/40 dark:text-gray-500 font-mono">
              *Supabase is currently off or running in preview sandbox. Click above to login as any staff member.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
