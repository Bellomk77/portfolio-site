'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Clock, Upload, MessageSquare, FileBarChart2,
  ArrowRight, Zap, ChevronRight, RefreshCw,
  DollarSign, FileText, Shield, Bell,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import Sidebar from '@/components/layout/Sidebar'
import { formatCurrency, getDaysUntil, urgencyColors, taxTypeBadge, taxTypeLabel } from '@/lib/utils'
import { UPCOMING_DEADLINES_2025, MONTHLY_TAX_DATA, FINANCE_ACT_UPDATES } from '@/lib/nigerian-tax-data'

const KPI_CARDS = [
  {
    label:    'Total Tax Due This Month',
    value:    '₦5.74M',
    change:   '+12.3%',
    up:       true,
    icon:     DollarSign,
    color:    'bg-blue-50 border-blue-300 text-blue-400',
    subLabel: 'vs ₦5.11M last month',
  },
  {
    label:    'AI Savings Discovered',
    value:    '₦8.4M',
    change:   '+₦1.2M',
    up:       true,
    icon:     Zap,
    color:    'bg-ng-50 border-ng-300 text-ng-400',
    subLabel: 'in unclaimed capital allowances',
  },
  {
    label:    'Documents Processed',
    value:    '247',
    change:   '+34',
    up:       true,
    icon:     FileText,
    color:    'bg-purple-50 border-purple-300 text-purple-400',
    subLabel: 'this month (3 pending)',
  },
  {
    label:    'Compliance Score',
    value:    '87/100',
    change:   '+5pts',
    up:       true,
    icon:     Shield,
    color:    'bg-orange-50 border-orange-300 text-orange-400',
    subLabel: 'Grade B — Good standing',
  },
]

const QUICK_ACTIONS = [
  { label: 'Upload Documents',    href: '/upload',     icon: Upload,        color: 'bg-ng-600 hover:bg-ng-500' },
  { label: 'Calculate Taxes',     href: '/calculator', icon: DollarSign,    color: 'bg-blue-600 hover:bg-blue-500' },
  { label: 'Ask AI Advisor',      href: '/chat',       icon: MessageSquare, color: 'bg-purple-600 hover:bg-purple-500' },
  { label: 'Generate Report',     href: '/reports',    icon: FileBarChart2, color: 'bg-orange-600 hover:bg-orange-500' },
]

const chartData = MONTHLY_TAX_DATA.map(d => ({
  month: d.month,
  VAT:   d.vat   / 1_000_000,
  PAYE:  d.paye  / 1_000_000,
  WHT:   d.wht   / 1_000_000,
  CIT:   d.cit   / 1_000_000,
}))

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s: number, p: any) => s + p.value, 0)
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs shadow-xl">
      <div className="font-semibold text-gray-900 mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-6 py-0.5">
          <span style={{ color: p.color }}>{p.dataKey}</span>
          <span className="text-gray-900 font-medium">₦{p.value.toFixed(2)}M</span>
        </div>
      ))}
      <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between">
        <span className="text-gray-500">Total</span>
        <span className="text-gray-900 font-bold">₦{total.toFixed(2)}M</span>
      </div>
    </div>
  )
}

function HealthScoreRing({ score }: { score: number }) {
  const r     = 52
  const circ  = 2 * Math.PI * r
  const dash  = (score / 100) * circ
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
  const color = score >= 80 ? '#008751' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-extrabold text-gray-900">{score}</div>
        <div className="text-xs text-gray-500">Grade {grade}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  const pendingDeadlines = UPCOMING_DEADLINES_2025.filter(d => d.status !== 'filed')
  const totalDue = pendingDeadlines.reduce((s, d) => s + (d.amount || 0), 0)

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Zenith Holdings Ltd • FY 2025 • June 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link
              href="/upload"
              className="flex items-center gap-2 bg-ng-600 hover:bg-ng-500 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload Docs
            </Link>
          </div>
        </header>

        <div className="p-8 space-y-6">

          {/* Alert banner */}
          <div className="bg-orange-50 border border-orange-300/60 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4.5 h-4.5 text-orange-400 flex-shrink-0" />
              <span className="text-orange-200 text-sm">
                <strong>3 upcoming FIRS deadlines</strong> in the next 21 days — total due: <strong>{formatCurrency(totalDue)}</strong>
              </span>
            </div>
            <Link href="/compliance" className="text-orange-400 hover:text-orange-300 text-sm font-medium whitespace-nowrap flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            {KPI_CARDS.map((card, i) => (
              <div key={i} className={`rounded-xl p-5 bg-gray-50 border border-gray-200`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                    <card.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${card.up ? 'text-ng-400' : 'text-red-400'}`}>
                    {card.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {card.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{card.value}</div>
                <div className="text-gray-500 text-xs font-medium">{card.label}</div>
                <div className="text-gray-600 text-xs mt-0.5">{card.subLabel}</div>
              </div>
            ))}
          </div>

          {/* Charts + Health Score */}
          <div className="grid grid-cols-3 gap-5">
            {/* Monthly Tax Chart */}
            <div className="col-span-2 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900 font-semibold">Monthly Tax Liability</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Jan – Jun 2025 (₦ millions)</p>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">2025</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={10} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af', paddingTop: '12px' }} />
                  <Bar dataKey="VAT"  fill="#7c3aed" radius={[3,3,0,0]} />
                  <Bar dataKey="PAYE" fill="#008751" radius={[3,3,0,0]} />
                  <Bar dataKey="WHT"  fill="#ea580c" radius={[3,3,0,0]} />
                  <Bar dataKey="CIT"  fill="#2563eb" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tax Health Score */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center">
              <h3 className="text-gray-900 font-semibold mb-1">Tax Health Score</h3>
              <p className="text-gray-500 text-xs mb-6">Updated today</p>
              <HealthScoreRing score={87} />
              <div className="mt-6 w-full space-y-2">
                {[
                  { label: 'Compliance',     val: 92 },
                  { label: 'Documentation',  val: 78 },
                  { label: 'Optimisation',   val: 85 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-gray-900 font-medium">{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ng-600 rounded-full transition-all duration-700"
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/compliance" className="mt-5 text-ng-400 hover:text-ng-300 text-xs flex items-center gap-1">
                View Full Report <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Deadlines + Quick Actions */}
          <div className="grid grid-cols-3 gap-5">
            {/* Upcoming Deadlines */}
            <div className="col-span-2 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 font-semibold">Upcoming FIRS Deadlines</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Next 90 days</p>
                </div>
                <Link href="/compliance" className="text-ng-400 hover:text-ng-300 text-xs flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {UPCOMING_DEADLINES_2025.map(d => {
                  const days     = getDaysUntil(d.dueDate)
                  const urgency  = d.status === 'filed' ? 'ok' : days < 0 ? 'overdue' : days <= 3 ? 'urgent' : days <= 7 ? 'warning' : 'ok'
                  const colors   = urgencyColors(urgency)
                  return (
                    <div key={d.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-100/30 transition-colors">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${taxTypeBadge(d.taxType)} flex-shrink-0`}>
                        {d.taxType}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 text-sm font-medium truncate">{d.description}</div>
                        <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {d.dueDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {d.status === 'filed' && <span className="text-ng-500">· Filed ✓</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-gray-900 text-sm font-semibold">
                          {d.amount ? formatCurrency(d.amount) : '—'}
                        </div>
                        <div className={`text-xs font-medium mt-0.5 ${colors.text}`}>
                          {d.status === 'filed' ? 'Filed' : days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions + Updates */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                <h3 className="text-gray-900 font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`${color} text-gray-900 rounded-xl p-3.5 text-xs font-medium flex flex-col items-center gap-2 text-center transition-all shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tax Law Flash */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-semibold">Tax Law Flash</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-ng-500 animate-pulse" />
                    <span className="text-gray-500 text-xs">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {FINANCE_ACT_UPDATES.slice(0, 3).map((u, i) => (
                    <div key={i} className="border-l-2 border-ng-700 pl-3">
                      <div className="text-gray-900 text-xs font-medium leading-snug">{u.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{u.effectiveDate}</div>
                    </div>
                  ))}
                </div>
                <Link href="/compliance" className="mt-4 block text-center text-ng-400 hover:text-ng-300 text-xs">
                  View all updates →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
