import { describe, it, expect } from 'vitest';
import {
  analyzeDocumentRisks,
  calculateOverallRiskScore,
  extractKeyClauses,
  generateContractSummary,
} from '../services/ai/ruleEngine';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';

describe('Legal Rule Engine & Risk Radar', () => {
  const sampleLease = SAMPLE_CONTRACTS[0]; // Austin Lease with liquidated damages & auto-renewal

  it('detects automatic renewal / evergreen clauses with page attribution', () => {
    const risks = analyzeDocumentRisks(sampleLease);
    const autoRenewalRisk = risks.find((r) => r.category === 'Automatic Renewal');
    expect(autoRenewalRisk).toBeDefined();
    expect(autoRenewalRisk?.severity).toBe('caution');
    expect(autoRenewalRisk?.verifiedInDocument).toBe(true);
    expect(autoRenewalRisk?.pageNumber).toBe(1);
  });

  it('detects liquidated damages and punitive deposit forfeitures', () => {
    const risks = analyzeDocumentRisks(sampleLease);
    const liquidatedRisk = risks.find((r) => r.title.includes('Liquidated Damages'));
    expect(liquidatedRisk).toBeDefined();
    expect(liquidatedRisk?.severity).toBe('critical');
    expect(liquidatedRisk?.recommendedRevision).toContain('actual, direct');
  });

  it('detects uncapped and one-sided indemnification clauses', () => {
    const risks = analyzeDocumentRisks(sampleLease);
    const indemnityRisk = risks.find((r) => r.category === 'Uncapped Liability');
    expect(indemnityRisk).toBeDefined();
    expect(indemnityRisk?.severity).toBe('critical');
  });

  it('calculates elevated risk score for contracts containing critical exposure', () => {
    const risks = analyzeDocumentRisks(sampleLease);
    const { score, assessment } = calculateOverallRiskScore(risks);
    expect(score).toBeGreaterThanOrEqual(60);
    expect(assessment).toMatch(/Risk|Critical/);
  });

  it('extracts structured contract summary with parties and financials', () => {
    const risks = analyzeDocumentRisks(sampleLease);
    const summary = generateContractSummary(sampleLease, risks);
    expect(summary.category).toBe('rental');
    expect(summary.financials.totalValue).toContain('$2,450');
    expect(summary.renewalTerms.hasAutoRenewal).toBe(true);
    expect(summary.plainEnglishTakeaway.length).toBeGreaterThan(20);
  });
});
