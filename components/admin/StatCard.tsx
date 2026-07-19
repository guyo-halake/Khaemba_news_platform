import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  icon: LucideIcon
}

export default function StatCard({ title, value, description, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-ink-navy/10 dark:border-gray-800 rounded-lg p-5 flex items-start justify-between shadow-sm">
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold tracking-widest text-ink-navy/60 dark:text-gray-400 uppercase">
          {title}
        </span>
        <div className="text-2xl md:text-3xl font-headline font-black text-ink-navy dark:text-white">
          {value}
        </div>
        
        {trend ? (
          <div className="flex items-center space-x-1.5 text-xs font-mono">
            <span className={trend.isPositive ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-ink-navy/40 dark:text-gray-500">
              {trend.label}
            </span>
          </div>
        ) : description ? (
          <p className="text-xs text-ink-navy/50 dark:text-gray-400 font-mono">
            {description}
          </p>
        ) : null}
      </div>

      <div className="p-2.5 bg-amber/10 dark:bg-amber/5 text-amber rounded">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}
