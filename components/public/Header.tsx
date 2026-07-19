'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { useDemoMode } from '@/lib/demo-context'
import { Sun, Moon, Search, Calendar, CloudSun, Menu, X, ArrowRight, User, Database, Layers3 } from 'lucide-react'
import { mockArticles, isMockEnabled } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { isDemoMode, toggleDemoMode } = useDemoMode()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dateStr, setDateStr] = useState('')
  const [tickerItems, setTickerItems] = useState<string[]>([])
  const [userSession, setUserSession] = useState<any>(null)
  const [cardStyle, setCardStyle] = useState<'minimalist' | 'bold' | 'editorial'>('editorial')
  const [siteName, setSiteName] = useState('KHAEMBA NEWS')
  const [siteTagline, setSiteTagline] = useState('The Voice of Devolution & Authoritative County Journalism')
  const [siteCategories, setSiteCategories] = useState<Category[]>([])

  useEffect(() => {
    const savedCardStyle = localStorage.getItem('cardStyle')
    if (savedCardStyle === 'minimalist' || savedCardStyle === 'bold' || savedCardStyle === 'editorial') {
      setCardStyle(savedCardStyle)
    }

    // Format Date
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    setDateStr(new Date().toLocaleDateString('en-US', options))

    // Set news ticker items
    const fetchTicker = async () => {
      if (isMockEnabled()) {
        const headlines = mockArticles.map(art => art.title)
        setTickerItems(headlines.length > 0 ? headlines : ['Loading breaking news...'])
        return
      }
      try {
        const supabase = createClient()
        const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'
        const { data } = await supabase
          .from('articles')
          .select('title')
          .eq('status', 'published')
          .eq('tenant_id', tenantId)
          .order('published_at', { ascending: false })
          .limit(5)
        if (data && data.length > 0) {
          setTickerItems(data.map(d => d.title))
        } else {
          setTickerItems(['No breaking news at this moment. Check back later.'])
        }
      } catch (e) {
        console.error(e)
      }
    }

    // Check user auth status
    const checkUser = async () => {
      if (isMockEnabled()) {
        const cookies = document.cookie.split('; ')
        const mockLoggedIn = cookies.find(c => c.startsWith('mock_logged_in='))?.split('=')[1] === 'true'
        const mockUserRole = cookies.find(c => c.startsWith('mock_user_role='))?.split('=')[1] || ''
        const mockUserName = cookies.find(c => c.startsWith('mock_user_name='))?.split('=')[1] || ''
        if (mockLoggedIn) {
          setUserSession({
            user: {
              email: 'mock@khaembanews.com',
              user_metadata: { full_name: decodeURIComponent(mockUserName) },
            },
            role: mockUserRole
          })
        } else {
          setUserSession(null)
        }
        return
      }
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setUserSession(session)
    }

    const fetchSiteSettings = async () => {
      if (isMockEnabled()) {
        setSiteCategories([])
        return
      }

      try {
        const supabase = createClient()
        const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'
        const { data } = await supabase
          .from('site_settings')
          .select('site_name, site_tagline')
          .eq('tenant_id', tenantId)
          .maybeSingle()

        if (data) {
          setSiteName(data.site_name || 'KHAEMBA NEWS')
          setSiteTagline(data.site_tagline || 'The Voice of Devolution & Authoritative County Journalism')
        }
      } catch (error) {
        console.error('Failed to load site settings:', error)
      }
    }

    const fetchCategories = async () => {
      if (isMockEnabled()) {
        return
      }

      try {
        const supabase = createClient()
        const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'
        const { data } = await supabase
          .from('categories')
          .select('id, name, slug, accent_color')
          .eq('tenant_id', tenantId)
          .order('name', { ascending: true })

        if (data) {
          setSiteCategories(data as Category[])
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    fetchTicker()
    checkUser()
    fetchSiteSettings()
    fetchCategories()
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const cycleCardStyle = () => {
    const nextStyle = cardStyle === 'editorial' ? 'minimalist' : cardStyle === 'minimalist' ? 'bold' : 'editorial'
    setCardStyle(nextStyle)
    localStorage.setItem('cardStyle', nextStyle)
    window.location.reload()
  }

  return (
    <header className="w-full bg-paper-warm dark:bg-paper-dark border-b border-ink-navy/10 dark:border-gray-800 z-50">
      {/* 1. TOP UTILITY BAR */}
      <div className="w-full bg-ink-navy dark:bg-gray-950 text-paper-warm dark:text-gray-300 py-1.5 px-4 md:px-8 text-xs font-mono flex flex-wrap justify-between items-center border-b border-white/5">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-amber" />
            <span>{dateStr || 'Sunday, July 19, 2026'}</span>
          </span>
          <span className="hidden sm:flex items-center space-x-1 border-l border-white/10 pl-4">
            <CloudSun className="w-3.5 h-3.5 text-amber animate-pulse" />
            <span>Nairobi, 22°C Overcast</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">

          <Link href="/advertise" className="hover:text-amber transition-colors font-semibold">
            ADVERTISE
          </Link>
          <span className="text-white/20">|</span>
          <Link href="#newsletter" className="hover:text-amber transition-colors font-semibold">
            SUBSCRIBE
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/admin" className="flex items-center space-x-1 hover:text-amber transition-colors">
            <User className="w-3.5 h-3.5" />
            <span>{userSession ? 'ADMIN' : 'STAFF LOGIN'}</span>
          </Link>
          <span className="text-white/20">|</span>
          <button
            onClick={cycleCardStyle}
            className="flex items-center space-x-1 px-2 py-1 rounded font-semibold transition-all bg-white/10 text-white/90 hover:bg-white/15"
            title={`Card style: ${cardStyle}`}
          >
            <Layers3 className="w-3.5 h-3.5" />
            <span className="font-mono font-bold">{cardStyle.slice(0, 3).toUpperCase()}</span>
          </button>
          <button
            onClick={toggleDemoMode}
            className={`flex items-center space-x-1 px-2 py-1 rounded font-semibold transition-all ${
              isDemoMode 
                ? 'bg-amber/20 text-amber hover:bg-amber/30' 
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
            title={isDemoMode ? 'Demo Mode ON - Click to disable' : 'Demo Mode OFF - Click to enable'}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="font-mono font-bold">D</span>
            <span className="font-mono font-bold">{isDemoMode ? 'DEMO' : 'LIVE'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN LOGO & BRANDING ROW */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink-navy dark:text-paper-warm hover:text-amber transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Center/Left Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/">
            <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tight text-ink-navy dark:text-paper-warm select-none hover:opacity-90 transition-opacity">
              {siteName.split(' ')[0]} <span className="text-amber">{siteName.split(' ').slice(1).join(' ') || 'NEWS'}</span>
            </h1>
          </Link>
          <p className="hidden md:block text-[10px] font-mono tracking-widest text-ink-navy/60 dark:text-gray-400 mt-1 uppercase">
            {siteTagline}
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-white dark:bg-gray-800 border border-ink-navy/20 dark:border-gray-700 rounded-full px-3 py-1.5 transition-all w-48 md:w-64">
                <input
                  type="text"
                  placeholder="Search articles & videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs w-full focus:outline-none text-ink-navy dark:text-paper-warm"
                  autoFocus
                />
                <button type="submit" aria-label="Submit search">
                  <Search className="w-4 h-4 text-ink-navy/60 dark:text-gray-400 hover:text-amber transition-colors" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="ml-1 text-ink-navy/40 dark:text-gray-500 hover:text-red-500"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-ink-navy dark:text-paper-warm"
                aria-label="Open search bar"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-ink-navy dark:text-paper-warm"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber" /> : <Moon className="w-5 h-5" />}
          </button>



          <Link href="/advertise" className="hidden lg:flex items-center space-x-1 bg-amber text-ink-navy font-bold text-xs px-4 py-2.5 rounded hover:bg-amber-hover transition-colors shadow-sm">
            <span>ADVERTISE WITH US</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION BAR */}
      <nav className="w-full border-t border-b border-ink-navy/10 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex justify-center space-x-8 font-mono text-xs py-3.5">
          <Link href="/" className="hover:text-amber dark:hover:text-amber transition-colors font-bold tracking-wider">
            HOME
          </Link>
          {siteCategories.length > 0 ? siteCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="transition-colors tracking-wider hover:opacity-80"
              style={{ color: category.accent_color }}
            >
              {category.name.toUpperCase()}
            </Link>
          )) : (
            <>
              <Link href="/category/politics" className="hover:text-category-politics transition-colors tracking-wider">POLITICS</Link>
              <Link href="/category/business" className="hover:text-category-business transition-colors tracking-wider">BUSINESS</Link>
              <Link href="/category/county" className="hover:text-category-county transition-colors tracking-wider">COUNTY</Link>
              <Link href="/category/sports" className="hover:text-category-sports transition-colors tracking-wider">SPORTS</Link>
            </>
          )}
          <Link href="/documentaries" className="hover:text-amber transition-colors tracking-wider font-bold text-amber">
            DOCUMENTARIES
          </Link>
          <Link href="/category/opinion" className="hover:text-category-opinion transition-colors tracking-wider">
            OPINION
          </Link>
        </div>
      </nav>

      {/* 4. BREAKING NEWS TICKER */}
      <div className="w-full bg-amber/10 dark:bg-amber/5 border-b border-amber/20 overflow-hidden py-2 text-xs flex items-center">
        <div className="bg-amber text-ink-navy font-bold px-3 py-1 font-mono tracking-widest text-[10px] shrink-0 ml-4 rounded uppercase z-10 shadow-sm">
          BREAKING
        </div>
        <div className="relative w-full overflow-hidden h-5 flex items-center ml-4">
          <div className="animate-ticker whitespace-nowrap">
            {/* Double the array elements to ensure seamless loop */}
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={idx} className="mx-6 text-ink-navy dark:text-paper-warm font-medium hover:text-amber transition-colors cursor-pointer">
                • &nbsp; {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-paper-warm dark:bg-paper-dark z-40 pt-20 px-6 flex flex-col space-y-6">
          <div className="flex flex-col space-y-4 font-mono text-sm border-b border-ink-navy/10 dark:border-gray-800 pb-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber">HOME</Link>
            <Link href="/category/politics" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-politics">POLITICS</Link>
            <Link href="/category/business" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-business">BUSINESS</Link>
            <Link href="/category/county" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-county">COUNTY</Link>
            <Link href="/category/sports" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-sports">SPORTS</Link>
            <Link href="/documentaries" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber text-amber font-bold">DOCUMENTARIES</Link>
            <Link href="/category/opinion" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-opinion">OPINION</Link>
            <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber font-bold">STAFF LOGIN</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/advertise" onClick={() => setMobileMenuOpen(false)} className="bg-amber text-ink-navy font-bold text-center py-2.5 rounded">
              ADVERTISE WITH US
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
