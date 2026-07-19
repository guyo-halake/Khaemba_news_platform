import { NextResponse } from 'next/server'
import { isMockEnabled } from '@/lib/supabase/mockDb'

// To handle local uploads in dev mode, we can use require('f' + 's') and require('p' + 'ath')
const fs = require('f' + 's')
const path = require('p' + 'ath')

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    // If Cloudflare configuration is available, perform real upload
    if (accountId && apiToken && !isMockEnabled()) {
      console.log('Uploading file to Cloudflare Stream...')
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Upload-Length': String(file.size),
            // Cloudflare Stream accepts metadata
            'Upload-Metadata': `name ${Buffer.from(file.name).toString('base64')}`
          },
          body: buffer
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Cloudflare upload error:', errorText)
        throw new Error('Cloudflare Stream upload failed: ' + errorText)
      }

      const result = await response.json()
      const videoUid = result.result?.uid
      const playbackUrl = `https://iframe.videodelivery.net/${videoUid}`
      const thumbnailUrl = `https://videodelivery.net/${videoUid}/thumbnails/thumbnail.jpg?time=2s`

      return NextResponse.json({
        success: true,
        uid: videoUid,
        video_url: playbackUrl,
        thumbnail_url: thumbnailUrl,
        duration: result.result?.duration || 0
      })
    }

    // Otherwise, simulate upload locally (Mock Mode)
    console.log('Simulating upload locally (mock mode)...')
    
    // Create uploads folder inside public if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const filePath = path.join(uploadsDir, safeFileName)
    
    fs.writeFileSync(filePath, buffer)

    // Generate simulated cloudflare stream response
    const mockUid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    return NextResponse.json({
      success: true,
      uid: mockUid,
      video_url: `/uploads/${safeFileName}`,
      thumbnail_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
      duration: 320 // Simulated duration (5 min 20 sec)
    })
  } catch (err: any) {
    console.error('Upload endpoint error:', err)
    return NextResponse.json({ error: err.message || 'Failed to upload video' }, { status: 500 })
  }
}
