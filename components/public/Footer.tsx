'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Mail, Facebook, Twitter, Youtube, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setEmail('')
        setMessage('Thank you for subscribing! Stay tuned.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Subscription failed. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error. Please try again later.')
    }
  }

  return (
    <footer id="newsletter" className="w-full bg-ink-navy dark:bg-gray-950 text-paper-warm/80 dark:text-gray-400 pt-16 pb-8 px-4 md:px-8 border-t border-white/5 font-body">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/15">
        
        {/* Column 1: Branding & Intro */}
        <div className="flex flex-col space-y-4">
          <Link href="/">
            <h2 className="font-headline font-black text-2xl tracking-tight text-white select-none">
              KHAEMBA <span className="text-amber">NEWS</span>
            </h2>
          </Link>
          <p className="text-sm leading-relaxed">
            Independent, county-first investigative reporting. Authoritative stories and in-depth documentaries outlining structural governance, economic growth, and communities in East Africa.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-amber hover:text-ink-navy transition-colors text-white" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-amber hover:text-ink-navy transition-colors text-white" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-amber hover:text-ink-navy transition-colors text-white" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Categories Nav */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-mono text-xs font-bold tracking-widest text-white uppercase">Categories</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <Link href="/category/politics" className="hover:text-amber transition-colors">Politics & Parliament</Link>
            <Link href="/category/business" className="hover:text-amber transition-colors">Business & Devolution VC</Link>
            <Link href="/category/county" className="hover:text-amber transition-colors">County News & Devolution</Link>
            <Link href="/category/sports" className="hover:text-amber transition-colors">Track, Field & Sports</Link>
            <Link href="/category/opinion" className="hover:text-amber transition-colors">Opinion & Editorials</Link>
            <Link href="/documentaries" className="hover:text-amber transition-colors text-amber font-semibold">Documentaries Hub</Link>
          </div>
        </div>

        {/* Column 3: Quick Corporate Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-mono text-xs font-bold tracking-widest text-white uppercase">Corporate</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <Link href="/about" className="hover:text-amber transition-colors">About Our Newsroom</Link>
            <Link href="/contact" className="hover:text-amber transition-colors">Contact Editorial Desk</Link>
            <Link href="/advertise" className="hover:text-amber transition-colors font-semibold">Advertise With Us</Link>
            <Link href="/privacy" className="hover:text-amber transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Column 4: Newsletter Box */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-mono text-xs font-bold tracking-widest text-white uppercase">Newsletter Dispatch</h3>
          <p className="text-sm">
            Get premium analyses and county dispatches delivered weekly to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex items-stretch bg-white/5 border border-white/10 rounded overflow-hidden">
            <div className="flex items-center px-3 text-white/40">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="bg-transparent text-sm w-full py-2.5 outline-none text-white placeholder-white/30"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-amber text-ink-navy hover:bg-amber-hover transition-colors px-4 flex items-center justify-center font-bold"
              aria-label="Subscribe to newsletter"
            >
              {status === 'loading' ? (
                <div className="w-4 h-4 border-2 border-ink-navy border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </form>
          {status === 'success' && (
            <div className="flex items-center space-x-1.5 text-green-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center space-x-1.5 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-mono tracking-wider">
        <p className="text-white/40">
          &copy; {new Date().getFullYear()} Khaemba News. All rights reserved.
        </p>
        <p className="text-white/40 mt-2 sm:mt-0">
          Built with Next.js, Tailwind, & Supabase.
        </p>
      </div>
    </footer>
  )
}
