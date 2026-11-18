import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ChecklistItem } from '../../types';

interface ChecklistTabProps {
  checklist: ChecklistItem[];
  onJumpToPage?: (page: number) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  checklist,
  onJumpToPage,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>(checklist);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompletedByUser: !item.isCompletedByUser } : item
      )
    );
  };

  const completedCount = items.filter((i) => i.isCompletedByUser).length;
  const progressPct = Math.round((completedCount / Math.max(1, items.length)) * 100);

  return (
    <div className="space-y-6 animate-fade-in text-sm">
      {/* Progress Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pre-Signing Readiness
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {completedCount} of {items.length} Items Verified
            </h3>
          </div>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {progressPct}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Work through these statutory safeguards and practical questions before putting your physical or digital signature on this contract.
        </p>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3.5">
        {items.map((item) => {
          const isDone = item.isCompletedByUser;
          const isAction = item.status === 'action_required';
          const isCaution = item.status === 'caution';

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-soft flex items-start gap-4 ${
                isDone
                  ? 'bg-slate-50/80 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-900/60 opacity-80'
                  : 'bg-white dark:bg-midnight-950 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0"
              >
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-semibold text-sm ${
                      isDone
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${
                      isAction
                        ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200'
                        : isCaution
                        ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200'
                        : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <strong className="text-indigo-600 dark:text-indigo-400">Action Advice: </strong>
                  {item.actionAdvice}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
