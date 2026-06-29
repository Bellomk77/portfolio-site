'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calculator, Upload, MessageSquare,
  CheckSquare, FileBarChart2, Settings, HelpCircle,
  ChevronRight, Bell, Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',   label: 'Dashboard',         icon: LayoutDashboard },
  { href: '/upload',      label: 'Upload Documents',  icon: Upload },
  { href: '/calculator',  label: 'Tax Calculator',    icon: Calculator },
  { href: '/chat',        label: 'AI Tax Advisor',    icon: MessageSquare, badge: 'AI' },
  { href: '/compliance',  label: 'Compliance Tracker',icon: CheckSquare },
  { href: '/reports',     label: 'Reports & Filing',  icon: FileBarChart2 },
]

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help',     label: 'Help & Docs', icon: HelpCircle },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-ng-600 rounded-xl flex items-center justify-center shadow-lg shadow-ng-600/30 group-hover:bg-ng-500 transition-colors">
            <span className="text-gray-900 font-black text-sm tracking-tighter">TP</span>
          </div>
          <div>
            <div className="text-gray-900 font-bold text-lg leading-none">TaxPadi</div>
            <div className="text-gray-500 text-xs">AI Tax Platform</div>
          </div>
        </Link>
      </div>

      {/* Business selector */}
      <div className="px-4 py-3 border-b border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100/50 text-left group">
          <div className="w-7 h-7 bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-900 truncate font-medium">Zenith Holdings Ltd</div>
            <div className="text-xs text-gray-500">TIN: 20456789-0001</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-500" />
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Main Menu</p>
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-ng-600/15 text-ng-400 border border-ng-300/60'
                  : 'text-gray-500 hover:bg-gray-100/60 hover:text-gray-900'
              )}
            >
              <Icon className={cn('w-4.5 h-4.5 flex-shrink-0', active ? 'text-ng-400' : 'text-gray-500 group-hover:text-gray-700')} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-xs bg-ng-600/30 text-ng-400 border border-ng-300 px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              {active && <div className="w-1.5 h-1.5 rounded-full bg-ng-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Alert strip */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Bell className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-orange-300 text-xs font-semibold">Deadline Alert</div>
              <div className="text-orange-400/80 text-xs mt-0.5">PAYE due in <span className="font-bold text-orange-300">11 days</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="px-3 py-3 border-t border-gray-200 space-y-0.5">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100/60"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ng-600 to-ng-800 flex items-center justify-center text-gray-900 text-sm font-bold">
            Z
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-900 truncate font-medium">Zainab Aliyu</div>
            <div className="text-xs text-gray-500 truncate">Finance Director</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
