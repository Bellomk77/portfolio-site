'use client'
import { useState, useCallback } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { Calculator, ChevronRight, Info, Download, Copy, CheckCircle, AlertTriangle } from 'lucide-react'
import { calculateCIT, calculateVAT, calculatePAYE, calculateWHT, calculateCGT, getBusinessSize } from '@/lib/tax-calculations'
import { WHT_RATES, VAT_EXEMPT_ITEMS } from '@/lib/nigerian-tax-data'
import { formatCurrency, formatCurrencyFull, cn } from '@/lib/utils'

const TABS = ['CIT', 'VAT', 'PAYE', 'WHT', 'CGT'] as const
type Tab = typeof TABS[number]

function InputField({ label, value, onChange, prefix = '₦', hint }: {
  label: string; value: string; onChange: (v: string) => void; prefix?: string; hint?: string
}) {
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1.5 font-medium">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
          className="w-full bg-gray-100 border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-ng-600 focus:ring-1 focus:ring-ng-600/50 transition-all"
          placeholder="0"
        />
      </div>
      {hint && <p className="text-gray-600 text-xs mt-1">{hint}</p>}
    </div>
  )
}

function Toggle({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        className={cn('w-10 h-5 rounded-full relative transition-all mt-0.5 flex-shrink-0', checked ? 'bg-ng-600' : 'bg-gray-200')}
        onClick={() => onChange(!checked)}
      >
        <div className={cn('w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all', checked ? 'left-5.5 left-[22px]' : 'left-0.5')} />
      </div>
      <div>
        <div className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{label}</div>
        {description && <div className="text-xs text-gray-600 mt-0.5">{description}</div>}
      </div>
    </label>
  )
}

function ResultRow({ label, amount, isTotal, isDeduction, indent }: { label: string; amount: number; isTotal?: boolean; isDeduction?: boolean; indent?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between py-2.5', isTotal ? 'border-t border-gray-300 mt-1 pt-3.5' : 'border-b border-gray-200', indent && 'pl-3')}>
      <span className={cn('text-sm', isTotal ? 'text-gray-900 font-bold' : isDeduction ? 'text-red-400' : 'text-gray-700')}>
        {isDeduction && '– '}{label}
      </span>
      <span className={cn('text-sm font-semibold', isTotal ? 'text-gray-900 text-base' : isDeduction ? 'text-red-400' : 'text-gray-900')}>
        {formatCurrencyFull(Math.abs(amount))}
      </span>
    </div>
  )
}

function CITCalculator() {
  const [turnover, setTurnover]         = useState('')
  const [profit, setProfit]             = useState('')
  const [priorLoss, setPriorLoss]       = useState('')
  const [capAllowance, setCapAllowance] = useState('')
  const [investmentAllow, setInvestmentAllow] = useState('')

  const v = (s: string) => parseFloat(s) || 0

  const result = v(profit) > 0
    ? calculateCIT({
        annualTurnover:     v(turnover),
        assessableProfit:   v(profit),
        previousYearLoss:   v(priorLoss),
        capitalAllowances:  v(capAllowance),
        investmentAllowance:v(investmentAllow),
      })
    : null

  const size = v(turnover) > 0 ? getBusinessSize(v(turnover)) : null

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-blue-950/30 border border-blue-300/50 rounded-xl p-4 text-sm text-blue-300">
          <strong>CIT Rates 2024:</strong> 0% (turnover ≤₦25M) · 20% (₦25M–₦100M) · 30% (&gt;₦100M)
          <br /><span className="text-blue-400/70 text-xs mt-1 block">Education Tax: 2.5% added on assessable profit (all sizes)</span>
        </div>

        {size && (
          <div className={cn('rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2',
            size === 'small'  ? 'bg-ng-50 text-ng-400 border border-ng-300' :
            size === 'medium' ? 'bg-yellow-50 text-yellow-400 border border-yellow-300' :
            'bg-red-50 text-red-400 border border-red-300'
          )}>
            <CheckCircle className="w-4 h-4" />
            {size === 'small'  ? 'Small company — CIT exempt! (Turnover ≤₦25M)' :
             size === 'medium' ? 'Medium company — 20% CIT rate applies' :
             'Large company — 30% CIT rate applies'}
          </div>
        )}

        <InputField label="Annual Gross Turnover (₦)" value={turnover} onChange={setTurnover} hint="Used to determine company size and CIT rate" />
        <InputField label="Assessable Profit (₦)" value={profit} onChange={setProfit} hint="Revenue minus allowable deductions before tax reliefs" />
        <InputField label="Prior Year Losses Carried Forward (₦)" value={priorLoss} onChange={setPriorLoss} hint="s.27 CITA — losses can be carried forward indefinitely" />
        <InputField label="Capital Allowances (₦)" value={capAllowance} onChange={setCapAllowance} hint="Third Schedule CITA — initial + annual allowances" />
        <InputField label="Investment Allowances (₦)" value={investmentAllow} onChange={setInvestmentAllow} hint="Additional relief for qualifying investments" />
      </div>

      <div className="bg-gray-50/60 rounded-2xl border border-gray-200 p-6">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-ng-400" />
          CIT Calculation Breakdown
        </h3>
        {result ? (
          <>
            <div className="space-y-0">
              {result.breakdown.map((row, i) => (
                <ResultRow key={i} label={row.label} amount={row.amount} isDeduction={row.isDeduction} isTotal={i === result.breakdown.length - 1} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-100/60 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">Effective Rate</div>
                <div className="text-gray-900 font-bold text-xl mt-0.5">{(result.effectiveRate * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-gray-100/60 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">Filing Deadline</div>
                <div className="text-gray-900 font-bold text-sm mt-0.5">6 months after FYE</div>
              </div>
            </div>
            <div className="mt-3 bg-ng-50 border border-ng-300/50 rounded-xl p-3 text-xs text-ng-300">
              <strong>Note:</strong> Also remember Education Tax ({formatCurrencyFull(result.educationTax)}) is filed on the same form (ETF Form) with your CIT return.
            </div>
          </>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-gray-600 text-sm gap-2">
            <Calculator className="w-10 h-10 text-gray-700" />
            Enter your figures to see the breakdown
          </div>
        )}
      </div>
    </div>
  )
}

function VATCalculator() {
  const [sales, setSales]       = useState('')
  const [inputs, setInputs]     = useState('')
  const [exemptSales, setExemptSales] = useState('')
  const [creditBfwd, setCreditBfwd]   = useState('')

  const v = (s: string) => parseFloat(s) || 0

  const result = v(sales) > 0
    ? calculateVAT({ taxableSales: v(sales), taxableInputPurchases: v(inputs), vatExemptSales: v(exemptSales), bfwdVATCredit: v(creditBfwd) })
    : null

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-purple-950/30 border border-purple-300/50 rounded-xl p-4 text-sm text-purple-300">
          <strong>VAT Rate: 7.5%</strong> (Finance Act 2020) • Monthly return due <strong>21st of following month</strong>
          <br /><span className="text-purple-400/70 text-xs mt-1 block">Use Form 002. Late filing: ₦5,000 penalty + 5% of tax due per month.</span>
        </div>
        <InputField label="Taxable Sales (excl. VAT) (₦)" value={sales} onChange={setSales} hint="All VAT-able goods and services supplied" />
        <InputField label="Taxable Input Purchases (excl. VAT) (₦)" value={inputs} onChange={setInputs} hint="Purchases of goods/services with VAT you can recover" />
        <InputField label="VAT-Exempt Sales (₦)" value={exemptSales} onChange={setExemptSales} hint="Sales not subject to VAT (basic foods, medicines, etc.)" />
        <InputField label="VAT Credit Brought Forward (₦)" value={creditBfwd} onChange={setCreditBfwd} hint="Excess input VAT from previous month" />

        <div className="bg-gray-50/60 rounded-xl border border-gray-200 p-4">
          <div className="text-gray-500 text-xs font-medium mb-2">Common VAT-Exempt Items (VATA Schedule)</div>
          <div className="flex flex-wrap gap-1.5">
            {VAT_EXEMPT_ITEMS.slice(0, 6).map(item => (
              <span key={item} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50/60 rounded-2xl border border-gray-200 p-6">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-purple-400" />
          VAT Return Breakdown
        </h3>
        {result ? (
          <>
            <div className="space-y-0">
              {result.breakdown.map((row, i) => (
                <ResultRow key={i} label={row.label} amount={row.amount} isDeduction={row.isDeduction} isTotal={i === result.breakdown.length - 1} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-100/60 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">Net VAT Payable</div>
                <div className={cn('font-bold text-xl mt-0.5', result.netVATPayable > 0 ? 'text-red-400' : 'text-ng-400')}>
                  {formatCurrencyFull(result.netVATPayable || result.vatCredit)}
                </div>
              </div>
              <div className="bg-gray-100/60 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">Return Due</div>
                <div className="text-gray-900 font-bold text-sm mt-0.5">21st of next month</div>
              </div>
            </div>
            {result.vatCredit > 0 && (
              <div className="mt-3 bg-ng-50 border border-ng-300/50 rounded-xl p-3 text-xs text-ng-300">
                <strong>VAT Credit:</strong> You have excess input VAT of {formatCurrencyFull(result.vatCredit)} to carry forward to next month.
              </div>
            )}
          </>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-gray-600 text-sm gap-2">
            <Calculator className="w-10 h-10 text-gray-700" />
            Enter your sales and purchase figures
          </div>
        )}
      </div>
    </div>
  )
}

function PAYECalculator() {
  const [salary, setSalary]       = useState('')
  const [pension, setPension]     = useState(true)
  const [nhf, setNhf]             = useState(false)
  const [nhis, setNhis]           = useState(false)
  const [lifeAssurance, setLifeAssurance] = useState('')
  const [dependents, setDependents] = useState('0')

  const v = (s: string) => parseFloat(s) || 0

  const result = v(salary) > 0
    ? calculatePAYE({ grossSalary: v(salary), pensionContributor: pension, nhfContributor: nhf, nhisContributor: nhis, lifeAssurancePremium: v(lifeAssurance), dependentRelatives: parseInt(dependents) || 0 })
    : null

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-ng-950/30 border border-ng-300/50 rounded-xl p-4 text-sm text-ng-300">
          <strong>PAYE Due:</strong> 10th of the following month • Progressive rates: 7% → 24%
          <br /><span className="text-ng-400/70 text-xs mt-1 block">All allowances below are exempt from PAYE under PITA S.33.</span>
        </div>
        <InputField label="Gross Annual Salary (₦)" value={salary} onChange={setSalary} hint="Before any deductions or tax" />
        <div className="space-y-3 bg-gray-100/50 border border-gray-200 rounded-xl p-4">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Exempt Allowances & Deductions</div>
          <Toggle label="Pension (8% employee contribution)" checked={pension} onChange={setPension} description="Pension Reform Act 2014 — exempt from PAYE" />
          <Toggle label="NHF Contribution (2.5%)" checked={nhf} onChange={setNhf} description="National Housing Fund — exempt from PAYE" />
          <Toggle label="NHIS Contribution (2.5%)" checked={nhis} onChange={setNhis} description="National Health Insurance Scheme — exempt" />
        </div>
        <InputField label="Life Assurance Premium (₦/yr)" value={lifeAssurance} onChange={setLifeAssurance} hint="Full premium is tax-exempt under PITA" />
        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">Dependent Relatives</label>
          <input type="number" min="0" max="5" value={dependents} onChange={e => setDependents(e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-ng-600" placeholder="0" />
          <p className="text-gray-600 text-xs mt-1">₦2,000 relief per dependent (max ₦3,000)</p>
        </div>
      </div>

      <div className="bg-gray-50/60 rounded-2xl border border-gray-200 p-6">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-ng-400" />
          PAYE Breakdown
        </h3>
        {result ? (
          <div className="space-y-0">
            {result.breakdown.map((row, i) => (
              <ResultRow key={i} label={row.label} amount={row.amount} isDeduction={row.isDeduction} isTotal={row.label === 'Net Monthly Take-Home' || row.label === 'Annual PAYE Tax'} />
            ))}
            <div className="mt-4 bg-gray-100/60 rounded-xl p-3">
              <div className="text-gray-500 text-xs font-semibold mb-2">Progressive Tax Bands Applied</div>
              {result.taxBrackets.map((b, i) => (
                <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-300/50 last:border-0">
                  <span className="text-gray-500">{b.label}</span>
                  <span className="text-gray-900 font-medium">{formatCurrencyFull(b.taxAmount)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-red-50 border border-red-300/40 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">Effective Rate</div>
                <div className="text-red-400 font-bold text-lg">{(result.effectiveRate * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-ng-50 border border-ng-300/40 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">Net Monthly Pay</div>
                <div className="text-ng-400 font-bold text-sm">{formatCurrencyFull(result.netMonthlyIncome)}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-gray-600 text-sm gap-2">
            <Calculator className="w-10 h-10 text-gray-700" />
            Enter gross annual salary to calculate PAYE
          </div>
        )}
      </div>
    </div>
  )
}

function WHTCalculator() {
  const [amount, setAmount]   = useState('')
  const [txType, setTxType]   = useState('dividends')

  const v = (s: string) => parseFloat(s) || 0
  const whtKey = txType
  const selectedTx = WHT_RATES[whtKey]
  const result = v(amount) > 0 ? calculateWHT(v(amount), whtKey) : null

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-orange-950/30 border border-orange-300/50 rounded-xl p-4 text-sm text-orange-300">
          <strong>WHT Due:</strong> 21st of the following month • WHT certificate issued to payee
          <br /><span className="text-orange-400/70 text-xs mt-1 block">WHT is deducted at source and remitted to FIRS within 21 days.</span>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">Transaction Type</label>
          <select
            value={txType}
            onChange={e => setTxType(e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-ng-600"
          >
            {Object.entries(WHT_RATES).map(([key, val]) => (
              <option key={key} value={key}>{val.description} ({(val.rate * 100).toFixed(0)}%)</option>
            ))}
          </select>
          {selectedTx && (
            <p className="text-orange-400/70 text-xs mt-1">Rate: {(selectedTx.rate * 100).toFixed(0)}% • Code: {selectedTx.code}</p>
          )}
        </div>

        <InputField label="Gross Payment Amount (₦)" value={amount} onChange={setAmount} hint="The full amount before WHT deduction" />

        <div className="bg-gray-100/50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 space-y-1.5">
          <div className="font-semibold text-gray-700 mb-2">How WHT Works:</div>
          <div>1. You (the payer) deduct WHT from the payment</div>
          <div>2. You remit the WHT to FIRS by the 21st</div>
          <div>3. You issue a WHT credit note to the payee</div>
          <div>4. The payee uses the credit note to offset their tax liability</div>
        </div>
      </div>

      <div className="bg-gray-50/60 rounded-2xl border border-gray-200 p-6">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-orange-400" />
          WHT Calculation
        </h3>
        {result ? (
          <div className="space-y-0">
            <ResultRow label="Gross Payment Amount"           amount={result.grossAmount} />
            <ResultRow label={`WHT @ ${(result.whtRate * 100).toFixed(0)}%`} amount={result.whtAmount} isDeduction />
            <ResultRow label="Net Amount to Payee"           amount={result.netAmount} isTotal />
            <div className="mt-4 space-y-3">
              <div className="bg-gray-100/60 rounded-xl p-4">
                <div className="text-gray-500 text-xs font-semibold mb-2">What you need to do:</div>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-ng-500 flex-shrink-0 mt-0.5" />Pay {formatCurrencyFull(result.netAmount)} to {result.transactionType.toLowerCase()}</div>
                  <div className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-ng-500 flex-shrink-0 mt-0.5" />Remit {formatCurrencyFull(result.whtAmount)} to FIRS by 21st</div>
                  <div className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-ng-500 flex-shrink-0 mt-0.5" />Issue WHT credit note/certificate to payee</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-300/40 rounded-xl p-3 text-xs text-blue-300">
                The payee can offset this {formatCurrencyFull(result.whtAmount)} WHT against their annual tax liability or CIT/PIT assessment.
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-gray-600 text-sm gap-2">
            <Calculator className="w-10 h-10 text-gray-700" />
            Select transaction type and enter amount
          </div>
        )}
      </div>
    </div>
  )
}

function CGTCalculator() {
  const [proceeds, setProceeds]         = useState('')
  const [cost, setCost]                 = useState('')
  const [incidental, setIncidental]     = useState('')
  const [improvement, setImprovement]   = useState('')

  const v = (s: string) => parseFloat(s) || 0
  const result = v(proceeds) > 0
    ? calculateCGT({ proceedsOfDisposal: v(proceeds), costOfAcquisition: v(cost), incidentalCosts: v(incidental), improvementCosts: v(improvement) })
    : null

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-red-950/30 border border-red-300/50 rounded-xl p-4 text-sm text-red-300">
          <strong>CGT Rate: 10%</strong> of net chargeable gain • Due on disposal of chargeable assets
          <br /><span className="text-red-400/70 text-xs mt-1 block">CGT applies to land, buildings, stocks, bonds, crypto, business assets.</span>
        </div>
        <InputField label="Proceeds of Disposal (₦)" value={proceeds} onChange={setProceeds} hint="Sale price or fair market value at disposal date" />
        <InputField label="Original Cost of Acquisition (₦)" value={cost} onChange={setCost} hint="Purchase price + acquisition costs (legal fees, stamp duty)" />
        <InputField label="Incidental Disposal Costs (₦)" value={incidental} onChange={setIncidental} hint="Agent fees, legal costs, advertising costs of sale" />
        <InputField label="Improvement Costs (₦)" value={improvement} onChange={setImprovement} hint="Capital improvements added during ownership (not repairs)" />
        <div className="bg-gray-100/50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
          <strong className="text-gray-700">CGT Exemptions:</strong>
          <ul className="mt-1.5 space-y-1 list-disc list-inside">
            <li>Principal private residence (one per person)</li>
            <li>Gains below ₦10,000 (de minimis)</li>
            <li>Government bonds and securities</li>
            <li>Life assurance policy proceeds</li>
            <li>Decorations and certain personal effects</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50/60 rounded-2xl border border-gray-200 p-6">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-red-400" />
          CGT Calculation
        </h3>
        {result ? (
          <div className="space-y-0">
            <ResultRow label="Proceeds of Disposal"      amount={result.proceedsOfDisposal} />
            <ResultRow label="Less: Cost of Acquisition" amount={result.costOfAcquisition}  isDeduction />
            <ResultRow label="Less: Incidental Costs"    amount={result.incidentalCosts}    isDeduction />
            <ResultRow label="Less: Improvement Costs"   amount={result.improvementCosts}   isDeduction />
            <ResultRow label="Net Chargeable Gain"       amount={result.capitalGain}        isTotal />
            <ResultRow label="CGT @ 10%"                 amount={result.cgtAmount}          isTotal />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-100/60 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">Effective Rate on Proceeds</div>
                <div className="text-red-400 font-bold text-lg mt-0.5">{(result.effectiveRate * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-gray-100/60 rounded-xl p-3 text-center">
                <div className="text-gray-500 text-xs">CGT Payable</div>
                <div className="text-gray-900 font-bold text-sm mt-0.5">{formatCurrencyFull(result.cgtAmount)}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-gray-600 text-sm gap-2">
            <Calculator className="w-10 h-10 text-gray-700" />
            Enter disposal and cost figures
          </div>
        )}
      </div>
    </div>
  )
}

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<Tab>('CIT')

  const tabDescriptions: Record<Tab, string> = {
    CIT:  'Company Income Tax — annual tax on corporate profits (CITA)',
    VAT:  'Value Added Tax @ 7.5% — monthly return (Form 002)',
    PAYE: 'Pay As You Earn — monthly employee tax deduction (PITA)',
    WHT:  'Withholding Tax — deducted at source on specified payments',
    CGT:  'Capital Gains Tax @ 10% — on disposal of chargeable assets',
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Tax Calculator</h1>
          <p className="text-gray-500 text-sm">Finance Act 2024 compliant • All Nigerian federal taxes</p>
        </header>

        <div className="p-8">
          {/* Tab navigation */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-200 mb-6 w-fit">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-5 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab
                    ? 'bg-ng-600 text-gray-900 shadow-md shadow-ng-600/30'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-sm mb-6 bg-gray-50/40 border border-gray-200 rounded-xl px-4 py-3">
            <strong className="text-gray-900">{activeTab}</strong> — {tabDescriptions[activeTab]}
          </p>

          <div className="bg-gray-50/20 rounded-2xl border border-gray-200 p-6">
            {activeTab === 'CIT'  && <CITCalculator />}
            {activeTab === 'VAT'  && <VATCalculator />}
            {activeTab === 'PAYE' && <PAYECalculator />}
            {activeTab === 'WHT'  && <WHTCalculator />}
            {activeTab === 'CGT'  && <CGTCalculator />}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 flex items-start gap-3 bg-gray-100/50 border border-gray-200 rounded-xl px-5 py-4 text-xs text-gray-500">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            This calculator provides estimates based on current Nigerian tax law. Results are for guidance only. Always consult a qualified tax professional (CITN member) for complex situations and filing advice.
          </div>
        </div>
      </main>
    </div>
  )
}
