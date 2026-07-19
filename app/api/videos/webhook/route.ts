import { NextResponse } from 'next/server'
import { isMockEnabled } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/client'

// Obfuscated string concatenation for server-side file operations in mock mode
const fs = require('f' + 's')
const path = require('p' + 'ath')

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Received Cloudflare Stream webhook event:', body)

    const eventType = body.event_type // e.g. "stream.lifecycle.success"
    const videoUid = body.uid

    if (!videoUid) {
      return NextResponse.json({ error: 'Missing UID' }, { status: 400 })
    }

    // When a video completes processing, flip its status to "published"
    if (eventType === 'stream.lifecycle.success') {
      const playbackUrl = `https://iframe.videodelivery.net/${videoUid}`

      if (isMockEnabled()) {
        const storePath = path.join(process.cwd(), 'mock_db_store.json')
        if (fs.existsSync(storePath)) {
          const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'))
          if (store.mockVideos) {
            store.mockVideos = store.mockVideos.map((v: any) => {
              if (v.video_url.includes(videoUid) || v.video_url === playbackUrl) {
                return {
                  ...v,
                  status: 'published',
                  published_at: new Date().toISOString()
                }
              }
              return v
            })
            fs.writeFileSync(storePath, JSON.stringify(store, null, 2))
            console.log(`[Mock Webhook] Video ${videoUid} marked as published.`)
          }
        }
      } else {
        const supabase = createClient()
        const { error } = await supabase
          .from('videos')
          .update({
            status: 'published',
            published_at: new Date().toISOString()
          })
          .or(`video_url.eq.${playbackUrl},video_url.ilike.%${videoUid}%`)

        if (error) {
          console.error('Failed to update video status in Supabase via webhook:', error.message)
          throw error
        }
        console.log(`[Supabase Webhook] Video ${videoUid} marked as published.`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Webhook endpoint error:', err)
    return NextResponse.json({ error: err.message || 'Webhook failed' }, { status: 500 })
  }
}
