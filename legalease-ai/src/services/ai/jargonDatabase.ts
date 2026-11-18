export interface LegalTermDefinition {
  term: string;
  category: 'Liability' | 'Termination' | 'Payment' | 'Employment' | 'Real Estate' | 'General' | 'Dispute Resolution';
  simpleMeaning: string;
  realWorldExample: string;
  dangerLevel: 'low' | 'caution' | 'critical';
  whatToLookOutFor: string;
}

export const LEGAL_JARGON_DICTIONARY: Record<string, LegalTermDefinition> = {
  'indemnification': {
    term: 'Indemnification (Hold Harmless)',
    category: 'Liability',
    simpleMeaning: 'A promise to pay for the other person’s legal costs, damages, or losses if someone sues them because of something you did.',
    realWorldExample: 'If a client gets sued for copyright infringement over an image you used in your design, an indemnification clause means you must pay their lawyers and any court judgment.',
    dangerLevel: 'critical',
    whatToLookOutFor: 'Ensure indemnification is mutual and capped to your contract fee or insurance policy. Avoid "defend, indemnify, and hold harmless" without fault limits.',
  },
  'indemnify': {
    term: 'Indemnify',
    category: 'Liability',
    simpleMeaning: 'To compensate or reimburse another party for financial harm or legal damages they incur.',
    realWorldExample: 'Paying the landlord if a water leak from your washing machine damages the downstairs apartment.',
    dangerLevel: 'critical',
    whatToLookOutFor: 'Check if you are being asked to indemnify against their negligence or claims outside your direct control.',
  },
  'liquidated damages': {
    term: 'Liquidated Damages',
    category: 'Payment',
    simpleMeaning: 'A pre-set financial penalty specified in the contract that you must pay automatically if you break a specific rule or deadline, without them having to prove the actual loss.',
    realWorldExample: 'A clause stating: "If tenant breaks the lease early, tenant shall pay a liquidated damages penalty of $3,500."',
    dangerLevel: 'critical',
    whatToLookOutFor: 'Check whether the sum is a reasonable pre-estimate of loss or an unenforceable punitive penalty. Look for grace periods.',
  },
  'severability': {
    term: 'Severability',
    category: 'General',
    simpleMeaning: 'A "safety valve" stating that if a court finds one sentence or clause illegal, the rest of the contract remains active rather than throwing out the whole deal.',
    realWorldExample: 'If a judge declares a 3-year non-compete clause too extreme, severability allows the salary and IP clauses to continue working.',
    dangerLevel: 'low',
    whatToLookOutFor: 'Standard boilerplate. Generally harmless and protective for both parties.',
  },
  'force majeure': {
    term: 'Force Majeure',
    category: 'General',
    simpleMeaning: '"Act of God" clause excusing both parties from their obligations when impossible due to unforeseeable disasters (hurricanes, wars, pandemics).',
    realWorldExample: 'A wedding venue being flooded by a hurricane, allowing both parties to cancel without paying breach damages.',
    dangerLevel: 'caution',
    whatToLookOutFor: 'Check whether payments are also excused, and whether pandemics or government shutdown orders are explicitly included or excluded.',
  },
  'joint and several liability': {
    term: 'Joint and Several Liability',
    category: 'Liability',
    simpleMeaning: 'All signers are responsible together, but each individual is also 100% on the hook for the entire debt if others do not pay.',
    realWorldExample: 'You and two roommates sign a lease. If your roommates refuse to pay their share of rent, the landlord can legally demand 100% of the rent solely from you.',
    dangerLevel: 'critical',
    whatToLookOutFor: 'If signing with partners or roommates, be aware that you are acting as a guarantor for their financial failures.',
  },
  'arbitration': {
    term: 'Mandatory Arbitration',
    category: 'Dispute Resolution',
    simpleMeaning: 'Surrendering your constitutional right to take a dispute to a public court or jury, agreeing instead to use a private, paid arbitrator whose decision is final.',
    realWorldExample: 'If your employer withholds commissions, you cannot sue them in state court; you must submit your case to private arbitration proceedings.',
    dangerLevel: 'caution',
    whatToLookOutFor: 'Look at who pays arbitrator fees. In many jurisdictions, employers or landlords must cover these costs, but check for fee-splitting traps.',
  },
  'non-compete': {
    term: 'Non-Compete Covenant',
    category: 'Employment',
    simpleMeaning: 'A restriction prohibiting you from working for competitors or starting a rival business in the same industry after you leave.',
    realWorldExample: 'A clause barring a software engineer from working for any technology company in North America for 24 months post-resignation.',
    dangerLevel: 'critical',
    whatToLookOutFor: 'Examine duration (over 12 months is often suspect), geographic territory, and industry scope. Note that several jurisdictions (like California) ban non-competes outright.',
  },
  'at-will': {
    term: 'At-Will Employment',
    category: 'Employment',
    simpleMeaning: 'Either you or the company can terminate the employment at any moment, for any reason (or no reason at all), with or without advance notice.',
    realWorldExample: 'You can resign tomorrow without penalty, and the company can lay you off tomorrow without needing to prove poor performance.',
    dangerLevel: 'caution',
    whatToLookOutFor: 'Make sure guaranteed severance or equity vesting milestones have explicit carve-outs if you are terminated without cause.',
  },
  'evergreen': {
    term: 'Evergreen Clause (Automatic Renewal)',
    category: 'Termination',
    simpleMeaning: 'The agreement automatically extends for another full term (e.g. another year) unless you give written notice within a strict, narrow window.',
    realWorldExample: 'A contract that automatically locks you into another 12 months at $2,000/month unless you send a certified letter exactly 60 days before expiration.',
    dangerLevel: 'caution',
    whatToLookOutFor: 'Set a calendar alert immediately. Look for 30-day or 60-day notice requirement deadlines.',
  },
  'cure period': {
    term: 'Notice & Cure Period',
    category: 'Termination',
    simpleMeaning: 'A mandatory window of time (usually 15 to 30 days) given to fix an alleged mistake or missed payment before the other party can cancel the contract or sue you.',
    realWorldExample: 'If a payment is late, the landlord or client must notify you in writing and give you 10 days to pay before declaring a default.',
    dangerLevel: 'caution',
    whatToLookOutFor: 'Contracts without a cure period allow instant termination or default penalties upon the first trivial mistake. Always ask for at least 15 days cure.',
  },
  'holdover': {
    term: 'Holdover Rent',
    category: 'Real Estate',
    simpleMeaning: 'A punitive rent penalty (often 150% to 200% of normal rent) charged if you stay in the property even a single day past your lease end date.',
    realWorldExample: 'If your lease ends July 31 and you hand in keys on August 2, the landlord charges 200% daily rate plus full month rent.',
    dangerLevel: 'caution',
    whatToLookOutFor: 'Check holdover percentage (over 150% is aggressive). Ensure moving delays with reasonable communication aren\'t penalized exorbitantly.',
  },
  'waiver of subrogation': {
    term: 'Waiver of Subrogation',
    category: 'Liability',
    simpleMeaning: 'Preventing insurance companies from suing the other party to recover money they paid out for an insured loss.',
    realWorldExample: 'If a fire damages the rented building, the landlord\'s insurer pays the landlord, but cannot turn around and sue you for the money.',
    dangerLevel: 'low',
    whatToLookOutFor: 'Standard in commercial leases. Check with your insurance broker to ensure your policy permits this waiver.',
  },
  'merger clause': {
    term: 'Merger Clause (Entire Agreement)',
    category: 'General',
    simpleMeaning: 'States that only what is written in this signed paper counts. Any previous verbal promises, email agreements, or handshake deals are completely null and void.',
    realWorldExample: 'A leasing agent says "don\'t worry, parking is free", but the signed lease has a merger clause and mentions a $200 parking fee. You must pay $200.',
    dangerLevel: 'caution',
    whatToLookOutFor: 'Never rely on verbal assurances. If something was promised in an email or conversation, it MUST be typed into the contract before you sign.',
  },
  'limitation of liability': {
    term: 'Limitation of Liability',
    category: 'Liability',
    simpleMeaning: 'A ceiling on the maximum dollar amount one party can ever be forced to pay the other for damages, often capped at fees paid in the last 12 months.',
    realWorldExample: 'Even if software bugs cause your business $100,000 in lost sales, the vendor\'s liability is capped at the $500 monthly fee you paid.',
    dangerLevel: 'caution',
    whatToLookOutFor: 'Ensure liability caps are mutual. A dangerous contract caps the vendor\'s liability at $100 while leaving your liability completely uncapped.',
  },
};

export function findJargonTermsInText(text: string): Array<{ term: string; definition: string }> {
  const found: Array<{ term: string; definition: string }> = [];
  const lower = text.toLowerCase();

  for (const [key, item] of Object.entries(LEGAL_JARGON_DICTIONARY)) {
    if (lower.includes(key)) {
      found.push({
        term: item.term,
        definition: item.simpleMeaning,
      });
    }
  }

  return found;
}
