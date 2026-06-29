export type BusinessSize = 'small' | 'medium' | 'large'
export type BusinessType = 'sole_trader' | 'partnership' | 'private_limited' | 'public_limited' | 'ngo'
export type TaxType = 'CIT' | 'VAT' | 'PAYE' | 'WHT' | 'CGT' | 'EDUCATION' | 'STAMP_DUTY' | 'NITDA' | 'NASENI' | 'WINDFALL'
export type FilingStatus = 'filed' | 'pending' | 'overdue' | 'upcoming'
export type DocumentType = 'invoice' | 'receipt' | 'bank_statement' | 'payroll' | 'financial_statement' | 'contract' | 'other'
export type MessageRole = 'user' | 'assistant'

export interface TaxRate {
  type: TaxType
  rate: number
  description: string
  legalBasis: string
  effectiveDate: string
}

export interface FilingDeadline {
  id: string
  taxType: TaxType
  period: string
  dueDate: Date
  status: FilingStatus
  amount?: number
  penalty?: number
  description: string
}

export interface TaxBreakdownItem {
  label: string
  amount: number
  rate?: number
  isDeduction?: boolean
}

export interface TaxRelief {
  name: string
  amount: number
  legalBasis: string
}

export interface CITResult {
  businessSize: BusinessSize
  citRate: number
  assessableProfit: number
  previousYearLoss: number
  capitalAllowances: number
  taxableProfit: number
  citAmount: number
  educationTax: number
  totalTax: number
  effectiveRate: number
  breakdown: TaxBreakdownItem[]
}

export interface VATResult {
  vatRate: number
  taxableSales: number
  taxableInputs: number
  vatExemptSales: number
  outputVAT: number
  inputVAT: number
  netVATPayable: number
  vatCredit: number
  breakdown: TaxBreakdownItem[]
}

export interface PAYEResult {
  grossSalary: number
  pensionDeduction: number
  nhfDeduction: number
  nhisDeduction: number
  lifeAssurancePremium: number
  grossIncomeAfterDeductions: number
  cra: number
  dependentRelief: number
  chargeableIncome: number
  annualTax: number
  monthlyTax: number
  effectiveRate: number
  netAnnualIncome: number
  netMonthlyIncome: number
  taxBrackets: { label: string; taxableAmount: number; taxAmount: number }[]
  breakdown: TaxBreakdownItem[]
}

export interface WHTResult {
  grossAmount: number
  whtRate: number
  whtAmount: number
  netAmount: number
  transactionType: string
}

export interface CGTResult {
  proceedsOfDisposal: number
  costOfAcquisition: number
  incidentalCosts: number
  improvementCosts: number
  adjustedCost: number
  capitalGain: number
  cgtRate: number
  cgtAmount: number
  effectiveRate: number
}

export interface HealthScore {
  overall: number
  compliance: number
  documentation: number
  optimization: number
  grade: string
  status: string
}

export interface BusinessProfile {
  name: string
  tin?: string
  type: BusinessType
  size: BusinessSize
  annualTurnover: number
  employees: number
  industry: string
  stateOfOperation: string
  vatRegistered: boolean
  financialYearEnd: string
}

export interface Document {
  id: string
  name: string
  type: DocumentType
  size: number
  uploadDate: Date
  status: 'uploading' | 'processing' | 'analyzed' | 'error'
  extractedData?: ExtractedDocumentData
  aiSummary?: string
  taxImplications?: string[]
}

export interface ExtractedDocumentData {
  totalAmount?: number
  vatAmount?: number
  whtAmount?: number
  date?: string
  vendor?: string
  description?: string
  category?: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  sources?: string[]
}

export interface TaxSavingsOpportunity {
  type: string
  potentialSaving: number
  description: string
  legalBasis: string
  effort: 'low' | 'medium' | 'high'
}

export interface FinanceActUpdate {
  year: number
  title: string
  description: string
  applicableTo: string[]
  effectiveDate: string
  legalBasis: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  type: 'new' | 'update' | 'proposed' | 'reminder'
}
