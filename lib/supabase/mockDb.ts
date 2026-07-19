import { Article, Category, Video, Ad, Comment, User } from '../types'

export const isMockEnabled = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !url || url.includes('placeholder-project')
}

// 1. Mock Users
export const mockUsers: User[] = [
  {
    id: 'u-1',
    full_name: 'Wanjala Khaemba',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'u-2',
    full_name: 'Sarah Jepchirchir',
    role: 'editor',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'u-3',
    full_name: 'Dennis Omondi',
    role: 'contributor',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    created_at: '2026-03-10T00:00:00Z',
  }
]

// 2. Mock Categories
export const mockCategories: Category[] = [
  { id: 'cat-politics', name: 'Politics', slug: 'politics', accent_color: '#B23A3A' },
  { id: 'cat-business', name: 'Business', slug: 'business', accent_color: '#3A7D44' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', accent_color: '#2E5FA3' },
  { id: 'cat-county', name: 'County', slug: 'county', accent_color: '#8A5A9E' },
  { id: 'cat-opinion', name: 'Opinion', slug: 'opinion', accent_color: '#5E6E7A' },
]

// 3. Mock Articles
export let mockArticles: Article[] = [
  {
    id: 'art-1',
    title: 'The Great County Re-imagination: Devolution After Ten Years',
    slug: 'the-great-county-reimagination-devolution-after-ten-years',
    excerpt: 'A comprehensive analysis of how the 47 county governments have transformed rural economies and the challenges ahead.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'Ten years since the inauguration of devolution in Kenya, the results in rural counties present a mixed bag of historic development triumphs and lingering administrative bottlenecks.' },
      { id: 'b2', type: 'heading', value: 'The Economic Uplift of the Interior', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'Before devolution, up to 90% of national development resources were concentrated in capital regions. Today, county healthcare facilities, paved market roads, and agricultural subsidies have spurred economic nodes in previously marginalized towns.' },
      { id: 'b4', type: 'quote', value: 'Devolution has brought the government closer to the people, but it has also brought accountability issues directly to the local doorstep.' },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b5', type: 'heading', value: 'Resource Gaps and Capital Debts', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'Despite success, delays in national exchequer disbursements continue to cripple operations, leaving contractors unpaid and local dispensaries short of critical medical supplies. As the next decade of local governance begins, structural revenue reforms remain crucial.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800',
    category_id: 'cat-county',
    category: mockCategories[3],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-18T10:00:00Z',
    tags: ['Devolution', 'County Growth', 'Governance'],
    view_count: 1420,
    created_at: '2026-07-18T09:00:00Z',
    updated_at: '2026-07-18T10:00:00Z',
  },
  {
    id: 'art-2',
    title: 'National Assembly Set to Debate High-Stakes Finance Bill Amendments',
    slug: 'national-assembly-debate-finance-bill-amendments',
    excerpt: 'Legislators face public pressure as debates focus on digital tax rates, petroleum levies, and small business exemptions.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'The National Assembly is braced for a tense session as lawmakers from across the aisle debate controversial amendments to the Finance Bill.' },
      { id: 'b2', type: 'paragraph', value: 'Key sticking points include proposed adjustments to the VAT on digital services and imports, which tech founders warn could suppress local innovation hubs.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    category_id: 'cat-politics',
    category: mockCategories[0],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T06:30:00Z',
    tags: ['Politics', 'Finance Bill', 'Taxes'],
    view_count: 852,
    created_at: '2026-07-19T05:00:00Z',
    updated_at: '2026-07-19T06:30:00Z',
  },
  {
    id: 'art-3',
    title: 'Tech Hubs Propel Silicon Savannah to Record Venture Capital Year',
    slug: 'tech-hubs-propel-silicon-savannah-venture-capital',
    excerpt: 'Nairobi ranks top in East Africa for startup funding, attracting investments in clean tech, fin-tech, and micro-logistics.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'Nairobi-based startups have raised a combined record capital, defying global venture funding slowdowns. The surge is driven by strong investor appetite in clean energy transitions.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    category_id: 'cat-business',
    category: mockCategories[1],
    author_id: 'u-3',
    author: mockUsers[2],
    status: 'published',
    published_at: '2026-07-17T12:00:00Z',
    tags: ['Tech', 'Funding', 'Business'],
    view_count: 2100,
    created_at: '2026-07-17T11:00:00Z',
    updated_at: '2026-07-17T12:00:00Z',
  },
  {
    id: 'art-4',
    title: 'Why Civic Duty Begins At The Ballot, But Ends In Community Forums',
    slug: 'why-civic-duty-begins-at-ballot-ends-in-community',
    excerpt: 'Opinion: An analysis of why citizens must stay engaged between election cycles to ensure policies translate into actual public benefit.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'Casting a vote is the loudest civic action a citizen can take, but keeping government accountable requires persistent, quiet participation in sub-county public hearings.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800',
    category_id: 'cat-opinion',
    category: mockCategories[4],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-18T14:00:00Z',
    tags: ['Civic Duty', 'Elections', 'Community'],
    view_count: 512,
    created_at: '2026-07-18T13:00:00Z',
    updated_at: '2026-07-18T14:00:00Z',
  },
  {
    id: 'art-5',
    title: 'Continental Athletics Showdown: Stars Primed for Gold in Regional Games',
    slug: 'continental-athletics-showdown-stars-primed-for-gold',
    excerpt: 'National record-holders look to dominate the middle-distance events at the upcoming African Games.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'The national track and field squad has entered bubble training as preparations peak for the continental championships.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    category_id: 'cat-sports',
    category: mockCategories[2],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T07:15:00Z',
    tags: ['Athletics', 'Running', 'Sports'],
    view_count: 120,
    created_at: '2026-07-19T06:00:00Z',
    updated_at: '2026-07-19T07:15:00Z',
  }
]

// 4. Mock Videos
export let mockVideos: Video[] = [
  {
    id: 'vid-1',
    title: 'The Mau Forest Keepers: Guardians of the Water Tower',
    slug: 'mau-forest-keepers-guardians-water-tower',
    description: 'An investigative documentary looking at the indigenous communities actively preserving the forest ecosystems against encroachers.',
    thumbnail_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder link
    duration_seconds: 1450, // ~24 minutes
    category_id: 'cat-county',
    category: mockCategories[3],
    status: 'published',
    published_at: '2026-07-15T08:00:00Z',
    view_count: 4500,
    created_at: '2026-07-15T07:00:00Z',
  },
  {
    id: 'vid-2',
    title: 'Nairobi Transit: Echoes of the Matatu Culture',
    slug: 'nairobi-transit-echoes-matatu-culture',
    description: 'Exploring the vibrant, visual, and sonic history of the city\'s iconic passenger mini-buses and their economic engine.',
    thumbnail_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration_seconds: 980, // ~16 minutes
    category_id: 'cat-business',
    category: mockCategories[1],
    status: 'published',
    published_at: '2026-07-10T14:30:00Z',
    view_count: 12000,
    created_at: '2026-07-10T12:00:00Z',
  },
  {
    id: 'vid-3',
    title: 'Altitudes of Excellence: Training in Iten',
    slug: 'altitudes-excellence-training-iten',
    description: 'A deep-dive look at the high-altitude training camp that produces the fastest marathoners and middle-distance runners in the world.',
    thumbnail_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    video_source_type: 'vimeo',
    video_url: 'https://vimeo.com/765039',
    duration_seconds: 1820, // ~30 minutes
    category_id: 'cat-sports',
    category: mockCategories[2],
    status: 'published',
    published_at: '2026-07-05T09:00:00Z',
    view_count: 8900,
    created_at: '2026-07-05T08:00:00Z',
  }
]

// 5. Mock Ads
export let mockAds: Ad[] = [
  {
    id: 'ad-top',
    client_name: 'Vipingo Ridge Golf Estates',
    image_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1000&q=80',
    target_link: 'https://vipingoridge.com',
    position: 'homepage_top',
    start_date: '2026-07-01',
    end_date: '2026-07-31',
    status: 'active',
    created_at: '2026-07-01T00:00:00Z',
    impressions: 48500,
    clicks: 1240,
  },
  {
    id: 'ad-mid',
    client_name: 'Safaricom 5G Business Plan',
    image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&q=80',
    target_link: 'https://safaricom.co.ke',
    position: 'homepage_mid',
    start_date: '2026-07-10',
    end_date: '2026-08-10',
    status: 'active',
    created_at: '2026-07-10T00:00:00Z',
    impressions: 32000,
    clicks: 980,
  },
  {
    id: 'ad-inline',
    client_name: 'Equity Bank Supreme Banking',
    image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    target_link: 'https://equitygroupholdings.com',
    position: 'article_inline',
    start_date: '2026-07-15',
    end_date: '2026-07-22', // Expiring in 3 days!
    status: 'active',
    created_at: '2026-07-15T00:00:00Z',
    impressions: 15400,
    clicks: 432,
  },
  {
    id: 'ad-sidebar',
    client_name: 'KCB Mortgages: Own Your Home',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80',
    target_link: 'https://kcbgroup.com',
    position: 'sidebar',
    start_date: '2026-07-15',
    end_date: '2026-08-15',
    status: 'active',
    created_at: '2026-07-15T00:00:00Z',
    impressions: 22400,
    clicks: 340,
  }
]

// 6. Mock Comments
export let mockComments: Comment[] = [
  {
    id: 'c-1',
    article_id: 'art-1',
    author_name: 'John Muthama',
    body: 'Devolution has really helped road networks in Machakos County. However, monitoring funds is key.',
    status: 'approved',
    created_at: '2026-07-18T12:30:00Z',
  },
  {
    id: 'c-2',
    article_id: 'art-1',
    author_name: 'Fatuma Ali',
    body: 'Excellent reporting. We need more focus on rural healthcare systems in the northern region.',
    status: 'approved',
    created_at: '2026-07-18T15:45:00Z',
  },
  {
    id: 'c-3',
    article_id: 'art-1',
    author_name: 'David Langat',
    body: 'Why are county staff salaries delayed every month? The Treasury must fix this.',
    status: 'pending',
    created_at: '2026-07-19T04:20:00Z',
  }
]

// 7. Mock Subscribers
export let mockSubscribers: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'editor@khaembanews.com', subscribed_at: '2026-06-15T09:00:00Z' },
  { id: 'sub-2', email: 'muthama.john@gmail.com', subscribed_at: '2026-07-02T14:22:00Z' },
  { id: 'sub-3', email: 'ali.fatuma@yahoo.com', subscribed_at: '2026-07-10T10:11:00Z' }
]

// 8. In-Memory Operations for Analytics & CMS updates in Admin Panel
export const addArticle = (art: Partial<Article>) => {
  const newArt: Article = {
    id: `art-${Date.now()}`,
    title: art.title || 'Untitled',
    slug: art.slug || `untitled-${Date.now()}`,
    excerpt: art.excerpt || '',
    body: art.body || [],
    featured_image_url: art.featured_image_url || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800',
    category_id: art.category_id || 'cat-politics',
    category: mockCategories.find(c => c.id === art.category_id) || mockCategories[0],
    author_id: art.author_id || 'u-1',
    author: mockUsers[0],
    status: art.status || 'draft',
    published_at: art.status === 'published' ? new Date().toISOString() : undefined,
    tags: art.tags || [],
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockArticles = [newArt, ...mockArticles]
  return newArt
}

export const updateArticle = (id: string, updates: Partial<Article>) => {
  mockArticles = mockArticles.map(art => {
    if (art.id === id) {
      const merged = { ...art, ...updates, updated_at: new Date().toISOString() }
      if (updates.category_id) {
        merged.category = mockCategories.find(c => c.id === updates.category_id)
      }
      return merged as Article
    }
    return art
  })
}

export const deleteArticle = (id: string) => {
  mockArticles = mockArticles.filter(art => art.id !== id)
}

export const addVideo = (vid: Partial<Video>) => {
  const newVid: Video = {
    id: `vid-${Date.now()}`,
    title: vid.title || 'Untitled Video',
    slug: vid.slug || `untitled-video-${Date.now()}`,
    description: vid.description || '',
    thumbnail_url: vid.thumbnail_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    video_source_type: vid.video_source_type || 'youtube',
    video_url: vid.video_url || '',
    duration_seconds: vid.duration_seconds || 0,
    category_id: vid.category_id,
    category: mockCategories.find(c => c.id === vid.category_id),
    status: vid.status || 'draft',
    published_at: vid.status === 'published' ? new Date().toISOString() : undefined,
    view_count: 0,
    created_at: new Date().toISOString(),
  }
  mockVideos = [newVid, ...mockVideos]
  return newVid
}

export const updateVideo = (id: string, updates: Partial<Video>) => {
  mockVideos = mockVideos.map(vid => {
    if (vid.id === id) {
      const merged = { ...vid, ...updates }
      if (updates.category_id) {
        merged.category = mockCategories.find(c => c.id === updates.category_id)
      }
      return merged as Video
    }
    return vid
  })
}

export const deleteVideo = (id: string) => {
  mockVideos = mockVideos.filter(vid => vid.id !== id)
}

export const addAd = (ad: Partial<Ad>) => {
  const newAd: Ad = {
    id: `ad-${Date.now()}`,
    client_name: ad.client_name || 'New Client',
    image_url: ad.image_url || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    target_link: ad.target_link || '#',
    position: ad.position || 'homepage_top',
    start_date: ad.start_date || new Date().toISOString().split('T')[0],
    end_date: ad.end_date || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
    status: ad.status || 'active',
    created_at: new Date().toISOString(),
    impressions: 0,
    clicks: 0,
  }
  mockAds = [newAd, ...mockAds]
  return newAd
}

export const updateAd = (id: string, updates: Partial<Ad>) => {
  mockAds = mockAds.map(ad => {
    if (ad.id === id) {
      return { ...ad, ...updates } as Ad
    }
    return ad
  })
}

export const deleteAd = (id: string) => {
  mockAds = mockAds.filter(ad => ad.id !== id)
}

export const trackAdEvent = (id: string, type: 'impression' | 'click') => {
  mockAds = mockAds.map(ad => {
    if (ad.id === id) {
      if (type === 'impression') {
        return { ...ad, impressions: (ad.impressions || 0) + 1 }
      } else {
        return { ...ad, clicks: (ad.clicks || 0) + 1 }
      }
    }
    return ad
  })
}

export const addSubscriber = (email: string) => {
  const exists = mockSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase())
  if (!exists) {
    mockSubscribers.push({
      id: `sub-${Date.now()}`,
      email,
      subscribed_at: new Date().toISOString()
    })
  }
}

export const addComment = (comment: Partial<Comment>) => {
  const newComment: Comment = {
    id: `c-${Date.now()}`,
    article_id: comment.article_id || 'art-1',
    author_name: comment.author_name || 'Anonymous',
    body: comment.body || '',
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  mockComments.push(newComment)
  return newComment
}

export const updateCommentStatus = (id: string, status: 'approved' | 'rejected') => {
  mockComments = mockComments.map(c => {
    if (c.id === id) {
      return { ...c, status }
    }
    return c
  })
}

export const deleteComment = (id: string) => {
  mockComments = mockComments.filter(c => c.id !== id)
}
