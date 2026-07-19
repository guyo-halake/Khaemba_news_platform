'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Send a pageview log to our API endpoint
    const trackPageview = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_path: pathname,
            referrer: typeof document !== 'undefined' ? document.referrer : null,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          }),
        })
      } catch (err) {
        // Silent error handling for analytics fail-safes
        console.error('Failed to log analytics:', err)
      }
    }

    trackPageview()
  }, [pathname])

  return null
}
