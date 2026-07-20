import { NextResponse } from 'next/server'
import { isMockEnabled, mockSubscribers, mockNewsletters } from '@/lib/supabase/mockDb'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { subject, content, tenantId } = body

    if (!subject || !content || !tenantId) {
      return NextResponse.json({ error: 'Missing subject, content or tenantId' }, { status: 400 })
    }

    if (isMockEnabled()) {
      const newDispatch = {
        id: `nl-${Date.now()}`,
        subject,
        content,
        sent_at: new Date().toISOString(),
        recipients_count: mockSubscribers.length
      }

      mockNewsletters.push(newDispatch)

      // Sync to json store if it exists (server-side only, read-only on Vercel)
      try {
        const fs = require('fs')
        const path = require('path')
        const storePath = path.join(process.cwd(), 'mock_db_store.json')
        if (fs.existsSync(storePath)) {
          const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'))
          if (!store.mockNewsletters) store.mockNewsletters = []
          store.mockNewsletters = [newDispatch, ...store.mockNewsletters]
          fs.writeFileSync(storePath, JSON.stringify(store, null, 2))
        }
      } catch {
        // Filesystem may be read-only on Vercel — safe to ignore
      }

      console.log(`[Mock Mailer] Dispatched "${subject}" to ${mockSubscribers.length} addresses.`)
      return NextResponse.json({ success: true, dispatch: newDispatch })
    }

    // Real Supabase Pipeline
    const supabase = createClient()

    // 1. Get recipients count
    const { count, error: countErr } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (countErr) throw countErr

    const recipientsCount = count || 0

    // 2. Log in newsletter_sent table
    const { data: newDispatch, error: insertErr } = await supabase
      .from('newsletter_sent')
      .insert({
        tenant_id: tenantId,
        subject,
        content,
        recipients_count: recipientsCount,
        sent_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertErr) throw insertErr

    // Note: In production, you would trigger your Resend / Mailgun / AWS SES integration here.
    console.log(`[Supabase Mailer] Dispatched "${subject}" to ${recipientsCount} addresses.`)

    return NextResponse.json({ success: true, dispatch: newDispatch })
  } catch (err: any) {
    console.error('Newsletter send API error:', err)
    return NextResponse.json({ error: err.message || 'Failed to broadcast newsletter' }, { status: 500 })
  }
}
