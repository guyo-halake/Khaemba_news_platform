import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, addSubscriber } from '@/lib/supabase/mockDb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }
    
    if (isMockEnabled()) {
      addSubscriber(email)
      return NextResponse.json({ success: true, mode: 'mock' })
    }
    
    const supabase = createClient()
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd7e9b0cf-52fb-4d1a-8c88-75796c000000'

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        tenant_id: tenantId
      })
      
    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        return NextResponse.json({ error: 'This email is already subscribed' }, { status: 409 })
      }
      console.error('Newsletter signup error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Newsletter route error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
