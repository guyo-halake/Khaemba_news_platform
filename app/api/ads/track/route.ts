import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, trackAdEvent } from '@/lib/supabase/mockDb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { ad_id, event_type } = await req.json()
    
    if (!ad_id || !['impression', 'click'].includes(event_type)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }
    
    if (isMockEnabled()) {
      trackAdEvent(ad_id, event_type)
      return NextResponse.json({ success: true, mode: 'mock' })
    }
    
    const supabase = createClient()
    const { error } = await supabase
      .from('ad_analytics')
      .insert({
        ad_id,
        event_type
      })
      
    if (error) {
      console.error('Error tracking ad event:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Ad tracking route error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
