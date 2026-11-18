import React from 'react';
import { Scale, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { BENCHMARK_COMPARISONS } from '../../data/benchmarkClauses';

export const ComparisonTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in text-sm">
      <div className="p-5 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4" /> Market Benchmark Redline Comparison
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Compare Contract Terms vs. Balanced Fair-Market Standards
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Identify how aggressively this contract deviates from standard industry norms across key risk areas.
        </p>
      </div>

      <div className="space-y-6">
        {BENCHMARK_COMPARISONS.map((b, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {b.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {b.clauseName}
                </h4>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  b.currentRiskLevel === 'Dangerous'
                    ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200'
                    : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200'
                }`}
              >
                {b.currentRiskLevel} Wording
              </span>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Analyzed Contract's Clause */}
              <div className="p-3.5 rounded-xl bg-red-50/40 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block">
                  This Agreement's Language:
                </span>
                <p className="font-serif italic text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{b.currentContractText}"
                </p>
              </div>

              {/* Market Standard Benchmark */}
              <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fair-Market Standard:
                </span>
                <p className="font-serif text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{b.marketStandardBenchmark}"
                </p>
              </div>
            </div>

            {/* Analysis & Negotiation Advice */}
            <div className="pt-2 space-y-2 text-xs">
              <div>
                <strong className="text-slate-900 dark:text-white">Difference Analysis: </strong>
                <span className="text-slate-600 dark:text-slate-300">{b.differenceAnalysis}</span>
              </div>
              <div className="p-3 rounded-lg bg-lavender-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
                <strong className="text-indigo-700 dark:text-indigo-300 flex items-center gap-1 mb-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Suggested Redline Amendment:
                </strong>
                <span className="text-slate-700 dark:text-slate-200 font-mono text-[11px] block">
                  {b.suggestedNegotiationAsk}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
