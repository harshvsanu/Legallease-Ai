import { BenchmarkComparison } from '../types';

export const BENCHMARK_COMPARISONS: BenchmarkComparison[] = [
  {
    clauseName: 'Indemnification & Hold Harmless',
    category: 'Liability',
    currentContractText: 'Contractor shall defend, indemnify, and hold harmless Client against all claims, liabilities, and attorney fees without limitation.',
    currentRiskLevel: 'Dangerous',
    marketStandardBenchmark: 'Each party shall defend and indemnify the other against third-party claims arising from gross negligence or willful misconduct, capped at total fees paid under this Agreement.',
    differenceAnalysis: 'The current clause is one-sided and uncapped. The market standard is mutual, requires actual fault, and caps damages to fees paid.',
    suggestedNegotiationAsk: 'Strike "all claims without limitation" and insert: "Each party\'s liability shall be mutual and capped at the total amounts paid in the preceding 12 months."',
  },
  {
    clauseName: 'Termination for Convenience',
    category: 'Termination',
    currentContractText: 'Company may terminate at any time without notice. Contractor must provide 60 days prior written notice.',
    currentRiskLevel: 'Aggressive',
    marketStandardBenchmark: 'Either party may terminate this Agreement without cause upon providing thirty (30) days prior written notice to the other party.',
    differenceAnalysis: 'Current term is completely asymmetric, giving the client freedom to walk away instantly while locking you into 60 days.',
    suggestedNegotiationAsk: 'Request mutual 30-day notice for convenience by either party.',
  },
  {
    clauseName: 'Automatic Renewal / Evergreen',
    category: 'Termination',
    currentContractText: 'Automatically renews for successive 12-month terms unless written notice is given 60 days prior to expiration.',
    currentRiskLevel: 'Aggressive',
    marketStandardBenchmark: 'Renews on a month-to-month basis upon expiration, or requires written reminder notice 30 days prior to annual renewal.',
    differenceAnalysis: 'A 60-day window without reminder notice creates a trap where missing the deadline binds you for an entire additional year.',
    suggestedNegotiationAsk: 'Add a condition that the other party must send a written notice reminder 30 days before the non-renewal deadline.',
  },
  {
    clauseName: 'Non-Compete Covenant',
    category: 'Employment',
    currentContractText: 'Employee shall not engage in any competitive business worldwide for two (2) years post-termination.',
    currentRiskLevel: 'Dangerous',
    marketStandardBenchmark: 'Reasonable non-solicitation of active clients for 6 months within the local metropolitan market, with no blanket employment ban.',
    differenceAnalysis: 'A worldwide 2-year non-compete is legally punitive and heavily restricted or void in multiple states (CA, NY, MN).',
    suggestedNegotiationAsk: 'Replace with a targeted non-solicitation of actual clients you personally worked with, limited to 6 months.',
  },
  {
    clauseName: 'Liquidated Damages / Deposit Forfeiture',
    category: 'Financial',
    currentContractText: 'Tenant shall forfeit the entire deposit plus pay $3,500 liquidated damages if terminating early.',
    currentRiskLevel: 'Dangerous',
    marketStandardBenchmark: 'Tenant is responsible for rent until a replacement tenant is found, with Landlord under an affirmative statutory duty to mitigate damages.',
    differenceAnalysis: 'Combines deposit forfeiture with an arbitrary cash penalty without requiring the landlord to attempt to re-rent the property.',
    suggestedNegotiationAsk: 'Propose an early termination re-letting fee of no more than 1 month\'s rent, with security deposit returned subject to standard inspection.',
  },
];
