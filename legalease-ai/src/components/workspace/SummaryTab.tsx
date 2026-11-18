import React from 'react';
import {
  Users,
  DollarSign,
  Calendar,
  ShieldCheck,
  RotateCcw,
  LogOut,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { ContractSummary } from '../../types';

interface SummaryTabProps {
  summary: ContractSummary;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ summary }) => {
  return (
    <div className="space-y-6 animate-fade-in text-sm">
      {/* Executive Takeaway */}
      <div className="p-5 rounded-2xl bg-lavender-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 space-y-2">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> AI Plain-English Takeaway
        </div>
        <p className="text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
          {summary.plainEnglishTakeaway}
        </p>
      </div>

      {/* Contracting Parties & Dates */}
      <div className="p-5 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider">
          <Users className="w-4 h-4 text-indigo-500" /> Contracting Parties & Governing Law
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {summary.parties.map((p, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{p.role}</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm">{p.name}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <span>Effective Date: <strong className="text-slate-800 dark:text-slate-200">{summary.effectiveDate || 'Not specified'}</strong></span>
          <span>Jurisdiction: <strong className="text-slate-800 dark:text-slate-200">{summary.governingLaw || 'General Law'}</strong></span>
        </div>
      </div>

      {/* Financials & Penalties */}
      <div className="p-5 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider">
          <DollarSign className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Financial Commitments & Fees
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Primary Fee / Rent</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">
              {summary.financials.totalValue || 'See Contract'}
            </span>
            <span className="text-slate-500 block mt-1">{summary.financials.paymentSchedule}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Security Deposit / Escrow</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">
              {summary.financials.securityDeposit || 'None Required'}
            </span>
            <span className="text-slate-500 block mt-1">Refundable subject to damages</span>
          </div>
        </div>

        {summary.financials.lateFees && (
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Late Payment Rule: {summary.financials.lateFees}</span>
          </div>
        )}
      </div>

      {/* Renewal & Termination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Renewal */}
        <div className="p-5 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-indigo-500" /> Renewal Conditions
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {summary.renewalTerms.details}
          </p>
          <div className="pt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            Notice Window: {summary.renewalTerms.noticePeriodRequired}
          </div>
        </div>

        {/* Termination */}
        <div className="p-5 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider">
            <LogOut className="w-4 h-4 text-red-500" /> Exit & Termination
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {summary.terminationConditions.convenienceNotice}
          </p>
          {summary.terminationConditions.penaltiesOrLiquidatedDamages && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ {summary.terminationConditions.penaltiesOrLiquidatedDamages}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
