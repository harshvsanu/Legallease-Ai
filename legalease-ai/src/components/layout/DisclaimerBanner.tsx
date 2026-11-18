import React, { useState } from 'react';
import { AlertTriangle, X, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-midnight-950 border-b border-indigo-900/60 text-slate-200 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <p className="leading-snug">
            <span className="font-semibold text-white">Informational Legal Assistance Only:</span> LegalEase AI provides automated educational insights, plain-English translations, and risk detection. It is <strong className="text-amber-300">not a law firm and does not provide legal advice</strong>. Always consult a qualified attorney for binding counsel.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% On-Device
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            title="Dismiss notice"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
