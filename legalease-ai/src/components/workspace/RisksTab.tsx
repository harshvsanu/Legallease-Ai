import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  Info,
  Scale,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { RiskFinding, RiskSeverity } from '../../types';

interface RisksTabProps {
  risks: RiskFinding[];
  overallScore: number;
  riskAssessment: string;
  onJumpToPage: (page: number) => void;
  onSelectRisk: (risk: RiskFinding) => void;
}

export const RisksTab: React.FC<RisksTabProps> = ({
  risks,
  overallScore,
  riskAssessment,
  onJumpToPage,
  onSelectRisk,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | RiskSeverity>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRisks = risks.filter((r) => {
    return severityFilter === 'all' || r.severity === severityFilter;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScoreColor = () => {
    if (overallScore >= 70) return 'text-red-500 bg-red-500';
    if (overallScore >= 40) return 'text-amber-500 bg-amber-500';
    return 'text-emerald-500 bg-emerald-500';
  };

  return (
    <div className="space-y-6 animate-fade-in text-sm">
      {/* Risk Gauge Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Contract Exposure Radar
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {riskAssessment}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            {risks.length} legal ambiguity, penalty, or liability findings identified locally. These do not make terms invalid, but indicate one-sided exposure.
          </p>
        </div>

        {/* Gauge Widget */}
        <div className="flex items-center gap-4 shrink-0 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <span className={`text-3xl font-extrabold ${overallScore >= 70 ? 'text-red-600 dark:text-red-400' : overallScore >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {overallScore}
            </span>
            <span className="text-xs text-slate-400 block font-medium">/ 100 Risk</span>
          </div>
          <div className="w-20 bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full ${overallScore >= 70 ? 'bg-red-500' : overallScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 scrollbar-none">
        <button
          onClick={() => setSeverityFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            severityFilter === 'all'
              ? 'bg-midnight-950 dark:bg-indigo-600 text-white font-semibold shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Findings ({risks.length})
        </button>
        <button
          onClick={() => setSeverityFilter('critical')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            severityFilter === 'critical'
              ? 'bg-red-600 text-white font-semibold shadow-sm'
              : 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60'
          }`}
        >
          Critical Reviews ({risks.filter((r) => r.severity === 'critical').length})
        </button>
        <button
          onClick={() => setSeverityFilter('caution')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            severityFilter === 'caution'
              ? 'bg-amber-500 text-white font-semibold shadow-sm'
              : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60'
          }`}
        >
          Cautions & Traps ({risks.filter((r) => r.severity === 'caution').length})
        </button>
        <button
          onClick={() => setSeverityFilter('low')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            severityFilter === 'low'
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Notices ({risks.filter((r) => r.severity === 'low').length})
        </button>
      </div>

      {/* Risks List */}
      {filteredRisks.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No risks found matching selected filter.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredRisks.map((risk) => {
            const isCritical = risk.severity === 'critical';
            const isCaution = risk.severity === 'caution';

            return (
              <div
                key={risk.id}
                onClick={() => onSelectRisk(risk)}
                className={`p-6 rounded-2xl bg-white dark:bg-midnight-950 border transition-all space-y-4 shadow-sm hover:shadow-soft cursor-pointer ${
                  isCritical
                    ? 'border-red-200 dark:border-red-900/60 hover:border-red-400'
                    : isCaution
                    ? 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          isCritical
                            ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                            : isCaution
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {risk.severity} • {risk.category}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onJumpToPage(risk.pageNumber);
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        Page {risk.pageNumber} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {risk.title}
                    </h3>
                  </div>
                </div>

                {/* Trigger Excerpt */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Contract Language Trigger:
                  </span>
                  <p className="font-serif italic text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {risk.triggerExcerpt}
                  </p>
                </div>

                {/* Plain English & Legal Reasoning */}
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-slate-900 dark:text-white">What this means: </strong>
                    <span className="text-slate-600 dark:text-slate-300">{risk.plainEnglishMeaning}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Legal implication: </strong>
                    <span className="text-slate-600 dark:text-slate-300">{risk.legalReasoning}</span>
                  </div>
                </div>

                {/* Proposed Counter-Revision / Redline */}
                <div className="p-3.5 rounded-xl bg-lavender-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Suggested Negotiation Counter-Proposal:
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(risk.id, risk.recommendedRevision);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 flex items-center gap-1 transition-colors"
                      title="Copy revision text to clipboard"
                    >
                      {copiedId === risk.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Revision
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono bg-white/70 dark:bg-slate-950/70 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                    "{risk.recommendedRevision}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
