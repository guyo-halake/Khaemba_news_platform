'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Ad } from '@/lib/types'
import { isMockEnabled, mockAds } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'

interface AdWindowProps {
  position: 'homepage_top' | 'homepage_mid' | 'article_inline' | 'sidebar'
}

export default function AdWindow({ position }: AdWindowProps) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAd = async () => {
      try {
        if (isMockEnabled()) {
          // Find matching active ad from mock database
          const activeAd = mockAds.find(
            a => a.position === position && a.status === 'active'
          )
          setAd(activeAd || null)
          setLoading(false)
          
          if (activeAd) {
            // Track Impression in Mock
            await trackEvent(activeAd.id, 'impression')
          }
          return
        }

        const supabase = createClient()
        const todayStr = new Date().toISOString().split('T')[0]
        const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'
        
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('position', position)
          .eq('status', 'active')
          .eq('tenant_id', tenantId)
          .lte('start_date', todayStr)
          .gte('end_date', todayStr)
          .limit(1)
          .maybeSingle()

        if (error) {
          console.error(`Ad fetch error for ${position}:`, error)
        } else if (data) {
          setAd(data as Ad)
          // Track Impression in DB
          await trackEvent(data.id, 'impression')
        }
      } catch (err) {
        console.error('Ad load catch:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAd()
  }, [position])

  const trackEvent = async (adId: string, eventType: 'impression' | 'click') => {
    try {
      await fetch('/api/ads/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad_id: adId, event_type: eventType }),
      })
    } catch (err) {
      console.error('Failed to log ad event:', err)
    }
  }

  const handleAdClick = () => {
    if (ad) {
      trackEvent(ad.id, 'click')
    }
  }

  if (loading || !ad) {
    // Gracefully collapse if there is no active ad
    return null
  }

  // Define dimension classes based on ad positions
  const getPositionStyles = () => {
    switch (position) {
      case 'homepage_top':
        return 'w-full max-w-5xl h-[90px] md:h-[120px] mx-auto my-6'
      case 'homepage_mid':
        return 'w-full max-w-5xl h-[120px] md:h-[180px] mx-auto my-8'
      case 'article_inline':
        return 'w-full max-w-3xl h-[100px] md:h-[150px] mx-auto my-6'
      case 'sidebar':
        return 'w-full h-[250px] md:h-[300px] my-4'
      default:
        return 'w-full my-4'
    }
  }

  return (
    <div className={`relative overflow-hidden border border-ink-navy/10 dark:border-gray-800 bg-white dark:bg-gray-900 rounded group transition-shadow hover:shadow-md ${getPositionStyles()}`}>
      {/* Sponsor Tag */}
      <div className="absolute top-1 right-2 z-10 font-mono text-[9px] text-white/70 bg-black/45 px-1.5 py-0.5 rounded uppercase tracking-wider">
        Sponsored Advertisement
      </div>

      <a
        href={ad.target_link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAdClick}
        className="relative block w-full h-full"
      >
        <Image
          src={ad.image_url}
          alt={`Ad by ${ad.client_name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={position === 'homepage_top'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
          <span className="text-[10px] text-white font-mono uppercase tracking-widest bg-amber/90 px-2 py-1 rounded">
            Visit {ad.client_name} &rarr;
          </span>
        </div>
      </a>
    </div>
  )
}
