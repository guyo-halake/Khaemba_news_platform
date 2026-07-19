'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, FileText, Film, Image as AdIcon, Users, Settings, LogOut, Sun, Moon, Newspaper, ShieldAlert, Tags, MessageSquare, Mail, Inbox } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { isMockEnabled } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  user: {
    name: string
    role: 'admin' | 'editor' | 'contributor'
    avatar?: string
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    if (isMockEnabled()) {
      // Clear mock cookies
      document.cookie = 'mock_logged_in=; path=/; max-age=0'
      document.cookie = 'mock_user_role=; path=/; max-age=0'
      document.cookie = 'mock_user_name=; path=/; max-age=0'
      window.location.href = '/admin/login'
      return
    }

    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'contributor'] },
    { href: '/admin/articles', label: 'Articles', icon: FileText, roles: ['admin', 'editor', 'contributor'] },
    { href: '/admin/categories', label: 'Categories', icon: Tags, roles: ['admin', 'editor'] },
    { href: '/admin/videos', label: 'Videos', icon: Film, roles: ['admin', 'editor'] },
    { href: '/admin/ads', label: 'Ad Campaigns', icon: AdIcon, roles: ['admin'] },
    { href: '/admin/comments', label: 'Comments', icon: MessageSquare, roles: ['admin', 'editor'] },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail, roles: ['admin'] },
    { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox, roles: ['admin', 'editor'] },
    { href: '/admin/users', label: 'Staff Directory', icon: Users, roles: ['admin'] },
    { href: '/admin/themes', label: 'Theme Switcher', icon: Sun, roles: ['admin'] },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings, roles: ['admin'] },
  ]

  return (
    <aside className="w-64 shrink-0 bg-ink-navy dark:bg-gray-950 text-paper-warm flex flex-col justify-between h-screen sticky top-0 border-r border-white/5 font-body">
      <div className="flex flex-col flex-grow">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center space-x-2">
            <Newspaper className="w-6 h-6 text-amber" />
            <div>
              <h1 className="font-headline font-black text-lg text-white leading-none">
                KHAEMBA <span className="text-amber">NEWS</span>
              </h1>
              <span className="font-mono text-[9px] text-white/50 tracking-widest uppercase">
                Staff Control
              </span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 bg-white/5 rounded border border-white/5 flex items-center space-x-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-amber/40" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-amber/20 text-amber font-bold flex items-center justify-center font-mono uppercase">
              {user.name[0]}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <span className="inline-block text-[9px] font-mono text-amber uppercase font-semibold">
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-4 space-y-1.5 pt-2">
          {navItems
            .filter(item => item.roles.includes(user.role))
            .map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded text-sm transition-all ${
                    isActive
                      ? 'bg-amber text-ink-navy font-bold shadow-md'
                      : 'text-paper-warm/75 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-mono text-paper-warm/65 hover:text-white bg-white/5 rounded border border-white/5"
        >
          <span>THEME MODE</span>
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Staff Logout</span>
        </button>
      </div>
    </aside>
  )
}
