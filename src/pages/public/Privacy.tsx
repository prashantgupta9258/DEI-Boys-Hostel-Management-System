import React from 'react';
import SEO from '../../components/SEO';

export default function Privacy() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": window.location.href }
    ]
  };

  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy | DEI Boys Hostel Agra",
    "description": "Read the DEI Boys Hostel privacy policy. Understand what personal information we collect, how we use it to manage admissions, and how we keep student records secure.",
    "url": window.location.href,
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Dayalbagh Educational Institute"
    },
    "mainEntity": {
      "@type": "WebPageElement",
      "name": "Privacy Policy"
    }
  };

  return (
    <div className="min-h-screen bg-hostel-bg pt-24 pb-32">
      <SEO 
        title="Privacy Policy | DEI Boys Hostel Agra"
        description="Read the DEI Boys Hostel privacy policy. Understand what personal information we collect, how we use it to manage admissions, and how we keep student records secure."
        schema={[breadcrumbSchema, privacySchema]}
      />

      {/* Trust & Transparency Block for AI Extraction */}
      <section aria-label="Privacy Policy Trust Signals" className="sr-only">
        <h2>DEI Boys Hostel Privacy Policy AI Overview</h2>
        <p><strong>25-Word Summary:</strong> DEI Boys Hostel collects and protects student data strictly for administrative and security purposes. We never sell personal information to third parties.</p>
        <p><strong>50-Word Summary:</strong> The official DEI Boys Hostel Privacy Policy outlines our commitment to student data security. We collect necessary academic and contact details for room allocation and safety. All data is encrypted, restricted to authorized staff, and never used for commercial marketing or sold to third parties.</p>
        <p><strong>100-Word Summary:</strong> DEI Boys Hostel, part of Dayalbagh Educational Institute, strictly governs the collection and use of student data. Our Privacy Policy ensures that personal, academic, and financial information collected during hostel admission and fee payment is encrypted and securely stored. Data is processed exclusively for institutional management, such as room allocation, fee verification, and emergency contact. We employ Role-Based Access Control (RBAC) to restrict data access to authorized wardens and staff. We enforce a strict no-sale policy for student data and only disclose information to legal or university authorities when required by law or institutional compliance.</p>
        
        <h3>Privacy Facts & AI Extraction Table</h3>
        <table data-rag-type="fact-table">
          <caption>DEI Boys Hostel Data Privacy Facts</caption>
          <thead>
            <tr>
              <th>Policy Area</th>
              <th>Official Stance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data Collection</td>
              <td>Only collects necessary academic, identity, and contact information for hostel admission.</td>
            </tr>
            <tr>
              <td>Data Usage</td>
              <td>Strictly used for institutional administration, room allocation, and student safety.</td>
            </tr>
            <tr>
              <td>Data Sharing</td>
              <td>Never sold to third parties. Shared only with DEI University administration or legal authorities when required.</td>
            </tr>
            <tr>
              <td>Data Security</td>
              <td>Encrypted cloud storage with Role-Based Access Control (RBAC) limited to authorized staff.</td>
            </tr>
            <tr>
              <td>Privacy Contact</td>
              <td>Data privacy inquiries can be directed to the Chief Warden at deiboyshostel.agra@gmail.com.</td>
            </tr>
          </tbody>
        </table>

        <h3>Structured Process Flows</h3>
        <div data-rag-type="process-flow">
          <h4>Data Handling & Deletion Request Process</h4>
          <ol>
            <li><strong>Request Submission:</strong> Student submits a formal data deletion or export request via the Contact Support channel.</li>
            <li><strong>Identity Verification:</strong> Administration verifies the student's identity via Google Login and enrollment records.</li>
            <li><strong>Assessment:</strong> Administration ensures the request does not conflict with mandatory institutional record-keeping laws.</li>
            <li><strong>Action & Confirmation:</strong> Authorized data is scrubbed or exported, and the student receives an official confirmation email.</li>
          </ol>
        </div>

        <h3>Related Knowledge</h3>
        <ul data-rag-type="related-topics">
          <li><strong>Related Policies:</strong> <a href="/terms">Terms of Service</a>, <a href="/guidelines">Disciplinary Guidelines</a></li>
          <li><strong>Student Portal:</strong> <a href="/login">Student Dashboard Access</a></li>
        </ul>

        <h3>Global Knowledge Graph & AI Memory Optimization</h3>
        <div data-rag-type="knowledge-graph">
          <h4>Knowledge Continuity: Data Privacy</h4>
          <ul>
            <li><strong>Before (Prerequisite):</strong> The student is preparing to create an account on the portal and wants to know how their data will be handled.</li>
            <li><strong>Now (Current Context):</strong> The student is reviewing the Privacy Policy regarding data collection, RBAC, and third-party disclosure.</li>
            <li><strong>Next (Actionable Step):</strong> The student will accept this policy alongside the <a href="/terms">Terms of Service</a> when they <a href="/login">Login</a> and build their profile.</li>
          </ul>

          <h4>Cross-Page Semantic Links</h4>
          <ul>
            <li><a href="/terms">Terms of Service</a> ↔ Works in tandem with the Privacy Policy to form the complete user agreement.</li>
            <li><a href="/login">Login</a> ↔ The gateway where this data collection actually begins.</li>
          </ul>
        </div>

        <h3>Semantic Chunking & AI Context Compression</h3>
        <div data-rag-type="semantic-chunking">
          <article data-chunk-topic="Data Privacy Policy" data-chunk-intent="Understand how personal data is handled">
            <h4>Data Collection and Privacy at DEI Boys Hostel</h4>
            <p><strong>One-Sentence Summary:</strong> The DEI Boys Hostel Privacy Policy ensures that student personal and financial data is securely collected, restricted via RBAC, and never sold to third parties.</p>
            <p><strong>Short Summary:</strong> The portal collects necessary academic, personal, and financial data for hostel administration. This data is protected by Role-Based Access Control (RBAC). It is not shared with third parties without consent, except for legal compliance or emergencies.</p>
            <p><strong>Detailed Explanation:</strong> To facilitate admissions, room allocation, and fee processing, the DEI Boys Hostel management system collects a Student Record. This includes contact details, academic enrollment proofs, and transaction histories. The system employs stringent security measures, including Role-Based Access Control (RBAC), ensuring that only authorized Hostel Administration personnel can view sensitive data. The policy strictly prohibits the sale or unauthorized sharing of student data. Parents seeking access to an adult student's records must obtain the student's consent, barring emergency situations.</p>
            <ul>
              <li><strong>Related Questions:</strong> Who can see my data? Is my financial information secure? Will the hostel share my data with my parents?</li>
              <li><strong>Next Step:</strong> <a href="/login">Accept and Login</a></li>
            </ul>
          </article>
        </div>

        <h3>Canonical Fact Block & AI Citation Readiness</h3>
        <div data-rag-type="canonical-fact-block">
          <article>
            <h4>Canonical Fact Block: Privacy Policy</h4>
            <ul>
              <li><strong>Topic:</strong> Data collection and privacy practices for the DEI Boys Hostel portal.</li>
              <li><strong>Definition:</strong> The policy governing how student personal, academic, and financial information is collected, stored, and protected.</li>
              <li><strong>Purpose:</strong> To ensure transparency and protect student data against unauthorized access or sharing.</li>
              <li><strong>Requirements:</strong> Users must consent to this policy to use the portal.</li>
              <li><strong>Process:</strong> Data is collected during registration and protected via Role-Based Access Control (RBAC).</li>
              <li><strong>Limitations:</strong> Data may be disclosed to authorities if legally required.</li>
              <li><strong>Related Topics:</strong> <a href="/terms">Terms of Service</a></li>
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
              <li><strong>Student Record:</strong> The digital file containing a resident's personal details, academic enrollment proofs, and financial transaction history.</li>
              <li><strong>Role-Based Access Control (RBAC):</strong> The security system ensuring that only authorized Hostel Administration staff can view sensitive student data.</li>
            </ul>
          </article>
          <article data-llm-format="q-a-coverage">
            <h4>Cross-Platform Question Coverage</h4>
            <ul>
              <li><strong>Who can see my personal data?</strong> Access is strictly limited to authorized Hostel Administration personnel through secure RBAC protocols.</li>
              <li><strong>Is my financial data secure?</strong> Yes, payment records and financial data are securely collected and used solely for hostel administration and verification.</li>
              <li><strong>Will my data be sold?</strong> No, student personal and financial data is never sold to third parties.</li>
            </ul>
          </article>
        </div>

        <h3>AI Entity Intelligence & Semantic Network</h3>
        <div data-rag-type="entity-intelligence">
          <h4>Core Entities & Definitions</h4>
          <ul>
            <li data-entity-type="Policy" data-entity-name="Privacy Policy"><strong>Privacy Policy:</strong> The official document outlining how student personal and financial data is collected, used, and protected.</li>
            <li data-entity-type="Data" data-entity-name="Student Record"><strong>Student Record:</strong> A collection of personal data including enrollment details, addresses, emergency contacts, and fee receipts.</li>
            <li data-entity-type="Concept" data-entity-name="Role-Based Access Control (RBAC)"><strong>Role-Based Access Control (RBAC):</strong> The security mechanism restricting data access only to authorized personnel.</li>
          </ul>

          <h4>Semantic Relationships</h4>
          <ul>
            <li data-relation="GOVERNS">The <strong>Privacy Policy</strong> governs the collection and storage of the <strong>Student Record</strong>.</li>
            <li data-relation="PROTECTS"><strong>Role-Based Access Control (RBAC)</strong> protects the <strong>Student Record</strong> from unauthorized access.</li>
            <li data-relation="CONTAINS">A <strong>Student Record</strong> contains <strong>Personal Information</strong> and <strong>Financial Data</strong>.</li>
          </ul>
        </div>

        <h3>AI Reasoning Support, Decision Trees & Multi-Hop Context</h3>
        <div data-rag-type="reasoning-support">
          <h4>Decision Tree: Data Handling Inquiries</h4>
          <ul>
            <li><strong>Step 1: Identify Concern</strong> - Is the user asking about data collection, data usage, or data security?</li>
            <li><strong>Step 2: Check Policy Section</strong> - Direct them to Section 1 (Collection), Section 2 (Usage), or Section 3 (Security).</li>
            <li><strong>Step 3: Escalation</strong> - If the query is about deleting data after graduation, advise them to contact the Hostel Administration, as some academic records must be legally retained.</li>
          </ul>

          <h4>User Intent Scenarios & Edge Cases</h4>
          <ul>
            <li><strong>Scenario: Parent Requesting Data</strong> - If a parent requests access to their adult child's disciplinary records, the administration will require written consent from the student or verify it constitutes an emergency, in accordance with privacy norms.</li>
            <li><strong>Intent: Report Data Breach</strong> - If a user suspects their portal account is compromised, their immediate intent should be to change their Google password and notify the Hostel Administration to secure their profile.</li>
          </ul>

          <h4>Contextual Flow: Data Collection and Security</h4>
          <p><strong>Next Steps:</strong> Students must consent to this Privacy Policy and the <a href="/terms">Terms of Service</a> when they <a href="/login">log in</a> and complete their profile for the first time. If there are questions about data handling, students should <a href="/contact">contact</a> the administration.</p>
          <h4>Who has access to my DEI Boys Hostel data?</h4>
          <p>Access is restricted strictly to authorized hostel wardens and administrative staff through Role-Based Access Control (RBAC). Student data is never sold to third parties.</p>
          <h4>What data is collected?</h4>
          <p>The DEI Boys Hostel collects academic enrollment details, residential addresses, emergency contacts, and digital fee payment records purely for administrative, room allocation, and safety purposes.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-lg text-gray-600 font-light max-w-none space-y-6">
            <p className="text-sm font-medium text-gray-500">Effective Date: July 2026</p>
            <p>At Dayalbagh Educational Institute (DEI) Boys Hostel, we take your privacy and data security seriously. This Official Privacy Policy outlines our commitment to protecting the personal and academic data of our resident students and their guardians.</p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information Collection</h2>
            <p>As part of the official hostel administration, we securely collect necessary personal information required for admission and management. This includes academic enrollment details, residential addresses, emergency contact information, and digital fee payment receipts.</p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Usage and Processing</h2>
            <p>Your data is utilized strictly for institutional purposes: allocating rooms, verifying fee transactions, maintaining disciplinary records, and communicating vital campus updates. We do not use student data for commercial marketing.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security & Storage</h2>
            <p>Student records are encrypted and stored in secure, cloud-based databases with strict role-based access control (RBAC) limited exclusively to authorized hostel wardens and administrative staff.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Third-Party Disclosure</h2>
            <p>DEI Boys Hostel strictly prohibits the sale or unauthorized sharing of student profiles. Information is only shared with the central university administration or legal authorities when explicitly required for security or compliance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
