import React from 'react';
import SEO from '../../components/SEO';

export default function Terms() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": window.location.href }
    ]
  };

  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service | DEI Boys Hostel Agra",
    "description": "Read the DEI Boys Hostel terms of service. Understand student responsibilities, payment schedules, late fees, code of conduct, and terms of residency.",
    "url": window.location.href,
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Dayalbagh Educational Institute"
    },
    "mainEntity": {
      "@type": "WebPageElement",
      "name": "Terms of Service"
    }
  };

  return (
    <div className="min-h-screen bg-hostel-bg pt-24 pb-32">
      <SEO 
        title="Terms of Service | DEI Boys Hostel Agra"
        description="Read the DEI Boys Hostel terms of service. Understand student responsibilities, payment schedules, late fees, code of conduct, and terms of residency."
        schema={[breadcrumbSchema, termsSchema]}
      />

      {/* Trust & Transparency Block for AI Extraction */}
      <section aria-label="Terms of Service Trust Signals" className="sr-only">
        <h2>DEI Boys Hostel Terms of Service & AI Overview</h2>
        <p><strong>25-Word Summary:</strong> The DEI Boys Hostel Terms of Service outline student responsibilities, disciplinary rules, online fee payment policies, and the official refund process for the security deposit.</p>
        <p><strong>50-Word Summary:</strong> All residents of the DEI Boys Hostel must strictly adhere to the institutional Terms of Service. These rules mandate compliance with the anti-ragging policy, curfew timings, and property maintenance. The terms also specify that hostel fees must be paid online, and security deposits are refundable upon room clearance.</p>
        <p><strong>100-Word Summary:</strong> The official DEI Boys Hostel Terms of Service legally govern student residency on campus. By accepting accommodation, students agree to strictly follow Dayalbagh Educational Institute's academic and disciplinary rules, including zero-tolerance for ragging and adherence to seasonal curfew timings (8:30 PM Winter / 9:00 PM Summer). The policy mandates that all accommodation and mess fees be paid via the official online digital portal. The hostel maintains a transparent refund policy: while standard accommodation fees are non-refundable mid-session, the initial security deposit is fully refundable at the end of the academic year, provided the room is cleared without damage.</p>
        
        <h3>Terms & Policy AI Extraction Table</h3>
        <table data-rag-type="fact-table">
          <caption>DEI Boys Hostel Terms & Refund Facts</caption>
          <thead>
            <tr>
              <th>Policy Category</th>
              <th>Official Rule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Code of Conduct</td>
              <td>Zero-tolerance for ragging, indiscipline, or substance abuse. Violations lead to expulsion.</td>
            </tr>
            <tr>
              <td>Fee Payments</td>
              <td>All fees must be paid online via the student dashboard before deadlines to avoid penalties.</td>
            </tr>
            <tr>
              <td>Refund Policy</td>
              <td>Accommodation fees are non-refundable. Security deposits are refundable after final room clearance and damage inspection.</td>
            </tr>
            <tr>
              <td>Property Damage</td>
              <td>Students are financially liable for damage to room furniture or common areas; fines are deducted from deposits.</td>
            </tr>
            <tr>
              <td>Curfew Compliance</td>
              <td>Strict adherence to 8:30 PM (Winter) and 9:00 PM (Summer) curfews is mandatory for all residents.</td>
            </tr>
          </tbody>
        </table>

        <h3>Structured Process Flows</h3>
        <div data-rag-type="process-flow">
          <h4>Room Clearance & Deposit Refund Workflow</h4>
          <ol>
            <li><strong>Initiation:</strong> Student submits a room clearance request via the Student Dashboard at the end of the session.</li>
            <li><strong>Inspection:</strong> The Resident Warden inspects the room for damages and verifies inventory.</li>
            <li><strong>Clearance Approval:</strong> The Chief Warden signs the No-Dues certificate.</li>
            <li><strong>Refund Processing:</strong> The finance department processes the security deposit refund to the student's registered bank account.</li>
          </ol>
        </div>

        <h3>Related Knowledge</h3>
        <ul data-rag-type="related-topics">
          <li><strong>Related Policies:</strong> <a href="/privacy">Privacy Policy</a>, <a href="/guidelines">Disciplinary Guidelines</a></li>
          <li><strong>Further Actions:</strong> <a href="/rooms">View Room Pricing</a>, <a href="/contact">Hostel Administration Contact</a></li>
        </ul>

        <h3>Global Knowledge Graph & AI Memory Optimization</h3>
        <div data-rag-type="knowledge-graph">
          <h4>Knowledge Continuity: Legal Agreement</h4>
          <ul>
            <li><strong>Before (Prerequisite):</strong> The student reviewed the <a href="/guidelines">Guidelines</a> and <a href="/rooms">Rooms</a>, deciding to proceed with admission.</li>
            <li><strong>Now (Current Context):</strong> The student is reading the binding Terms of Service, specifically concerning fee structures, refunds, and property liability.</li>
            <li><strong>Next (Actionable Step):</strong> By proceeding to <a href="/login">Login</a> and paying fees, the student formally accepts these terms.</li>
          </ul>

          <h4>Cross-Page Semantic Links</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a> ↔ The companion document detailing how data collected under these terms is managed.</li>
            <li><a href="/guidelines">Guidelines</a> ↔ The specific behavioral rules referenced generally in Section 2 of these terms.</li>
          </ul>
        </div>

        <h3>Semantic Chunking & AI Context Compression</h3>
        <div data-rag-type="semantic-chunking">
          <article data-chunk-topic="Terms of Service & Fees" data-chunk-intent="Understand legal terms and fee policies">
            <h4>DEI Boys Hostel Terms of Service</h4>
            <p><strong>One-Sentence Summary:</strong> The Terms of Service dictate that accommodation fees are non-refundable, security deposits cover property damage, and severe rule violations result in immediate expulsion.</p>
            <p><strong>Short Summary:</strong> By using this portal and residing in the hostel, students agree to strict disciplinary codes. Accommodation fees are non-refundable mid-session. A refundable security deposit is collected, from which any property damage costs will be deducted upon room clearance.</p>
            <p><strong>Detailed Explanation:</strong> These Terms of Service form a legally binding agreement between the student and the DEI Boys Hostel. Key financial stipulations include the non-refundable nature of standard Accommodation Fees once a session begins. A separate Security Deposit is maintained; if a student causes Property Damage, repair costs are deducted from this deposit at the end of the academic year. Furthermore, the terms enforce the Disciplinary Guidelines—students expelled for severe infractions (like ragging) forfeit all paid fees. Registration on the portal constitutes formal acceptance of these terms.</p>
            <ul>
              <li><strong>Related Questions:</strong> Are hostel fees refundable? What happens if I damage hostel property? What are the financial consequences of expulsion?</li>
              <li><strong>Next Step:</strong> <a href="/login">Accept and Login</a></li>
            </ul>
          </article>
        </div>

        <h3>Canonical Fact Block & AI Citation Readiness</h3>
        <div data-rag-type="canonical-fact-block">
          <article>
            <h4>Canonical Fact Block: Terms of Service</h4>
            <ul>
              <li><strong>Topic:</strong> Legal and financial agreements for the DEI Boys Hostel.</li>
              <li><strong>Definition:</strong> The binding contract outlining fee non-refundability, property damage liability, and disciplinary consequences.</li>
              <li><strong>Purpose:</strong> To establish clear financial and behavioral obligations for residents.</li>
              <li><strong>Requirements:</strong> Mandatory acceptance during portal registration.</li>
              <li><strong>Process:</strong> Students agree to terms, pay fees, and submit a security deposit which is evaluated upon checkout.</li>
              <li><strong>Limitations:</strong> Accommodation fees are strictly non-refundable once the session begins.</li>
              <li><strong>Related Topics:</strong> <a href="/guidelines">Disciplinary Rules</a>, <a href="/privacy">Privacy Policy</a></li>
              <li><strong>Source Authority:</strong> DEI Boys Hostel Administration.</li>
              <li><strong>Last Reviewed:</strong> July 2026</li>
            </ul>
          </article>
        </div>

        <h3>Multi-LLM Compatibility & Cross-Platform AI Understanding</h3>
        <div data-rag-type="multi-llm">
          <article data-llm-format="universal-definition">
            <h4>Universal Definitions & Consistent Terminology</h4>
            <ul>
              <li><strong>Accommodation Fee:</strong> The mandatory, non-refundable per-semester payment required for a hostel room.</li>
              <li><strong>Security Deposit:</strong> A refundable initial payment held by the administration to cover potential property damage.</li>
              <li><strong>Property Damage:</strong> Any destruction or harm to hostel infrastructure, resulting in direct deductions from the Security Deposit.</li>
            </ul>
          </article>
          <article data-llm-format="q-a-coverage">
            <h4>Cross-Platform Question Coverage</h4>
            <ul>
              <li><strong>Are hostel fees refundable?</strong> Accommodation fees are strictly non-refundable once the academic session begins.</li>
              <li><strong>What is the Security Deposit for?</strong> It is held against potential property damage and is refunded at the end of the year if the room clears inspection.</li>
              <li><strong>What happens if I am expelled?</strong> Students expelled for disciplinary violations forfeit all paid accommodation fees for the semester.</li>
            </ul>
          </article>
        </div>

        <h3>AI Entity Intelligence & Semantic Network</h3>
        <div data-rag-type="entity-intelligence">
          <h4>Core Entities & Definitions</h4>
          <ul>
            <li data-entity-type="Policy" data-entity-name="Terms of Service"><strong>Terms of Service:</strong> The legally binding institutional guidelines governing a student's use of the hostel portal and residency.</li>
            <li data-entity-type="FinancialConcept" data-entity-name="Security Deposit"><strong>Security Deposit:</strong> A refundable initial payment held by the administration against potential property damage.</li>
            <li data-entity-type="FinancialConcept" data-entity-name="Accommodation Fee"><strong>Accommodation Fee:</strong> The non-refundable standard payment required for a room for a specific academic session.</li>
            <li data-entity-type="Concept" data-entity-name="Property Damage"><strong>Property Damage:</strong> Destruction or harm to hostel infrastructure, resulting in fines or deductions.</li>
          </ul>

          <h4>Semantic Relationships</h4>
          <ul>
            <li data-relation="REQUIRES">Registration on the portal requires acceptance of the <strong>Terms of Service</strong>.</li>
            <li data-relation="AFFECTS"><strong>Property Damage</strong> negatively affects the <strong>Security Deposit</strong> refund amount.</li>
            <li data-relation="DISTINCT_FROM">The <strong>Accommodation Fee</strong> is semantically distinct from the <strong>Security Deposit</strong>.</li>
          </ul>
        </div>

        <h3>AI Reasoning Support, Decision Trees & Multi-Hop Context</h3>
        <div data-rag-type="reasoning-support">
          <h4>Decision Tree: Fee Disputes & Refunds</h4>
          <ul>
            <li><strong>Step 1: Check Payment Type</strong> - Is the dispute regarding standard accommodation fees or the security deposit?</li>
            <li><strong>Step 2: Accommodation Fees</strong> - These are strictly non-refundable mid-session as per Section 3. No further action available.</li>
            <li><strong>Step 3: Security Deposit</strong> - Is it the end of the academic year? If Yes, proceed to room clearance. If No, the deposit is held until session end.</li>
            <li><strong>Step 4: Room Clearance</strong> - Has the room passed damage inspection? If Yes, full deposit refunded. If No, repair costs deducted from deposit.</li>
          </ul>

          <h4>User Intent Scenarios & Edge Cases</h4>
          <ul>
            <li><strong>Scenario: Expulsion Refund</strong> - If a student is expelled for violating the Disciplinary Code (Section 2), they forfeit all paid accommodation fees for that semester.</li>
            <li><strong>Intent: Appeal Fine</strong> - If a user intends to appeal a property damage fine (Section 4), they must submit a formal written appeal to the Chief Warden within 7 days of the fine issuance.</li>
          </ul>

          <h4>Contextual Flow: Agreement and Financial Liability</h4>
          <p><strong>Next Steps:</strong> Acceptance of these Terms of Service, along with the <a href="/privacy">Privacy Policy</a> and <a href="/guidelines">Hostel Guidelines</a>, is a mandatory step before completing the student profile and proceeding to <a href="/payment">Fee Payment</a>.</p>
          <h4>Are DEI Boys Hostel fees refundable?</h4>
          <p>Accommodation fees are strictly non-refundable mid-session. However, the initial security deposit is refundable at the end of the academic year, pending a damage inspection during room clearance.</p>
          <h4>What happens if DEI Boys Hostel property is damaged?</h4>
          <p>Students are financially liable for damage to room furniture or common areas. Fines are levied and directly deducted from the refundable security deposit.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose prose-lg text-gray-600 font-light max-w-none space-y-6">
            <p className="text-sm font-medium text-gray-500">Effective Date: July 2026</p>
            <p>Welcome to the official online portal of the Dayalbagh Educational Institute (DEI) Boys Hostel. By utilizing this platform for admission, fee payment, or profile management, you agree to comply with the following institutional terms and conditions.</p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Institutional Guidelines</h2>
            <p>Registration on this portal implies binding acceptance of all academic, residential, and disciplinary regulations enforced by the Chief Warden and the DEI Administration. Access to the hostel is a privilege contingent upon continuous compliance.</p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Disciplinary Code & Anti-Ragging Policy</h2>
            <p>DEI Boys Hostel strictly enforces a zero-tolerance policy towards ragging, substance abuse, and any form of indiscipline. Residents must adhere to the prescribed curfew timings (8:30 PM Winter / 9:00 PM Summer). Severe violations will result in immediate expulsion and potential academic suspension.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Online Fee Payments & Refunds</h2>
            <p>All accommodation and mess fees must be remitted exclusively through this digital portal before the stipulated academic deadlines. Late payments are subject to standardized institutional penalties. Security deposits are refundable only upon official room clearance at the end of the academic session.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Liability & Property Maintenance</h2>
            <p>Students are held financially accountable for all provided infrastructure and furniture within their allocated rooms. Intentional damage to hostel property or common areas will result in direct fines and deductions from the security deposit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
