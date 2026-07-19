'use client'

import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import { useState } from 'react'
import { CheckCircle2, Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex-grow w-full space-y-12">
        <section className="space-y-4 max-w-2xl">
          <h1 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-ink-navy dark:text-paper-warm">
            Contact Our News Desk
          </h1>
          <p className="text-sm sm:text-base text-ink-navy/70 dark:text-gray-400 leading-relaxed">
            Have a story tip, press release, correction request, or corporate query? Reach out directly using the form below or contact our sub-offices.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-headline font-bold text-xl text-ink-navy dark:text-paper-warm">
              Submit Tip or Message
            </h3>

            {status === 'success' ? (
              <div className="py-8 text-center bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <h4 className="font-headline font-bold text-lg text-ink-navy dark:text-paper-warm">
                  Message Sent Successfully
                </h4>
                <p className="text-xs text-ink-navy/70 dark:text-gray-300">
                  Thank you. If your submission contains verified tip leads, a member of our editorial desk will contact you.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-xs font-bold text-amber hover:underline pt-2"
                >
                  Send Another Message
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

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Press release / Story tip / Correction"
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink-navy/60 dark:text-gray-400 uppercase">Your Message</label>
                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-paper-warm/50 dark:bg-gray-800 border border-ink-navy/10 dark:border-gray-700 rounded outline-none focus:border-amber text-ink-navy dark:text-paper-warm resize-y"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-amber hover:bg-amber-hover text-ink-navy font-bold text-xs px-6 py-3 rounded transition-colors shadow-sm flex items-center space-x-1.5 ml-auto"
                >
                  {status === 'submitting' ? (
                    <div className="w-4 h-4 border-2 border-ink-navy border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Dispatch</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-sm text-xs font-mono">
              <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-paper-warm border-b border-ink-navy/5 pb-2 uppercase font-sans">
                Newsroom Contact
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-ink-navy dark:text-paper-warm">Head Office:</p>
                    <p className="text-ink-navy/70 dark:text-gray-400 leading-normal">
                      4th Floor, Devolution Plaza,<br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 border-t border-ink-navy/5 pt-3">
                  <Mail className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-ink-navy dark:text-paper-warm">Emails:</p>
                    <p className="text-ink-navy/70 dark:text-gray-400">tips@khaembanews.com</p>
                    <p className="text-ink-navy/70 dark:text-gray-400">press@khaembanews.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 border-t border-ink-navy/5 pt-3">
                  <Phone className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-ink-navy dark:text-paper-warm">Phone Numbers:</p>
                    <p className="text-ink-navy/70 dark:text-gray-400">+254 (0) 20 555 0192</p>
                    <p className="text-ink-navy/70 dark:text-gray-400">+254 (0) 712 345 678</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
