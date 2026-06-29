import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    template: '%s | TaxPadi',
    default:  'TaxPadi — Nigeria\'s Smartest AI Tax Platform',
  },
  description:
    'AI-powered tax compliance for Nigerian businesses. Upload documents, calculate CIT/VAT/PAYE/WHT, track FIRS deadlines, and get expert advice. Always current with Finance Act 2024.',
  keywords: [
    'Nigeria tax', 'FIRS', 'VAT Nigeria', 'company income tax Nigeria',
    'PAYE calculator Nigeria', 'withholding tax Nigeria', 'Finance Act 2024',
    'tax compliance Nigeria', 'SME tax Nigeria', 'TaxPadi',
  ],
  authors: [{ name: 'TaxPadi' }],
  creator: 'TaxPadi',
  openGraph: {
    type:        'website',
    siteName:    'TaxPadi',
    title:       'TaxPadi — Nigeria\'s Smartest AI Tax Platform',
    description: 'AI-powered Nigerian tax compliance. Upload docs, calculate taxes, never miss a FIRS deadline.',
    locale:      'en_NG',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'TaxPadi — Nigeria\'s Smartest AI Tax Platform',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#008751',
  width:      'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
