'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { Sun, Moon, Search, Calendar, Menu, X, User, Layers3 } from 'lucide-react'
import { mockArticles, mockCategories, isMockEnabled } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dateStr, setDateStr] = useState('')
  const [tickerItems, setTickerItems] = useState<string[]>([])
  const [userSession, setUserSession] = useState<any>(null)
  const [siteCategories, setSiteCategories] = useState<Category[]>([])
  const [cardStyle, setCardStyle] = useState<'minimalist' | 'bold' | 'editorial'>('editorial')

  useEffect(() => {
    // Restore card style from localStorage
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

    const fetchCategories = async () => {
      if (isMockEnabled()) {
        setSiteCategories(mockCategories)
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
    fetchCategories()
  }, [])

  const cycleCardStyle = () => {
    const nextStyle = cardStyle === 'editorial' ? 'minimalist' : cardStyle === 'minimalist' ? 'bold' : 'editorial'
    setCardStyle(nextStyle)
    localStorage.setItem('cardStyle', nextStyle)
    window.location.reload()
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="w-full bg-paper-warm dark:bg-paper-dark border-b border-ink-navy/10 dark:border-gray-800 z-50">
      {/* 1. SLIM UTILITY BAR */}
      <div className="w-full bg-ink-navy dark:bg-gray-950 text-paper-warm dark:text-gray-300 py-1 px-4 md:px-8 text-[11px] font-mono flex justify-between items-center border-b border-white/5">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 opacity-70">
            <Calendar className="w-3 h-3" />
            <span>{dateStr || 'Sunday, July 20, 2026'}</span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/about" className="hover:text-amber transition-colors hidden sm:inline">ABOUT</Link>
          <span className="text-white/20 hidden sm:inline">|</span>
          <Link href="/contact" className="hover:text-amber transition-colors hidden sm:inline">CONTACT</Link>
          <span className="text-white/20 hidden sm:inline">|</span>
          <Link href="/admin" className="flex items-center space-x-1 hover:text-amber transition-colors">
            <User className="w-3 h-3" />
            <span>{userSession ? 'DASHBOARD' : 'STAFF'}</span>
          </Link>
        </div>
      </div>

      {/* 2. CLEAN LOGO & BRANDING ROW */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink-navy dark:text-paper-warm hover:text-amber transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo — clean & minimal */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/">
            <h1 className="font-headline font-black text-2xl md:text-3xl tracking-tight text-ink-navy dark:text-paper-warm select-none hover:opacity-90 transition-opacity">
              KHAEMBA <span className="text-amber">NEWS</span>
            </h1>
          </Link>
          <p className="hidden md:block text-[9px] font-mono tracking-[0.2em] text-ink-navy/50 dark:text-gray-500 mt-0.5 uppercase">
            Kenya&apos;s Trusted News Source
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-1.5">
          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-white dark:bg-gray-800 border border-ink-navy/20 dark:border-gray-700 rounded-full px-3 py-1.5 transition-all w-44 md:w-56">
                <input
                  type="text"
                  placeholder="Search..."
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
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-ink-navy dark:text-paper-warm"
                aria-label="Open search bar"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* Card Style Toggle */}
          <button
            onClick={cycleCardStyle}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-ink-navy dark:text-paper-warm"
            title={`Card style: ${cardStyle}`}
            aria-label="Switch card style"
          >
            <Layers3 className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-ink-navy dark:text-paper-warm"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION BAR */}
      <nav className="w-full border-t border-b border-ink-navy/10 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex justify-center space-x-8 font-mono text-xs py-3">
          <Link href="/" className="hover:text-amber dark:hover:text-amber transition-colors font-bold tracking-wider">
            HOME
          </Link>
          {siteCategories.length > 0 ? siteCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="transition-colors tracking-wider hover:opacity-80 font-semibold"
              style={{ color: category.accent_color }}
            >
              {category.name.toUpperCase()}
            </Link>
          )) : (
            <>
              <Link href="/category/politics" className="hover:text-category-politics transition-colors tracking-wider">POLITICS</Link>
              <Link href="/category/business" className="hover:text-category-business transition-colors tracking-wider">BUSINESS</Link>
              <Link href="/category/national" className="hover:text-category-county transition-colors tracking-wider">NATIONAL</Link>
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
      <div className="w-full bg-amber/10 dark:bg-amber/5 border-b border-amber/20 overflow-hidden py-1.5 text-xs flex items-center">
        <div className="bg-amber text-ink-navy font-bold px-3 py-0.5 font-mono tracking-widest text-[10px] shrink-0 ml-4 rounded uppercase z-10 shadow-sm">
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
        <div className="md:hidden fixed inset-0 bg-paper-warm dark:bg-paper-dark z-[60] pt-4 px-6 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b border-ink-navy/10 dark:border-gray-800">
            <span className="font-headline font-black text-xl text-ink-navy dark:text-paper-warm">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-ink-navy dark:text-paper-warm">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-4 font-mono text-sm pt-6 pb-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber py-1">HOME</Link>
            <Link href="/category/politics" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-politics py-1">POLITICS</Link>
            <Link href="/category/business" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-business py-1">BUSINESS</Link>
            <Link href="/category/national" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-county py-1">NATIONAL</Link>
            <Link href="/category/sports" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-sports py-1">SPORTS</Link>
            <Link href="/documentaries" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber text-amber font-bold py-1">DOCUMENTARIES</Link>
            <Link href="/category/opinion" onClick={() => setMobileMenuOpen(false)} className="hover:text-category-opinion py-1">OPINION</Link>
          </div>
          <div className="flex flex-col space-y-3 border-t border-ink-navy/10 dark:border-gray-800 pt-6">
            <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="bg-ink-navy dark:bg-white text-white dark:text-ink-navy font-bold text-center py-2.5 rounded text-sm">STAFF LOGIN</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="bg-amber text-ink-navy font-bold text-center py-2.5 rounded text-sm">CONTACT US</Link>
          </div>
        </div>
      )}
    </header>
  )
}
