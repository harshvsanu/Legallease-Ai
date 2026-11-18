import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ExtractedClause } from '../../types';

interface ClausesTabProps {
  clauses: ExtractedClause[];
  onJumpToPage: (page: number) => void;
  onSelectClause: (clause: ExtractedClause) => void;
}

export const ClausesTab: React.FC<ClausesTabProps> = ({
  clauses,
  onJumpToPage,
  onSelectClause,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(null);
  const [activeJargonTooltip, setActiveJargonTooltip] = useState<{ term: string; definition: string } | null>(null);

  const categories = ['all', 'Financial', 'Termination', 'Liability', 'Intellectual Property', 'Dispute Resolution'];

  const filteredClauses = clauses.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plainEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rawText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in text-sm">
      {/* Header & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search plain-English clauses or legal terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-midnight-950 dark:bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Clauses' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jargon Modal / Tooltip Overlay */}
      {activeJargonTooltip && (
        <div className="p-4 rounded-xl bg-midnight-950 text-white border border-indigo-700 shadow-elevated text-xs space-y-2 animate-fade-in relative">
          <div className="flex items-center justify-between font-bold text-indigo-300">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Legal Term Definition
            </span>
            <button
              onClick={() => setActiveJargonTooltip(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="font-semibold text-sm">{activeJargonTooltip.term}</p>
          <p className="text-slate-200 leading-relaxed">{activeJargonTooltip.definition}</p>
        </div>
      )}

      {/* Clauses List */}
      {filteredClauses.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No matching clauses found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClauses.map((clause) => {
            const isExpanded = expandedClauseId === clause.id;
            return (
              <div
                key={clause.id}
                className="p-5 rounded-2xl bg-white dark:bg-midnight-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-4"
              >
                {/* Clause Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-lavender-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {clause.category}
                      </span>
                      <button
                        onClick={() => onJumpToPage(clause.pageNumber)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        Page {clause.pageNumber} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {clause.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Plain English Translation */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                    What this means in plain English:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                    {clause.plainEnglish}
                  </p>
                </div>

                {/* Scenario Example */}
                {clause.scenarioExample && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">Everyday Scenario: </span>
                    {clause.scenarioExample}
                  </div>
                )}

                {/* Jargon tags */}
                {clause.jargonTerms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Terms:</span>
                    {clause.jargonTerms.map((j, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveJargonTooltip(j)}
                        className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3" />
                        {j.term}
                      </button>
                    ))}
                  </div>
                )}

                {/* Expandable Raw Text */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 animate-fade-in">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Exact Contract Text (Page {clause.pageNumber}):
                    </span>
                    <p className="font-serif italic text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
                      "{clause.rawText}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
