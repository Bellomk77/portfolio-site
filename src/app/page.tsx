'use client'
import Link from 'next/link'
import {
  Brain, Shield, Calculator, Upload, Clock, CheckCircle,
  ArrowRight, TrendingUp, AlertCircle, FileText, Zap,
  Building2, Star, ChevronRight, BarChart3, Lock,
  Globe, Phone, Mail, Menu, X,
} from 'lucide-react'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '#features',    label: 'Features' },
  { href: '#calculator',  label: 'Calculator' },
  { href: '#updates',     label: 'Tax Updates' },
  { href: '#pricing',     label: 'Pricing' },
]

const FEATURES = [
  {
    icon: Upload,
    title: 'AI Document Intelligence',
    description: 'Upload invoices, bank statements, payslips, contracts — our AI extracts and maps every figure to the correct tax head in seconds. No manual data entry.',
    color: 'bg-ng-950/80 text-ng-400 border-ng-300',
    tags: ['PDF', 'Excel', 'Images', 'Bank Statements'],
  },
  {
    icon: Calculator,
    title: 'All Nigerian Taxes, One Place',
    description: 'Precise calculations for CIT, VAT, PAYE, WHT, CGT, Education Tax, NITDA Levy, and more — always reflecting the latest Finance Act rates.',
    color: 'bg-blue-950/80 text-blue-400 border-blue-300',
    tags: ['CIT', 'VAT 7.5%', 'PAYE', 'WHT', 'CGT'],
  },
  {
    icon: Brain,
    title: 'AI Tax Advisor — 24/7',
    description: 'Ask anything about Nigerian tax law. Get instant answers citing CITA, PITA, VATA, Finance Acts, and FIRS circulars — like having a CITN-qualified advisor on call.',
    color: 'bg-purple-950/80 text-purple-400 border-purple-300',
    tags: ['FIRS Circulars', 'Finance Act', 'CITA', 'PITA'],
  },
  {
    icon: Clock,
    title: 'Smart FIRS Deadline Engine',
    description: 'Never miss a filing date. Intelligent calendar tracks all FIRS deadlines with reminders 30, 7, and 1 day out. Calculates penalties before they hit.',
    color: 'bg-orange-950/80 text-orange-400 border-orange-300',
    tags: ['Auto-reminders', 'Penalty Preview', 'Multi-entity'],
  },
  {
    icon: Shield,
    title: 'Audit-Ready Documentation',
    description: 'Every transaction stored with a full, timestamped audit trail. Generate FIRS-compliant evidence packages at the click of a button.',
    color: 'bg-red-950/80 text-red-400 border-red-300',
    tags: ['Audit Trail', 'FIRS Forms', 'Evidence Bundle'],
  },
  {
    icon: TrendingUp,
    title: 'Tax Optimisation Engine',
    description: 'AI scans your data for missed capital allowances, unclaimed reliefs, loss carry-forwards, export incentives, and pioneer status opportunities.',
    color: 'bg-yellow-950/80 text-yellow-400 border-yellow-300',
    tags: ['Capital Allowances', 'Pioneer Status', 'Loss Relief'],
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Upload Your Documents',
    description: 'Drag-and-drop invoices, bank statements, payroll records, or financial statements. Any format — PDF, Excel, or images. Our AI handles the rest.',
    icon: Upload,
  },
  {
    num: '02',
    title: 'AI Analyses & Calculates',
    description: 'TaxPadi extracts data, categorises transactions, applies correct rates from the Finance Act, flags compliance issues, and spots missed savings.',
    icon: Brain,
  },
  {
    num: '03',
    title: 'File, Save & Sleep Well',
    description: 'Review your AI-prepared returns, implement savings, and export FIRS-compliant documents. Full filing history and audit trail stored securely.',
    icon: CheckCircle,
  },
]

const TAX_UPDATES = [
  { type: 'critical', label: '2024', title: 'Windfall Tax — 70% on bank FX profits (Finance Act 2023)', date: 'Effective Jan 2024' },
  { type: 'new',      label: 'NEW',  title: 'Mandatory e-Invoicing for businesses over ₦25M turnover', date: 'FIRS Circular 2024' },
  { type: 'alert',    label: 'BILL', title: 'Tax Reform Bills 2024: New National Revenue Service proposed', date: 'Pending NASS approval' },
  { type: 'update',   label: 'SME',  title: 'Small company CIT exemption — threshold raised to ₦25M gross turnover', date: 'Finance Act 2023' },
  { type: 'update',   label: 'TP',   title: 'Transfer pricing penalties now up to 10% of transaction value', date: 'TP Regs 2024' },
  { type: 'update',   label: 'CGT',  title: 'Crypto and digital asset gains subject to 10% Capital Gains Tax', date: 'Finance Act 2021' },
]

const LAWS = [
  'Finance Act 2024 (assented)',
  'Tax Reform Bills 2024',
  'Finance Act 2023',
  'Companies Income Tax Act (CITA)',
  'Personal Income Tax Act (PITA)',
  'Value Added Tax Act (VATA)',
  'Capital Gains Tax Act (CGTA)',
  'Transfer Pricing Regulations 2024',
  'FIRS Practice Notes 2024',
  'Petroleum Profits Tax Act (PPTA)',
]

const PRICING = [
  {
    name: 'Starter',
    priceNGN: '15,000',
    usd: '$10',
    desc: 'Perfect for sole traders and micro-businesses.',
    featured: false,
    features: [
      '100 document uploads/month',
      'CIT, VAT & PAYE calculators',
      'FIRS deadline reminders',
      'Basic AI tax advisor (50 queries/month)',
      'Email support',
    ],
  },
  {
    name: 'Business',
    priceNGN: '45,000',
    usd: '$30',
    desc: 'For growing SMEs managing complex obligations.',
    featured: true,
    features: [
      'Unlimited document uploads',
      'All 9 tax types (CIT, VAT, PAYE, WHT, CGT…)',
      'Unlimited AI advisor queries',
      'Full audit trail & FIRS-ready reports',
      'Tax optimisation engine',
      'Multi-entity management (up to 3)',
      'Priority support (24hr SLA)',
    ],
  },
  {
    name: 'Enterprise',
    priceNGN: '120,000',
    usd: '$80',
    desc: 'For large corporations with advanced needs.',
    featured: false,
    features: [
      'Everything in Business',
      'Dedicated tax specialist',
      'FIRS audit liaison support',
      'ERP/SAGE/QuickBooks integration',
      'Transfer pricing compliance module',
      'Unlimited entities',
      'Custom white-label option',
    ],
  },
]

const TESTIMONIALS = [
  {
    name: 'Chidinma Okafor',
    role: 'CFO, Lagostech Innovations',
    avatar: 'CO',
    quote: "TaxPadi saved us ₦8.4M in missed capital allowances we didn't even know we could claim. The AI is frighteningly good at finding money.",
  },
  {
    name: 'Abdulrahman Musa',
    role: 'Founder, Kano Agro Processing',
    avatar: 'AM',
    quote: 'As a small business owner I used to dread FIRS. Now I upload my documents, TaxPadi does the maths, and I file on time every time. It\'s genuinely a superpower.',
  },
  {
    name: 'Funmilayo Adebayo',
    role: 'Tax Manager, Rivers State Conglomerate',
    avatar: 'FA',
    quote: 'The Finance Act tracker alone is worth the subscription. We always know about new changes before our external consultants tell us.',
  },
]

const typeColor = (type: string) => {
  switch (type) {
    case 'critical': return 'bg-red-950/50 text-red-400 border border-red-300'
    case 'new':      return 'bg-ng-950/50 text-ng-400 border border-ng-300'
    case 'alert':    return 'bg-orange-950/50 text-orange-400 border border-orange-300'
    default:         return 'bg-blue-950/50 text-blue-400 border border-blue-300'
  }
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-ng-600 rounded-lg flex items-center justify-center shadow-lg shadow-ng-600/40">
              <span className="text-gray-900 font-black text-sm">TP</span>
            </div>
            <span className="text-gray-900 font-bold text-lg">TaxPadi</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-500">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="hover:text-gray-900 transition-colors">{l.label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 text-sm px-4 py-2">Login</Link>
            <Link href="/dashboard" className="bg-ng-600 hover:bg-ng-500 text-gray-900 text-sm px-5 py-2 rounded-lg font-medium shadow-lg shadow-ng-600/30 transition-all hover:shadow-ng-500/40">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu */}
          <button className="md:hidden text-gray-500" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4 space-y-3">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block text-gray-700 hover:text-gray-900 py-1.5">{l.label}</a>
            ))}
            <Link href="/dashboard" className="block mt-3 bg-ng-600 text-gray-900 text-center py-3 rounded-xl font-medium">
              Start Free Trial
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-5 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-ng-50/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-ng-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-ng-50 border border-ng-300/60 text-ng-600 px-4 py-1.5 rounded-full text-sm mb-8">
            <Zap className="w-3.5 h-3.5" />
            Finance Act 2024 Compliant • Powered by Claude AI
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Nigeria's Most<br />
            <span className="gradient-text">Intelligent</span> Tax Platform
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop dreading FIRS. TaxPadi's AI handles your business taxes from document upload
            to filing-ready returns — always current with the latest Nigerian tax laws.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-ng-600 hover:bg-ng-500 text-gray-900 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:shadow-xl hover:shadow-ng-600/30"
            >
              Start for Free — No Card Needed <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl text-base transition-all"
            >
              Try Tax Calculator
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
            {[
              { value: '50K+', label: 'Nigerian Businesses', sub: 'and growing' },
              { value: '₦4.2B', label: 'Tax Savings Found', sub: 'for our users' },
              { value: '99.8%', label: 'Filing Accuracy', sub: 'vs manual entry' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-gray-500 text-sm font-medium mt-0.5">{s.label}</div>
                <div className="text-gray-600 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scrolling ticker ─────────────────────────────────── */}
      <div className="py-4 bg-gray-50/40 border-y border-gray-200 overflow-hidden">
        <div className="ticker">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-10 mr-10">
              {['FIRS Compliant', 'Finance Act 2024', 'VAT Returns', 'CIT Filing', 'PAYE Automation',
                'WHT Management', 'CGT Calculator', 'Audit Protection', 'Real-time Updates', 'Multi-entity'].map(item => (
                <div key={item} className="flex items-center gap-2 text-gray-500 whitespace-nowrap">
                  <CheckCircle className="w-3.5 h-3.5 text-ng-600" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything Your Nigerian Business Needs</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              From sole traders to large corporations — TaxPadi handles all federal and state taxes with AI precision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className={`rounded-2xl p-6 bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all group`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map(t => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────── */}
      <section className="py-24 px-5 bg-gray-50/30 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tax Filing in 3 Simple Steps</h2>
            <p className="text-gray-500 text-lg">No accounting degree. No manual entries. TaxPadi does the heavy lifting.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="text-ng-600/40 font-black text-6xl leading-none mb-4 select-none">{s.num}</div>
                <div className="w-11 h-11 bg-ng-600/20 rounded-xl flex items-center justify-center mb-4 border border-ng-300">
                  <s.icon className="w-5 h-5 text-ng-400" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{s.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 -right-4 text-gray-700">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tax Law Updates ───────────────────────────────────── */}
      <section id="updates" className="py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-950/50 border border-orange-300/60 text-orange-400 px-3 py-1.5 rounded-full text-sm mb-6">
                <AlertCircle className="w-3.5 h-3.5" />
                Live Tax Intelligence
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Always Current with Nigerian Tax Law</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Our AI is continuously trained on FIRS circulars, Finance Acts, Tax Appeal Tribunal decisions,
                and Federal High Court rulings. You'll never be blindsided by a rate change.
              </p>

              <div className="space-y-3">
                {TAX_UPDATES.map((u, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${typeColor(u.type)}`}>{u.label}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 text-sm font-medium">{u.title}</div>
                      <div className="text-gray-500 text-xs mt-1">{u.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-ng-500 animate-pulse" />
                <span className="text-gray-500 text-sm">AI Knowledge Base — Last Updated Today</span>
              </div>
              <div className="space-y-2">
                {LAWS.map(law => (
                  <div key={law} className="flex items-center justify-between p-3 bg-gray-100/60 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{law}</span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-ng-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <span className="text-gray-500 text-xs">+ 200+ FIRS Practice Notes and Information Circulars</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-24 px-5 bg-gray-50/30 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Nigerian Businesses</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="text-gray-500 text-sm ml-2">4.9/5 from 2,300+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-ng-600/30 border border-ng-300 rounded-full flex items-center justify-center text-ng-400 text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-gray-900 text-sm font-medium">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500 text-lg">Less than one hour with a tax consultant. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((p, i) => (
              <div key={i} className={`rounded-2xl p-6 relative ${p.featured
                ? 'bg-ng-600 border-2 border-ng-400 shadow-2xl shadow-ng-600/30'
                : 'bg-gray-50 border border-gray-200'}`}>
                {p.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-ng-700 text-xs font-extrabold px-3 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{p.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-extrabold text-gray-900">₦{p.priceNGN}</span>
                  <span className={p.featured ? 'text-ng-200 text-sm' : 'text-gray-500 text-sm'}>/month</span>
                </div>
                <div className={`text-xs mb-3 ${p.featured ? 'text-ng-200' : 'text-gray-500'}`}>≈ {p.usd} USD</div>
                <p className={`text-sm mb-5 ${p.featured ? 'text-ng-100' : 'text-gray-500'}`}>{p.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.featured ? 'text-ng-200' : 'text-ng-500'}`} />
                      <span className={p.featured ? 'text-ng-50' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${p.featured
                    ? 'bg-white text-ng-700 hover:bg-ng-50'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mt-8">
            All plans include 30-day free trial • No credit card required • Prices in Nigerian Naira
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-ng-600 via-ng-700 to-ng-800 rounded-3xl p-12 sm:p-16 border border-ng-300 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ng-600/5 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
                Ready to Simplify Your Nigerian Taxes?
              </h2>
              <p className="text-ng-100 text-lg mb-10 max-w-xl mx-auto">
                Join 50,000+ Nigerian businesses already using TaxPadi to stay FIRS-compliant and discover savings.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 bg-white hover:bg-ng-50 text-ng-700 px-10 py-4 rounded-xl text-lg font-bold transition-all hover:shadow-2xl hover:shadow-ng-600/40"
              >
                Start Your 30-Day Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center justify-center gap-5 mt-8 text-ng-200 text-sm">
                <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-ng-200" />No credit card</div>
                <div className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-ng-200" />Bank-grade security</div>
                <div className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-ng-200" />All Nigerian states</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="py-14 px-5 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-ng-600 rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-black text-sm">TP</span>
                </div>
                <span className="text-gray-900 font-bold">TaxPadi</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Nigeria's most trusted AI-powered tax compliance platform. Built for Nigerian businesses, by people who understand Nigerian taxes.</p>
              <div className="flex gap-3 mt-4">
                <a href="mailto:hello@taxpadi.ng" className="text-gray-600 hover:text-ng-400 transition-colors"><Mail className="w-4 h-4" /></a>
                <a href="tel:+2348000000000" className="text-gray-600 hover:text-ng-400 transition-colors"><Phone className="w-4 h-4" /></a>
              </div>
            </div>

            {[
              {
                title: 'Product',
                links: ['Tax Calculator', 'Document Upload', 'AI Advisor', 'Compliance Tracker', 'Reports & Filing'],
              },
              {
                title: 'Tax Types',
                links: ['Company Income Tax (CIT)', 'Value Added Tax (VAT)', 'PAYE & Payroll', 'Withholding Tax (WHT)', 'Capital Gains Tax (CGT)'],
              },
              {
                title: 'Resources',
                links: ['Tax Calendar 2025', 'Finance Act 2024 Guide', 'FIRS Latest Updates', 'Penalty Calculator', 'Support & Docs'],
              },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-gray-900 text-sm font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><Link href="/dashboard" className="text-gray-500 text-sm hover:text-gray-700 transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© 2025 TaxPadi Technologies Ltd. RC: 1234567. All rights reserved. Not affiliated with FIRS.</p>
            <p>Made with 🇳🇬 for Nigerian businesses</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
