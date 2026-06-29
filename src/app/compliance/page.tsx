'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { CheckCircle, AlertCircle, Clock, XCircle, Calculator, ChevronDown, ChevronRight, Info, Calendar } from 'lucide-react'
import { UPCOMING_DEADLINES_2025, FINANCE_ACT_UPDATES } from '@/lib/nigerian-tax-data'
import { formatCurrency, getDaysUntil, urgencyColors, getDeadlineUrgency, taxTypeBadge, taxTypeLabel, calculateLatePenalty } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ALL_DEADLINES_2025 = [
  ...UPCOMING_DEADLINES_2025,
  { id: '6', taxType: 'VAT' as const, period: 'May 2025', dueDate: new Date('2025-06-21'), status: 'filed' as const, amount: 3_050_000, description: 'Monthly VAT return (Form 002) for May 2025' },
  { id: '7', taxType: 'WHT' as const, period: 'May 2025', dueDate: new Date('2025-06-21'), status: 'filed' as const, amount: 580_000, description: 'WHT remittance for May 2025' },
  { id: '8', taxType: 'PAYE' as const, period: 'Apr 2025', dueDate: new Date('2025-05-10'), status: 'filed' as const, amount: 1_720_000, description: 'Monthly PAYE remittance for April 2025' },
  { id: '9', taxType: 'VAT' as const, period: 'Apr 2025', dueDate: new Date('2025-05-21'), status: 'filed' as const, amount: 3_400_000, description: 'Monthly VAT return (Form 002) for April 2025' },
]

const PENALTY_RATES = {
  CIT:  { base: 0.10, monthly: 0.05, label: '10% + 5%/month' },
  VAT:  { base: 0.05, monthly: 0.025, label: '5% (min ₦5k) + 2.5%/month' },
  PAYE: { base: 0.10, monthly: 0.05, label: '10% + 5%/month' },
  WHT:  { base: 0.10, monthly: 0.05, label: '10% + 5%/month' },
  CGT:  { base: 0.10, monthly: 0.05, label: '10% + 5%/month' },
  EDUCATION: { base: 0.10, monthly: 0.05, label: '10% + 5%/month' },
  STAMP_DUTY: { base: 0, monthly: 0, label: 'Penalty varies' },
  NITDA: { base: 0.10, monthly: 0.05, label: '10% + 5%/month' },
  NASENI: { base: 0.10, monthly: 0.05, label: '10% + 5%/month' },
  WINDFALL: { base: 0.10, monthly: 0.05, label: '10% + 5%/month' },
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'filed':    return <CheckCircle className="w-4 h-4 text-ng-500" />
    case 'overdue':  return <XCircle className="w-4 h-4 text-red-500" />
    case 'upcoming': return <Clock className="w-4 h-4 text-yellow-500" />
    default:         return <AlertCircle className="w-4 h-4 text-orange-500" />
  }
}

function DeadlineRow({ deadline }: { deadline: typeof ALL_DEADLINES_2025[number] }) {
  const [expanded, setExpanded] = useState(false)
  const days    = getDaysUntil(deadline.dueDate)
  const urgency = deadline.status === 'filed' ? 'ok' : getDeadlineUrgency(deadline.dueDate)
  const colors  = urgencyColors(urgency)
  const penaltyRates = PENALTY_RATES[deadline.taxType] || PENALTY_RATES.CIT

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all">
      <div
        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-100/70 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <StatusIcon status={deadline.status === 'filed' ? 'filed' : urgency === 'overdue' ? 'overdue' : 'upcoming'} />

        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${taxTypeBadge(deadline.taxType)}`}>
          {deadline.taxType}
        </span>

        <div className="flex-1 min-w-0">
          <div className="text-gray-900 text-sm font-medium truncate">{deadline.description}</div>
          <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            Due: {deadline.dueDate.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-gray-900 text-sm font-bold">{deadline.amount ? formatCurrency(deadline.amount) : '—'}</div>
          <div className={`text-xs mt-0.5 font-medium ${colors.text}`}>
            {deadline.status === 'filed'
              ? '✓ Filed'
              : days < 0
              ? `${Math.abs(days)} days overdue`
              : `${days} days left`}
          </div>
        </div>

        {expanded ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
      </div>

      {expanded && (
        <div className="px-5 pb-4 border-t border-gray-200/60 pt-4 bg-gray-50/30">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Tax Amount</div>
              <div className="text-gray-900 font-bold">{deadline.amount ? formatCurrency(deadline.amount) : '—'}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Penalty Rate</div>
              <div className="text-orange-400 font-bold text-sm">{penaltyRates.label}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
              <div className="text-gray-500 text-xs mb-1">
                {deadline.status === 'filed' ? 'Status' : days < 0 ? 'Penalty if unpaid now' : 'If 30 days late'}
              </div>
              <div className={cn('font-bold text-sm', deadline.status === 'filed' ? 'text-ng-400' : 'text-red-400')}>
                {deadline.status === 'filed'
                  ? 'Filed & compliant ✓'
                  : deadline.amount
                    ? formatCurrency(calculateLatePenalty(deadline.amount, Math.max(0, -days) + 30))
                    : '—'}
              </div>
            </div>
          </div>
          {deadline.status !== 'filed' && deadline.amount && days >= 0 && (
            <div className="mt-3 bg-orange-950/30 border border-orange-300/50 rounded-xl p-3 text-xs text-orange-300">
              <strong>Action Required:</strong> Pay {formatCurrency(deadline.amount)} by{' '}
              {deadline.dueDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'long' })} to avoid the{' '}
              {penaltyRates.label} FIRS penalty. File via FIRS e-Tax portal at taxpromax.firs.gov.ng
            </div>
          )}
          {deadline.status === 'overdue' && (
            <div className="mt-3 bg-red-950/30 border border-red-300/50 rounded-xl p-3 text-xs text-red-300">
              <strong>⚠ Overdue:</strong> Contact FIRS immediately and pay the outstanding {formatCurrency(deadline.amount || 0)} plus accrued penalties to stop further charges.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CompliancePage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'filed'>('all')
  const [filterType,   setFilterType]   = useState('all')

  const filed   = ALL_DEADLINES_2025.filter(d => d.status === 'filed').length
  const pending = ALL_DEADLINES_2025.filter(d => d.status !== 'filed').length
  const overdue = ALL_DEADLINES_2025.filter(d => d.status !== 'filed' && getDaysUntil(d.dueDate) < 0).length

  const filtered = ALL_DEADLINES_2025.filter(d => {
    if (filterStatus === 'pending' && d.status === 'filed') return false
    if (filterStatus === 'filed'   && d.status !== 'filed') return false
    if (filterType !== 'all' && d.taxType !== filterType)   return false
    return true
  })

  const complianceRate = Math.round((filed / ALL_DEADLINES_2025.length) * 100)

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Compliance Tracker</h1>
          <p className="text-gray-500 text-sm">All FIRS filing deadlines • FY 2025 • Click any row for penalty detail</p>
        </header>

        <div className="p-8 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Compliance Rate', value: `${complianceRate}%`, sub: `${filed}/${ALL_DEADLINES_2025.length} filings`, color: 'text-ng-400', bg: 'bg-ng-50 border-ng-300' },
              { label: 'Filed On Time',    value: filed.toString(),   sub: 'total filings',     color: 'text-ng-400',     bg: 'bg-ng-50 border-ng-300' },
              { label: 'Pending',          value: pending.toString(), sub: 'need attention',     color: 'text-yellow-400', bg: 'bg-yellow-50 border-yellow-300' },
              { label: 'Overdue',          value: overdue.toString(), sub: 'act immediately',    color: 'text-red-400',    bg: 'bg-red-50 border-red-300' },
            ].map(card => (
              <div key={card.label} className={`rounded-xl border p-5 ${card.bg}`}>
                <div className={`text-3xl font-extrabold mb-1 ${card.color}`}>{card.value}</div>
                <div className="text-gray-900 text-sm font-medium">{card.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Finance Act update strip */}
          <div className="bg-blue-950/30 border border-blue-300/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-300">
                <strong>Tax Reform Bills 2024</strong> (4 bills before the National Assembly) may restructure FIRS into a new National Revenue Service and overhaul the VAT sharing formula. Monitor progress at NASS.gov.ng — TaxPadi will update you automatically when changes are enacted.
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
              {(['all', 'pending', 'filed'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
                    filterStatus === s ? 'bg-ng-600 text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  )}>
                  {s}
                </button>
              ))}
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-ng-600"
            >
              <option value="all">All Tax Types</option>
              {['CIT', 'VAT', 'PAYE', 'WHT', 'CGT', 'EDUCATION'].map(t => <option key={t} value={t}>{taxTypeLabel(t)}</option>)}
            </select>
          </div>

          {/* Deadline list */}
          <div className="space-y-2">
            {filtered.length > 0
              ? filtered
                  .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                  .map(d => <DeadlineRow key={d.id} deadline={d} />)
              : (
                <div className="text-center py-16 text-gray-600">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-ng-800" />
                  No deadlines match your filters
                </div>
              )}
          </div>

          {/* Penalty reference */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-gray-900 font-semibold mb-4">FIRS Penalty Reference Guide</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Tax Type', 'Late Filing Penalty', 'Monthly Interest', 'Legal Basis'].map(h => (
                      <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide py-2 pr-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { tax: 'CIT / Edu Tax', penalty: '10% of tax due', interest: '5% per month', basis: 'CITA S.56; ITMA S.17' },
                    { tax: 'VAT',            penalty: '5% of tax due (min ₦5,000)', interest: '5% per month', basis: 'VATA S.28; Finance Act 2020' },
                    { tax: 'PAYE',           penalty: '10% of amount due', interest: '5% per month', basis: 'PITA S.80; ITMA S.17' },
                    { tax: 'WHT',            penalty: '10% of WHT due', interest: '5% per month', basis: 'CITA S.79; PITA S.82' },
                    { tax: 'CGT',            penalty: '10% + interest', interest: '5% per month', basis: 'CGTA S.32' },
                    { tax: 'Stamp Duty',     penalty: 'Penalty prescribed by court', interest: 'Judge\'s discretion', basis: 'Stamp Duties Act' },
                  ].map(row => (
                    <tr key={row.tax}>
                      <td className="py-3 pr-6 text-gray-900 font-medium">{row.tax}</td>
                      <td className="py-3 pr-6 text-red-400">{row.penalty}</td>
                      <td className="py-3 pr-6 text-orange-400">{row.interest}</td>
                      <td className="py-3 text-gray-500 text-xs">{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
