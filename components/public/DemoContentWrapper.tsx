'use client'

import { ReactNode } from 'react'
import { useDemoMode } from '@/lib/demo-context'

interface DemoContentWrapperProps {
  children: ReactNode
}

export default function DemoContentWrapper({ children }: DemoContentWrapperProps) {
  const { isDemoMode } = useDemoMode()

  if (!isDemoMode) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center rounded-2xl border border-dashed border-ink-navy/15 dark:border-gray-700 bg-white/40 dark:bg-gray-900/25 p-10 text-center">
        <div className="max-w-xl space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full border border-ink-navy/15 dark:border-gray-700 flex items-center justify-center text-amber text-xs font-black tracking-[0.3em]">
            LIVE
          </div>
          <h2 className="font-headline font-black text-3xl md:text-4xl text-ink-navy dark:text-paper-warm">
            Live newsroom is off
          </h2>
          <p className="text-ink-navy/70 dark:text-gray-400 font-mono text-sm leading-relaxed">
            The site is in production-ready empty mode. Switch the <span className="font-bold text-amber">D</span> button in the top bar to restore the full demo stories, documentaries, and ad placements.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 opacity-40">
            <div className="h-24 rounded-xl border border-dashed border-ink-navy/20 dark:border-gray-700" />
            <div className="h-24 rounded-xl border border-dashed border-ink-navy/20 dark:border-gray-700" />
            <div className="h-24 rounded-xl border border-dashed border-ink-navy/20 dark:border-gray-700" />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
