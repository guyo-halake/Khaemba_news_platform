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

  const renderMockAdContent = () => {
    if (ad.client_name.includes('Kenya Tourism') || ad.client_name.includes('Tourism Board')) {
      return (
        <div className="w-full h-full bg-gradient-to-r from-teal-900 via-orange-800 to-amber-700 flex items-center justify-between px-6 sm:px-12 text-white relative">
          <div className="space-y-1.5 py-2 max-w-[70%]">
            <span className="text-[9px] font-mono tracking-widest text-amber uppercase font-extrabold bg-black/30 px-2 py-0.5 rounded">Magical Kenya</span>
            <h4 className="font-headline font-black text-base sm:text-2xl leading-tight">Rediscover the Magic. The wild awaits you.</h4>
            <p className="text-[10px] sm:text-xs text-white/80 line-clamp-1 font-sans">Explore majestic savannahs, pristine white beaches, and rich cultural heritage.</p>
          </div>
          <div className="shrink-0 z-10">
            <span className="inline-block text-xs font-mono font-bold bg-amber text-ink-navy px-4 py-2 rounded shadow hover:bg-amber-hover transition-colors">
              Book Safari &rarr;
            </span>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent pointer-events-none" />
        </div>
      )
    }

    if (ad.client_name.includes('Safaricom')) {
      return (
        <div className="w-full h-full bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-950 flex items-center justify-between px-6 sm:px-12 text-white relative">
          <div className="space-y-1.5 py-2 max-w-[70%]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
              <span className="text-[10px] font-mono tracking-widest text-white uppercase font-extrabold">Safaricom 5G</span>
            </div>
            <h4 className="font-headline font-black text-base sm:text-2xl leading-tight">Experience Ultra-Fast Internet. Go 5G.</h4>
            <p className="text-[10px] sm:text-xs text-white/80 line-clamp-1 font-sans">Empowering your connection. High-speed home fibre & mobile data packages.</p>
          </div>
          <div className="shrink-0 z-10">
            <span className="inline-block text-xs font-mono font-bold bg-white text-emerald-900 px-4 py-2 rounded shadow hover:bg-gray-100 transition-colors">
              Dial *544# &rarr;
            </span>
          </div>
        </div>
      )
    }

    if (ad.client_name.includes('Equity')) {
      return (
        <div className="w-full h-full bg-gradient-to-r from-red-950 via-amber-950 to-amber-900 flex items-center justify-between px-6 sm:px-12 text-white relative">
          <div className="space-y-1.5 py-2 max-w-[75%]">
            <span className="text-[9px] font-mono tracking-widest text-amber uppercase font-extrabold bg-black/40 px-2 py-0.5 rounded">Equity Bank</span>
            <h4 className="font-headline font-bold text-sm sm:text-lg leading-tight">Wings to Fly: Transform Your Financial Future Today.</h4>
            <p className="text-[10px] sm:text-xs text-white/70 line-clamp-1 font-sans">Quick mobile loans via EazzyApp or dialing *247#. Member of Equity Group.</p>
          </div>
          <div className="shrink-0 z-10">
            <span className="inline-block text-xs font-mono font-bold bg-amber text-red-950 px-4 py-2 rounded shadow hover:bg-amber-hover transition-colors">
              Access *247#
            </span>
          </div>
        </div>
      )
    }

    if (ad.client_name.includes('Tusker') || ad.client_name.includes('Lager')) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex flex-col justify-between p-4 text-black relative border-t-4 border-black">
          <div className="space-y-1.5 text-center mt-2">
            <span className="text-[10px] font-mono tracking-widest uppercase font-black bg-black text-amber px-3 py-0.5 rounded-full inline-block">Tusker Lager</span>
            <h4 className="font-headline font-black text-xl leading-tight">KENYA'S FINEST</h4>
            <p className="text-[11px] font-serif italic text-black/85 leading-snug">Celebrating Our Heritage Since 1922.</p>
          </div>
          <div className="text-center mt-4">
            <span className="inline-block text-xs font-mono font-bold bg-black text-white px-5 py-2 rounded shadow hover:bg-black/90 transition-colors">
              Our Craft &rarr;
            </span>
          </div>
          <p className="text-[7.5px] font-mono text-black/70 text-center uppercase tracking-tighter mt-auto pt-2 border-t border-black/10">
            Excessive alcohol consumption is harmful to your health. Strictly 18+
          </p>
        </div>
      )
    }

    // Fallback standard render
    return (
      <>
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
      </>
    )
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
        {isMockEnabled() ? renderMockAdContent() : (
          <>
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
          </>
        )}
      </a>
    </div>
  )
}
