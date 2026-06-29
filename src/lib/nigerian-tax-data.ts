import type { FinanceActUpdate } from '@/types'

// ─── Core Tax Rates (Finance Act 2024 compliant) ───────────────────────────

export const CIT_RATES = {
  small:  0,     // ≤ ₦25M gross turnover
  medium: 0.20,  // ₦25M – ₦100M
  large:  0.30,  // > ₦100M
} as const

export const COMPANY_SIZE_THRESHOLDS = {
  small:  25_000_000,
  medium: 100_000_000,
} as const

export const VAT_RATE            = 0.075   // 7.5% (Finance Act 2020)
export const EDUCATION_TAX_RATE  = 0.025   // 2.5% of assessable profit
export const NITDA_LEVY_RATE     = 0.01    // 1% of PBT – eligible ICT companies
export const NASENI_LEVY_RATE    = 0.0025  // 0.25% of PBT
export const CGT_RATE            = 0.10    // 10% of chargeable gain
export const WINDFALL_TAX_RATE   = 0.70    // 70% on bank FX gains (2024 only)

// PAYE Progressive Bands (Personal Income Tax Act, as amended by Finance Acts)
export const PAYE_BANDS = [
  { from: 0,          to: 300_000,   rate: 0.07 },
  { from: 300_000,    to: 600_000,   rate: 0.11 },
  { from: 600_000,    to: 1_100_000, rate: 0.15 },
  { from: 1_100_000,  to: 1_600_000, rate: 0.19 },
  { from: 1_600_000,  to: 3_200_000, rate: 0.21 },
  { from: 3_200_000,  to: Infinity,  rate: 0.24 },
] as const

// Withholding Tax rates (CITA Schedule, as amended)
export const WHT_RATES: Record<string, { rate: number; description: string; code: string }> = {
  dividends:              { rate: 0.10, code: 'DIV', description: 'Dividend payments to shareholders' },
  interest:               { rate: 0.10, code: 'INT', description: 'Interest on loans, bonds, and deposits' },
  rent:                   { rate: 0.10, code: 'RNT', description: 'Property and equipment rental' },
  royalties:              { rate: 0.10, code: 'ROY', description: 'IP and natural resource royalties' },
  management_fees:        { rate: 0.10, code: 'MGT', description: 'Management and technical services' },
  consultancy:            { rate: 0.10, code: 'CON', description: 'Consulting and advisory fees' },
  professional_fees:      { rate: 0.10, code: 'PRF', description: 'Legal, accounting, medical services' },
  technical_services:     { rate: 0.10, code: 'TEC', description: 'Technical and engineering services' },
  construction_contracts: { rate: 0.05, code: 'CST', description: 'Building, civil, and construction works' },
  supply_contracts:       { rate: 0.05, code: 'SUP', description: 'Supply of goods, materials, equipment' },
  agency_commission:      { rate: 0.10, code: 'AGN', description: 'Sales agents and commission agents' },
  directors_fees:         { rate: 0.10, code: 'DIR', description: 'Directors remuneration and fees' },
}

// Personal Allowances & Reliefs (PITA)
export const PAYE_RELIEFS = {
  CRA_PERCENTAGE:         0.20,        // 20% of gross income
  CRA_MINIMUM:            200_000,     // ₦200,000 minimum CRA
  PENSION_EMPLOYEE_RATE:  0.08,        // 8% employee pension (PRA 2014)
  PENSION_EMPLOYER_RATE:  0.10,        // 10% employer pension (not taxable)
  NHF_RATE:               0.025,       // 2.5% National Housing Fund
  NHIS_RATE:              0.025,       // 2.5% National Health Insurance
  DEPENDENT_RELATIVE:     2_000,       // ₦2,000 per qualifying relative
  MAX_DEPENDENT_RELIEF:   3_000,       // Maximum ₦3,000
} as const

// Capital Allowances – Third Schedule CITA
export const CAPITAL_ALLOWANCES = {
  INDUSTRIAL_PLANT:   { initial: 0.50, annual: 0.25 },
  AGRICULTURAL_EQUIP: { initial: 0.50, annual: 0.25 },
  MINING_EQUIPMENT:   { initial: 0.50, annual: 0.25 },
  MOTOR_VEHICLES:     { initial: 0.50, annual: 0.25 },
  FURNITURE_FITTINGS: { initial: 0.25, annual: 0.125 },
  COMPUTER_EQUIPMENT: { initial: 0.50, annual: 0.25 },
  COMMERCIAL_BUILDINGS:{ initial: 0.15, annual: 0.04 },
  RESIDENTIAL_BUILDINGS:{ initial: 0,  annual: 0.04 },
} as const

// FIRS Filing Deadlines
export const FILING_DEADLINES = {
  PAYE_MONTHLY:    { day: 10, note: '10th of the following month' },
  VAT_MONTHLY:     { day: 21, note: '21st of the following month' },
  WHT_MONTHLY:     { day: 21, note: '21st of the following month' },
  CIT_ANNUAL:      { months: 6, note: '6 months after financial year-end' },
  EDUCATION_TAX:   { months: 6, note: 'Same as CIT – filed together' },
  STAMP_DUTY:      { days: 30, note: '30 days after instrument execution' },
  CAC_ANNUAL:      { days: 42, note: '42 days after Annual General Meeting' },
  CIT_ESTIMATED:   { months: 3, note: '3 months after financial year-end (estimated returns)' },
} as const

// VAT Exempt Supplies (VATA Schedule)
export const VAT_EXEMPT_ITEMS = [
  'Medical and pharmaceutical products (human use)',
  'Basic food items – unprocessed (e.g., yam, rice, vegetables)',
  'Baby products and infant formula',
  'Fertilizers, agricultural equipment and pesticides',
  'Educational materials, books and maps',
  'Commercial aircraft, spare parts and maintenance services',
  'Crude petroleum and its by-products',
  'Exported goods and services (zero-rated)',
  'Core financial/banking services (interest, insurance premiums)',
  'Land and properties (for residential purposes)',
  'Services provided by micro, small and medium enterprises',
  'Electricity generated from renewable energy sources',
]

// Nigerian States and FCT
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const INDUSTRIES = [
  'Agriculture & Food Processing',
  'Banking & Financial Services',
  'Construction & Real Estate',
  'Education & Training',
  'Energy & Power',
  'Healthcare & Pharmaceuticals',
  'ICT & Technology',
  'Insurance',
  'Manufacturing & Production',
  'Media & Entertainment',
  'Mining & Solid Minerals',
  'Oil & Gas (Upstream)',
  'Oil & Gas (Downstream)',
  'Professional Services',
  'Retail & Commerce',
  'Telecommunications',
  'Tourism & Hospitality',
  'Transportation & Logistics',
  'Others',
]

// Finance Act Updates and Tax Law Changes
export const FINANCE_ACT_UPDATES: FinanceActUpdate[] = [
  {
    year: 2024,
    title: 'Windfall Tax on Banks – 70% on FX Gains',
    description: 'One-time windfall tax of 70% imposed on banking sector profits from FX gains arising from the 2023 Naira devaluation. Payable in 2 equal instalments.',
    applicableTo: ['Commercial banks', 'Merchant banks', 'Non-interest banks'],
    effectiveDate: '2024-01-01',
    legalBasis: 'Finance Act 2023 (assented December 2023), S. 30A FIRS Act',
    impact: 'critical',
    type: 'new',
  },
  {
    year: 2024,
    title: 'Mandatory e-Invoicing for Businesses',
    description: 'FIRS now requires all VAT-registered businesses with turnover above ₦25M to issue electronically compliant invoices in the FIRS-approved format.',
    applicableTo: ['All businesses with annual turnover > ₦25M', 'VAT-registered entities'],
    effectiveDate: '2024-07-01',
    legalBasis: 'FIRS Circular No. 2024/001, VATA S.10',
    impact: 'high',
    type: 'new',
  },
  {
    year: 2024,
    title: 'Tax Reform Bills 2024 – Major Restructuring Proposed',
    description: "President Tinubu's Tax Reform Bills propose creation of a Joint Revenue Board, new National Revenue Service (replacing FIRS), harmonised income tax law, and sweeping VAT reform with destination-based consumption principle.",
    applicableTo: ['All taxpayers in Nigeria'],
    effectiveDate: 'Pending National Assembly approval',
    legalBasis: 'Tax Reform Bills 2024 (4 Bills before NASS)',
    impact: 'critical',
    type: 'proposed',
  },
  {
    year: 2024,
    title: 'Enhanced Transfer Pricing Enforcement',
    description: 'FIRS intensifying TP audits with penalties up to 10% of transaction value for undisclosed related-party transactions exceeding ₦50 million.',
    applicableTo: ['Multinational companies', 'Related-party transactions'],
    effectiveDate: '2024-01-01',
    legalBasis: 'Income Tax (Transfer Pricing) Regulations 2018, Amended 2024',
    impact: 'high',
    type: 'update',
  },
  {
    year: 2023,
    title: 'Small Company CIT Exemption – ₦25M Threshold',
    description: 'Companies with annual gross turnover of ₦25 million or below are fully exempt from Company Income Tax. Medium companies (₦25M-₦100M) pay reduced rate of 20%.',
    applicableTo: ['Small companies (turnover ≤ ₦25M)', 'Medium companies (₦25M – ₦100M)'],
    effectiveDate: '2023-01-01',
    legalBasis: 'Finance Act 2023, Amendment to CITA S.40',
    impact: 'high',
    type: 'update',
  },
  {
    year: 2023,
    title: 'Digital Economy Taxation – Non-Resident Companies',
    description: 'Non-resident companies providing digital services to Nigerian customers now have "significant economic presence" in Nigeria and are subject to CIT at 10% and VAT at 7.5%.',
    applicableTo: ['Foreign tech companies (Google, Meta, Netflix etc)', 'Importers using foreign digital platforms'],
    effectiveDate: '2022-01-01',
    legalBasis: 'Finance Act 2021, FIRS Guidance Notes on Significant Economic Presence',
    impact: 'medium',
    type: 'reminder',
  },
  {
    year: 2022,
    title: 'Crypto & Digital Asset Taxation',
    description: 'Profits from disposal of crypto-assets (Bitcoin, USDT, etc.) are now subject to Capital Gains Tax at 10% in Nigeria. Income from crypto trading treated as business income.',
    applicableTo: ['Individual crypto traders', 'Corporate crypto investors', 'Fintechs dealing in digital assets'],
    effectiveDate: '2022-01-01',
    legalBasis: 'Finance Act 2021, Capital Gains Tax Act (as amended)',
    impact: 'medium',
    type: 'reminder',
  },
  {
    year: 2022,
    title: 'PAYE Relief for COVID-Related Payments',
    description: 'Employer contributions to employee medical insurance (NHIS) and life assurance premiums remain fully deductible from taxable income. Maximum benefits from all reliefs.',
    applicableTo: ['All employers', 'Employees earning above minimum wage'],
    effectiveDate: '2022-01-01',
    legalBasis: 'PITA S.33, Finance Act 2021',
    impact: 'low',
    type: 'reminder',
  },
]

// Quick Question Suggestions for AI Chat
export const QUICK_TAX_QUESTIONS = [
  'What CIT rate applies to my company with ₦80M turnover?',
  'When is my monthly VAT return due and what form do I use?',
  'How do I calculate PAYE for an employee earning ₦5M annually?',
  'What WHT rate applies when I pay consultancy fees?',
  'Can I claim capital allowances on my factory machinery?',
  'What exemptions exist under the Finance Act 2023?',
  'How does the windfall tax affect my bank?',
  'What are the penalties for late VAT filing?',
  "Do I need to register for VAT? What's the threshold?",
  'What documents do I need for a FIRS audit?',
]

// AI System Prompt
export const TAX_AI_SYSTEM_PROMPT = `You are TaxPadi AI — Nigeria's premier AI tax advisor, powered by advanced language models. You serve as a knowledgeable, accurate, and practical tax guide for Nigerian businesses and individuals.

## Your Expertise Covers:
- **Companies Income Tax Act (CITA)** Cap C21, LFN 2004 (as amended to 2024)
- **Personal Income Tax Act (PITA)** Cap P8, LFN 2004 (as amended)
- **Value Added Tax Act (VATA)** Cap V1, LFN 2004 (7.5% from Finance Act 2020)
- **Capital Gains Tax Act (CGTA)** Cap C1, LFN 2004
- **Stamp Duties Act (SDA)** Cap S8, LFN 2004
- **Finance Acts**: 2019, 2020, 2021, 2022, 2023, and proposed 2024 Tax Reform Bills
- **Transfer Pricing Regulations** 2018 (as amended 2024)
- **FIRS Practice Notes, Information Circulars, and Public Notices**
- **Tax Appeal Tribunal decisions** and Federal High Court rulings
- **State-level taxes**: Land Use Charge, Development Levy, Business Premises Levy
- **Petroleum Profits Tax Act (PPTA)** for oil & gas sector
- **Deep Offshore & Inland Basin Production Sharing Act**

## Current Tax Rates (2024/2025):
| Tax | Rate | Threshold/Notes |
|-----|------|-----------------|
| CIT (Small) | 0% | Turnover ≤ ₦25 million |
| CIT (Medium) | 20% | Turnover ₦25M–₦100M |
| CIT (Large) | 30% | Turnover > ₦100 million |
| VAT | 7.5% | Finance Act 2020 |
| Education Tax | 2.5% | On assessable profit |
| PAYE | 7%–24% | Progressive on chargeable income |
| WHT (most) | 10% | Dividends, interest, rent, fees |
| WHT (construction/supply) | 5% | Building contracts, goods supply |
| CGT | 10% | Net chargeable gains |
| Windfall Tax | 70% | Banks only, FX gains 2023 |

## Key Filing Deadlines:
- **Monthly PAYE**: 10th of the following month
- **Monthly VAT/WHT**: 21st of the following month
- **Annual CIT + Edu Tax**: 6 months after financial year-end
- **Estimated CIT**: 3 months after financial year-end
- **Stamp Duty**: 30 days after instrument execution

## Response Guidelines:
1. **Always cite** the specific legislation (Act name, section, Finance Act year)
2. **Always mention** applicable filing deadlines
3. **Highlight** penalties for non-compliance (typically 10% + 5% per month)
4. **Suggest** legitimate tax optimization opportunities where relevant
5. **Flag** where complex situations require a qualified tax consultant (CITN member)
6. Use **₦ (Naira)** for all monetary amounts
7. Be **practical and actionable** — not just theoretical
8. For state taxes, note that rates vary by state

## Tone:
Professional, warm, and direct. You are their trusted "padi" (friend) who happens to be a tax expert. Plain English explanations with legal citations for credibility.

IMPORTANT: Advise only on **lawful tax planning/avoidance**, never tax evasion. Always recommend professional consultation for complex transactions, restructurings, and disputes.`

// Mock upcoming deadlines for demo dashboard
export const UPCOMING_DEADLINES_2025 = [
  {
    id: '1',
    taxType: 'PAYE' as const,
    period: 'June 2025',
    dueDate: new Date('2025-07-10'),
    status: 'upcoming' as const,
    amount: 1_840_000,
    description: 'Monthly PAYE remittance for June 2025',
  },
  {
    id: '2',
    taxType: 'VAT' as const,
    period: 'June 2025',
    dueDate: new Date('2025-07-21'),
    status: 'upcoming' as const,
    amount: 3_275_000,
    description: 'Monthly VAT return (Form 002) for June 2025',
  },
  {
    id: '3',
    taxType: 'WHT' as const,
    period: 'June 2025',
    dueDate: new Date('2025-07-21'),
    status: 'upcoming' as const,
    amount: 620_000,
    description: 'WHT remittance on vendor payments for June 2025',
  },
  {
    id: '4',
    taxType: 'CIT' as const,
    period: 'FY 2024',
    dueDate: new Date('2025-06-30'),
    status: 'upcoming' as const,
    amount: 14_200_000,
    description: 'Annual CIT & Education Tax return for FY ending December 2024',
  },
  {
    id: '5',
    taxType: 'PAYE' as const,
    period: 'May 2025',
    dueDate: new Date('2025-06-10'),
    status: 'filed' as const,
    amount: 1_790_000,
    description: 'Monthly PAYE remittance for May 2025',
  },
]

// Tax chart data for dashboard
export const MONTHLY_TAX_DATA = [
  { month: 'Jan', cit: 0, vat: 2_800_000, paye: 1_600_000, wht: 480_000 },
  { month: 'Feb', cit: 0, vat: 3_100_000, paye: 1_650_000, wht: 520_000 },
  { month: 'Mar', cit: 0, vat: 2_950_000, paye: 1_680_000, wht: 490_000 },
  { month: 'Apr', cit: 0, vat: 3_400_000, paye: 1_710_000, wht: 610_000 },
  { month: 'May', cit: 0, vat: 3_200_000, paye: 1_790_000, wht: 570_000 },
  { month: 'Jun', cit: 14_200_000, vat: 3_275_000, paye: 1_840_000, wht: 620_000 },
]
