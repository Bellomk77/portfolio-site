import type { BusinessSize, CITResult, VATResult, PAYEResult, WHTResult, CGTResult } from '@/types'
import {
  CIT_RATES,
  COMPANY_SIZE_THRESHOLDS,
  VAT_RATE,
  EDUCATION_TAX_RATE,
  CGT_RATE,
  PAYE_BANDS,
  PAYE_RELIEFS,
  WHT_RATES,
} from './nigerian-tax-data'

export function getBusinessSize(annualTurnover: number): BusinessSize {
  if (annualTurnover <= COMPANY_SIZE_THRESHOLDS.small)  return 'small'
  if (annualTurnover <= COMPANY_SIZE_THRESHOLDS.medium) return 'medium'
  return 'large'
}

// ─── Company Income Tax ────────────────────────────────────────────────────

export function calculateCIT(params: {
  annualTurnover: number
  assessableProfit: number
  previousYearLoss?: number
  capitalAllowances?: number
  investmentAllowance?: number
}): CITResult {
  const {
    annualTurnover,
    assessableProfit,
    previousYearLoss    = 0,
    capitalAllowances   = 0,
    investmentAllowance = 0,
  } = params

  const businessSize = getBusinessSize(annualTurnover)
  const citRate      = CIT_RATES[businessSize]

  const totalRelief  = previousYearLoss + capitalAllowances + investmentAllowance
  const taxableProfit = Math.max(0, assessableProfit - totalRelief)
  const citAmount    = taxableProfit * citRate
  const educationTax = Math.max(0, assessableProfit) * EDUCATION_TAX_RATE
  const totalTax     = citAmount + educationTax

  return {
    businessSize,
    citRate,
    assessableProfit,
    previousYearLoss,
    capitalAllowances,
    taxableProfit,
    citAmount,
    educationTax,
    totalTax,
    effectiveRate: assessableProfit > 0 ? totalTax / assessableProfit : 0,
    breakdown: [
      { label: 'Gross Assessable Profit',           amount: assessableProfit },
      { label: 'Less: Prior Year Losses',           amount: previousYearLoss,    isDeduction: true },
      { label: 'Less: Capital Allowances',          amount: capitalAllowances,   isDeduction: true },
      { label: 'Less: Investment Allowances',       amount: investmentAllowance, isDeduction: true },
      { label: 'Taxable Profit',                    amount: taxableProfit },
      { label: `Company Income Tax (${(citRate * 100).toFixed(0)}%)`, amount: citAmount },
      { label: 'Education Tax (2.5%)',              amount: educationTax },
      { label: 'Total Tax Liability',               amount: totalTax },
    ],
  }
}

// ─── Value Added Tax ───────────────────────────────────────────────────────

export function calculateVAT(params: {
  taxableSales: number
  taxableInputPurchases: number
  vatExemptSales?: number
  bfwdVATCredit?: number
}): VATResult {
  const {
    taxableSales,
    taxableInputPurchases,
    vatExemptSales = 0,
    bfwdVATCredit  = 0,
  } = params

  const outputVAT    = taxableSales * VAT_RATE
  const inputVAT     = taxableInputPurchases * VAT_RATE
  const totalInputs  = inputVAT + bfwdVATCredit
  const netVATPayable = Math.max(0, outputVAT - totalInputs)
  const vatCredit    = totalInputs > outputVAT ? totalInputs - outputVAT : 0

  return {
    vatRate: VAT_RATE,
    taxableSales,
    taxableInputs: taxableInputPurchases,
    vatExemptSales,
    outputVAT,
    inputVAT,
    netVATPayable,
    vatCredit,
    breakdown: [
      { label: 'Taxable Sales (excl. VAT)',          amount: taxableSales },
      { label: 'Output VAT @ 7.5%',                  amount: outputVAT },
      { label: 'Taxable Input Purchases (excl. VAT)', amount: taxableInputPurchases },
      { label: 'Input VAT @ 7.5%',                   amount: inputVAT, isDeduction: true },
      ...(bfwdVATCredit > 0 ? [{ label: 'B/Fwd VAT Credit', amount: bfwdVATCredit, isDeduction: true }] : []),
      { label: netVATPayable > 0 ? 'Net VAT Payable to FIRS' : 'VAT Credit C/Forward', amount: netVATPayable || vatCredit },
    ],
  }
}

// ─── PAYE (Pay As You Earn) ────────────────────────────────────────────────

export function calculatePAYE(params: {
  grossSalary: number
  pensionContributor?: boolean
  nhfContributor?: boolean
  nhisContributor?: boolean
  lifeAssurancePremium?: number
  dependentRelatives?: number
}): PAYEResult {
  const {
    grossSalary,
    pensionContributor   = true,
    nhfContributor       = false,
    nhisContributor      = false,
    lifeAssurancePremium = 0,
    dependentRelatives   = 0,
  } = params

  const pensionDeduction = pensionContributor ? grossSalary * PAYE_RELIEFS.PENSION_EMPLOYEE_RATE : 0
  const nhfDeduction     = nhfContributor     ? grossSalary * PAYE_RELIEFS.NHF_RATE : 0
  const nhisDeduction    = nhisContributor    ? grossSalary * PAYE_RELIEFS.NHIS_RATE : 0

  const grossAfterDeductions = grossSalary - pensionDeduction - nhfDeduction - nhisDeduction - lifeAssurancePremium

  // Consolidated Relief Allowance = higher of ₦200K or 1% of gross + 20% of gross
  const craPercentage = grossAfterDeductions * PAYE_RELIEFS.CRA_PERCENTAGE
  const craMinimum    = PAYE_RELIEFS.CRA_MINIMUM + (grossAfterDeductions * 0.01)
  const cra           = Math.max(craPercentage + (grossAfterDeductions * 0.01), craMinimum)

  const dependentRelief  = Math.min(dependentRelatives * PAYE_RELIEFS.DEPENDENT_RELATIVE, PAYE_RELIEFS.MAX_DEPENDENT_RELIEF)
  const chargeableIncome = Math.max(0, grossAfterDeductions - cra - dependentRelief)

  // Progressive tax calculation
  let annualTax = 0
  const taxBrackets: { label: string; taxableAmount: number; taxAmount: number }[] = []
  let remaining = chargeableIncome

  for (const band of PAYE_BANDS) {
    if (remaining <= 0) break
    const sliceSize   = band.to === Infinity ? remaining : Math.min(remaining, band.to - band.from)
    const taxInSlice  = sliceSize * band.rate
    annualTax        += taxInSlice
    if (sliceSize > 0) {
      taxBrackets.push({
        label:         `₦${formatNum(band.from)} – ${band.to === Infinity ? 'Above' : '₦' + formatNum(band.to)} @ ${(band.rate * 100).toFixed(0)}%`,
        taxableAmount: sliceSize,
        taxAmount:     taxInSlice,
      })
    }
    remaining -= sliceSize
  }

  const monthlyTax       = annualTax / 12
  const netAnnualIncome  = grossSalary - annualTax - pensionDeduction - nhfDeduction - nhisDeduction
  const netMonthlyIncome = netAnnualIncome / 12

  return {
    grossSalary,
    pensionDeduction,
    nhfDeduction,
    nhisDeduction,
    lifeAssurancePremium,
    grossIncomeAfterDeductions: grossAfterDeductions,
    cra,
    dependentRelief,
    chargeableIncome,
    annualTax,
    monthlyTax,
    effectiveRate: grossSalary > 0 ? annualTax / grossSalary : 0,
    netAnnualIncome,
    netMonthlyIncome,
    taxBrackets,
    breakdown: [
      { label: 'Gross Annual Salary',                   amount: grossSalary },
      { label: 'Less: Pension Contribution (8%)',       amount: pensionDeduction,      isDeduction: true },
      { label: 'Less: NHF Contribution (2.5%)',         amount: nhfDeduction,          isDeduction: true },
      { label: 'Less: NHIS Contribution (2.5%)',        amount: nhisDeduction,         isDeduction: true },
      { label: 'Less: Life Assurance Premium',          amount: lifeAssurancePremium,  isDeduction: true },
      { label: 'Gross Income (for CRA calculation)',    amount: grossAfterDeductions },
      { label: 'Less: Consolidated Relief Allowance',  amount: cra,                   isDeduction: true },
      { label: 'Less: Dependent Relative Relief',      amount: dependentRelief,       isDeduction: true },
      { label: 'Chargeable Income',                    amount: chargeableIncome },
      { label: 'Annual PAYE Tax',                      amount: annualTax },
      { label: 'Monthly PAYE Deduction',               amount: monthlyTax },
      { label: 'Net Monthly Take-Home',                amount: netMonthlyIncome },
    ],
  }
}

// ─── Withholding Tax ───────────────────────────────────────────────────────

export function calculateWHT(amount: number, transactionTypeKey: string): WHTResult {
  const txType  = WHT_RATES[transactionTypeKey] || WHT_RATES['consultancy']
  const whtAmount = amount * txType.rate

  return {
    grossAmount:     amount,
    whtRate:         txType.rate,
    whtAmount,
    netAmount:       amount - whtAmount,
    transactionType: txType.description,
  }
}

// ─── Capital Gains Tax ─────────────────────────────────────────────────────

export function calculateCGT(params: {
  proceedsOfDisposal:  number
  costOfAcquisition:   number
  incidentalCosts:     number
  improvementCosts?:   number
  allowableInflation?: number
}): CGTResult {
  const {
    proceedsOfDisposal,
    costOfAcquisition,
    incidentalCosts,
    improvementCosts   = 0,
    allowableInflation = 0,
  } = params

  const adjustedCost = costOfAcquisition + incidentalCosts + improvementCosts + allowableInflation
  const capitalGain  = Math.max(0, proceedsOfDisposal - adjustedCost)
  const cgtAmount    = capitalGain * CGT_RATE

  return {
    proceedsOfDisposal,
    costOfAcquisition,
    incidentalCosts,
    improvementCosts,
    adjustedCost,
    capitalGain,
    cgtRate: CGT_RATE,
    cgtAmount,
    effectiveRate: proceedsOfDisposal > 0 ? cgtAmount / proceedsOfDisposal : 0,
  }
}

// ─── Tax Health Score ──────────────────────────────────────────────────────

export function calculateHealthScore(params: {
  vatFilingStreak:        number   // months of on-time VAT filing (0–12)
  payeFilingStreak:       number   // months of on-time PAYE filing (0–12)
  whtFilingStreak:        number   // months of on-time WHT filing (0–12)
  citFiledOnTime:         boolean
  hasOutstandingDebt:     boolean
  documentationCompleteness: number // 0–100
  missedOpportunities:    number   // count of un-claimed reliefs
}): { overall: number; grade: string; status: string; compliance: number; documentation: number; optimization: number } {
  const {
    vatFilingStreak,
    payeFilingStreak,
    whtFilingStreak,
    citFiledOnTime,
    hasOutstandingDebt,
    documentationCompleteness,
    missedOpportunities,
  } = params

  const complianceScore = Math.min(100,
    (vatFilingStreak  / 12) * 35 +
    (payeFilingStreak / 12) * 30 +
    (whtFilingStreak  / 12) * 20 +
    (citFiledOnTime ? 15 : 0)
  )

  const debtPenalty       = hasOutstandingDebt ? 15 : 0
  const docScore          = documentationCompleteness
  const optimizationScore = Math.max(0, 100 - missedOpportunities * 20)

  const overall = Math.max(0, Math.min(100, Math.round(
    complianceScore * 0.50 +
    docScore        * 0.25 +
    optimizationScore * 0.25 -
    debtPenalty
  )))

  return {
    overall,
    compliance:    Math.round(complianceScore),
    documentation: Math.round(docScore),
    optimization:  Math.round(optimizationScore),
    grade:  overall >= 90 ? 'A' : overall >= 80 ? 'B' : overall >= 70 ? 'C' : overall >= 60 ? 'D' : 'F',
    status: overall >= 85 ? 'Excellent' : overall >= 70 ? 'Good' : overall >= 55 ? 'Fair' : 'Needs Attention',
  }
}

// ─── Penalty Calculator ────────────────────────────────────────────────────

export function calculateFIRSPenalty(params: {
  taxAmount:  number
  daysLate:   number
  taxType:    'CIT' | 'VAT' | 'PAYE' | 'WHT'
}): { basePenalty: number; interestCharge: number; total: number; breakdown: string[] } {
  const { taxAmount, daysLate, taxType } = params
  const breakdown: string[] = []

  let basePenalty = 0
  let interestRate = 0

  if (taxType === 'CIT') {
    basePenalty  = taxAmount * 0.10
    interestRate = 0.05  // 5% per month or part thereof
    breakdown.push('Base penalty: 10% of tax due')
    breakdown.push('Monthly interest: 5% per month or part thereof')
  } else if (taxType === 'VAT') {
    basePenalty  = Math.max(taxAmount * 0.05, 5_000)
    interestRate = 0.025
    breakdown.push('Base penalty: 5% of tax due (min ₦5,000)')
    breakdown.push('Monthly interest: 2.5% per month')
  } else {
    basePenalty  = taxAmount * 0.10
    interestRate = 0.05
    breakdown.push('Base penalty: 10% of tax due')
    breakdown.push('Monthly interest: 5% per month or part thereof')
  }

  const monthsLate    = Math.ceil(daysLate / 30)
  const interestCharge = taxAmount * interestRate * monthsLate
  breakdown.push(`${monthsLate} month(s) late → interest = ₦${interestCharge.toLocaleString()}`)

  return { basePenalty, interestCharge, total: basePenalty + interestCharge, breakdown }
}

// ─── Tax Savings Opportunities ─────────────────────────────────────────────

export function findTaxSavings(params: {
  annualTurnover:       number
  assessableProfit:     number
  capitalExpenditures?: number
  exportRevenue?:       number
  rndSpend?:            number
  employeeCount?:       number
  isInPioneerIndustry?: boolean
  hasPreviousLoss?:     boolean
  lossCarriedForward?:  number
}) {
  const opportunities = []

  if ((params.capitalExpenditures || 0) > 0) {
    const cap   = params.capitalExpenditures!
    const saving = cap * 0.50 * CIT_RATES[getBusinessSize(params.annualTurnover)]
    opportunities.push({
      type:         'Capital Allowances',
      potentialSaving: saving,
      description:  `Claim 50% initial + 25% annual allowance on ₦${(cap / 1_000_000).toFixed(1)}M capex`,
      legalBasis:   'Third Schedule, CITA',
      effort:       'low' as const,
    })
  }

  if ((params.exportRevenue || 0) > 0) {
    const saving = params.exportRevenue! * 0.20 * 0.20
    opportunities.push({
      type:         'Export Profits Tax Credit',
      potentialSaving: saving,
      description:  '20% tax credit on profits attributable to export sales',
      legalBasis:   'CITA S.26 – Export Incentive',
      effort:       'medium' as const,
    })
  }

  if ((params.rndSpend || 0) > 0) {
    const saving = params.rndSpend! * CIT_RATES[getBusinessSize(params.annualTurnover)]
    opportunities.push({
      type:         'R&D Expenditure Deduction',
      potentialSaving: saving,
      description:  'Full deduction of qualifying research & development expenses',
      legalBasis:   'CITA S.24',
      effort:       'medium' as const,
    })
  }

  if (params.isInPioneerIndustry) {
    const saving = params.assessableProfit * CIT_RATES[getBusinessSize(params.annualTurnover)]
    opportunities.push({
      type:         'Pioneer Status Tax Holiday',
      potentialSaving: saving,
      description:  '3–5 year CIT holiday for qualifying pioneer industries',
      legalBasis:   'Industrial Development (Income Tax Relief) Act',
      effort:       'high' as const,
    })
  }

  if ((params.lossCarriedForward || 0) > 0) {
    const saving = Math.min(params.lossCarriedForward!, params.assessableProfit) * CIT_RATES[getBusinessSize(params.annualTurnover)]
    opportunities.push({
      type:         'Loss Relief (Carry Forward)',
      potentialSaving: saving,
      description:  `Offset ₦${(params.lossCarriedForward! / 1_000_000).toFixed(1)}M of prior losses against current profit`,
      legalBasis:   'CITA S.27 – Carry-Forward of Losses',
      effort:       'low' as const,
    })
  }

  return opportunities
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatNum(n: number): string {
  return n.toLocaleString('en-NG')
}
