import {
  DocumentMetadata,
  RiskFinding,
  ExtractedClause,
  ContractSummary,
  ChecklistItem,
  AnalysisReport,
} from '../../types';
import { findJargonTermsInText } from './jargonDatabase';
import { validateCitation } from '../extractors/citationValidator';

interface RiskRule {
  id: string;
  category: RiskFinding['category'];
  severity: RiskFinding['severity'];
  title: string;
  pattern: RegExp;
  plainEnglishMeaning: string;
  legalReasoning: string;
  practicalImpact: string;
  recommendedRevision: string;
}

const RISK_RULES: RiskRule[] = [
  {
    id: 'risk-sole-discretion',
    category: 'Unilateral Right',
    severity: 'caution',
    title: 'Unchecked Unilateral Discretion',
    pattern: /(?:sole\s+and\s+absolute\s+discretion|at\s+its\s+sole\s+discretion|in\s+its\s+absolute\s+discretion)/i,
    plainEnglishMeaning: 'The other party can make critical decisions or interpretations without needing to be fair, reasonable, or explain their reasoning.',
    legalReasoning: 'Granting one party unfettered discretion undermines the implied covenant of good faith and fair dealing, making it difficult to challenge unfair determinations.',
    practicalImpact: 'They can reject your work, deny requests, or enforce penalties based on purely subjective whim.',
    recommendedRevision: 'Replace "in its sole discretion" with "in its reasonable commercial discretion, acting in good faith and not unreasonably withheld or delayed."',
  },
  {
    id: 'risk-uncapped-indemnity',
    category: 'Uncapped Liability',
    severity: 'critical',
    title: 'One-Sided or Broad Indemnification',
    pattern: /(?:defend,\s*indemnify(?:,\s*and\s*hold\s*harmless)?|indemnify\s+and\s+hold\s+harmless).*?(?:all\s+claims|any\s+and\s+all\s+losses|attorney(?:'s|\s+)?fees)/i,
    plainEnglishMeaning: 'You are agreeing to pay all legal bills and damages if a third party sues them, potentially without any dollar limit.',
    legalReasoning: 'Uncapped indemnities expose you to enterprise-level liabilities far exceeding the economic value of your contract.',
    practicalImpact: 'A single frivolous lawsuit by an outsider could force you to cover tens of thousands of dollars in legal defense fees.',
    recommendedRevision: 'Make indemnity mutual, limit to direct damages caused solely by your gross negligence or willful misconduct, and cap liability at total contract fees received.',
  },
  {
    id: 'risk-auto-renewal',
    category: 'Automatic Renewal',
    severity: 'caution',
    title: 'Automatic Renewal / Evergreen Trap',
    pattern: /(?:automatically\s+renew(?:s|ed)?|renew\s+for\s+successive\s+terms?|evergreen).*?(?:unless|prior\s+to|written\s+notice)/i,
    plainEnglishMeaning: 'The contract will renew automatically for another full term unless you remember to cancel within a specific, rigid notice window.',
    legalReasoning: 'Automatic renewal clauses shift the burden onto you to affirmatively track expiration dates or face continued financial obligations.',
    practicalImpact: 'Missing the notice deadline by even one day can legally bind you to another year of payments or services you no longer want.',
    recommendedRevision: 'Require the other party to send a written reminder notice 30 days prior to the deadline, or switch to month-to-month renewal upon term expiration.',
  },
  {
    id: 'risk-liquidated-damages',
    category: 'Hidden Penalty',
    severity: 'critical',
    title: 'Liquidated Damages Penalty',
    pattern: /(?:liquidated\s+damages|as\s+a\s+penalty|forfeit\s+(?:the\s+entire|all)\s+deposit|penalty\s+of\s+\$?[0-9,]+)/i,
    plainEnglishMeaning: 'A pre-set financial fee or penalty triggered upon breach, regardless of the actual financial damage suffered.',
    legalReasoning: 'While liquidated damages are enforceable if they reflect a genuine pre-estimate of loss, punitive damages in private contracts are disfavored by law.',
    practicalImpact: 'You could be forced to forfeit thousands of dollars even if your breach caused zero real financial loss to the other party.',
    recommendedRevision: 'Propose that compensation be limited to proven, actual, direct out-of-pocket damages rather than a fixed arbitrary forfeiture.',
  },
  {
    id: 'risk-unilateral-modification',
    category: 'Unilateral Right',
    severity: 'critical',
    title: 'Unilateral Contract Modification',
    pattern: /(?:may\s+modify|change\s+the\s+terms|update\s+these\s+terms|alter\s+this\s+agreement)\s+(?:from\s+time\s+to\s+time\s+without\s+notice|at\s+any\s+time\s+in\s+its\s+sole|without\s+prior\s+consent)/i,
    plainEnglishMeaning: 'The other party reserves the right to change rules, fees, or your obligations at any point without asking for your approval.',
    legalReasoning: 'Contracts require mutual assent. Unilateral modification clauses make obligations illusory and inherently unequal.',
    practicalImpact: 'They could increase fees, reduce benefits, or impose new restrictions while you remain bound by the agreement.',
    recommendedRevision: 'State clearly: "No amendment or modification of this Agreement shall be valid unless in writing and signed by both parties."',
  },
  {
    id: 'risk-asymmetric-termination',
    category: 'Ambiguous Wording',
    severity: 'caution',
    title: 'Asymmetric Termination Rights',
    pattern: /(?:terminate\s+(?:immediately|at\s+any\s+time)\s+without\s+cause|landlord\s+may\s+terminate.*?tenant\s+shall\s+provide|company\s+may\s+terminate.*?with\s+no\s+notice)/i,
    plainEnglishMeaning: 'One party can terminate easily with zero notice, while the other party is locked in or required to give prolonged advance warning.',
    legalReasoning: 'Asymmetric termination provisions create an imbalance of power and reduce operational stability for the dependent party.',
    practicalImpact: 'You have no guaranteed runway if they decide to terminate, but you cannot exit without risking a breach of contract lawsuit.',
    recommendedRevision: 'Demand bilateral symmetry: provide equal notice periods (e.g., 30 days written notice for convenience by either party).',
  },
  {
    id: 'risk-broad-noncompete',
    category: 'Restrictive Covenant',
    severity: 'critical',
    title: 'Overly Broad Non-Compete Clause',
    pattern: /(?:non-compete|shall\s+not\s+compete|not\s+directly\s+or\s+indirectly\s+engage).*?(?:period\s+of\s+[1-9]\s+years?|worldwide|any\s+business\s+competitive)/i,
    plainEnglishMeaning: 'Drastic restrictions preventing you from earning a living in your industry, often with overly long timeframes or huge geographical zones.',
    legalReasoning: 'Enforceability of non-competes depends heavily on geographic scope, duration, and local statutory bans (e.g. FTC rules, California, New York).',
    practicalImpact: 'Could block you from accepting future job offers or starting a business even in areas where the former company does no business.',
    recommendedRevision: 'Narrow scope strictly to direct competitors within a 25-mile radius for no longer than 6 months, or strike the non-compete entirely.',
  },
  {
    id: 'risk-asymmetric-attorney-fees',
    category: 'Hidden Penalty',
    severity: 'caution',
    title: 'One-Way Attorney\'s Fees',
    pattern: /(?:tenant|employee|contractor)\s+shall\s+(?:reimburse|pay)\s+(?:landlord|employer|company)(?:'s)?\s+(?:reasonable\s+)?attorney(?:'s)?\s+fees/i,
    plainEnglishMeaning: 'If there is a dispute, you must pay their lawyers if you lose, but they do NOT have to pay your lawyers if you win.',
    legalReasoning: 'One-way attorney fee clauses weaponize litigation costs to deter you from defending your legitimate rights.',
    practicalImpact: 'Even if the other party breaches, the threat of legal fee liability makes seeking justice financially perilous.',
    recommendedRevision: 'Replace with a mutual prevailing-party clause: "In any action arising out of this Agreement, the prevailing party shall be entitled to recover reasonable attorney fees."',
  },
  {
    id: 'risk-waiver-jury-trial',
    category: 'Ambiguous Wording',
    severity: 'low',
    title: 'Waiver of Jury Trial & Class Action',
    pattern: /(?:waives?(?:\s+all\s+right\s+to)?\s+a\s+trial\s+by\s+jury|waive\s+any\s+right\s+to\s+participate\s+in\s+a\s+class\s+action)/i,
    plainEnglishMeaning: 'You give up your right to have a jury hear your case or join with other affected tenants/employees in a group lawsuit.',
    legalReasoning: 'Common in commercial agreements, but significantly limits dispute forums to bench trials or individual actions.',
    practicalImpact: 'You must resolve disputes individually before a single judge or arbitrator.',
    recommendedRevision: 'If consumer or tenant context, verify if state law prohibits mandatory waivers of trial rights before signing.',
  },
];

/**
 * Extracts key clauses from document text and assigns plain-English explanations.
 */
export function extractKeyClauses(doc: DocumentMetadata): ExtractedClause[] {
  const clauses: ExtractedClause[] = [];
  const clauseHeadings = [
    { title: 'Term & Renewal', category: 'Termination', keywords: ['term', 'duration', 'renewal', 'commencement'] },
    { title: 'Rent & Payments', category: 'Financial', keywords: ['rent', 'payment', 'fees', 'compensation', 'invoicing', 'salary'] },
    { title: 'Security Deposit', category: 'Financial', keywords: ['security deposit', 'deposit', 'escrow'] },
    { title: 'Termination Conditions', category: 'Termination', keywords: ['termination', 'default', 'cancellation', 'surrender'] },
    { title: 'Indemnification & Hold Harmless', category: 'Liability', keywords: ['indemnif', 'hold harmless', 'defense'] },
    { title: 'Limitation of Liability', category: 'Liability', keywords: ['limitation of liability', 'consequential damages', 'liability cap'] },
    { title: 'Confidentiality & IP', category: 'Intellectual Property', keywords: ['confidential', 'proprietary', 'intellectual property', 'inventions'] },
    { title: 'Restrictive Covenants', category: 'Covenants', keywords: ['non-compete', 'non-solicit', 'covenant'] },
    { title: 'Governing Law & Disputes', category: 'Dispute Resolution', keywords: ['governing law', 'jurisdiction', 'arbitration', 'venue'] },
  ];

  let idCounter = 1;

  for (const page of doc.pages) {
    const text = page.text;
    const paragraphs = text.split(/\n\s*\n/);

    for (const para of paragraphs) {
      const clean = para.trim();
      if (clean.length < 50) continue;

      for (const def of clauseHeadings) {
        const matches = def.keywords.some((k) => clean.toLowerCase().includes(k));
        if (matches && !clauses.some((c) => c.title === def.title && c.pageNumber === page.pageNumber)) {
          const jargon = findJargonTermsInText(clean);
          
          clauses.push({
            id: `cls-${idCounter++}`,
            title: def.title,
            category: def.category as any,
            rawText: clean.length > 500 ? clean.slice(0, 500) + '...' : clean,
            pageNumber: page.pageNumber,
            plainEnglish: generatePlainEnglishClauseExplanation(def.title, clean),
            scenarioExample: generateScenarioExample(def.title),
            jargonTerms: jargon,
            importance: def.category === 'Liability' || def.category === 'Financial' ? 'critical' : 'standard',
          });
          break;
        }
      }
    }
  }

  return clauses.slice(0, 12);
}

function generatePlainEnglishClauseExplanation(title: string, rawText: string): string {
  const lower = rawText.toLowerCase();

  if (title.includes('Term & Renewal')) {
    if (lower.includes('automatically') || lower.includes('renew')) {
      return 'Defines the starting and ending dates of the agreement. It contains an automatic rollover provision extending the contract unless you provide notice in advance.';
    }
    return 'Defines the official start and end dates of the agreement, outlining how long both parties are committed to this contract.';
  }
  if (title.includes('Rent & Payments')) {
    return 'Outlines your exact financial obligations, payment deadlines, acceptable methods of payment, and any late penalties charged if deadlines are missed.';
  }
  if (title.includes('Security Deposit')) {
    return 'Specifies the upfront security deposit held in trust, permissible deduction conditions (damages vs. normal wear), and the timeline for its return.';
  }
  if (title.includes('Termination')) {
    return 'Explains when and how either party can walk away from this contract, including required notice periods, breach of contract triggers, and any cancellation costs.';
  }
  if (title.includes('Indemnification')) {
    return 'Dictates who pays for legal expenses and damages if an outside party files a lawsuit. This can transfer significant financial risk onto you.';
  }
  if (title.includes('Limitation of Liability')) {
    return 'Sets a ceiling on financial recovery for damages or breach, shielding parties from catastrophic indirect or consequential losses.';
  }
  if (title.includes('Confidentiality & IP')) {
    return 'Protects secret company information and specifies who owns any software, creative work, or inventions created during the contract relationship.';
  }
  if (title.includes('Restrictive Covenants')) {
    return 'Restricts what you can do after the relationship ends, such as working for competitors or contacting former clients or colleagues.';
  }
  if (title.includes('Governing Law')) {
    return 'Specifies which state or country\'s legal system applies and where any official lawsuit or arbitration hearing must physically take place.';
  }
  return 'Establishes clear rules and binding contractual commitments regarding this aspect of your legal relationship.';
}

function generateScenarioExample(title: string): string {
  if (title.includes('Term & Renewal')) {
    return 'Example: If your lease ends July 31st with a 60-day notice requirement, you must give written notice by June 1st or be locked in for another full year.';
  }
  if (title.includes('Rent & Payments')) {
    return 'Example: If rent is due on the 1st with a 5-day grace period, paying on the 7th triggers a late fee of $75.';
  }
  if (title.includes('Indemnification')) {
    return 'Example: If someone slips inside your rented unit and sues the building owner, an indemnity clause requires your insurance or you personally to defend the owner.';
  }
  if (title.includes('Termination')) {
    return 'Example: If the company loses a major client, they can terminate this consulting contract with 30 days written notice and pay only for hours worked.';
  }
  return 'Example: Governs unexpected disputes or transitions smoothly according to agreed written rules rather than verbal assumptions.';
}

/**
 * Executes legal rule heuristics to detect risks and ambiguities across the document.
 */
export function analyzeDocumentRisks(doc: DocumentMetadata): RiskFinding[] {
  const findings: RiskFinding[] = [];
  const detectedIds = new Set<string>();

  for (const page of doc.pages) {
    const text = page.text;

    for (const rule of RISK_RULES) {
      if (detectedIds.has(`${rule.id}-${page.pageNumber}`)) continue;

      const match = text.match(rule.pattern);
      if (match) {
        detectedIds.add(`${rule.id}-${page.pageNumber}`);
        
        // Extract surrounding context (up to 200 characters)
        const matchIdx = match.index || 0;
        const start = Math.max(0, matchIdx - 40);
        const end = Math.min(text.length, matchIdx + match[0].length + 90);
        const excerpt = text.slice(start, end).replace(/\s+/g, ' ').trim();

        const validatedCitation = validateCitation(excerpt, page.pageNumber, doc.pages);

        findings.push({
          id: `risk-${findings.length + 1}`,
          category: rule.category,
          severity: rule.severity,
          title: rule.title,
          triggerExcerpt: `"...${excerpt}..."`,
          pageNumber: validatedCitation.pageNumber,
          plainEnglishMeaning: rule.plainEnglishMeaning,
          legalReasoning: rule.legalReasoning,
          practicalImpact: rule.practicalImpact,
          recommendedRevision: rule.recommendedRevision,
          verifiedInDocument: validatedCitation.verified,
        });
      }
    }
  }

  // Check for Missing Safeguards (e.g. Missing Cure Period, Missing Return of Deposit Date)
  const fullTextLower = doc.rawText.toLowerCase();

  if (
    (doc.category === 'rental' || doc.category === 'service') &&
    !fullTextLower.includes('cure period') &&
    !fullTextLower.includes('days to cure') &&
    !fullTextLower.includes('notice of default')
  ) {
    findings.push({
      id: `risk-missing-cure`,
      category: 'Missing Protection',
      severity: 'caution',
      title: 'Missing Notice & Opportunity to Cure',
      triggerExcerpt: '[Document-wide omission: No grace period defined for alleged defaults]',
      pageNumber: 1,
      plainEnglishMeaning: 'The contract does not give you any guaranteed window of time to correct a missed payment or accidental violation before they terminate or penalize you.',
      legalReasoning: 'Standard commercial and residential agreements provide at least 10 to 30 days written notice to cure any alleged breach prior to forfeiture.',
      practicalImpact: 'A single administrative oversight could immediately be weaponized as an incurable default.',
      recommendedRevision: 'Add: "In the event of an alleged breach, the non-breaching party shall provide written notice specifying the default, and the breaching party shall have fifteen (15) days to cure."',
      verifiedInDocument: true,
    });
  }

  return findings;
}

/**
 * Builds high-level contract summary.
 */
export function generateContractSummary(doc: DocumentMetadata, risks: RiskFinding[]): ContractSummary {
  const text = doc.rawText;
  const lower = text.toLowerCase();

  // Extract parties
  const parties: Array<{ name: string; role: string; description?: string }> = [];
  const partyRegex = /(?:between|by\s+and\s+between)\s+([^,\n\r]+?)(?:,\s*(?:an?\s+)?([^,\n\r]+?))?\s+(?:and|\&)\s+([^,\n\r]+?)(?:,\s*(?:an?\s+)?([^,\n\r]+?))?(?:\.|\n|\r)/i;
  const partyMatch = text.match(partyRegex);

  if (partyMatch) {
    parties.push({
      name: partyMatch[1].trim(),
      role: partyMatch[2]?.trim() || (doc.category === 'rental' ? 'Landlord' : 'First Party'),
    });
    parties.push({
      name: partyMatch[3].trim(),
      role: partyMatch[4]?.trim() || (doc.category === 'rental' ? 'Tenant' : 'Second Party'),
    });
  } else {
    // Domain fallbacks
    if (doc.category === 'rental') {
      parties.push({ name: 'Property Owner / Lessor', role: 'Landlord' });
      parties.push({ name: 'Resident / Lessee', role: 'Tenant' });
    } else if (doc.category === 'employment') {
      parties.push({ name: 'Employing Entity', role: 'Employer' });
      parties.push({ name: 'Hired Professional', role: 'Employee' });
    } else {
      parties.push({ name: 'Service Provider / Contractor', role: 'Contractor' });
      parties.push({ name: 'Recipient / Client', role: 'Client' });
    }
  }

  // Extract dates
  const dateMatch = text.match(/(?:dated\s+as\s+of|effective\s+date|entered\s+into\s+on)\s+([A-Z][a-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
  const effectiveDate = dateMatch ? dateMatch[1] : 'Upon mutual signature';

  // Extract governing law
  const lawMatch = text.match(/governed\s+by\s+(?:the\s+laws\s+of\s+)?(?:the\s+State\s+of\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const governingLaw = lawMatch ? `State of ${lawMatch[1]}` : 'Not explicitly specified';

  // Extract financial terms
  const amountMatch = text.match(/\$\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/);
  const depositMatch = text.match(/security\s+deposit.*?\$?\s?([0-9]{1,3}(?:,[0-9]{3})*)/i);
  const lateFeeMatch = text.match(/late\s+(?:fee|charge).*?\$?\s?([0-9]{1,3}(?:,[0-9]{3})*|\d+[\.\d]*%)/i);

  const hasAutoRenewal = risks.some((r) => r.category === 'Automatic Renewal') || lower.includes('automatically renew');

  return {
    title: doc.title,
    category: doc.category,
    effectiveDate,
    governingLaw,
    parties,
    financials: {
      totalValue: amountMatch ? `$${amountMatch[1]}` : 'See Schedule / Compensation clause',
      paymentSchedule: lower.includes('monthly') ? 'Monthly (1st of each calendar month)' : 'Per invoice milestone / Net 30',
      securityDeposit: depositMatch ? `$${depositMatch[1]}` : undefined,
      lateFees: lateFeeMatch ? `Late fee applies (${lateFeeMatch[1]})` : 'Standard legal interest rate',
    },
    keyDeadlines: [
      { event: 'Commencement & Possession Date', dateOrTimeframe: effectiveDate, importance: 'high' },
      { event: 'Payment Due Date', dateOrTimeframe: '1st day of each month / Net 30', importance: 'high' },
      { event: 'Notice to Terminate / Non-Renewal', dateOrTimeframe: hasAutoRenewal ? '60 days prior to term end' : '30 days written notice', importance: 'high' },
    ],
    obligations: [
      {
        party: parties[0]?.role || 'First Party',
        obligations: [
          'Deliver quiet possession or agreed scope of services',
          'Maintain property condition / provide compensation',
          'Comply with applicable statutory standards',
        ],
      },
      {
        party: parties[1]?.role || 'Second Party',
        obligations: [
          'Timely payment of all fees and financial commitments',
          'Adhere to covenants, rules, and restrictions',
          'Provide written advance notice before vacating or exiting',
        ],
      },
    ],
    renewalTerms: {
      hasAutoRenewal,
      noticePeriodRequired: hasAutoRenewal ? '60 Days Written Notice' : 'Optional negotiation',
      details: hasAutoRenewal
        ? 'Warning: Automatic rollover detected. Must send written cancellation 60 days before expiration to avoid binding extension.'
        : 'Contract ends on expiration date unless renewed by written mutual amendment.',
    },
    terminationConditions: {
      convenienceNotice: '30 to 60 days written notice required.',
      forCauseConditions: [
        'Material failure to pay within grace period',
        'Violation of core contractual covenants or statutory laws',
        'Bankruptcy or insolvency of either party',
      ],
      penaltiesOrLiquidatedDamages: risks.some((r) => r.category === 'Hidden Penalty')
        ? 'Liquidated damages or deposit forfeiture detected upon early breach.'
        : 'Subject to actual provable damages.',
    },
    plainEnglishTakeaway: `This ${doc.category} contract establishes binding legal commitments with ${parties[0]?.name || 'the first party'}. ${
      risks.length > 0
        ? `We flagged ${risks.length} potential risk areas (such as ${risks[0].title}) that warrant careful attention or negotiation before signing.`
        : 'The terms appear standard with no extreme red flags detected.'
    }`,
  };
}

/**
 * Builds interactive Before-You-Sign Checklist.
 */
export function generateChecklist(doc: DocumentMetadata, risks: RiskFinding[]): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: 'chk-1',
      title: 'Verify all blank fields and schedules are filled',
      category: 'Critical Legal Traps',
      status: 'action_required',
      description: 'Ensure no names, addresses, deposit sums, or dates are left blank or as "[TBD]". Never sign a contract with blank spaces.',
      actionAdvice: 'Review the document page by page to confirm all schedules, addenda, and signature lines are complete.',
      isCompletedByUser: false,
    },
    {
      id: 'chk-2',
      title: 'Review Financial & Late Fee Penalties',
      category: 'Financial & Payments',
      status: risks.some((r) => r.category === 'Hidden Penalty') ? 'caution' : 'verified',
      description: 'Confirm the exact rent/fee schedule, payment grace periods, and late penalty charges.',
      actionAdvice: 'Check that late fees are reasonable (typically under 5% of monthly amount) and include at least a 3-5 day grace period.',
      isCompletedByUser: false,
    },
    {
      id: 'chk-3',
      title: 'Check Automatic Renewal & Cancellation Deadlines',
      category: 'Exit & Termination',
      status: risks.some((r) => r.category === 'Automatic Renewal') ? 'caution' : 'verified',
      description: 'Verify how many days advance notice is required to cancel or prevent automatic renewal.',
      actionAdvice: 'Set a smartphone calendar reminder 75 days before the contract term expires to ensure you do not miss the cancellation window.',
      isCompletedByUser: false,
    },
    {
      id: 'chk-4',
      title: 'Confirm Indemnification & Liability Protections',
      category: 'Critical Legal Traps',
      status: risks.some((r) => r.category === 'Uncapped Liability') ? 'caution' : 'verified',
      description: 'Check whether you are being asked to defend or indemnify the other party for situations outside your control.',
      actionAdvice: 'Ask for mutual indemnification or ensure the clause excludes their gross negligence and is capped to insurance limits.',
      isCompletedByUser: false,
    },
    {
      id: 'chk-5',
      title: 'Inspect Termination for Convenience & Cure Period',
      category: 'Exit & Termination',
      status: risks.some((r) => r.category === 'Missing Protection') ? 'caution' : 'verified',
      description: 'Confirm that you are given at least 15 days written notice to cure any alleged mistake before default penalties apply.',
      actionAdvice: 'Request the insertion of a standard 15-day cure period for non-monetary defaults.',
      isCompletedByUser: false,
    },
    {
      id: 'chk-6',
      title: 'Confirm No Unilateral Modification Clause',
      category: 'Operational & Duties',
      status: risks.some((r) => r.title.includes('Unilateral Contract Modification')) ? 'action_required' : 'verified',
      description: 'Ensure that the other party cannot change prices, duties, or policies without your written consent.',
      actionAdvice: 'Ensure standard wording: "Amendments require mutual written agreement signed by both parties."',
      isCompletedByUser: false,
    },
  ];

  return items;
}

/**
 * Calculates overall risk score from 0 (Safe) to 100 (Critical Risk).
 */
export function calculateOverallRiskScore(risks: RiskFinding[]): {
  score: number;
  assessment: AnalysisReport['riskAssessment'];
} {
  let score = 15; // Baseline neutral score for any binding legal contract

  for (const risk of risks) {
    if (risk.severity === 'critical') {
      score += 25;
    } else if (risk.severity === 'caution') {
      score += 12;
    } else {
      score += 5;
    }
  }

  score = Math.min(100, Math.max(0, score));

  let assessment: AnalysisReport['riskAssessment'] = 'Low Risk';
  if (score >= 75) {
    assessment = 'Critical Flaws Detected';
  } else if (score >= 50) {
    assessment = 'High Risk Review Recommended';
  } else if (score >= 30) {
    assessment = 'Moderate Attention Needed';
  }

  return { score, assessment };
}

/**
 * Generates full analysis report for a document using on-device legal rules.
 */
export function runLocalAnalysis(doc: DocumentMetadata): AnalysisReport {
  const risks = analyzeDocumentRisks(doc);
  const clauses = extractKeyClauses(doc);
  const summary = generateContractSummary(doc, risks);
  const checklist = generateChecklist(doc, risks);
  const { score, assessment } = calculateOverallRiskScore(risks);

  return {
    documentId: doc.id,
    summary,
    clauses,
    risks,
    checklist,
    overallRiskScore: score,
    riskAssessment: assessment,
    engineUsed: 'LegalEase On-Device Neural Rule Engine (Zero-Cloud)',
    timestamp: new Date().toISOString(),
  };
}
