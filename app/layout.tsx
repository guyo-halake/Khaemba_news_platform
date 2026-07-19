import type { Metadata } from 'next'
import { Sora, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import AnalyticsTracker from '@/components/public/AnalyticsTracker'
import { DemoProvider } from '@/lib/demo-context'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
  weight: ['300', '400', '600', '700', '800'],
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Khaemba News | Authority Editorial & Documentaries',
    template: '%s | Khaemba News'
  },
  description: 'Uncompromising, authoritative, independent news coverage and high-production documentaries from the heart of the counties.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://khaembanews.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://khaembanews.com',
    siteName: 'Khaemba News',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Khaemba News & Documentaries',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} ${ibmPlexMono.variable} antialiased`}>
        <ThemeProvider>
          <DemoProvider>
            <AnalyticsTracker />
            {children}
          </DemoProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
