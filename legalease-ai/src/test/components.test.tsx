import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { SummaryTab } from '../components/workspace/SummaryTab';
import { ContractSummary } from '../types';

describe('LegalEase AI UI Components', () => {
  it('renders prominent legal disclaimer banner stating not definitive legal advice', () => {
    render(<DisclaimerBanner />);
    expect(
      screen.getByText(/Informational Legal Assistance Only/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/not a law firm and does not provide legal advice/i)
    ).toBeInTheDocument();
  });

  it('renders SummaryTab with structured parties and financial commitments', () => {
    const mockSummary: ContractSummary = {
      title: 'Residential Lease Agreement',
      category: 'rental',
      effectiveDate: 'Nov 1, 2026',
      governingLaw: 'State of Texas',
      parties: [
        { name: 'Austin Horizon Properties', role: 'Landlord' },
        { name: 'Alex Rivera', role: 'Tenant' },
      ],
      financials: {
        totalValue: '$2,450.00',
        paymentSchedule: 'Monthly (1st)',
        securityDeposit: '$2,450.00',
        lateFees: '$150.00 after 5th',
      },
      keyDeadlines: [],
      obligations: [],
      renewalTerms: {
        hasAutoRenewal: true,
        noticePeriodRequired: '60 Days',
        details: 'Automatic renewal for 12 months.',
      },
      terminationConditions: {
        convenienceNotice: '30 days',
        forCauseConditions: [],
      },
      plainEnglishTakeaway: 'This lease binds tenant to $2,450 monthly rent with automatic renewal.',
    };

    render(<SummaryTab summary={mockSummary} />);
    expect(screen.getByText('Austin Horizon Properties')).toBeInTheDocument();
    const moneyElements = screen.getAllByText('$2,450.00');
    expect(moneyElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Automatic renewal for 12 months/i)).toBeInTheDocument();
  });
});
