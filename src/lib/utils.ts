import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(2)}B`
  }
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(2)}M`
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦')
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦')
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num)
}

export function parseNaira(value: string): number {
  return parseFloat(value.replace(/[₦,\s]/g, '')) || 0
}

export function getDaysUntil(date: Date | string): number {
  const target = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function getDeadlineUrgency(date: Date | string): 'overdue' | 'urgent' | 'warning' | 'ok' {
  const days = getDaysUntil(date)
  if (days < 0)  return 'overdue'
  if (days <= 3) return 'urgent'
  if (days <= 7) return 'warning'
  return 'ok'
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
}

export function urgencyColors(urgency: ReturnType<typeof getDeadlineUrgency>) {
  switch (urgency) {
    case 'overdue': return { badge: 'bg-red-50 text-red-400 border-red-300',  dot: 'bg-red-500',    text: 'text-red-400' }
    case 'urgent':  return { badge: 'bg-orange-50 text-orange-400 border-orange-300', dot: 'bg-orange-500', text: 'text-orange-400' }
    case 'warning': return { badge: 'bg-yellow-50 text-yellow-400 border-yellow-300', dot: 'bg-yellow-500', text: 'text-yellow-400' }
    case 'ok':      return { badge: 'bg-green-950/60 text-green-400 border-green-800', dot: 'bg-green-500',  text: 'text-green-400' }
  }
}

export function taxTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CIT:        'Company Income Tax',
    VAT:        'Value Added Tax',
    PAYE:       'Pay As You Earn',
    WHT:        'Withholding Tax',
    CGT:        'Capital Gains Tax',
    EDUCATION:  'Education Tax',
    STAMP_DUTY: 'Stamp Duties',
    NITDA:      'NITDA Levy',
    NASENI:     'NASENI Levy',
    WINDFALL:   'Windfall Tax',
  }
  return labels[type] || type
}

export function taxTypeBadge(type: string): string {
  const colors: Record<string, string> = {
    CIT:        'bg-blue-50 text-blue-400 border-blue-300',
    VAT:        'bg-purple-50 text-purple-400 border-purple-300',
    PAYE:       'bg-green-950/60 text-green-400 border-green-800',
    WHT:        'bg-orange-50 text-orange-400 border-orange-300',
    CGT:        'bg-red-50 text-red-400 border-red-300',
    EDUCATION:  'bg-yellow-50 text-yellow-400 border-yellow-300',
    WINDFALL:   'bg-rose-950/60 text-rose-400 border-rose-800',
  }
  return colors[type] || 'bg-gray-50 text-gray-500 border-gray-300'
}

export function healthGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-green-400'
    case 'B': return 'text-blue-400'
    case 'C': return 'text-yellow-400'
    case 'D': return 'text-orange-400'
    default:  return 'text-red-400'
  }
}

export function calculateLatePenalty(taxAmount: number, daysLate: number): number {
  const basePenalty = taxAmount * 0.10
  const monthsLate = Math.ceil(daysLate / 30)
  const additionalPenalty = taxAmount * 0.05 * monthsLate
  return basePenalty + additionalPenalty
}
