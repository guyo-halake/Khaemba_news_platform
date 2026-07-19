import StatCard from '@/components/admin/StatCard'
import DashboardCharts from '@/components/admin/DashboardCharts'
import { createClient } from '@/lib/supabase/server'
import { isMockEnabled, mockArticles, mockAds, mockComments, mockSubscribers } from '@/lib/supabase/mockDb'
import { Newspaper, Eye, Image as AdIcon, DollarSign, Clock, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'

async function getDashboardMetrics() {
  if (isMockEnabled()) {
    const totalArticles = mockArticles.length
    const totalViews = mockArticles.reduce((acc, art) => acc + art.view_count, 0)
    const activeAds = mockAds.filter(a => a.status === 'active').length
    
    // Compute revenue dynamically based on active ad positions prices
    // homepage_top: $450, homepage_mid: $300, article_inline: $350, sidebar: $250
    const computedRevenue = mockAds
      .filter(a => a.status === 'active')
      .reduce((acc, ad) => {
        if (ad.position === 'homepage_top') return acc + 450
        if (ad.position === 'homepage_mid') return acc + 300
        if (ad.position === 'article_inline') return acc + 350
        if (ad.position === 'sidebar') return acc + 250
        return acc
      }, 0)

    const pendingComments = mockComments.filter(c => c.status === 'pending')
    const recentSubscribersCount = mockSubscribers.length

    // Generate recent activity logs
    const activities = [
      { id: '1', type: 'article', text: 'Sarah Jepchirchir published "Finance Bill Amendments"', time: '2 hours ago' },
      { id: '2', type: 'comment', text: `New comment pending moderation on devolution analysis`, time: '4 hours ago' },
      { id: '3', type: 'ad', text: 'Equity Bank active campaign "Supreme Banking" loaded', time: '1 day ago' },
      { id: '4', type: 'subscriber', text: 'New reader newsletter sign-up registered', time: '1 day ago' }
    ]

    // Generate daily traffic data
    const trafficData = [
      { day: 'Mon', views: 4200, articleViews: 2400 },
      { day: 'Tue', views: 4900, articleViews: 2900 },
      { day: 'Wed', views: 5100, articleViews: 3200 },
      { day: 'Thu', views: 5300, articleViews: 3500 },
      { day: 'Fri', views: 5800, articleViews: 4100 },
      { day: 'Sat', views: 6100, articleViews: 4300 },
      { day: 'Sun', views: 6400, articleViews: 4800 },
    ]

    const adRevenueData = [
      { month: 'Feb', revenue: 800, clicks: 120 },
      { month: 'Mar', revenue: 950, clicks: 180 },
      { month: 'Apr', revenue: 1100, clicks: 250 },
      { month: 'May', revenue: 1200, clicks: 310 },
      { month: 'Jun', revenue: 1350, clicks: 420 },
      { month: 'Jul', revenue: computedRevenue || 1350, clicks: 540 }
    ]

    return {
      stats: {
        totalArticles,
        totalViews,
        activeAds,
        computedRevenue
      },
      activities,
      trafficData,
      adRevenueData,
      pendingCommentsCount: pendingComments.length
    }
  }

  try {
    const supabase = createClient()
    
    // Fetch articles count & views
    const { data: articles } = await supabase
      .from('articles')
      .select('view_count')

    const totalArticles = articles?.length || 0
    const totalViews = articles?.reduce((acc, a) => acc + (a.view_count || 0), 0) || 0

    // Fetch active ads
    const { data: ads } = await supabase
      .from('ads')
      .select('position')
      .eq('status', 'active')

    const activeAds = ads?.length || 0
    const computedRevenue = ads?.reduce((acc, ad) => {
      if (ad.position === 'homepage_top') return acc + 450
      if (ad.position === 'homepage_mid') return acc + 300
      if (ad.position === 'article_inline') return acc + 350
      if (ad.position === 'sidebar') return acc + 250
      return acc
    }, 0) || 0

    // Comments pending moderation count
    const { count: pendingCommentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Dummy charts data when connecting to live DB first time (it grows as analytics is added)
    const trafficData = [
      { day: 'Mon', views: Math.floor(totalViews * 0.1), articleViews: Math.floor(totalViews * 0.07) },
      { day: 'Tue', views: Math.floor(totalViews * 0.12), articleViews: Math.floor(totalViews * 0.08) },
      { day: 'Wed', views: Math.floor(totalViews * 0.13), articleViews: Math.floor(totalViews * 0.09) },
      { day: 'Thu', views: Math.floor(totalViews * 0.14), articleViews: Math.floor(totalViews * 0.1) },
      { day: 'Fri', views: Math.floor(totalViews * 0.15), articleViews: Math.floor(totalViews * 0.11) },
      { day: 'Sat', views: Math.floor(totalViews * 0.16), articleViews: Math.floor(totalViews * 0.12) },
      { day: 'Sun', views: Math.floor(totalViews * 0.2), articleViews: Math.floor(totalViews * 0.15) },
    ]

    const adRevenueData = [
      { month: 'Jul', revenue: computedRevenue, clicks: 230 }
    ]

    return {
      stats: {
        totalArticles,
        totalViews,
        activeAds,
        computedRevenue
      },
      activities: [
        { id: '1', type: 'article', text: 'Database synchronization active', time: 'Just now' }
      ],
      trafficData,
      adRevenueData,
      pendingCommentsCount: pendingCommentsCount || 0
    }
  } catch (err) {
    console.error('Failed to get dashboard metrics:', err)
    return {
      stats: { totalArticles: 0, totalViews: 0, activeAds: 0, computedRevenue: 0 },
      activities: [],
      trafficData: [],
      adRevenueData: [],
      pendingCommentsCount: 0
    }
  }
}

export default async function AdminDashboardPage() {
  const { stats, activities, trafficData, adRevenueData, pendingCommentsCount } = await getDashboardMetrics()

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-black text-3xl text-ink-navy dark:text-white leading-tight">
            Dashboard
          </h1>
          <p className="text-xs font-mono text-ink-navy/60 dark:text-gray-400">
            Real-time server monitoring & metrics summaries
          </p>
        </div>
        
        <Link
          href="/admin/articles/new"
          className="bg-amber hover:bg-amber-hover text-ink-navy text-xs font-bold px-4 py-2.5 rounded shadow transition-colors flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Stat Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Articles"
          value={stats.totalArticles}
          description="Total published & drafts"
          icon={Newspaper}
        />
        <StatCard
          title="Aggregate Page Views"
          value={stats.totalViews.toLocaleString()}
          trend={{ value: 12.4, label: 'vs last week', isPositive: true }}
          icon={Eye}
        />
        <StatCard
          title="Active Ad Slots"
          value={`${stats.activeAds} / 4`}
          description="Occupied client spaces"
          icon={AdIcon}
        />
        <StatCard
          title="Monthly Est. Revenue"
          value={`$${stats.computedRevenue.toLocaleString()}`}
          trend={{ value: 8.5, label: 'vs last month', isPositive: true }}
          icon={DollarSign}
        />
      </section>

      {/* Charts Grid */}
      <DashboardCharts trafficData={trafficData} adRevenueData={adRevenueData} />

      {/* Split Content: Activities & Moderation queue alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Activity Logs */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-6 space-y-4 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white border-b border-ink-navy/5 pb-2">
            Recent System Activity
          </h3>
          <div className="space-y-4">
            {activities.map(act => (
              <div key={act.id} className="flex justify-between items-center text-xs border-b border-ink-navy/5 dark:border-gray-850 pb-2.5 last:border-0 last:pb-0">
                <span className="text-ink-navy/80 dark:text-gray-300 font-medium">
                  {act.text}
                </span>
                <span className="font-mono text-ink-navy/40 dark:text-gray-500 flex items-center space-x-1 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{act.time}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {pendingCommentsCount > 0 && (
            <div className="bg-amber/15 border border-amber/35 rounded-lg p-6 space-y-3 shadow-sm">
              <div className="flex items-center space-x-2 text-amber-700 dark:text-amber">
                <MessageSquare className="w-5 h-5 fill-amber/20" />
                <h4 className="font-headline font-bold text-base">
                  Moderation Required
                </h4>
              </div>
              <p className="text-xs text-ink-navy/80 dark:text-gray-300 leading-relaxed">
                There are <span className="font-bold text-amber-800 dark:text-amber">{pendingCommentsCount} comment(s)</span> awaiting approval in the editorial moderation queue.
              </p>
              <Link
                href="/admin/comments"
                className="inline-block text-xs font-bold text-amber hover:underline uppercase"
              >
                Go to Moderation &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
