'use client'

import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import { useState } from 'react'
import { CheckCircle2, DollarSign, Layout, Smartphone, Calendar, Send } from 'lucide-react'

export default function AdvertisePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [slot, setSlot] = useState('homepage_top')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')
      setName('')
      setEmail('')
      setCompany('')
      setMessage('')
    }, 1200)
  }

  const slots = [
    {
      id: 'homepage_top',
      name: 'Homepage Top Leaderboard',
      size: '970x90 px / 728x90 px',
      price: '$450 / month',
      description: 'First fold premium placement above all editorial contents. Maximum visibility for brand awareness campaigns.'
    },
    {
      id: 'homepage_mid',
      name: 'Homepage Middle Banner',
      size: '970x250 px / 728x90 px',
      price: '$300 / month',
      description: 'Nested between categories rows. High conversion rate as users scroll down trending and county feeds.'
    },
    {
      id: 'article_inline',
      name: 'Article Inline Banner',
      size: '728x90 px / 300x250 px',
      price: '$350 / month',
      description: 'Appears inside published articles below the 3rd block. Engages readers who read details and long-form features.'
    },
    {
      id: 'sidebar',
      name: 'Sidebar Square Banner',
      size: '300x250 px / 300x300 px',
      price: '$250 / month',
      description: 'Placed inside the sticky homepage and article page sidebars. Highly persistent as content is read.'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex-grow w-full space-y-12">
        {/* Intro Banner */}
        <section className="space-y-4 max-w-3xl">
          <h1 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-ink-navy dark:text-paper-warm leading-tight">
            Advertise With Us
          </h1>
          <p className="text-sm sm:text-base text-ink-navy/70 dark:text-gray-400 leading-relaxed">
            Reach thousands of decision-makers, county leaders, tech founders, and engaged readers across Kenya and East Africa. Choose from our premium local Ad Windows.
          </p>
        </section>

        {/* Mockup Previews & Pricing */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h2 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm">
              Ad Windows & Placements
            </h2>
            
            <div className="space-y-4">
              {slots.map(s => (
                <div key={s.id} className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-paper-warm">
                      {s.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-amber bg-amber/10 dark:bg-amber/5 px-2.5 py-1 rounded">
                      {s.price}
                    </span>
                  </div>
                  <p className="text-xs text-ink-navy/70 dark:text-gray-400">
                    {s.description}
                  </p>
                  <div className="flex items-center space-x-4 text-[10px] font-mono text-ink-navy/50 dark:text-gray-500 pt-2 border-t border-ink-navy/5">
                    <span className="flex items-center space-x-1">
                      <Layout className="w-3.5 h-3.5" />
                      <span>Desktop: {s.size.split(' / ')[0]}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile Responsive</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Reservation Form */}
          <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm">
                Book An Ad Window
              </h2>
              <p className="text-xs text-ink-navy/60 dark:text-gray-400">
                Submit details and our advertising coordinator will follow up with schedules and custom artwork details.
              </p>
            </div>

            {status === 'success' ? (
              <div className="space-y-4 py-8 text-center bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-paper-warm">
                  Inquiry Received!
                </h3>
                <p className="text-xs text-ink-navy/70 dark:text-gray-300">
                  Thank you for reaching out. We will review your request and contact you via email within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-xs font-bold text-amber hover:underline pt-2"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Target Ad Slot</label>
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                    >
                      {slots.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Campaign Pitch / Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your target dates, branding targets, and any custom requirements..."
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-amber hover:bg-amber-hover text-ink-navy font-bold text-xs py-3 rounded transition-colors shadow-sm flex items-center justify-center space-x-1.5"
                >
                  {status === 'submitting' ? (
                    <div className="w-4 h-4 border-2 border-ink-navy border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Ad Reservation</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
