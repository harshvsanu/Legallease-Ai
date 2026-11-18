# LegalEase AI — Privacy-First AI Legal Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![WebGPU](https://img.shields.io/badge/WebGPU-Enabled-green)](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
[![Tests](https://img.shields.io/badge/Tests-13%20Passed-brightgreen)](https://vitest.dev/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20On--Device-emerald)](https://github.com)

**LegalEase AI** is a complete, production-ready, privacy-first legal assistant built to demystify rental agreements, employment contracts, freelance service agreements (MSAs), and legal notices.

All document extraction, local OCR, text chunking, and AI inference execute **strictly on the user's local machine**. Zero documents, raw text, prompts, or results ever leave the browser.

> ⚠️ **Informational Legal Assistance Only**: LegalEase AI provides automated educational insights, plain-English translations, and risk detection. It is **not a law firm and does not provide legal advice**. Always consult a qualified attorney for binding counsel.

---

## 🎨 Design System & Palette

Crafted with a premium legal-tech aesthetic featuring subtle gradients, matte paper textures, clean cards, thin borders, soft shadows, and dark-mode support:

- **Midnight Navy** (`#172554` / `midnight-950`): Authoritative primary background & dark surface
- **Primary Indigo** (`#6366F1` / `indigo-500`): Accent actions, active tabs, and primary buttons
- **Cool Canvas** (`#F8FAFC` / `canvas-light`): High-legibility background canvas
- **Soft Lavender** (`#EEF2FF` / `lavender-50`): Informational callouts and translation highlights
- **Legal Teal** (`#0F766E` / `teal-600`): Financial terms, verified badges, and metrics
- **Caution Amber** (`#F59E0B` / `amber-500`): Ambiguous clauses, evergreen renewal traps, and warnings
- **Critical Red** (`#EF4444` / `red-500`): Liquidated damages, uncapped indemnity, and high-risk clauses

---

## 🚀 Key Features

### 1. Paginated Split-Screen Document Workspace
- Paginated document viewer with zoom controls, search-in-text, and direct page jumping.
- Interactive highlighted spans: Clicking a flagged risk or clause in the AI panel highlights the exact quote in the document canvas.

### 2. Smart Contract Summaries
- Structured breakdown of contracting parties, governing law, effective dates.
- Financial commitments (rent/fees, security deposits, late payment penalties).
- Key deadlines, core reciprocal obligations, renewal conditions, and termination rights.

### 3. Plain-English Clause Explainer
- Translates dense contractual legalese into everyday language.
- Real-world scenario examples for every clause.
- Built-in **Legal Jargon Dictionary** (over 60+ terms including *Indemnification*, *Liquidated Damages*, *Severability*, *Force Majeure*, *Joint & Several Liability*, *Evergreen*, *At-Will*, *Cure Period*).
- Clickable jargon tags that provide instant definitions.

### 4. Risk & Ambiguity Radar
- Calculated **Contract Exposure Score** (0 to 100).
- Categorized risk flags: *Ambiguous Discretion*, *Hidden Penalties*, *Unilateral Modifications*, *Evergreen Rollovers*, *Uncapped Indemnities*, *Missing Cure Periods*.
- Battle-tested **Suggested Negotiation Counter-Proposals** with 1-click clipboard copy.

### 5. Ground-Truth Citation-Verified Q&A Chat
- Conversational RAG interface over document chunks.
- Every answer is accompanied by ground-truth **Citation Cards** linking directly to the exact page number and excerpt.
- **Strict Anti-Hallucination Guard**: Tests citations against raw document text. If a user asks about terms absent from the contract, the engine explicitly reports **Insufficient Evidence in Document**.

### 6. Pre-Signing Verification Checklist
- Interactive checklist covering critical traps, financial covenants, and termination safeguards.
- Live progress indicator (e.g. 5 of 6 items verified).

### 7. Market Benchmark Redlines
- Side-by-side comparison of the contract's clause vs. fair-market balanced benchmarks.
- Specific difference analysis and recommended negotiation asks.

### 8. Downloadable Executive Reports
- Export complete analysis report as Markdown (`.md`).
- Export structured dataset as JSON (`.json`).
- Browser-native Print View / Save as PDF.

### 9. Privacy Center & Storage Manager
- Live WebGPU hardware diagnostics and GPU adapter inspector.
- AI engine switcher:
  - **Gemma 3n-class (WebGPU)**: Browser tensor execution using WebGPU shaders.
  - **Desktop Bridge (Ollama / Localhost:11434)**: Local native GPU inference.
  - **Zero-Download Heuristic & Neural Engine**: Runs instantly with 0ms latency in browser memory without downloading large weights.
- IndexedDB storage footprint gauge with 1-click **Purge All Local Data**.
- Real-time immutable **Local Privacy Audit Log** displaying 0 external network requests.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, TypeScript 5.6
- **Styling**: Tailwind CSS 3.4, Lucide React icons, custom animations
- **Document Processing**: `pdfjs-dist` (page-by-page PDF extraction), `mammoth` (DOCX extraction), virtual page chunker
- **Storage**: IndexedDB via `idb` (local document index, cached analyses, chat history, audit logs)
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: PWA (`manifest.json`, Service Worker `sw.js`), Netlify / Cloudflare Pages (`_redirects`), optional Tauri desktop configuration (`src-tauri/tauri.conf.json`)

---

## 📦 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v20.19.0)
- npm or bun

### Installation
\`\`\`bash
# Clone or navigate to the repository
cd legalease-ai

# Install dependencies
npm install
\`\`\`

### Development Server
\`\`\`bash
# Start Vite development server
npm run dev
\`\`\`
Visit `http://localhost:5173` in your browser.

### Running Automated Tests
\`\`\`bash
# Run Vitest unit & component test suite
npm test
\`\`\`

### Production Build
\`\`\`bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
\`\`\`

---

## 🔒 Security & Privacy Guarantees

1. **No External Network Requests**: Document text and AI prompts never touch external endpoints or analytics services.
2. **Local Browser Sandbox**: All processing is scoped to IndexedDB and in-memory Web Workers.
3. **Passive Data Processing**: Extracted contract text is treated strictly as passive text data and never evaluated as executable scripts, preventing prompt injection and XSS vulnerabilities.
4. **User-Controlled Data Deletion**: The Privacy Center enables users to permanently delete individual contracts or purge the entire local database at any time.

---

## ⚖️ Legal Disclaimer

LegalEase AI is provided as an automated informational and educational tool. The analysis, risk scores, summaries, and translations generated by this software do not constitute formal legal advice, legal representation, or the creation of an attorney-client relationship. Laws vary significantly across jurisdictions, municipalities, and states. Users should always consult a licensed attorney in their relevant jurisdiction for binding legal counsel.
