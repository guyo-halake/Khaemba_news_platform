import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import { mockUsers } from '@/lib/supabase/mockDb'
import { BookOpen, Award, Shield } from 'lucide-react'

export const metadata = {
  title: 'About Our Newsroom',
  description: 'Learn about the editorial vision, ethics standards, and team of journalists driving county devolution reporting at Khaemba News.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper-warm dark:bg-paper-dark transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full space-y-12">
        {/* Intro */}
        <section className="space-y-4 text-center max-w-3xl mx-auto">
          <h1 className="font-headline font-black text-4xl sm:text-5xl text-ink-navy dark:text-paper-warm">
            Independent. Authority. County-First.
          </h1>
          <p className="text-sm sm:text-base text-ink-navy/70 dark:text-gray-400 leading-relaxed font-serif italic">
            &ldquo;We believe that devolution is the single most important development in East African history. Our mission is to report on its progress, expose anomalies, and spotlight triumphs.&rdquo;
          </p>
        </section>

        {/* Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="space-y-3 p-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg">
            <div className="p-2.5 bg-amber/10 dark:bg-amber/5 text-amber rounded-full w-fit">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-paper-warm">
              Journalistic Integrity
            </h3>
            <p className="text-xs text-ink-navy/75 dark:text-gray-400 leading-relaxed">
              We vet every source, cross-reference fiscal allocations, and strictly isolate editorials from hard reporting.
            </p>
          </div>

          <div className="space-y-3 p-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg">
            <div className="p-2.5 bg-amber/10 dark:bg-amber/5 text-amber rounded-full w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-paper-warm">
              Devolution Focus
            </h3>
            <p className="text-xs text-ink-navy/75 dark:text-gray-400 leading-relaxed">
              National newsrooms often skip the interior. We place reporters in sub-counties to report local stories.
            </p>
          </div>

          <div className="space-y-3 p-5 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg">
            <div className="p-2.5 bg-amber/10 dark:bg-amber/5 text-amber rounded-full w-fit">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-paper-warm">
              Visual Excellence
            </h3>
            <p className="text-xs text-ink-navy/75 dark:text-gray-400 leading-relaxed">
              Our documentary team uses state-of-the-art cinematography to tell human interest stories and record events.
            </p>
          </div>
        </section>

        {/* Narrative text */}
        <section className="prose prose-lg dark:prose-invert max-w-none font-serif text-ink-navy/85 dark:text-gray-300 space-y-6">
          <p>
            Established in 2026, Khaemba News was founded by senior journalists who observed that county-level allocations and developments were largely underreported. While capital politics filled newspapers, agricultural milestones, local digital shifts, and sub-county healthcare reforms were neglected.
          </p>
          <p>
            With digital-first distribution and an integrated documentaries hub, we marry long-form text reporting with cinematic storytelling. Our work is supported by our readers and partners who value verified local intelligence.
          </p>
        </section>

        {/* Senior Staff */}
        <section className="space-y-6 pt-4">
          <h2 className="font-headline font-black text-2xl text-ink-navy dark:text-paper-warm border-b border-ink-navy/10 dark:border-gray-800 pb-2">
            Senior Newsroom Editors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {mockUsers.map(user => (
              <div key={user.id} className="flex flex-col items-center text-center space-y-3 p-6 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg">
                {user.avatar_url && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber">
                    <img src={user.avatar_url} alt={user.full_name} className="object-cover w-full h-full" />
                  </div>
                )}
                <div>
                  <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-paper-warm">{user.full_name}</h3>
                  <p className="text-xs font-mono text-amber uppercase mt-0.5">{user.role}</p>
                </div>
                <p className="text-xs text-ink-navy/55 dark:text-gray-400">
                  Senior member of the editorial desk managing dispatches and reviews.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
