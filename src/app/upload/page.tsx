'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Sidebar from '@/components/layout/Sidebar'
import {
  Upload, FileText, FileSpreadsheet, Image, X, CheckCircle,
  AlertCircle, Loader2, Brain, ArrowRight, Eye, Trash2, Download,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

type FileStatus = 'queued' | 'uploading' | 'analyzing' | 'done' | 'error'

interface UploadedFile {
  id: string
  file: File
  status: FileStatus
  progress: number
  result?: AnalysisResult
  error?: string
}

interface AnalysisResult {
  documentType: string
  vendor?: string
  date?: string
  totalAmount?: number
  vatAmount?: number
  whtAmount?: number
  category: string
  taxImplications: TaxImplication[]
  confidence: number
}

interface TaxImplication {
  type:        string
  description: string
  amount?:     number
  action:      string
  severity:    'info' | 'warning' | 'action'
}

function fileIcon(file: File) {
  if (file.type === 'application/pdf')                 return <FileText className="w-5 h-5 text-red-400" />
  if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))
                                                        return <FileSpreadsheet className="w-5 h-5 text-ng-400" />
  if (file.type.startsWith('image/'))                  return <Image className="w-5 h-5 text-blue-400" />
  return <FileText className="w-5 h-5 text-gray-500" />
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const MOCK_RESULTS: AnalysisResult[] = [
  {
    documentType: 'Purchase Invoice',
    vendor:   'Lagos Computer Supplies Ltd',
    date:     '15 Jun 2025',
    totalAmount: 4_250_000,
    vatAmount:   297_500,
    category: 'IT Equipment — Capital Expenditure',
    confidence: 96,
    taxImplications: [
      { type: 'VAT Input', description: 'Recoverable input VAT on purchase', amount: 297_500, action: 'Claim ₦297,500 input VAT on your June VAT return (Form 002)', severity: 'action' },
      { type: 'WHT', description: 'WHT may apply if payment to a company', amount: 212_500, action: 'Deduct 5% WHT (₦212,500) on this supply contract payment', severity: 'warning' },
      { type: 'Capital Allowance', description: 'Computer equipment qualifies for 50% initial + 25% annual allowance', amount: 2_125_000, action: 'Add to capital allowance schedule — potential CIT saving of ₦637,500', severity: 'action' },
    ],
  },
  {
    documentType: 'Bank Statement',
    vendor:   'First Bank of Nigeria — June 2025',
    date:     'June 2025',
    totalAmount: 28_400_000,
    category: 'Revenue — Multiple Receipts',
    confidence: 92,
    taxImplications: [
      { type: 'VAT Output', description: '47 identified revenue transactions, VAT output analysis required', amount: 2_130_000, action: 'Review each receipt — estimated output VAT of ₦2.13M to remit', severity: 'action' },
      { type: 'WHT Credits', description: '3 payments received net of WHT (₦180,000 withheld by clients)', amount: 180_000, action: 'Credit ₦180,000 WHT against your CIT/PAYE liability — obtain WHT certificates', severity: 'info' },
    ],
  },
]

function StatusBadge({ status }: { status: FileStatus }) {
  const config = {
    queued:    { label: 'Queued',    className: 'bg-gray-100 text-gray-500 border-gray-300' },
    uploading: { label: 'Uploading', className: 'bg-blue-50 text-blue-400 border-blue-300' },
    analyzing: { label: 'AI Analysing', className: 'bg-purple-50 text-purple-400 border-purple-300' },
    done:      { label: 'Analysed', className: 'bg-ng-50 text-ng-400 border-ng-300' },
    error:     { label: 'Error',    className: 'bg-red-50 text-red-400 border-red-300' },
  }[status]
  return <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${config.className}`}>{config.label}</span>
}

function ImplicationCard({ impl }: { impl: TaxImplication }) {
  const cfg = {
    action:  { border: 'border-ng-300/60', bg: 'bg-ng-50', icon: <ArrowRight className="w-3.5 h-3.5 text-ng-400" />, text: 'text-ng-300' },
    warning: { border: 'border-orange-300/60', bg: 'bg-orange-50', icon: <AlertCircle className="w-3.5 h-3.5 text-orange-400" />, text: 'text-orange-300' },
    info:    { border: 'border-blue-300/60', bg: 'bg-blue-50', icon: <CheckCircle className="w-3.5 h-3.5 text-blue-400" />, text: 'text-blue-300' },
  }[impl.severity]

  return (
    <div className={`rounded-xl border p-3.5 ${cfg.border} ${cfg.bg}`}>
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex-shrink-0">{cfg.icon}</div>
        <div>
          <div className={`text-xs font-semibold mb-1 ${cfg.text}`}>{impl.type}</div>
          <div className="text-gray-700 text-xs mb-1.5">{impl.description}</div>
          {impl.amount && <div className="text-gray-900 text-sm font-bold mb-1.5">{formatCurrency(impl.amount)}</div>}
          <div className="text-gray-500 text-xs bg-black/20 rounded-lg px-3 py-2 leading-relaxed">
            → {impl.action}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles: UploadedFile[] = accepted.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      status: 'queued' as FileStatus,
      progress: 0,
    }))
    setFiles(prev => [...prev, ...newFiles])
    newFiles.forEach(uf => simulateAnalysis(uf.id))
  }, [])

  function simulateAnalysis(id: string) {
    let prog = 0
    const uploadInterval = setInterval(() => {
      prog += 15
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: Math.min(prog, 60) } : f))
      if (prog >= 60) {
        clearInterval(uploadInterval)
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'analyzing', progress: 70 } : f))
        setTimeout(() => {
          const result = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]
          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done', progress: 100, result } : f))
        }, 2000)
      }
    }, 200)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.csv'],
    },
    maxSize: 50 * 1024 * 1024,
  })

  function removeFile(id: string) {
    setFiles(prev => prev.filter(f => f.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const selectedFile = files.find(f => f.id === selectedId)
  const doneFiles    = files.filter(f => f.status === 'done')
  const totalVAT     = doneFiles.reduce((s, f) => s + (f.result?.vatAmount || 0), 0)

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">AI Document Upload</h1>
          <p className="text-gray-500 text-sm">Upload invoices, bank statements, payroll and financial docs — AI extracts tax data instantly</p>
        </header>

        <div className="p-8 grid grid-cols-3 gap-6">
          {/* Left column: Dropzone + file list */}
          <div className="col-span-1 space-y-5">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                isDragActive
                  ? 'border-ng-500 bg-ng-950/20'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/30'
              )}
            >
              <input {...getInputProps()} />
              <Upload className={cn('w-10 h-10 mx-auto mb-3', isDragActive ? 'text-ng-400' : 'text-gray-600')} />
              <div className="text-gray-900 text-sm font-semibold mb-1">
                {isDragActive ? 'Drop files here…' : 'Drag & Drop Files'}
              </div>
              <div className="text-gray-500 text-xs mb-3">or click to browse</div>
              <div className="flex flex-wrap justify-center gap-1.5 text-xs text-gray-600">
                {['PDF', 'Excel', 'PNG/JPG', 'CSV'].map(t => (
                  <span key={t} className="bg-gray-100 px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <div className="text-gray-700 text-xs mt-2">Max 50 MB per file</div>
            </div>

            {/* Summary stats */}
            {doneFiles.length > 0 && (
              <div className="bg-ng-950/30 border border-ng-300/50 rounded-xl p-4 space-y-2">
                <div className="text-ng-400 text-xs font-semibold mb-2 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" /> AI Analysis Summary
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Documents analysed</span>
                  <span className="text-gray-900 font-semibold">{doneFiles.length}</span>
                </div>
                {totalVAT > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Total VAT identified</span>
                    <span className="text-ng-400 font-semibold">{formatCurrency(totalVAT)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Action items found</span>
                  <span className="text-orange-400 font-semibold">
                    {doneFiles.reduce((s, f) => s + (f.result?.taxImplications.filter(i => i.severity === 'action').length || 0), 0)}
                  </span>
                </div>
              </div>
            )}

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Uploaded Files</div>
                {files.map(uf => (
                  <div
                    key={uf.id}
                    onClick={() => uf.status === 'done' && setSelectedId(uf.id === selectedId ? null : uf.id)}
                    className={cn(
                      'bg-gray-50 border rounded-xl p-3.5 transition-all',
                      uf.status === 'done' ? 'cursor-pointer hover:border-gray-400' : 'cursor-default',
                      selectedId === uf.id ? 'border-ng-700 bg-ng-950/20' : 'border-gray-200'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-0.5 flex-shrink-0">{fileIcon(uf.file)}</div>
                        <div className="min-w-0">
                          <div className="text-sm text-gray-900 truncate font-medium">{uf.file.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{formatFileSize(uf.file.size)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <StatusBadge status={uf.status} />
                        <button onClick={e => { e.stopPropagation(); removeFile(uf.id) }} className="text-gray-600 hover:text-red-400 transition-colors p-0.5">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {(uf.status === 'uploading' || uf.status === 'analyzing') && (
                      <div className="mt-2.5">
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${uf.progress}%` }} />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {uf.status === 'analyzing' ? <span className="text-purple-400 flex items-center gap-1"><Brain className="w-3 h-3" />AI extracting tax data…</span> : `Uploading ${uf.progress}%`}
                        </div>
                      </div>
                    )}
                    {uf.status === 'done' && uf.result && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                        <span>{uf.result.documentType}</span>
                        <span className="text-ng-500 flex items-center gap-1"><Eye className="w-3 h-3" />Click to review</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column: AI Analysis results */}
          <div className="col-span-2">
            {selectedFile?.result ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                {/* Document header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/20 border border-purple-300/50 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{selectedFile.result.documentType}</div>
                      <div className="text-gray-500 text-xs">{selectedFile.file.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-ng-50 text-ng-400 border border-ng-300 px-2.5 py-1 rounded-full">
                      {selectedFile.result.confidence}% confidence
                    </span>
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all border border-gray-300">
                      <Download className="w-3.5 h-3.5" />Export
                    </button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-6">
                  {/* Extracted data */}
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-4 text-sm">Extracted Document Data</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Document Type',   value: selectedFile.result.documentType },
                        { label: 'Vendor / Source', value: selectedFile.result.vendor || '—' },
                        { label: 'Date',            value: selectedFile.result.date || '—' },
                        { label: 'Category',        value: selectedFile.result.category },
                        { label: 'Total Amount',    value: selectedFile.result.totalAmount ? formatCurrency(selectedFile.result.totalAmount) : '—' },
                        { label: 'VAT Amount',      value: selectedFile.result.vatAmount ? formatCurrency(selectedFile.result.vatAmount) : '—' },
                        { label: 'WHT Amount',      value: selectedFile.result.whtAmount ? formatCurrency(selectedFile.result.whtAmount) : '—' },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                          <span className="text-gray-500 text-xs">{row.label}</span>
                          <span className="text-gray-900 text-xs font-medium">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tax implications */}
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-4 text-sm">
                      AI Tax Implications
                      <span className="ml-2 text-xs font-normal text-gray-500">({selectedFile.result.taxImplications.length} found)</span>
                    </h3>
                    <div className="space-y-3">
                      {selectedFile.result.taxImplications.map((impl, i) => (
                        <ImplicationCard key={i} impl={impl} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-3xl flex items-center justify-center mb-5">
                  <Brain className="w-9 h-9 text-gray-700" />
                </div>
                <div className="text-gray-500 font-semibold text-lg mb-2">AI Document Analyser Ready</div>
                <div className="text-gray-600 text-sm max-w-sm leading-relaxed">
                  Upload invoices, bank statements, payroll files, or financial statements on the left.
                  Our AI will extract every tax-relevant figure and tell you exactly what action to take.
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-xs">
                  {[
                    'Extracts VAT input/output',
                    'Identifies WHT obligations',
                    'Flags capital allowances',
                    'FIRS form mapping',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100/50 border border-gray-200 rounded-xl px-3 py-2">
                      <CheckCircle className="w-3.5 h-3.5 text-ng-600 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
