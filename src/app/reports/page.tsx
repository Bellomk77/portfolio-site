'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import {
  FileBarChart2, Download, Filter, Calendar, CheckCircle,
  FileText, TrendingUp, Shield, Printer, Eye,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { formatCurrency, formatCurrencyFull } from '@/lib/utils'
import { MONTHLY_TAX_DATA } from '@/lib/nigerian-tax-data'

const REPORT_TYPES = [
  { id: 'monthly_summary', label: 'Monthly Tax Summary', icon: Calendar, desc: 'VAT, PAYE & WHT overview for a selected month', color: 'text-blue-400 bg-blue-50 border-blue-300' },
  { id: 'annual_cit',      label: 'Annual CIT Return',  icon: FileBarChart2, desc: 'Company Income Tax computation with workings', color: 'text-ng-400 bg-ng-50 border-ng-300' },
  { id: 'vat_return',      label: 'VAT Return (Form 002)', icon: FileText, desc: 'Monthly VAT return ready for FIRS submission', color: 'text-purple-400 bg-purple-50 border-purple-300' },
  { id: 'audit_package',   label: 'Audit Evidence Package', icon: Shield, desc: 'Full documentation for FIRS audit defence', color: 'text-orange-400 bg-orange-50 border-orange-300' },
  { id: 'tax_savings',     label: 'Tax Savings Report', icon: TrendingUp, desc: 'AI-identified optimisation opportunities', color: 'text-yellow-400 bg-yellow-50 border-yellow-300' },
]

const PIE_DATA = [
  { name: 'VAT',       value: 16_525_000, fill: '#7c3aed' },
  { name: 'CIT + Edu', value: 14_200_000, fill: '#2563eb' },
  { name: 'PAYE',      value: 10_270_000, fill: '#008751' },
  { name: 'WHT',       value:  3_270_000, fill: '#ea580c' },
]
const TOTAL_TAX = PIE_DATA.reduce((s, d) => s + d.value, 0)

const SAVINGS_FOUND = [
  { type: 'Capital Allowances (IT Equipment)',    saving: 3_187_500, status: 'action', legalBasis: 'Third Schedule CITA' },
  { type: 'Export Profits Relief',               saving: 1_120_000, status: 'action', legalBasis: 'CITA S.26' },
  { type: 'Prior Year Loss Relief',              saving: 4_260_000, status: 'reviewed', legalBasis: 'CITA S.27' },
  { type: 'R&D Expenditure Deduction',           saving:   840_000, status: 'pending', legalBasis: 'CITA S.24' },
  { type: 'Small Company Threshold (borderline)', saving: 0, status: 'monitor', legalBasis: 'Finance Act 2023' },
]

const chartData = MONTHLY_TAX_DATA.map(d => ({
  month: d.month,
  VAT: d.vat / 1_000_000, PAYE: d.paye / 1_000_000, WHT: d.wht / 1_000_000, CIT: d.cit / 1_000_000,
}))

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly_summary')
  const [generating, setGenerating]         = useState(false)
  const [generated, setGenerated]           = useState(false)

  function generateReport() {
    setGenerating(true)
    setGenerated(false)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 2000)
  }

  const saveColor = (s: string) =>
    s === 'action'   ? 'bg-ng-50 text-ng-400 border-ng-300' :
    s === 'reviewed' ? 'bg-blue-50 text-blue-400 border-blue-300' :
    s === 'pending'  ? 'bg-yellow-50 text-yellow-400 border-yellow-300' :
    'bg-gray-50 text-gray-500 border-gray-300'

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reports & Filing</h1>
            <p className="text-gray-500 text-sm">Generate FIRS-compliant reports and tax analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm transition-all hover:bg-gray-100">
              <Filter className="w-4 h-4" />Period: FY 2025
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Report type selector */}
          <div className="grid grid-cols-5 gap-3">
            {REPORT_TYPES.map(rt => (
              <button
                key={rt.id}
                onClick={() => { setSelectedReport(rt.id); setGenerated(false) }}
                className={`rounded-xl p-4 border text-left transition-all ${
                  selectedReport === rt.id
                    ? rt.color + ' shadow-lg'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
              >
                <rt.icon className={`w-5 h-5 mb-2 ${selectedReport === rt.id ? '' : 'text-gray-500'}`} />
                <div className={`text-sm font-semibold mb-0.5 ${selectedReport === rt.id ? 'text-gray-900' : 'text-gray-900'}`}>{rt.label}</div>
                <div className="text-xs leading-snug opacity-70">{rt.desc}</div>
              </button>
            ))}
          </div>

          {/* Generate button */}
          <div className="flex items-center gap-4">
            <button
              onClick={generateReport}
              disabled={generating}
              className="flex items-center gap-2 bg-ng-600 hover:bg-ng-500 text-gray-900 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating Report…</>
              ) : (
                <><FileBarChart2 className="w-4 h-4" />Generate Report</>
              )}
            </button>
            {generated && (
              <>
                <button className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:text-gray-900 px-4 py-3 rounded-xl text-sm transition-all hover:bg-gray-100">
                  <Eye className="w-4 h-4" />Preview
                </button>
                <button className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:text-gray-900 px-4 py-3 rounded-xl text-sm transition-all hover:bg-gray-100">
                  <Download className="w-4 h-4" />Download PDF
                </button>
                <button className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:text-gray-900 px-4 py-3 rounded-xl text-sm transition-all hover:bg-gray-100">
                  <Printer className="w-4 h-4" />Print
                </button>
              </>
            )}
          </div>

          {/* Annual summary charts */}
          <div className="grid grid-cols-3 gap-5">
            {/* Bar chart */}
            <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-gray-900 font-semibold mb-1">Monthly Tax Payments — FY 2025</h3>
              <p className="text-gray-500 text-xs mb-5">January through June 2025 (₦ millions)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={10} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#111827' }}
                    formatter={(v: number) => [`₦${v.toFixed(2)}M`, '']}
                  />
                  <Bar dataKey="VAT"  fill="#7c3aed" radius={[3,3,0,0]} />
                  <Bar dataKey="PAYE" fill="#008751" radius={[3,3,0,0]} />
                  <Bar dataKey="WHT"  fill="#ea580c" radius={[3,3,0,0]} />
                  <Bar dataKey="CIT"  fill="#2563eb" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-gray-900 font-semibold mb-1">Tax Liability Split</h3>
              <p className="text-gray-500 text-xs mb-4">H1 2025 — Total: {formatCurrency(TOTAL_TAX)}</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={PIE_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(v: number) => [formatCurrency(v), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {PIE_DATA.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-gray-500">{d.name}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tax savings opportunities */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-semibold">AI-Identified Tax Savings Opportunities</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Total potential savings: <span className="text-ng-400 font-bold">{formatCurrencyFull(SAVINGS_FOUND.reduce((s, d) => s + d.saving, 0))}</span>
                </p>
              </div>
              <span className="text-xs bg-ng-50 text-ng-400 border border-ng-300 px-2.5 py-1 rounded-full">AI Report</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Opportunity', 'Potential Saving', 'Legal Basis', 'Status'].map(h => (
                    <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {SAVINGS_FOUND.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-100/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-gray-900 text-sm font-medium">{row.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-bold ${row.saving > 0 ? 'text-ng-400' : 'text-gray-500'}`}>
                        {row.saving > 0 ? formatCurrencyFull(row.saving) : 'Monitor'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 text-xs font-mono">{row.legalBasis}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${saveColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent reports */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-gray-900 font-semibold">Generated Reports Archive</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { name: 'May 2025 VAT Return (Form 002)',      date: '22 Jun 2025', size: '284 KB', status: 'submitted' },
                { name: 'May 2025 Monthly Tax Summary',        date: '01 Jun 2025', size: '156 KB', status: 'ready' },
                { name: 'Q1 2025 Tax Savings Analysis Report', date: '15 Apr 2025', size: '520 KB', status: 'ready' },
                { name: 'FY 2024 CIT Return Computation',      date: '28 Mar 2025', size: '1.2 MB', status: 'filed' },
                { name: 'FY 2024 Audit Evidence Package',      date: '28 Mar 2025', size: '8.4 MB', status: 'filed' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-100/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-gray-900 text-sm">{r.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{r.date} • {r.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${
                      r.status === 'submitted' || r.status === 'filed'
                        ? 'bg-ng-50 text-ng-400 border-ng-300'
                        : 'bg-gray-100 text-gray-500 border-gray-300'
                    }`}>
                      {r.status === 'submitted' ? '✓ Submitted to FIRS' : r.status === 'filed' ? '✓ Filed' : 'Ready'}
                    </span>
                    <button className="text-gray-500 hover:text-gray-900 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
