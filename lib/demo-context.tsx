"use client"

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'

interface DemoContextType {
  isDemoMode: boolean
  toggleDemoMode: () => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('demoMode')
    let currentMode = true
    if (saved !== null) {
      currentMode = JSON.parse(saved)
      setIsDemoMode(currentMode)
    }
    document.cookie = `demo_mode=${currentMode}; path=/; max-age=31536000`
  }, [])

  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const next = !prev
      localStorage.setItem('demoMode', JSON.stringify(next))
      document.cookie = `demo_mode=${next}; path=/; max-age=31536000`
      window.dispatchEvent(new Event('demo-mode-change'))
      window.location.reload()
      return next
    })
  }

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemoMode must be used within DemoProvider')
  }
  return context
}
