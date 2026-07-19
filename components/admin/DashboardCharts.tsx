'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ChartsProps {
  trafficData: Array<{ day: string; views: number; articleViews: number }>
  adRevenueData: Array<{ month: string; revenue: number; clicks: number }>
}

export default function DashboardCharts({ trafficData, adRevenueData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Traffic Line Chart */}
      <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div>
          <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white">
            Website Traffic Analytics
          </h3>
          <p className="text-xs text-ink-navy/50 dark:text-gray-400 font-mono">
            Daily page views vs article reads this week
          </p>
        </div>
        
        <div className="h-72 w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2332',
                  borderColor: '#D99A3F',
                  color: '#FAF6EF',
                  borderRadius: '4px'
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="views" name="Total Page Views" stroke="#D99A3F" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="articleViews" name="Article Views" stroke="#2E5FA3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Ad Analytics Bar Chart */}
      <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div>
          <h3 className="font-headline font-bold text-lg text-ink-navy dark:text-white">
            Ad Revenue & Clicks
          </h3>
          <p className="text-xs text-ink-navy/50 dark:text-gray-400 font-mono">
            Monthly aggregate ad sales in USD vs aggregate click counters
          </p>
        </div>

        <div className="h-72 w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2332',
                  borderColor: '#D99A3F',
                  color: '#FAF6EF',
                  borderRadius: '4px'
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="revenue" name="Revenue ($)" fill="#3A7D44" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicks" name="Total Ad Clicks" fill="#8A5A9E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
