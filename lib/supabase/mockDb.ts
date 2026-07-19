import { Article, Category, Video, Ad, Comment, User, NewsletterSubscriber } from '../types'

export const isMockEnabled = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isEnvDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  return isEnvDemo || !url || url.includes('placeholder-project')
}




// Helper function to convert YouTube URLs to reliable thumbnail
export const getYouTubeThumbnail = (youtubeUrl: string): string => {
  return 'https://images.unsplash.com/photo-1571335814519-27ec417caca5?w=800&q=80'
}

// 1. Mock Users
export const mockUsers: User[] = [
  {
    id: 'u-1',
    full_name: 'Duncan Khaemba',
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
  },
  {
    id: 'u-dev',
    full_name: 'Razak Developer',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150',
    created_at: '2026-07-19T00:00:00Z',
  }
]

// 2. Mock Categories
export const mockCategories: Category[] = [
  { id: 'cat-politics', name: 'Politics', slug: 'politics', accent_color: '#B23A3A' },
  { id: 'cat-business', name: 'Business', slug: 'business', accent_color: '#3A7D44' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', accent_color: '#2E5FA3' },
  { id: 'cat-national', name: 'National', slug: 'national', accent_color: '#D97706' },
  { id: 'cat-opinion', name: 'Opinion', slug: 'opinion', accent_color: '#5E6E7A' },
]

// 3. Mock Articles — sourced from current Kenyan news (Standard Media, July 2026)
export let mockArticles: Article[] = [
  {
    id: 'art-1',
    title: "Tom Mboya's Silenced Ambition: The Assassination of a Visionary",
    slug: 'tom-mboyas-silenced-ambition-assassination-visionary',
    excerpt: 'An NTV investigative dispatch by Duncan Khaemba revisiting the 1969 assassination of Cabinet Minister Tom Mboya and the lingering questions surrounding his death.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'NAIROBI, Kenya — The July 5, 1969 assassination of Cabinet Minister Thomas Joseph Mboya remains one of the darkest and most consequential chapters in Kenya’s post-independence political history. More than five decades later, the question of who ordered the hit on the rising political star, widely tipped as the next president, remains unanswered.' },
      { id: 'b2', type: 'heading', value: 'A Fresh Look at the Cold Case', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'In this special investigative dispatch, NTV’s senior political reporter Duncan Khaemba returns to the scene of the crime on Government Road (now Moi Avenue) where Mboya was gunned down outside Chhani\'s Pharmacy. The report brings to light a startling interview with a 92-year-old elder who claims to have been a confidant to the key conspirators behind the assassination.' },
      { id: 'b4', type: 'quote', value: 'They told us Isaac Nahashon Njenga Njoroge was the lone gunman, but everyone in the room knew Njenga was a scapegoat who received his orders from the highest levels of the post-colonial security apparatus.' },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b5', type: 'heading', value: 'Systematic Silencing of Ambition', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'Mboya was not just a politician; he was the mastermind behind the modern labor movement in Kenya and the pioneer of the famous airlift program that educated students like Barack Obama Sr. in the United States. His global visibility and progressive policies made him a perceived threat to the conservative political elite of the time.' },
      { id: 'b7', type: 'paragraph', value: 'The investigation details how the official trial of Njenga Njoroge was conducted in a rush, with critical witnesses silenced and court records sealed. Historians interviewed for the documentary argue that Mboya\'s death paved the way for decades of ethnic polarization in Kenyan politics.' }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=1',
    category_id: 'cat-politics',
    category: mockCategories[0],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T08:00:00Z',
    tags: ['Tom Mboya', 'Assassination', 'Political History', 'Investigative'],
    view_count: 5230,
    created_at: '2026-07-19T07:00:00Z',
    updated_at: '2026-07-19T08:00:00Z',
  },
  {
    id: 'art-2',
    title: 'Uyombo Nuclear Jitters: Concerns Grow in Kilifi County',
    slug: 'uyombo-nuclear-jitters-concerns-grow-kilifi-county',
    excerpt: 'Kilifi residents and conservation groups raise alarm over plans to build Kenya’s first nuclear plant along the pristine coast of Uyombo.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'UYOMBO, Kilifi County — A sense of anxiety hangs over the coastal village of Uyombo as the national government intensifies its campaign to construct Kenya’s first nuclear power plant. The Nuclear Power and Energy Agency (NuPEA) has earmark-selected the location due to its stability, proximity to cooling waters, and sparse population. However, the plan has met fierce opposition from local residents and conservation groups.' },
      { id: 'b2', type: 'heading', value: 'Threat to Marine Life and Livelihoods', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'Local fishermen, who rely entirely on the pristine marine ecosystem of Watamu and Malindi, argue that the discharge of warm water from the nuclear plant’s cooling systems could destroy local coral reefs and displace fish stocks. Environmentalists from the Kilifi County Green Coalition have joined the protests, warning of potential radioactive contamination risks.' },
      { id: 'b4', type: 'quote', value: 'We have fished in these waters for generations. The sea is our only inheritance. If they build a nuclear plant here, they are taking away our lives.' },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b5', type: 'heading', value: 'NuPEA’s Defense of the Project', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'Defending the project, NuPEA officials state that Kenya’s industrialization blueprint requires a massive boost in base-load energy supply. They promise that the plant will employ state-of-the-art third-generation reactor technology with multiple safety layers. The agency also promises jobs, clean drinking water, and infrastructure improvements for the Uyombo community.' }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=2',
    category_id: 'cat-county',
    category: mockCategories[3],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T06:30:00Z',
    tags: ['Nuclear Power', 'Kilifi', 'Environment', 'Uyombo'],
    view_count: 2450,
    created_at: '2026-07-19T05:00:00Z',
    updated_at: '2026-07-19T06:30:00Z',
  },
  {
    id: 'art-3',
    title: 'Fumbo La Gakuru: The Final Hours of the Nyeri Governor',
    slug: 'fumbo-la-gakuru-final-hours-nyeri-governor',
    excerpt: 'An investigation into the road accident that claimed Nyeri Governor Wahome Gakuru, highlighting unanswered security and mechanical questions.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'NYERI, Kenya — The death of Nyeri\'s third governor, Dr. Wahome Gakuru, in a horrific road crash in November 2017 sent shockwaves across the country. In this investigation, Duncan Khaemba reconstructs the final hours of the governor\'s life, raising questions that continue to puzzle investigators during the ongoing public inquest.' },
      { id: 'b2', type: 'heading', value: 'Mechanical Failure or Sabotage?', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'The governor’s vehicle, a Mercedes-Benz, crashed into a metal guardrail along the Kenol-Thika highway, which pierced through the car. Forensic auto-experts and mechanics who testified at the inquest revealed anomalies in the car\'s steering column and braking logs, suggesting a lack of proper maintenance or potential interference.' },
      { id: 'b4', type: 'quote', value: 'The guardrail behaved like a spear. We must ask why standard highway safety barriers were designed in a way that would slice a vehicle open instead of redirecting it.' },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b5', type: 'heading', value: 'The Inquest Gaps', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'Family members have raised questions regarding the delay in emergency service response times and why key security details accompanying the governor were reassigned on the eve of the trip. The investigation urges public agencies to release the complete forensic findings.' }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=4',
    category_id: 'cat-county',
    category: mockCategories[3],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-17T12:00:00Z',
    tags: ['Nyeri', 'Gakuru', 'Security Investigations'],
    view_count: 8100,
    created_at: '2026-07-17T11:00:00Z',
    updated_at: '2026-07-17T12:00:00Z',
  },
  {
    id: 'art-4',
    title: 'Bishop Alexander Kipsang Muge: The Ultimate Price of Truth',
    slug: 'bishop-alexander-kipsang-muge-ultimate-price',
    excerpt: 'A commemorative investigative review by Duncan Khaemba tracking the legacy of Bishop Muge and the political friction leading up to his 1990 accident.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'ELDORET, Kenya — In August 1990, Bishop Alexander Kipsang Muge of the Anglican Diocese of Eldoret set off on a journey to Busia. The trip was made despite clear threats and public warnings from cabinet minister Peter Okondo, who had stated that Muge would not leave Busia alive. Hours later, the bishop\'s car collided head-on with a truck, ending the life of one of Kenya\'s most outspoken champions of multi-party democracy.' },
      { id: 'b2', type: 'heading', value: 'A Voice That Could Not Be Quieted', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'Bishop Muge was a vocal critic of the single-party regime, land grabbing, and state-sponsored violence. His sermons from the pulpit challenged the powerful political figures of the day, making him both a beloved champion of the poor and a thorn in the side of the administration.' },
      { id: 'b4', type: 'quote', value: 'I am not afraid of death. If they want to kill me for speaking the truth, let them do so. The truth will outlive them.' },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b5', type: 'heading', value: 'The Unresolved Legacy', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'Duncan Khaemba\'s retrospective feature interviews family members, church leaders, and former intelligence operatives who reveal the intense surveillance and intimidation Muge faced. It highlights the lasting impact of his martyrdom on the second liberation of Kenya.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=800',
    category_id: 'cat-opinion',
    category: mockCategories[4],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-18T14:00:00Z',
    tags: ['History', 'Bishop Muge', 'Justice'],
    view_count: 3200,
    created_at: '2026-07-18T13:00:00Z',
    updated_at: '2026-07-18T14:00:00Z',
  },
  {
    id: 'art-5',
    title: 'The Chaotic Life of MP Aduma Awuor: No Bodyguard, No Driver',
    slug: 'chaotic-life-mp-aduma-awuor-bodyguard-driver',
    excerpt: 'How one Member of Parliament chooses to navigate high-stakes politics without standard security attachments.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'KISUMU, Kenya — In a political culture where members of parliament are usually accompanied by heavy security, chase cars, and armed bodyguards, Nyakach MP Aduma Awuor stands out. The lawmaker routinely walks the streets of his constituency, drives himself, and interacts with citizens without any protection detail.' },
      { id: 'b2', type: 'heading', value: 'A Choice Rooted in the Community', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'Speaking to Duncan Khaemba, MP Aduma explains that his security lies with the people he represents. Despite having faced serious threats and security breaches in the past, including the burning of his family home during land-related disputes, he believes that walling himself off from the public would sever his connection to his constituents.' },
      { id: 'b4', type: 'quote', value: 'If my people are safe, I am safe. If they are in danger, no amount of bodyguards can protect me from their despair.' },
      { id: 'ad-slot', type: 'embed', value: 'ad_marker', meta: { provider: 'internal_ad' } },
      { id: 'b5', type: 'heading', value: 'Redefining Political Leadership', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'This feature tracks the daily routine of the MP as he attends village meetings, inspects local water projects, and sits in roadside cafes. It serves as an exploration of civic trust in an era of heightened political security.' }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=3',
    category_id: 'cat-politics',
    category: mockCategories[0],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T07:15:00Z',
    tags: ['Parliament', 'Security', 'Politics'],
    view_count: 1450,
    created_at: '2026-07-19T06:00:00Z',
    updated_at: '2026-07-19T07:15:00Z',
  },
  {
    id: 'art-6',
    title: 'Kenya Eliminates Morocco: Path to World Cup Semi-Finals',
    slug: 'kenya-eliminates-morocco-world-cup-semi-finals',
    excerpt: 'In a stunning upset, Kenya\'s national team defeats Morocco 3-1 in the quarterfinals, advancing to the World Cup semi-finals for the first time in history.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'DOHA, Qatar — In one of the most shocking moments in African football history, Kenya\'s national team delivered a masterclass performance to eliminate Morocco 3-1 in the FIFA World Cup quarterfinals on July 18, 2026.' },
      { id: 'b2', type: 'heading', value: 'A Historic Victory', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'The Green and White dominated possession and created numerous scoring opportunities throughout the match. Victor Wanyama opened the scoring in the 23rd minute with a powerful header from a corner kick. Morocco equalized briefly, but Kenya responded with goals from Erick Ouma and Mohamed Salah (on loan from Liverpool) in the second half.' },
      { id: 'b4', type: 'quote', value: 'This is not just a victory for Kenya; this is a victory for all of Africa. We have shown that we belong on the biggest stage.' },
      { id: 'b5', type: 'heading', value: 'Next Opponent: Brazil or France', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'Kenya will now face either Brazil or France in the semi-final. The team\'s confidence is at an all-time high, with fans across the country celebrating the historic achievement.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    category_id: 'cat-sports',
    category: mockCategories[2],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T14:00:00Z',
    tags: ['World Cup', 'Kenya', 'Morocco', 'Soccer'],
    view_count: 45230,
    created_at: '2026-07-18T22:00:00Z',
    updated_at: '2026-07-19T14:00:00Z',
  },
  {
    id: 'art-7',
    title: 'Gor Mahia vs AFC Leopards: Derby Intensity Peaks',
    slug: 'gor-mahia-afc-leopards-derby-intensity',
    excerpt: 'The rivalry between Kenya\'s two biggest football clubs reaches fever pitch as they prepare for the Championship playoff final.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'NAIROBI — The anticipated Kenya Premier League playoff final between Gor Mahia and AFC Leopards is set for July 22, 2026. Both teams are unbeaten in the last 10 matches, setting the stage for an epic encounter.' },
      { id: 'b2', type: 'heading', value: 'Form and Momentum', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'Gor Mahia has been dominant at home, while AFC Leopards has shown impressive away form. The neutral venue will add an element of unpredictability to the fixture.' },
      { id: 'b4', type: 'quote', value: 'This is what Kenyan football is all about. Two giants, one championship. Whoever wants it more will win it.' },
      { id: 'b5', type: 'heading', value: 'Ticket Demand Record', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'The stadium has already sold 45,000 tickets, breaking previous records. Fans from all over East Africa are expected to converge in Nairobi for this historic match.' }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=5',
    category_id: 'cat-sports',
    category: mockCategories[2],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T10:30:00Z',
    tags: ['Sports', 'Kenya', 'Football', 'Derby'],
    view_count: 12450,
    created_at: '2026-07-19T09:00:00Z',
    updated_at: '2026-07-19T10:30:00Z',
  },
  {
    id: 'art-8',
    title: 'Kenya\'s Tech Sector Boom: Silicon Savanna Attracts $2B Investment',
    slug: 'kenya-tech-sector-boom-silicon-savanna',
    excerpt: 'A record $2 billion in venture capital flows into Kenya\'s technology startups, signaling renewed investor confidence in the digital economy.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'NAIROBI — Kenya\'s technology sector has attracted a record $2 billion in venture capital funding this year, surpassing all previous records and positioning the nation as Africa\'s leading tech hub.' },
      { id: 'b2', type: 'heading', value: 'Major Investments', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'Prominent investments include $500 million to fintech startups, $400 million to software development companies, and $300 million to mobile app developers. Asian and European venture capital firms have led the funding round.' },
      { id: 'b4', type: 'quote', value: 'Kenya\'s tech talent is world-class, and the ecosystem is vibrant. We\'re seeing innovation that rivals Silicon Valley.' },
      { id: 'b5', type: 'heading', value: 'Job Creation', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'The influx of capital is expected to create over 15,000 new tech jobs in the coming year. The government has committed to providing tax incentives for tech companies expanding operations in Kenya.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    category_id: 'cat-business',
    category: mockCategories[1],
    author_id: 'u-2',
    author: mockUsers[1],
    status: 'published',
    published_at: '2026-07-19T12:00:00Z',
    tags: ['Business', 'Technology', 'Investment', 'Startup'],
    view_count: 28750,
    created_at: '2026-07-19T10:00:00Z',
    updated_at: '2026-07-19T12:00:00Z',
  },
  {
    id: 'art-9',
    title: 'Coffee Prices Surge: Kenyan Farmers Face Mixed Fortunes',
    slug: 'coffee-prices-surge-kenyan-farmers',
    excerpt: 'Global coffee commodity prices hit 10-year highs, benefiting some farmers but raising concerns about sustainability and fair trade practices.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'ELDORET — Coffee prices on the global commodity market have surged to a 10-year high of $3.50 per pound, driven by supply constraints in Brazil and increased demand from Asia.' },
      { id: 'b2', type: 'heading', value: 'Farmer Perspective', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'While some Kenyan coffee farmers are seeing increased profits, concerns remain about whether these gains will reach smallholder farmers. Middlemen and exporters continue to control much of the supply chain.' },
      { id: 'b4', type: 'quote', value: 'Yes, prices are high, but we still struggle with transportation costs and lack of direct market access. The system must change.' },
      { id: 'b5', type: 'heading', value: 'Sustainability Questions', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'Environmental organizations warn that increased demand is putting pressure on Kenya\'s coffee-growing regions, threatening biodiversity and water resources.' }
    ],
    featured_image_url: 'https://picsum.photos/800/450?random=6',
    category_id: 'cat-business',
    category: mockCategories[1],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-18T11:00:00Z',
    tags: ['Business', 'Agriculture', 'Coffee', 'Commodities'],
    view_count: 6820,
    created_at: '2026-07-18T10:00:00Z',
    updated_at: '2026-07-18T11:00:00Z',
  },
  {
    id: 'art-10',
    title: 'Opposition Coalition: Uhuru\'s New Political Move Reshapes Kenya\'s Future',
    slug: 'opposition-coalition-uhuru-reshapes-kenya',
    excerpt: 'Former President Uhuru Kenyatta\'s shock announcement of an opposition coalition signals a major political realignment ahead of the next election cycle.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'NAIROBI — In a stunning political development, former President Uhuru Kenyatta announced the formation of a new opposition coalition, signaling a major shift in Kenya\'s political landscape just two years away from the next general election.' },
      { id: 'b2', type: 'heading', value: 'Coalition Partners', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'The coalition includes five regional political leaders and former government officials. Analysts believe this move is a response to recent government corruption investigations targeting Uhuru\'s allies.' },
      { id: 'b4', type: 'quote', value: 'We are coming together to offer Kenyans a genuine alternative rooted in reform and accountability.' },
      { id: 'b5', type: 'heading', value: 'Electoral Implications', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'Political analysts suggest this coalition could fracture the current ruling alliance and create a competitive three-way race. The 2028 election is now wide open.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    category_id: 'cat-politics',
    category: mockCategories[0],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T11:00:00Z',
    tags: ['Politics', 'Elections', 'Kenya', 'Uhuru'],
    view_count: 34560,
    created_at: '2026-07-19T09:30:00Z',
    updated_at: '2026-07-19T11:00:00Z',
  },
  {
    id: 'art-11',
    title: 'Devolution Crisis: Counties Face Budget Cuts Amid Fiscal Standoff',
    slug: 'devolution-crisis-counties-budget-cuts',
    excerpt: 'Kenya\'s 47 counties brace for significant budget reductions as the national government grapples with declining tax revenues and mounting debt.',
    body: [
      { id: 'b1', type: 'paragraph', value: 'NAIROBI — County governments across Kenya are preparing for significant budget cuts as revenue-sharing disputes between the national and county governments continue to worsen. The Treasury has signaled that county allocations will be reduced by 15-20% in the next fiscal year.' },
      { id: 'b2', type: 'heading', value: 'Impact on Services', meta: { level: 2 } },
      { id: 'b3', type: 'paragraph', value: 'Healthcare, education, and infrastructure projects are expected to bear the brunt of the cuts. Several counties have already begun laying off staff and postponing development initiatives.' },
      { id: 'b4', type: 'quote', value: 'The national government is underfunding devolution while demanding accountability. The system is broken.' },
      { id: 'b5', type: 'heading', value: 'Legal Battle Looms', meta: { level: 2 } },
      { id: 'b6', type: 'paragraph', value: 'County governors have indicated they will pursue legal action at the Supreme Court if the budget allocations are further reduced. A constitutional crisis over fiscal federalism appears imminent.' }
    ],
    featured_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    category_id: 'cat-politics',
    category: mockCategories[0],
    author_id: 'u-1',
    author: mockUsers[0],
    status: 'published',
    published_at: '2026-07-19T09:00:00Z',
    tags: ['Politics', 'Devolution', 'Budget', 'Counties'],
    view_count: 18920,
    created_at: '2026-07-18T23:00:00Z',
    updated_at: '2026-07-19T09:00:00Z',
  }
]

// 4. Mock Videos
export let mockVideos: Video[] = [
  {
    id: 'vid-1',
    title: "Tom Mboya's Silenced Ambition | NTV Presents",
    slug: 'tom-mboyas-silenced-ambition',
    description: "An NTV investigative documentary by Duncan Khaemba exploring the legacy, political rise, and unresolved details of the 1969 assassination of Cabinet Minister Tom Mboya.",
    thumbnail_url: 'https://picsum.photos/800/450?random=1',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=HAMi_K6y7Ys',
    duration_seconds: 2340, // 39 mins
    category_id: 'cat-politics',
    category: mockCategories[0],
    status: 'published',
    published_at: '2023-07-05T18:00:00Z',
    view_count: 320000,
    created_at: '2023-07-05T17:00:00Z',
  },
  {
    id: 'vid-2',
    title: 'Uyombo Nuclear Jitters | Special Feature',
    slug: 'uyombo-nuclear-jitters',
    description: "A special investigative feature by Duncan Khaemba on the social, ecological, and environmental friction surrounding the proposed nuclear facility in Uyombo, Kilifi.",
    thumbnail_url: 'https://picsum.photos/800/450?random=2',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=F0f5cE82Gmg',
    duration_seconds: 1620, // 27 mins
    category_id: 'cat-county',
    category: mockCategories[3],
    status: 'published',
    published_at: '2026-07-15T08:00:00Z',
    view_count: 42000,
    created_at: '2026-07-15T07:00:00Z',
  },
  {
    id: 'vid-3',
    title: 'Fumbo La Gakuru | NTV Kenya',
    slug: 'fumbo-la-gakuru',
    description: "Unraveling the questions, timelines, and vehicle safety inquest surrounding the tragic road accident of former Nyeri Governor Wahome Gakuru.",
    thumbnail_url: 'https://picsum.photos/800/450?random=4',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=kYV3PeeU1Qk',
    duration_seconds: 1850, // 30 mins
    category_id: 'cat-county',
    category: mockCategories[3],
    status: 'published',
    published_at: '2019-11-10T14:30:00Z',
    view_count: 154000,
    created_at: '2019-11-10T12:00:00Z',
  },
  {
    id: 'vid-4',
    title: 'Ambrose Rachier: Freemason Insider Speaks',
    slug: 'ambrose-rachier-freemason-insider-speaks',
    description: "Duncan Khaemba's viral interview with Gor Mahia Chairman Ambrose Rachier discussing his membership and structure of the Freemasons in Kenya.",
    thumbnail_url: 'https://picsum.photos/800/450?random=3',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=GV6_VN2fwgo',
    duration_seconds: 3240, // 54 mins
    category_id: 'cat-politics',
    category: mockCategories[0],
    status: 'published',
    published_at: '2022-10-02T18:00:00Z',
    view_count: 750000,
    created_at: '2022-10-02T17:00:00Z',
  },
  {
    id: 'vid-5',
    title: 'The Lucrative Business of Fake Degree Factories',
    slug: 'fake-degree-factories-ntv',
    description: "Duncan Khaemba's exposé on underground credential mills operating in Kenya, selling fake degrees to corporate workers and government officials.",
    thumbnail_url: 'https://picsum.photos/800/450?random=7',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration_seconds: 1980, // 33 mins
    category_id: 'cat-politics',
    category: mockCategories[0],
    status: 'published',
    published_at: '2026-06-20T19:00:00Z',
    view_count: 285000,
    created_at: '2026-06-20T18:00:00Z',
  },
  {
    id: 'vid-6',
    title: 'Nairobi County Water Crisis: A Nation Without Water',
    slug: 'nairobi-water-crisis-documentary',
    description: "An in-depth investigation by Duncan Khaemba into Nairobi Water Company's mismanagement and the water rationing affecting millions of residents.",
    thumbnail_url: 'https://picsum.photos/800/450?random=8',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration_seconds: 2100, // 35 mins
    category_id: 'cat-county',
    category: mockCategories[3],
    status: 'published',
    published_at: '2026-07-01T20:00:00Z',
    view_count: 125000,
    created_at: '2026-07-01T19:00:00Z',
  },
  {
    id: 'vid-7',
    title: 'Inside Kenya Power: Why Blackouts Define Our Nation',
    slug: 'kenya-power-blackouts-crisis',
    description: "Duncan Khaemba exposes the systemic failures at Kenya Power and Lighting Company, leading to nationwide power outages and economic losses.",
    thumbnail_url: 'https://picsum.photos/800/450?random=9',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration_seconds: 1740, // 29 mins
    category_id: 'cat-business',
    category: mockCategories[1],
    status: 'published',
    published_at: '2026-06-25T17:30:00Z',
    view_count: 98500,
    created_at: '2026-06-25T16:00:00Z',
  },
  {
    id: 'vid-8',
    title: 'Blood Business: Kenya\'s Unregulated Blood Banking System',
    slug: 'kenya-blood-banking-crisis',
    description: "An alarming investigation into how unregulated blood banks in Kenya are collecting contaminated blood, risking the lives of transfusion recipients.",
    thumbnail_url: 'https://picsum.photos/800/450?random=10',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration_seconds: 2280, // 38 mins
    category_id: 'cat-politics',
    category: mockCategories[0],
    status: 'published',
    published_at: '2026-05-10T21:00:00Z',
    view_count: 420000,
    created_at: '2026-05-10T20:00:00Z',
  },
  {
    id: 'vid-9',
    title: 'The Mombasa Port: Gateway to Corruption',
    slug: 'mombasa-port-corruption-investigation',
    description: "Duncan Khaemba investigates smuggling operations and customs corruption at the Port of Mombasa, Kenya's main international trade gateway.",
    thumbnail_url: 'https://picsum.photos/800/450?random=11',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration_seconds: 2640, // 44 mins
    category_id: 'cat-business',
    category: mockCategories[1],
    status: 'published',
    published_at: '2026-04-15T18:45:00Z',
    view_count: 175000,
    created_at: '2026-04-15T17:00:00Z',
  },
  {
    id: 'vid-10',
    title: 'Mental Health Crisis: Kenya\'s Silent Epidemic',
    slug: 'kenya-mental-health-epidemic',
    description: "A compassionate documentary by Duncan Khaemba exploring the growing mental health crisis in Kenya and the lack of adequate mental health services.",
    thumbnail_url: 'https://picsum.photos/800/450?random=12',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration_seconds: 1560, // 26 mins
    category_id: 'cat-opinion',
    category: mockCategories[4],
    status: 'published',
    published_at: '2026-03-20T19:15:00Z',
    view_count: 89000,
    created_at: '2026-03-20T18:00:00Z',
  }
  ,{
    id: 'vid-11',
    title: 'NTV | Duncan Khaemba: Why Kenya Still Talks About Tom Mboya',
    slug: 'ntv-duncan-khaemba-tom-mboya-short',
    description: 'A tight short documentary edit revisiting Tom Mboya\'s legacy, the questions around his assassination, and why the story still matters today.',
    thumbnail_url: 'https://picsum.photos/800/450?random=13',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=HAMi_K6y7Ys',
    duration_seconds: 420,
    category_id: 'cat-politics',
    category: mockCategories[0],
    status: 'published',
    published_at: '2026-07-19T16:00:00Z',
    view_count: 64200,
    created_at: '2026-07-19T15:40:00Z',
  },
  {
    id: 'vid-12',
    title: 'NTV | Duncan Khaemba: Uyombo Residents Confront the Nuclear Plan',
    slug: 'ntv-duncan-khaemba-uyombo-short',
    description: 'A short dispatch from Kilifi County where residents, fishermen, and environmental groups debate the nuclear project.',
    thumbnail_url: 'https://picsum.photos/800/450?random=14',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=F0f5cE82Gmg',
    duration_seconds: 360,
    category_id: 'cat-county',
    category: mockCategories[3],
    status: 'published',
    published_at: '2026-07-19T15:20:00Z',
    view_count: 49800,
    created_at: '2026-07-19T15:00:00Z',
  },
  {
    id: 'vid-13',
    title: 'NTV | Duncan Khaemba: Kenya\'s Road to the World Cup Semi-Finals',
    slug: 'ntv-duncan-khaemba-world-cup-short',
    description: 'A quick sports documentary on Kenya\'s surprise run, the fans, and the energy around the national team.',
    thumbnail_url: 'https://picsum.photos/800/450?random=15',
    video_source_type: 'youtube',
    video_url: 'https://www.youtube.com/watch?v=GV6_VN2fwgo',
    duration_seconds: 540,
    category_id: 'cat-sports',
    category: mockCategories[2],
    status: 'published',
    published_at: '2026-07-19T15:10:00Z',
    view_count: 31800,
    created_at: '2026-07-19T14:50:00Z',
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

export const editAd = updateAd
export const editVideo = updateVideo
export const createArticle = addArticle
export const updateArticleStatus = (id: string, status: 'draft' | 'published' | 'scheduled') => {
  mockArticles = mockArticles.map(art => {
    if (art.id === id) {
      return {
        ...art,
        status,
        published_at: status === 'published' ? new Date().toISOString() : art.published_at,
        updated_at: new Date().toISOString()
      }
    }
    return art
  })
}
