import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Search,
  CheckCircle2,
  FileText,
  Scale,
  Sparkles,
  BookOpen,
  ChevronRight,
  Eye,
  Check,
} from 'lucide-react';
import { DocumentMetadata } from '../../types';
import { SAMPLE_CONTRACTS } from '../../data/sampleContracts';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onOpenSample: (sample: DocumentMetadata) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onOpenSample,
}) => {
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState(0);

  const interactiveSnippets = [
    {
      title: 'Automatic Renewal Trap',
      rawText: 'This Lease shall automatically renew for successive 12-month terms unless written notice is received 60 days prior...',
      translation: 'You are locked into another full year of rent unless you send a certified letter at least 2 months before your lease ends.',
      actionAdvice: 'Add a calendar alert 75 days before expiration, or ask for month-to-month rollover upon lease term end.',
      severity: 'caution',
    },
    {
      title: 'Uncapped Indemnification',
      rawText: 'Contractor shall defend, indemnify, and hold harmless Client against any and all claims, liabilities, and attorney fees...',
      translation: 'You are agreeing to pay all of their lawyer fees and court judgments if anyone sues them, even if you did nothing intentional.',
      actionAdvice: 'Demand mutual indemnity, restrict strictly to your direct gross negligence, and cap financial liability to fees paid.',
      severity: 'critical',
    },
    {
      title: 'Liquidated Damages Penalty',
      rawText: 'Tenant shall forfeit the entire deposit and immediately pay a liquidated damages penalty of $3,500.00...',
      translation: 'A pre-set financial punishment charged automatically if you move out early, even if they quickly find a new tenant.',
      actionAdvice: 'Propose that compensation be limited strictly to landlord\'s actual provable out-of-pocket costs with duty to mitigate.',
      severity: 'critical',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Privacy Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lavender-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-800 text-xs sm:text-sm font-medium shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>100% On-Device Legal AI • Zero Cloud Uploads Guaranteed</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Understand Every Contract{' '}
            <span className="bg-gradient-to-r from-midnight-950 via-indigo-600 to-teal-600 dark:from-white dark:via-indigo-300 dark:to-teal-400 bg-clip-text text-transparent">
              Before You Sign.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Translate dense legal legalese into plain English, uncover predatory penalties, detect ambiguous clauses, and generate a pre-signing negotiation checklist. Powered by on-device Gemma AI in your browser.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onStartAnalysis}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-midnight-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold shadow-elevated hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base group"
            >
              <FileCheck className="w-5 h-5 text-indigo-400 dark:text-white" />
              Analyze Document Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onOpenSample(SAMPLE_CONTRACTS[0])}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Eye className="w-4 h-4 text-indigo-500" />
              Try Sample Lease Agreement
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Rental Leases</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Employment Agreements</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Consulting & MSAs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Statutory Legal Notices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Clause Demystifier Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-midnight-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Live Interactive Preview
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                See How LegalEase Demystifies Real Contract Language
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {interactiveSnippets.map((s, idx) => (
                <button
                  key={s.title}
                  onClick={() => setSelectedSnippetIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSnippetIndex === idx
                      ? 'bg-midnight-950 dark:bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Raw Legalese */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                  Original Contract Clause
                </span>
                <p className="font-serif italic text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  "{interactiveSnippets[selectedSnippetIndex].rawText}"
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <AlertTriangle className="w-4 h-4" />
                <span>High Ambiguity & Asymmetric Exposure Detected</span>
              </div>
            </div>

            {/* Plain English Translation */}
            <div className="p-5 rounded-xl bg-lavender-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    Plain-English Translation
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium">
                    Verified Citation
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  {interactiveSnippets[selectedSnippetIndex].translation}
                </p>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/80 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">Recommended Counter-Action:</span>{' '}
                <span className="text-slate-600 dark:text-slate-300">
                  {interactiveSnippets[selectedSnippetIndex].actionAdvice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Contract Intelligence */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Everything You Need to Negotiate with Confidence
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Engineered to highlight the clauses landlords, employers, and clients hope you will overlook.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-soft transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Plain-English Explainer
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Converts archaic Latin terms, indemnification mandates, and legal jargon into everyday scenarios with clear examples.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-soft transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Risk & Ambiguity Radar
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Detects unilateral termination rights, liquidated damage traps, hidden automatic renewals, and uncapped liability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-soft transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Before-You-Sign Checklist
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generates an actionable list of questions, missing protections (e.g. grace periods), and specific clauses to request amendments to.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-soft transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Citation-Verified Q&A
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask anything about your document. Every response is strictly linked to page numbers and validated against the document text.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture & Privacy Comparison */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-midnight-950 text-white p-8 sm:p-12 relative overflow-hidden border border-indigo-900/60 shadow-elevated">
          <div className="max-w-2xl space-y-4 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" /> 100% Privacy Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Why On-Device AI Matters for Legal Documents
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Contracts contain your home address, salary figures, bank details, and trade secrets. Uploading them to cloud AI providers creates privacy and confidentiality risks. LegalEase AI executes completely in your local browser sandbox.
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-indigo-900/50">
            {/* Cloud AI */}
            <div className="p-5 rounded-2xl bg-white/5 border border-red-500/30 space-y-3">
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Traditional Cloud AI Tools
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span> Uploads private agreements to third-party cloud servers.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span> Documents may be stored, logged, or used for model training.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span> Requires persistent internet connection and subscriptions.
                </li>
              </ul>
            </div>

            {/* LegalEase AI */}
            <div className="p-5 rounded-2xl bg-indigo-950/60 border border-emerald-500/40 space-y-3">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> LegalEase AI Architecture
              </span>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Zero Bytes Leave Your Machine:</strong> Text extraction, OCR, and AI inference happen 100% locally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>On-Device Gemma 3n AI:</strong> Accelerated by WebGPU or lightweight local neural models.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Private Storage:</strong> Document indexes are stored strictly inside your browser's IndexedDB.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Test CTA */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Ready to review your agreement?
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upload any PDF or Word contract, or try one of our built-in realistic agreements with one click.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartAnalysis}
            className="px-8 py-3.5 rounded-xl bg-midnight-950 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 text-white font-semibold shadow-elevated transition-all inline-flex items-center gap-2"
          >
            Launch LegalEase AI Workspace
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
