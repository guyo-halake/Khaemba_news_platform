'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Newspaper, Mail, Lock, User, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isMockEnabled, addSubscriber } from '@/lib/supabase/mockDb'

export default function ReaderSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const mockActive = isMockEnabled()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions')
      setLoading(false)
      return
    }

    try {
      if (mockActive) {
        // In mock mode, just add as subscriber
        addSubscriber(formData.email)
        setSubmitted(true)
        setTimeout(() => {
          router.push('/admin/login')
        }, 3000)
        return
      }

      const supabase = createClient()
      
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'reader',
          }
        }
      })

      if (authError) {
        setError(authError.message)
      } else {
        // Add to newsletter subscribers
        addSubscriber(formData.email)
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
              <Newspaper className="w-8 h-8" />
            </div>
            <h1 className="font-headline font-black text-3xl text-ink-navy dark:text-paper-warm">
              Join Khaemba News
            </h1>
            <p className="text-sm text-ink-navy/60 dark:text-gray-400">
              Get the latest news delivered to your inbox
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-start space-x-3 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Welcome to Khaemba News!</p>
                  <p className="text-green-600 dark:text-green-400 mt-1">Account created successfully. Check your email to verify your account.</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">Redirecting to login page...</p>
                </div>
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
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full text-sm px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-amber focus:border-transparent text-ink-navy dark:text-paper-warm placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-ink-navy dark:text-gray-300 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full text-sm px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-amber focus:border-transparent text-ink-navy dark:text-paper-warm placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-ink-navy dark:text-gray-300 flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full text-sm px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-amber focus:border-transparent text-ink-navy dark:text-paper-warm placeholder-gray-500 dark:placeholder-gray-400 transition-all pr-12"
                    required
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-ink-navy dark:text-gray-300 flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full text-sm px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-amber focus:border-transparent text-ink-navy dark:text-paper-warm placeholder-gray-500 dark:placeholder-gray-400 transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-amber focus:ring-amber"
                  required
                />
                <span className="text-xs text-ink-navy/60 dark:text-gray-400">
                  I agree to the <Link href="/terms" className="text-amber hover:text-orange-700 font-semibold">Terms of Service</Link> and <Link href="/privacy" className="text-amber hover:text-orange-700 font-semibold">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-ink-navy to-blue-800 dark:from-amber dark:to-orange-500 text-white dark:text-ink-navy hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm py-3 rounded-lg transition-all duration-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-ink-navy border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Link to Login */}
          <div className="border-t border-ink-navy/5 dark:border-gray-800 pt-6 text-center space-y-3">
            <p className="text-sm text-ink-navy/60 dark:text-gray-400">
              Already have an account?
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-amber hover:text-orange-700 dark:hover:text-amber transition-colors group"
            >
              <span>Sign in here</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-ink-navy/40 dark:text-gray-500 mt-6 space-y-2">
          <p>© {new Date().getFullYear()} Khaemba News Group. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
