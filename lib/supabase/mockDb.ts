import { Article, Video, Category, User } from '@/lib/types'

// Extended Ad type for mock with count fields matching AdsManager component
export interface MockAd {
  id: string; client_name: string; image_url: string; target_link: string;
  position: 'homepage_top' | 'homepage_mid' | 'article_inline' | 'sidebar';
  start_date: string; end_date: string; status: 'active' | 'paused' | 'expired';
  impressions_count: number; clicks_count: number;
  tenant_id?: string; created_at: string; updated_at?: string;
}

export interface MockComment {
  id: string; article_id: string; author_name: string; body: string;
  status: 'pending' | 'approved' | 'rejected'; created_at: string;
}

export interface MockAdClient {
  id: string; name: string; email?: string | null; phone?: string | null; created_at: string;
}

export interface MockAdPayment {
  id: string; client_id: string; ad_id?: string | null; amount: number; payment_date: string;
  payment_method: 'M-Pesa' | 'Bank Transfer' | 'Card' | 'Cash';
  status: 'pending' | 'completed' | 'refunded'; created_at: string;
}

export interface MockSubscriber {
  id: string; email: string; subscribed_at: string;
}

export interface MockNewsletter {
  id: string; subject: string; content: string; sent_at: string; recipients_count: number;
}

export interface MockInquiry {
  id: string; name: string; email: string; subject: string; message: string;
  type: 'contact' | 'advertise'; status: 'unread' | 'read' | 'replied'; created_at: string;
}

// 0. Demo mode check
export function isMockEnabled(): boolean {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  }
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

// 1. Mock Users
export const mockUsers: User[] = [
  { id: 'u-1', full_name: 'Duncan Khaemba', role: 'admin', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', created_at: '2024-01-01T00:00:00Z' },
  { id: 'u-2', full_name: 'Sarah Jepchirchir', role: 'editor', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', created_at: '2024-03-15T00:00:00Z' },
]

// 2. Mock Categories
export const mockCategories: Category[] = [
  { id: 'cat-politics', name: 'Politics', slug: 'politics', accent_color: '#B23A3A' },
  { id: 'cat-business', name: 'Business', slug: 'business', accent_color: '#3A7D44' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', accent_color: '#2E5FA3' },
  { id: 'cat-national', name: 'National', slug: 'national', accent_color: '#8A5A9E' },
  { id: 'cat-opinion', name: 'Opinion', slug: 'opinion', accent_color: '#5E6E7A' },
]

// 3. Mock Articles — sourced from current Kenyan news (Standard Media, July 2026)
export let mockArticles: Article[] = [
  {
    id: 'art-1',
    title: "DCP's Landslide Win: How Ol Kalou Shook Ruto's Mt Kenya Strategy",
    slug: 'dcp-landslide-ol-kalou-shook-ruto-mt-kenya-strategy',
    excerpt: 'DCP candidate Sammy Waweru crushed UDA in the Ol Kalou by-election, triggering a political reckoning across Mt Kenya ahead of 2027.',
    body: [
      { id: 'b1', type: 'paragraph', value: "OL KALOU, Nyandarua County — The Independent Electoral and Boundaries Commission has declared Democracy for the Citizens Party candidate Sammy Douglas Kamau Waweru the winner of the Ol Kalou parliamentary by-election, securing roughly 35,440 votes against UDA's Samuel Muchina Nyagah, who trailed with just over 5,400. The seat fell vacant following the death of sitting MP David Njuguna Kiaraho." },
      { id: 'b2', type: 'heading', value: 'A Proxy Battle for Mt Kenya', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "The contest had been read well beyond Nyandarua's borders, framed as the first direct electoral test between President William Ruto's UDA and a DCP camp aligned with former Deputy President Rigathi Gachagua since his party's launch. Senior Kenya Kwanza figures, including Deputy President Kithure Kindiki and several Cabinet secretaries, campaigned heavily for the UDA candidate, while Gachagua personally led DCP's ground campaign." },
      { id: 'b4', type: 'quote', value: 'There will be Kenya after the election, and we must live together as brothers and sisters of one nation.' },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b5', type: 'heading', value: "Kindiki's Terse Response", meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'DP Kindiki posted a brief two-word reaction on social media — "Back to the drawing board" — a line political observers have read as a rare admission from within Kenya Kwanza that its Mt Kenya strategy needs an overhaul before 2027.' },
      { id: 'b7', type: 'paragraph', value: "The DCP win is the party's first parliamentary seat since its formation, and analysts expect it to accelerate political realignment across the region as both camps position themselves for the next general election." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=21',
    category_id: 'cat-politics',
    category: mockCategories[0],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T08:00:00Z',
    tags: ['Ol Kalou', 'DCP', 'UDA', 'By-election', 'Mt Kenya'],
    view_count: 15230,
    created_at: '2026-07-19T07:00:00Z',
    updated_at: '2026-07-19T08:00:00Z',
  },
  {
    id: 'art-2',
    title: 'Walking on Eggshells: Why DP Kindiki Faces a Bleak Political Road Ahead',
    slug: 'walking-eggshells-dp-kindiki-bleak-political-road',
    excerpt: "Analysts say Kindiki risks repeating Gachagua's fate — installed to deliver Mt Kenya but without an independent political base of his own.",
    body: [
      { id: 'b1', type: 'paragraph', value: "NAIROBI — Deputy President Kithure Kindiki is facing mounting scrutiny over his political standing in Mt Kenya, with commentators increasingly comparing his trajectory to that of his predecessor, Rigathi Gachagua, who was impeached and removed from office." },
      { id: 'b2', type: 'heading', value: 'A Loyalist Without a Base', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "Unlike Gachagua, who built an independent political following before rising to the deputy presidency, Kindiki was handpicked directly by President Ruto and has no personal electoral base in the region. That dependency, observers argue, leaves him with little room to manoeuvre when regional sentiment turns against the administration, as it did following the Ol Kalou by-election result." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: 'The 2027 Pressure Test', meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "With the next general election drawing closer, Kindiki's ability to reconnect Mt Kenya voters with the Ruto administration is increasingly seen as the defining test of his tenure — one that recent results suggest is far from guaranteed." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=22',
    category_id: 'cat-politics',
    category: mockCategories[0],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T07:15:00Z',
    tags: ['Kindiki', 'Deputy President', 'Mt Kenya', 'Politics'],
    view_count: 9840,
    created_at: '2026-07-19T06:00:00Z',
    updated_at: '2026-07-19T07:15:00Z',
  },
  {
    id: 'art-3',
    title: "Western Kenya's Running-Mate Push: Inside Wetang'ula and Mudavadi's Quiet Rivalry",
    slug: 'western-kenya-running-mate-wetangula-mudavadi-rivalry',
    excerpt: "As Kenya Kwanza MPs push Ruto to pick a Western Kenya running mate for 2027, two of the region's biggest political names are quietly jostling for the slot.",
    body: [
      { id: 'b1', type: 'paragraph', value: "KAKAMEGA — In the aftermath of the Ol Kalou by-election defeat, a growing number of Kenya Kwanza legislators are urging President Ruto to consider a running mate from Western Kenya ahead of 2027, reviving a long-simmering contest for influence between two senior figures from the region." },
      { id: 'b2', type: 'heading', value: 'Two Camps, One Region', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "The push has intensified debate over who best represents Western Kenya's interests within the ruling coalition, with allies on both sides positioning their principal as the natural choice should Ruto opt to reshuffle the ticket." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: 'What It Means for 2027', meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "Political strategists say the outcome of this internal contest could shape how Kenya Kwanza approaches vote-rich Western Kenya, a region increasingly viewed as pivotal following the erosion of support in parts of Mt Kenya." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=23',
    category_id: 'cat-politics',
    category: mockCategories[0],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T09:30:00Z',
    tags: ['Western Kenya', 'Wetangula', 'Mudavadi', '2027 Elections'],
    view_count: 7120,
    created_at: '2026-07-19T09:00:00Z',
    updated_at: '2026-07-19T09:30:00Z',
  },
  {
    id: 'art-4',
    title: "Why Kenya's Middle Class Could Be Shrinking Fast",
    slug: 'why-kenyas-middle-class-could-be-shrinking-fast',
    excerpt: 'Rising living costs and stagnant wages are quietly eroding Kenya\'s middle-income households, economists warn.',
    body: [
      { id: 'b1', type: 'paragraph', value: "NAIROBI — A growing body of economic data suggests Kenya's middle class — long seen as a driver of consumer spending and political stability — is under sustained pressure, with rising costs of living outpacing income growth for many urban households." },
      { id: 'b2', type: 'heading', value: 'Squeezed From Both Sides', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "Economists point to a combination of high taxation, elevated fuel and food prices, and a weakening shilling as key factors pushing previously stable households closer to the poverty line. Debt servicing by the household sector has also climbed sharply in recent years." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: 'A Divided Picture', meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "The trend sits uneasily alongside separate data showing a rise in the number of Kenyan dollar millionaires, underscoring a widening gap between the country's wealthiest residents and its squeezed middle." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=24',
    category_id: 'cat-business',
    category: mockCategories[1],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T10:00:00Z',
    tags: ['Economy', 'Middle Class', 'Cost of Living'],
    view_count: 11430,
    created_at: '2026-07-19T09:00:00Z',
    updated_at: '2026-07-19T10:00:00Z',
  },
  {
    id: 'art-5',
    title: "Why Civil Society Wants Kenya's Sh13 Trillion Debt Discussed at Dinner Tables",
    slug: 'civil-society-sh13-trillion-debt-dinner-tables',
    excerpt: 'Advocacy groups say Kenya\'s ballooning public debt is too often treated as an abstract Treasury figure rather than a household-level concern.',
    body: [
      { id: 'b1', type: 'paragraph', value: "NAIROBI — Civil society organisations are pushing for Kenya's public debt, now standing at roughly Sh13 trillion, to become a mainstream topic of everyday conversation rather than something confined to budget briefings and economic reports." },
      { id: 'b2', type: 'heading', value: 'Making Debt Personal', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "Campaigners argue that ordinary Kenyans often don't connect the dots between rising national debt and the taxes, fees, and service cuts they experience directly, and that closing this awareness gap could build more public pressure for fiscal discipline." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: 'Treasury Under Pressure', meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "The push comes amid separate revelations that a portion of Eurobond proceeds was redirected to cover domestic debt obligations, further fuelling public scrutiny of how borrowed funds are managed." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=25',
    category_id: 'cat-business',
    category: mockCategories[1],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T10:30:00Z',
    tags: ['Public Debt', 'Treasury', 'Eurobond', 'Civil Society'],
    view_count: 6720,
    created_at: '2026-07-19T09:45:00Z',
    updated_at: '2026-07-19T10:30:00Z',
  },
  {
    id: 'art-6',
    title: "Kenya's Economy Is Creating More Millionaires — Just Not for Everyone",
    slug: 'kenyas-economy-creating-more-millionaires',
    excerpt: 'New wealth data shows a rising count of dollar millionaires in Kenya, even as middle-income households report growing financial strain.',
    body: [
      { id: 'b1', type: 'paragraph', value: "NAIROBI — Kenya is minting dollar millionaires at a faster pace than in previous years, according to new wealth tracking data, driven largely by real estate, financial services, and a small but growing tech and investment class." },
      { id: 'b2', type: 'heading', value: 'Where the Wealth Is Concentrating', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "Much of this growth is concentrated in Nairobi and a handful of urban centres, with high-net-worth individuals increasingly diversifying into offshore assets and private equity rather than traditional savings instruments." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: 'A Widening Divide', meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "The findings arrive alongside separate warnings that Kenya's middle class is shrinking, painting a picture of an economy generating substantial wealth at the top while squeezing households in the middle." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=26',
    category_id: 'cat-business',
    category: mockCategories[1],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T11:00:00Z',
    tags: ['Wealth', 'Economy', 'Millionaires', 'Nairobi'],
    view_count: 8950,
    created_at: '2026-07-19T10:15:00Z',
    updated_at: '2026-07-19T11:00:00Z',
  },
  {
    id: 'art-7',
    title: 'Kilifi Opens Its First Safe House for Survivors of Gender-Based Violence',
    slug: 'kilifi-opens-first-safe-house-gbv-survivors',
    excerpt: 'The new facility gives Kilifi County survivors of gender-based violence a secure place to seek shelter and support for the first time.',
    body: [
      { id: 'b1', type: 'paragraph', value: "KILIFI — Kilifi County has opened its first dedicated safe house for survivors of gender-based violence, marking a significant step in the region's response to a persistent public health and safety crisis." },
      { id: 'b2', type: 'heading', value: 'Filling a Long-Standing Gap', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "Local officials and advocacy groups say the facility addresses a long-standing gap in the county, where survivors previously had few safe, confidential options for shelter while seeking legal or medical support." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: "What's Next", meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "County health and gender officials say the safe house will work alongside existing counselling and legal-aid services, with hopes of expanding capacity as demand becomes clearer." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=27',
    category_id: 'cat-national',
    category: mockCategories[3],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-18T12:00:00Z',
    tags: ['Kilifi', 'Gender-Based Violence', 'Safe House', 'Coast'],
    view_count: 5410,
    created_at: '2026-07-18T11:00:00Z',
    updated_at: '2026-07-18T12:00:00Z',
  },
  {
    id: 'art-8',
    title: 'Glock Pistol, Laptop Stolen From Nairobi Businessman',
    slug: 'glock-pistol-laptop-stolen-nairobi-businessman',
    excerpt: 'Police are investigating after a Nairobi businessman reported the theft of a licensed firearm and a laptop.',
    body: [
      { id: 'b1', type: 'paragraph', value: "NAIROBI — Police are investigating the theft of a licensed Glock pistol and a laptop belonging to a Nairobi businessman, in an incident that has raised fresh questions about the security of licensed firearms in the city." },
      { id: 'b2', type: 'heading', value: 'Details Still Emerging', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "Investigators have not yet released a full account of how the theft occurred. The case has been flagged to the Directorate of Criminal Investigations, given the involvement of a licensed firearm." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: 'A Developing Story', meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "This report will be updated as police provide further details on the investigation and any recovered property." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=28',
    category_id: 'cat-national',
    category: mockCategories[3],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T05:00:00Z',
    tags: ['Nairobi', 'Crime', 'Investigation'],
    view_count: 4230,
    created_at: '2026-07-19T04:30:00Z',
    updated_at: '2026-07-19T05:00:00Z',
  },
  {
    id: 'art-9',
    title: 'Opportunity or Another Mega Gold Scandal in the Making?',
    slug: 'opportunity-or-another-mega-gold-scandal',
    excerpt: 'A newly announced mining deal is drawing both investor interest and sharp scrutiny, given Kenya\'s history with gold-investment scams.',
    body: [
      { id: 'b1', type: 'paragraph', value: "NAIROBI — A newly unveiled gold mining deal is drawing a mixed reaction, with some officials touting it as a genuine economic opportunity and others warning it echoes patterns seen in past Kenyan gold-investment scandals." },
      { id: 'b2', type: 'heading', value: 'A History of Caution', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "Kenya has seen a string of gold-related investment scams over the past decade, leaving regulators and the public wary of new mining announcements, even when backed by credible-sounding partners." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: 'Calls for Transparency', meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "Analysts are calling for full public disclosure of the deal's ownership structure and licensing terms before it moves forward, arguing that transparency now could prevent reputational damage later." }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=29',
    category_id: 'cat-national',
    category: mockCategories[3],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T09:00:00Z',
    tags: ['Mining', 'Gold', 'Investment', 'Scandal'],
    view_count: 13980,
    created_at: '2026-07-19T08:15:00Z',
    updated_at: '2026-07-19T09:00:00Z',
  },
  {
    id: 'art-10',
    title: 'World Cup 2026: Spain Take On Argentina in Late Kickoff Clash',
    slug: 'world-cup-2026-spain-argentina-late-kickoff',
    excerpt: 'Two of the tournament\'s heavyweights meet in a high-stakes World Cup fixture, with Kenyan fans tuning in live.',
    body: [
      { id: 'b1', type: 'paragraph', value: "The FIFA World Cup 2026 continues with Spain facing Argentina in a fixture billed as one of the tournament's marquee matchups, kicking off at 22:00 local time." },
      { id: 'b2', type: 'heading', value: 'What to Watch For', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: "Both sides enter the match with strong tournament form, and neutral fans across Kenya are expected to follow the game closely via live broadcasts and streaming coverage." },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b4', type: 'heading', value: 'Live Coverage', meta: { level: 2 } },
      { id: 'b5', type: 'paragraph', value: "Follow live updates and post-match analysis as the tournament heads toward its knockout stages." }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    category_id: 'cat-sports',
    category: mockCategories[2],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T18:00:00Z',
    tags: ['World Cup', 'Spain', 'Argentina', 'Football'],
    view_count: 22150,
    created_at: '2026-07-19T17:00:00Z',
    updated_at: '2026-07-19T18:00:00Z',
  }
]

// 4. Mock Videos / Documentaries
export let mockVideos: Video[] = [
  { id: 'vid-1', title: 'Inside Ol Kalou: The By-Election That Shook Mt Kenya', slug: 'inside-ol-kalou-by-election', description: 'A deep dive into the Ol Kalou by-election and its impact on 2027 politics.', thumbnail_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600', video_source_type: 'youtube', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration_seconds: 1845, category_id: 'cat-politics', category: mockCategories[0], status: 'published', published_at: '2026-07-18T10:00:00Z', view_count: 34200, created_at: '2026-07-17T08:00:00Z' },
  { id: 'vid-2', title: 'Kenya\'s Debt Crisis Explained', slug: 'kenya-debt-crisis-explained', description: 'Breaking down the Sh13 trillion question.', thumbnail_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600', video_source_type: 'youtube', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration_seconds: 2410, category_id: 'cat-business', category: mockCategories[1], status: 'published', published_at: '2026-07-15T14:00:00Z', view_count: 18700, created_at: '2026-07-14T10:00:00Z' },
  { id: 'vid-3', title: 'World Cup 2026: Kenya\'s Football Dream', slug: 'world-cup-2026-kenya-football', description: 'How Kenyan fans are experiencing the World Cup.', thumbnail_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600', video_source_type: 'youtube', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration_seconds: 1520, category_id: 'cat-sports', category: mockCategories[2], status: 'published', published_at: '2026-07-19T06:00:00Z', view_count: 41500, created_at: '2026-07-19T04:00:00Z' },
]

// 5. Mock Ads
export let mockAds: MockAd[] = [
  { id: 'ad-1', client_name: 'Kenya Tourism Board', image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800', target_link: 'https://magicalkenya.com', position: 'homepage_top', start_date: '2026-07-01', end_date: '2026-08-31', status: 'active', impressions_count: 24500, clicks_count: 890, created_at: '2026-07-01T00:00:00Z' },
  { id: 'ad-2', client_name: 'Equity Bank', image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', target_link: 'https://equitygroupholdings.com', position: 'article_inline', start_date: '2026-07-10', end_date: '2026-08-31', status: 'active', impressions_count: 18200, clicks_count: 520, created_at: '2026-07-10T00:00:00Z' },
  { id: 'ad-3', client_name: 'Safaricom PLC', image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', target_link: 'https://safaricom.co.ke', position: 'homepage_mid', start_date: '2026-06-15', end_date: '2026-08-31', status: 'active', impressions_count: 31000, clicks_count: 1200, created_at: '2026-06-15T00:00:00Z' },
  { id: 'ad-4', client_name: 'Tusker Lager', image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', target_link: 'https://eabl.com', position: 'sidebar', start_date: '2026-07-01', end_date: '2026-08-31', status: 'active', impressions_count: 12500, clicks_count: 450, created_at: '2026-07-01T00:00:00Z' },
]

// 6. Mock Comments
export let mockComments: MockComment[] = [
  { id: 'cmt-1', article_id: 'art-1', author_name: 'James Mwangi', body: 'This election result is a clear signal. Mt Kenya has spoken.', status: 'approved', created_at: '2026-07-19T09:30:00Z' },
  { id: 'cmt-2', article_id: 'art-1', author_name: 'Grace Akinyi', body: 'Great reporting, Duncan. Keep holding power accountable.', status: 'pending', created_at: '2026-07-19T10:15:00Z' },
  { id: 'cmt-3', article_id: 'art-4', author_name: 'Peter Ochieng', body: 'The middle class squeeze is real. We are feeling it daily.', status: 'pending', created_at: '2026-07-19T11:00:00Z' },
  { id: 'cmt-4', article_id: 'art-9', author_name: 'Fatuma Hassan', body: 'Another gold scam? Kenyans deserve better oversight.', status: 'approved', created_at: '2026-07-19T10:45:00Z' },
]

// 7. Mock Newsletter Subscribers
export let mockSubscribers: MockSubscriber[] = [
  { id: 'sub-1', email: 'james@example.com', subscribed_at: '2026-07-10T08:00:00Z' },
  { id: 'sub-2', email: 'grace@example.com', subscribed_at: '2026-07-15T14:30:00Z' },
  { id: 'sub-3', email: 'peter@example.com', subscribed_at: '2026-07-18T09:00:00Z' },
]

export let mockNewsletters: MockNewsletter[] = [
  { id: 'nl-1', subject: 'Khaemba News Weekly Roundup', content: '<p>Welcome to our weekly newsletter...</p>', sent_at: '2026-07-15T10:00:00Z', recipients_count: 3 },
  { id: 'nl-2', subject: 'Breaking: Major political realignment in Nairobi', content: '<p>A major development in Kenyan politics...</p>', sent_at: '2026-07-18T16:45:00Z', recipients_count: 3 }
]

export let mockInquiries: MockInquiry[] = [
  { id: 'inq-1', name: 'John Kamau', email: 'john@kamauassociates.co.ke', subject: 'Ad Rates Query', message: 'Hello, we would like to advertise our real estate firm on your sidebar slot. What are your monthly rates?', type: 'advertise', status: 'unread', created_at: '2026-07-18T10:00:00Z' },
  { id: 'inq-2', name: 'Amina Omondi', email: 'amina.omondi@outlook.com', subject: 'Tip-off: Health Ministry tender irregularity', message: 'I have documents detailing a suspect tender award at the Ministry of Health. Please contact me securely.', type: 'contact', status: 'unread', created_at: '2026-07-19T08:30:00Z' }
]

export let mockAdClients: MockAdClient[] = [
  { id: 'cli-1', name: 'Kenya Tourism Board', email: 'ads@magicalkenya.com', phone: '0712345678', created_at: '2026-07-01T00:00:00Z' },
  { id: 'cli-2', name: 'Equity Bank', email: 'marketing@equitybank.co.ke', phone: '0722000111', created_at: '2026-07-10T00:00:00Z' },
  { id: 'cli-3', name: 'Safaricom PLC', email: 'ads@safaricom.co.ke', phone: '0709000222', created_at: '2026-06-15T00:00:00Z' }
]

export let mockAdPayments: MockAdPayment[] = [
  { id: 'pay-1', client_id: 'cli-1', ad_id: 'ad-1', amount: 150000, payment_date: '2026-07-01', payment_method: 'Bank Transfer', status: 'completed', created_at: '2026-07-01T10:00:00Z' },
  { id: 'pay-2', client_id: 'cli-2', ad_id: 'ad-2', amount: 80000, payment_date: '2026-07-10', payment_method: 'M-Pesa', status: 'completed', created_at: '2026-07-10T12:00:00Z' },
  { id: 'pay-3', client_id: 'cli-3', ad_id: 'ad-3', amount: 250000, payment_date: '2026-06-15', payment_method: 'Bank Transfer', status: 'completed', created_at: '2026-06-15T09:00:00Z' }
]

// ── CRUD Helpers ──
let adCounter = mockAds.length + 1
export async function addAd(data: Omit<MockAd, 'id' | 'created_at'>): Promise<MockAd> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addAd', data })
    })
    return res.json()
  }

  const newAd: MockAd = {
    ...data,
    id: `ad-${adCounter++}`,
    created_at: new Date().toISOString()
  }
  mockAds = [newAd, ...mockAds]
  saveDbToDisk()
  return newAd
}

export async function editAd(id: string, data: Partial<MockAd>) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'editAd', id, data })
    })
    return
  }

  mockAds = mockAds.map(a => a.id === id ? { ...a, ...data, updated_at: new Date().toISOString() } : a)
  saveDbToDisk()
}

export async function deleteAd(id: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteAd', id })
    })
    return
  }

  mockAds = mockAds.filter(a => a.id !== id)
  saveDbToDisk()
}

export async function trackAdEvent(id: string, eventType: 'impression' | 'click') {
  if (typeof window !== 'undefined') {
    // Fire-and-forget background analytics log
    fetch('/api/ads/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: id, eventType })
    }).catch(() => {})
    return
  }

  mockAds = mockAds.map(a => {
    if (a.id === id) {
      return {
        ...a,
        impressions_count: eventType === 'impression' ? (a.impressions_count || 0) + 1 : a.impressions_count,
        clicks_count: eventType === 'click' ? (a.clicks_count || 0) + 1 : a.clicks_count
      }
    }
    return a
  })
  saveDbToDisk()
}

// ── Disk Persistence Helpers (Server-side only) ──
// Dynamic require to avoid webpack bundling fs/path for client
function getFs() {
  try { return require('fs') } catch { return null }
}
function getPath() {
  try { return require('path') } catch { return null }
}

function saveDbToDisk() {
  if (typeof window !== 'undefined') return
  const fs = getFs()
  const path = getPath()
  if (!fs || !path) return
  try {
    const DB_FILE_PATH = path.join(process.cwd(), 'mock_db_store.json')
    const data = {
      mockArticles,
      mockVideos,
      mockCategories,
      mockAds,
      mockComments,
      mockSubscribers,
      mockAdClients,
      mockAdPayments,
      mockNewsletters,
      mockInquiries
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2))
  } catch {
    // Read-only filesystem (Vercel) — silently skip
  }
}

function loadDbFromDisk() {
  if (typeof window !== 'undefined') return
  const fs = getFs()
  const path = getPath()
  if (!fs || !path) return
  try {
    const DB_FILE_PATH = path.join(process.cwd(), 'mock_db_store.json')
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8')
      const parsed = JSON.parse(raw)
      if (parsed.mockArticles) {
        mockArticles.length = 0
        mockArticles.push(...parsed.mockArticles)
      }
      if (parsed.mockVideos) {
        mockVideos.length = 0
        mockVideos.push(...parsed.mockVideos)
      }
      if (parsed.mockCategories) {
        mockCategories.length = 0
        mockCategories.push(...parsed.mockCategories)
      }
      if (parsed.mockAds) {
        mockAds.length = 0
        mockAds.push(...parsed.mockAds)
      }
      if (parsed.mockComments) {
        mockComments.length = 0
        mockComments.push(...parsed.mockComments)
      }
      if (parsed.mockSubscribers) {
        mockSubscribers.length = 0
        mockSubscribers.push(...parsed.mockSubscribers)
      }
      if (parsed.mockAdClients) {
        mockAdClients.length = 0
        mockAdClients.push(...parsed.mockAdClients)
      }
      if (parsed.mockAdPayments) {
        mockAdPayments.length = 0
        mockAdPayments.push(...parsed.mockAdPayments)
      }
      if (parsed.mockNewsletters) {
        mockNewsletters.length = 0
        mockNewsletters.push(...parsed.mockNewsletters)
      }
      if (parsed.mockInquiries) {
        mockInquiries.length = 0
        mockInquiries.push(...parsed.mockInquiries)
      }
    }
  } catch {
    // Read-only filesystem or file missing — silently skip
  }
}

// Load persisted mock database on module startup
loadDbFromDisk()

let videoCounter = mockVideos.length + 1
export async function addVideo(data: Omit<Video, 'id' | 'created_at'>): Promise<Video> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addVideo', data })
    })
    return res.json()
  }

  const newVid: Video = {
    ...data,
    id: `vid-${videoCounter++}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as any
  mockVideos = [newVid, ...mockVideos]
  saveDbToDisk()
  return newVid
}

export async function editVideo(id: string, data: Partial<Video>) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'editVideo', id, data })
    })
    return
  }

  mockVideos = mockVideos.map(v => v.id === id ? { ...v, ...data, updated_at: new Date().toISOString() } : v)
  saveDbToDisk()
}

export async function deleteVideo(id: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteVideo', id })
    })
    return
  }

  mockVideos = mockVideos.filter(v => v.id !== id)
  saveDbToDisk()
}

let articleCounter = mockArticles.length + 1

export async function createArticle(data: Omit<Article, 'id' | 'created_at'>): Promise<Article> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createArticle', data })
    })
    return res.json()
  }

  const newArt: Article = {
    ...data,
    id: `art-${articleCounter++}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    view_count: 0
  } as any
  mockArticles = [newArt, ...mockArticles]
  saveDbToDisk()
  return newArt
}

export async function updateArticle(id: string, data: Partial<Article>) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateArticle', id, data })
    })
    return
  }

  mockArticles = mockArticles.map(a => a.id === id ? { ...a, ...data, updated_at: new Date().toISOString() } : a)
  saveDbToDisk()
}

export async function deleteArticle(id: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteArticle', id })
    })
    return
  }

  mockArticles = mockArticles.filter(a => a.id !== id)
  saveDbToDisk()
}

export async function updateArticleStatus(id: string, status: 'draft' | 'published') {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateArticleStatus', id, status })
    })
    return
  }

  mockArticles = mockArticles.map(a => a.id === id ? {
    ...a,
    status,
    published_at: status === 'published' ? new Date().toISOString() : a.published_at,
    updated_at: new Date().toISOString()
  } : a)
  saveDbToDisk()
}

let categoryCounter = mockCategories.length + 1
export async function addCategory(data: Omit<Category, 'id'>): Promise<Category> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addCategory', data })
    })
    return res.json()
  }

  const newCat: Category = {
    ...data,
    id: `cat-${categoryCounter++}`
  }
  mockCategories.push(newCat)
  saveDbToDisk()
  return newCat
}

export async function editCategory(id: string, data: Partial<Category>) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'editCategory', id, data })
    })
    return
  }

  const updated = mockCategories.map(c => c.id === id ? { ...c, ...data } : c)
  mockCategories.length = 0
  mockCategories.push(...updated)
  saveDbToDisk()
}

export async function deleteCategory(id: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteCategory', id })
    })
    return
  }

  const filtered = mockCategories.filter(c => c.id !== id)
  mockCategories.length = 0
  mockCategories.push(...filtered)
  saveDbToDisk()
}

let commentCounter = mockComments.length + 1
export async function addComment(articleId: string, authorName: string, body: string): Promise<MockComment> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addComment', data: { articleId, authorName, body } })
    })
    return res.json()
  }

  const newComment: MockComment = {
    id: `cmt-${commentCounter++}`,
    article_id: articleId,
    author_name: authorName,
    body,
    status: 'pending',
    created_at: new Date().toISOString()
  }
  mockComments.push(newComment)
  saveDbToDisk()
  return newComment
}

export async function updateCommentStatus(id: string, status: 'approved' | 'rejected') {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateCommentStatus', id, status })
    })
    return
  }

  const updated = mockComments.map(c => c.id === id ? { ...c, status } : c)
  mockComments.length = 0
  mockComments.push(...updated)
  saveDbToDisk()
}

export async function deleteComment(id: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteComment', id })
    })
    return
  }

  const filtered = mockComments.filter(c => c.id !== id)
  mockComments.length = 0
  mockComments.push(...filtered)
  saveDbToDisk()
}

// mockAdClients and mockAdPayments are declared above (before loadDbFromDisk call)

let clientCounter = mockAdClients.length + 1
export async function addAdClient(data: Omit<MockAdClient, 'id' | 'created_at'>): Promise<MockAdClient> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addAdClient', data })
    })
    return res.json()
  }

  const newClient: MockAdClient = {
    ...data,
    id: `cli-${clientCounter++}`,
    created_at: new Date().toISOString()
  }
  mockAdClients.push(newClient)
  saveDbToDisk()
  return newClient
}

export async function editAdClient(id: string, data: Partial<MockAdClient>) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'editAdClient', id, data })
    })
    return
  }

  const updated = mockAdClients.map(c => c.id === id ? { ...c, ...data } : c)
  mockAdClients.length = 0
  mockAdClients.push(...updated)
  saveDbToDisk()
}

export async function deleteAdClient(id: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteAdClient', id })
    })
    return
  }

  const filtered = mockAdClients.filter(c => c.id !== id)
  mockAdClients.length = 0
  mockAdClients.push(...filtered)
  saveDbToDisk()
}

let paymentCounter = mockAdPayments.length + 1
export async function addAdPayment(data: Omit<MockAdPayment, 'id' | 'created_at'>): Promise<MockAdPayment> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addAdPayment', data })
    })
    return res.json()
  }

  const newPayment: MockAdPayment = {
    ...data,
    id: `pay-${paymentCounter++}`,
    created_at: new Date().toISOString()
  }
  mockAdPayments.push(newPayment)
  saveDbToDisk()
  return newPayment
}

export async function editAdPayment(id: string, data: Partial<MockAdPayment>) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'editAdPayment', id, data })
    })
    return
  }

  const updated = mockAdPayments.map(p => p.id === id ? { ...p, ...data } : p)
  mockAdPayments.length = 0
  mockAdPayments.push(...updated)
  saveDbToDisk()
}

export async function deleteAdPayment(id: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteAdPayment', id })
    })
    return
  }

  const filtered = mockAdPayments.filter(p => p.id !== id)
  mockAdPayments.length = 0
  mockAdPayments.push(...filtered)
  saveDbToDisk()
}

let inquiryCounter = mockInquiries.length + 1
export async function addInquiry(data: Omit<MockInquiry, 'id' | 'created_at' | 'status'>): Promise<MockInquiry> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addInquiry', data })
    })
    return res.json()
  }

  const newInquiry: MockInquiry = {
    ...data,
    id: `inq-${inquiryCounter++}`,
    status: 'unread',
    created_at: new Date().toISOString()
  }
  mockInquiries.push(newInquiry)
  saveDbToDisk()
  return newInquiry
}

export async function updateInquiryStatus(id: string, status: 'unread' | 'read' | 'replied') {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateInquiryStatus', id, status })
    })
    return
  }

  const updated = mockInquiries.map(i => i.id === id ? { ...i, status } : i)
  mockInquiries.length = 0
  mockInquiries.push(...updated)
  saveDbToDisk()
}

export async function deleteInquiry(id: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteInquiry', id })
    })
    return
  }

  const filtered = mockInquiries.filter(i => i.id !== id)
  mockInquiries.length = 0
  mockInquiries.push(...filtered)
  saveDbToDisk()
}

export async function addSubscriber(email: string) {
  if (typeof window !== 'undefined') {
    await fetch('/api/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addSubscriber', email })
    })
    return
  }

  const exists = mockSubscribers.some(s => s.email.toLowerCase() === email.toLowerCase())
  if (exists) return

  const newSub = {
    id: `sub-${mockSubscribers.length + 1}`,
    email,
    subscribed_at: new Date().toISOString()
  }
  mockSubscribers.push(newSub)
  saveDbToDisk()
}