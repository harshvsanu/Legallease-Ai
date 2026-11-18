import React from 'react';
import { ShieldCheck, Lock, HardDrive, Scale, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'workspace' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-midnight-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors py-12 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Guarantee */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-midnight-950 dark:bg-indigo-600 flex items-center justify-center text-white">
                <Scale className="w-4 h-4 text-indigo-400 dark:text-white" />
              </div>
              <span className="font-bold text-base text-midnight-950 dark:text-white">
                LegalEase<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              On-device AI contract review ensuring personal leases, employment terms, and consulting contracts are translated into clear, actionable terms without cloud vulnerability.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Zero Telemetry • Zero Cloud Storage
            </div>
          </div>

          {/* Column 2: Core Capabilities */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Capabilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Plain-English Clause Explainer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Risk & Ambiguity Radar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Before-You-Sign Checklist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Citation-Verified Q&A
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Market Benchmark Redlines
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Privacy & Security */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Privacy Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                <span>WebGPU & Local WebAssembly</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                <span>Encrypted IndexedDB Storage</span>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                  Privacy Center & Audit Logs <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Purge Local Database
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Disclaimers */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Legal Disclaimer
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              LegalEase AI is an informational tool. It does not provide legal representation or formal legal advice. Contract analysis should be supplemented with consultation from a licensed attorney in your relevant jurisdiction.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} LegalEase AI. Built for on-device privacy.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Gemma 3n-class & On-Device Compatible</span>
            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
            <span className="text-slate-400">PWA & Desktop Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
