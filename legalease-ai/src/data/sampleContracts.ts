import { DocumentMetadata } from '../types';
import { chunkDocument } from '../services/extractors/textChunker';

export const SAMPLE_CONTRACTS: DocumentMetadata[] = [
  {
    id: 'sample-residential-lease',
    title: 'Standard Residential Lease Agreement',
    fileName: 'Residential_Lease_Agreement_Austin.pdf',
    fileType: 'pdf',
    fileSize: 48200,
    pageCount: 3,
    wordCount: 1420,
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    category: 'rental',
    isSample: true,
    lastAnalyzedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    rawText: `RESIDENTIAL LEASE AGREEMENT

THIS RESIDENTIAL LEASE AGREEMENT (the "Agreement") is entered into as of October 1, 2026, by and between Austin Horizon Properties LLC, a Texas limited liability company ("Landlord"), and Alex Rivera ("Tenant").

1. PREMISES AND TERM
Landlord hereby leases to Tenant and Tenant hereby leases from Landlord the residential property located at 4102 South Congress Ave, Apt 304, Austin, TX 78704 (the "Premises"). The lease term commences on November 1, 2026, and shall expire on October 31, 2027 (the "Initial Term").

2. AUTOMATIC RENEWAL AND NOTICE TO VACATE
Upon the expiration of the Initial Term, this Agreement shall automatically renew for successive terms of twelve (12) months each, unless either party delivers written notice of non-renewal to the other party at least sixty (60) days prior to the expiration of the then-current term. Verbal notice shall be null and void.

3. RENT, PAYMENTS, AND LATE PENALTIES
Tenant shall pay Landlord a monthly rent of $2,450.00, payable in advance on or before the first (1st) day of each calendar month. If rent is not received by Landlord by 11:59 PM on the fifth (5th) day of the month, Tenant shall pay a late fee of $150.00 plus an additional penalty of $15.00 per day until rent is paid in full.

4. SECURITY DEPOSIT
Tenant has deposited with Landlord the sum of $2,450.00 as a Security Deposit. Landlord may retain all or any portion of the Security Deposit to repair damages beyond ordinary wear and tear, or apply said deposit toward unpaid rent, cleaning expenses, or administrative fees at Landlord's sole and absolute discretion.

5. EARLY TERMINATION AND LIQUIDATED DAMAGES
In the event Tenant vacates, abandons, or terminates this Lease prior to the expiration of the term for any reason, Tenant shall forfeit the entire Security Deposit and shall immediately pay to Landlord a liquidated damages penalty of $3,500.00, representing liquidated damages and not a penalty. Tenant shall remain liable for all accrued rent until a replacement tenant is secured.

6. INDEMNIFICATION AND HOLD HARMLESS
Tenant agrees to defend, indemnify, and hold harmless Landlord, its agents, and property managers from and against any and all claims, liabilities, lawsuits, losses, and reasonable attorney's fees arising from or related to any personal injury, property damage, or loss occurring within the Premises during the Term, regardless of whether caused in part by Landlord's negligence.

7. ACCESS AND INSPECTION
Landlord and its authorized agents shall have the right to enter the Premises at any time in its sole discretion, without prior notice, for the purpose of inspecting the condition of the Premises or showing the property to prospective purchasers.

8. ATTORNEYS' FEES
In the event Landlord employs an attorney to enforce any provision of this Agreement or to collect unpaid sums, Tenant shall reimburse Landlord for all reasonable attorney's fees, court costs, and collection expenses incurred by Landlord.

9. GOVERNING LAW AND SEVERABILITY
This Agreement shall be governed by the laws of the State of Texas. If any provision of this Agreement is declared invalid or unenforceable, such determination shall not affect the validity of the remaining provisions.`,
    pages: [
      {
        pageNumber: 1,
        text: `RESIDENTIAL LEASE AGREEMENT

THIS RESIDENTIAL LEASE AGREEMENT (the "Agreement") is entered into as of October 1, 2026, by and between Austin Horizon Properties LLC, a Texas limited liability company ("Landlord"), and Alex Rivera ("Tenant").

1. PREMISES AND TERM
Landlord hereby leases to Tenant and Tenant hereby leases from Landlord the residential property located at 4102 South Congress Ave, Apt 304, Austin, TX 78704 (the "Premises"). The lease term commences on November 1, 2026, and shall expire on October 31, 2027 (the "Initial Term").

2. AUTOMATIC RENEWAL AND NOTICE TO VACATE
Upon the expiration of the Initial Term, this Agreement shall automatically renew for successive terms of twelve (12) months each, unless either party delivers written notice of non-renewal to the other party at least sixty (60) days prior to the expiration of the then-current term. Verbal notice shall be null and void.

3. RENT, PAYMENTS, AND LATE PENALTIES
Tenant shall pay Landlord a monthly rent of $2,450.00, payable in advance on or before the first (1st) day of each calendar month. If rent is not received by Landlord by 11:59 PM on the fifth (5th) day of the month, Tenant shall pay a late fee of $150.00 plus an additional penalty of $15.00 per day until rent is paid in full.`,
        charStartIndex: 0,
        charEndIndex: 1210,
      },
      {
        pageNumber: 2,
        text: `4. SECURITY DEPOSIT
Tenant has deposited with Landlord the sum of $2,450.00 as a Security Deposit. Landlord may retain all or any portion of the Security Deposit to repair damages beyond ordinary wear and tear, or apply said deposit toward unpaid rent, cleaning expenses, or administrative fees at Landlord's sole and absolute discretion.

5. EARLY TERMINATION AND LIQUIDATED DAMAGES
In the event Tenant vacates, abandons, or terminates this Lease prior to the expiration of the term for any reason, Tenant shall forfeit the entire Security Deposit and shall immediately pay to Landlord a liquidated damages penalty of $3,500.00, representing liquidated damages and not a penalty. Tenant shall remain liable for all accrued rent until a replacement tenant is secured.

6. INDEMNIFICATION AND HOLD HARMLESS
Tenant agrees to defend, indemnify, and hold harmless Landlord, its agents, and property managers from and against any and all claims, liabilities, lawsuits, losses, and reasonable attorney's fees arising from or related to any personal injury, property damage, or loss occurring within the Premises during the Term, regardless of whether caused in part by Landlord's negligence.`,
        charStartIndex: 1212,
        charEndIndex: 2380,
      },
      {
        pageNumber: 3,
        text: `7. ACCESS AND INSPECTION
Landlord and its authorized agents shall have the right to enter the Premises at any time in its sole discretion, without prior notice, for the purpose of inspecting the condition of the Premises or showing the property to prospective purchasers.

8. ATTORNEYS' FEES
In the event Landlord employs an attorney to enforce any provision of this Agreement or to collect unpaid sums, Tenant shall reimburse Landlord for all reasonable attorney's fees, court costs, and collection expenses incurred by Landlord.

9. GOVERNING LAW AND SEVERABILITY
This Agreement shall be governed by the laws of the State of Texas. If any provision of this Agreement is declared invalid or unenforceable, such determination shall not affect the validity of the remaining provisions.

IN WITNESS WHEREOF, the parties have executed this Residential Lease Agreement as of the date first above written.`,
        charStartIndex: 2382,
        charEndIndex: 3250,
      },
    ],
    chunks: [],
  },
  {
    id: 'sample-tech-employment',
    title: 'Senior Software Engineer Employment Agreement',
    fileName: 'Tech_Employment_Agreement_Nexus.docx',
    fileType: 'docx',
    fileSize: 52400,
    pageCount: 2,
    wordCount: 1180,
    uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    category: 'employment',
    isSample: true,
    rawText: `EMPLOYMENT AGREEMENT

This EMPLOYMENT AGREEMENT is entered into as of November 15, 2026, between Nexus Cloud Systems Inc. ("Company") and Jordan Hayes ("Employee").

1. POSITION AND COMPENSATION
Employee is employed as Senior Platform Engineer at an annual base compensation of $165,000.00, paid semi-monthly. Employment is at-will; either Company or Employee may terminate employment at any time with or without cause or advance notice.

2. NON-COMPETE COVENANT
During the period of employment and for a period of two (2) years following termination of employment for any reason, Employee shall not directly or indirectly engage in, manage, operate, join, or render services to any business competitive with Company anywhere worldwide.

3. ASSIGNMENT OF INVENTIONS
Employee hereby irrevocably assigns to Company all right, title, and interest in and to any and all inventions, designs, source code, and improvements developed by Employee, whether created during working hours or personal time, using Company equipment or personal devices.

4. MANDATORY ARBITRATION
Any dispute, controversy, or claim arising out of this Agreement shall be settled exclusively by final and binding arbitration. Employee waives all right to a trial by jury or participation in a class action.`,
    pages: [
      {
        pageNumber: 1,
        text: `EMPLOYMENT AGREEMENT

This EMPLOYMENT AGREEMENT is entered into as of November 15, 2026, between Nexus Cloud Systems Inc. ("Company") and Jordan Hayes ("Employee").

1. POSITION AND COMPENSATION
Employee is employed as Senior Platform Engineer at an annual base compensation of $165,000.00, paid semi-monthly. Employment is at-will; either Company or Employee may terminate employment at any time with or without cause or advance notice.

2. NON-COMPETE COVENANT
During the period of employment and for a period of two (2) years following termination of employment for any reason, Employee shall not directly or indirectly engage in, manage, operate, join, or render services to any business competitive with Company anywhere worldwide.`,
        charStartIndex: 0,
        charEndIndex: 780,
      },
      {
        pageNumber: 2,
        text: `3. ASSIGNMENT OF INVENTIONS
Employee hereby irrevocably assigns to Company all right, title, and interest in and to any and all inventions, designs, source code, and improvements developed by Employee, whether created during working hours or personal time, using Company equipment or personal devices.

4. MANDATORY ARBITRATION
Any dispute, controversy, or claim arising out of this Agreement shall be settled exclusively by final and binding arbitration. Employee waives all right to a trial by jury or participation in a class action.

5. GOVERNING LAW
This agreement shall be governed by the laws of the State of Delaware.`,
        charStartIndex: 782,
        charEndIndex: 1480,
      },
    ],
    chunks: [],
  },
  {
    id: 'sample-freelance-services',
    title: 'Master Consulting & Professional Services Agreement',
    fileName: 'Freelance_Master_Services_Agreement.pdf',
    fileType: 'pdf',
    fileSize: 39500,
    pageCount: 2,
    wordCount: 890,
    uploadedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    category: 'service',
    isSample: true,
    rawText: `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is dated December 1, 2026, between Apex Media Partners ("Client") and Sarah Lin d/b/a Lin Creative ("Contractor").

1. SCOPE AND DELIVERABLES
Contractor agrees to perform brand design and web architecture deliverables specified in individual Statements of Work ("SOW").

2. PAYMENT TERMS
Invoices shall be payable Net 60 days following client review and approval. Any late payment shall not incur interest penalties unless past 90 days.

3. INDEMNITY AND LIABILITY
Contractor shall defend, indemnify, and hold harmless Client against any and all claims, damages, liabilities, and attorney's fees arising from deliverables provided. Contractor's liability under this Agreement shall be uncapped. Client's maximum cumulative liability shall be capped at $500.00.

4. TERMINATION FOR CONVENIENCE
Client may terminate this Agreement or any SOW at any time without cause upon zero (0) days notice. Contractor must provide sixty (60) days prior written notice to terminate.`,
    pages: [
      {
        pageNumber: 1,
        text: `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is dated December 1, 2026, between Apex Media Partners ("Client") and Sarah Lin d/b/a Lin Creative ("Contractor").

1. SCOPE AND DELIVERABLES
Contractor agrees to perform brand design and web architecture deliverables specified in individual Statements of Work ("SOW").

2. PAYMENT TERMS
Invoices shall be payable Net 60 days following client review and approval. Any late payment shall not incur interest penalties unless past 90 days.`,
        charStartIndex: 0,
        charEndIndex: 520,
      },
      {
        pageNumber: 2,
        text: `3. INDEMNITY AND LIABILITY
Contractor shall defend, indemnify, and hold harmless Client against any and all claims, damages, liabilities, and attorney's fees arising from deliverables provided. Contractor's liability under this Agreement shall be uncapped. Client's maximum cumulative liability shall be capped at $500.00.

4. TERMINATION FOR CONVENIENCE
Client may terminate this Agreement or any SOW at any time without cause upon zero (0) days notice. Contractor must provide sixty (60) days prior written notice to terminate.

5. GOVERNING LAW
Governed by the laws of the State of New York.`,
        charStartIndex: 522,
        charEndIndex: 1120,
      },
    ],
    chunks: [],
  },
];

// Initialize chunks for each sample contract
for (const sample of SAMPLE_CONTRACTS) {
  sample.chunks = chunkDocument(sample.pages);
}
