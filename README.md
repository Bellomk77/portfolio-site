# TaxPadi 🇳🇬
### Nigeria's Most Intelligent AI Tax Platform

TaxPadi is a full-stack AI-powered tax compliance SaaS for Nigerian businesses. Built with Next.js 14, TypeScript, Tailwind CSS, and the Anthropic Claude API, it helps companies of all sizes manage their FIRS obligations — from document upload to FIRS-ready returns.

---

## Features

### 🧠 AI Tax Advisor
- Powered by **Claude claude-sonnet-4-6** with a comprehensive Nigerian tax knowledge base
- Trained on CITA, PITA, VATA, Finance Acts 2019–2024, FIRS Circulars, and Tax Appeal Tribunal decisions
- Streaming responses with legal citations
- 24/7 available — like having a CITN-qualified advisor on call

### 📁 Smart Document Upload
- Upload invoices, bank statements, payroll files, financial statements
- AI extracts VAT amounts, WHT obligations, capital expenditure, categories
- Identifies actionable tax implications per document
- Supports PDF, Excel, CSV, PNG/JPG (up to 50 MB)

### 🧮 Complete Nigerian Tax Calculator
| Tax Type | Rate | Filing Deadline |
|----------|------|-----------------|
| CIT (Small) | 0% (turnover ≤₦25M) | 6 months after FYE |
| CIT (Medium) | 20% (₦25M–₦100M) | 6 months after FYE |
| CIT (Large) | 30% (>₦100M) | 6 months after FYE |
| Education Tax | 2.5% | Same as CIT |
| VAT | 7.5% | 21st of following month |
| PAYE | 7%–24% progressive | 10th of following month |
| WHT | 5%–10% | 21st of following month |
| CGT | 10% | On disposal |

### 📅 Compliance Tracker
- Full FIRS filing deadline calendar
- Real-time penalty preview (before they accrue)
- Expandable rows with filing instructions
- Traffic-light status system

### 📊 Reports & Filing
- Monthly tax summaries
- Annual CIT computation workings
- VAT Return (Form 002) pre-fill
- AI-identified tax savings with legal citations
- Audit evidence package generation

### 💯 Tax Health Score
- Composite score (0–100) based on compliance history
- Sub-scores: Compliance, Documentation, Optimisation
- Visual circular gauge with grade (A–F)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic Claude claude-sonnet-4-6 (streaming) |
| Charts | Recharts |
| Animations | Framer Motion |
| File Upload | React Dropzone |
| State | React useState / Zustand |
| Deployment | Vercel (recommended) |

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/bellomk77/taxpadi
cd taxpadi
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...    # Get from console.anthropic.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npx vercel
```

Set `ANTHROPIC_API_KEY` in Vercel project settings → Environment Variables.

---

## Nigerian Tax Coverage

### Federal Taxes
- **CITA** — Companies Income Tax Act (as amended to Finance Act 2024)
- **PITA** — Personal Income Tax Act (progressive PAYE bands)
- **VATA** — Value Added Tax Act (7.5% since Finance Act 2020)
- **CGTA** — Capital Gains Tax Act (10% on chargeable gains)
- **ETF Act** — Education Tax (2.5% of assessable profit)
- **Stamp Duties Act** — Instrument-based charges
- **Petroleum Profits Tax Act** — For upstream oil & gas

### Finance Act 2024 Provisions Included
- Windfall tax (70%) on bank FX gains
- Mandatory e-invoicing threshold (₦25M)
- Enhanced transfer pricing penalties
- Digital economy taxation (non-resident companies)
- Small company exemption at ₦25M gross turnover
- Medium company 20% CIT rate

### Tax Reform Bills 2024 (Monitored)
- Proposed National Revenue Service (replacing FIRS)
- Joint Revenue Board
- VAT destination-based reform
- Simplified income tax structure

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/page.tsx    # Main dashboard
│   ├── calculator/page.tsx   # All tax calculators
│   ├── upload/page.tsx       # AI document upload
│   ├── chat/page.tsx         # AI tax advisor
│   ├── compliance/page.tsx   # FIRS deadline tracker
│   ├── reports/page.tsx      # Reports & filing
│   └── api/chat/route.ts     # Claude streaming API
├── components/
│   └── layout/Sidebar.tsx    # App navigation
├── lib/
│   ├── nigerian-tax-data.ts  # All tax rates, deadlines, AI prompt
│   ├── tax-calculations.ts   # CIT, VAT, PAYE, WHT, CGT engines
│   └── utils.ts              # Formatting, utilities
└── types/index.ts            # TypeScript interfaces
```

---

## Roadmap

- [ ] FIRS TaxPro-Max API integration for direct e-filing
- [ ] Bank statement auto-import (Open Banking)
- [ ] Multi-user / team roles (Finance Director, Accountant, CEO)
- [ ] State-level taxes (Lagos, Rivers, Kano SIRS integration)
- [ ] Payroll module with pension (PRA) automation
- [ ] Mobile app (React Native)
- [ ] CAC annual returns integration
- [ ] Transfer pricing documentation builder

---

## Legal Disclaimer

TaxPadi provides AI-assisted tax guidance for informational purposes. It is not a substitute for advice from a qualified tax professional (CITN member). Always verify calculations with a registered tax consultant before filing with FIRS. TaxPadi is not affiliated with the Federal Inland Revenue Service (FIRS).

---

## License

MIT License — © 2025 TaxPadi Technologies Ltd

---

*Made with 🇳🇬 for Nigerian businesses. Ẹ káabọ̀!*
