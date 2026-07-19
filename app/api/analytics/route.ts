import { createClient } from '@/lib/supabase/server'
import { isMockEnabled } from '@/lib/supabase/mockDb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { page_path, referrer, user_agent } = await req.json()
    
    if (isMockEnabled()) {
      // In mock mode, we log to stdout to track activity
      console.log(`[Mock Analytics] Visit: Path=${page_path}, Referrer=${referrer || 'none'}`)
      return NextResponse.json({ success: true, mode: 'mock' })
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('site_analytics')
      .insert({
        page_path,
        referrer,
        user_agent
      })
      
    if (error) {
      console.error('Error inserting site analytics:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Analytics route error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
