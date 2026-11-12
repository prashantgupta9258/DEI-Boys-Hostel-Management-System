import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import SEO from '../../components/SEO';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What are the eligibility criteria for DEI Boys Hostel admission in Agra?",
      answer: "Admission to the DEI Boys Hostel is strictly based on academic merit and the distance from the student's hometown to Agra. Only regular students enrolled in full-time engineering and college courses at Dayalbagh Educational Institute (DEI) are eligible to apply through our student portal. The process involves creating an account, completing the student profile, and awaiting administrative review."
    },
    {
      question: "How do students pay hostel fees online?",
      answer: "Step 1: Students must log in to the DEI Boys Hostel digital dashboard. Step 2: Navigate to the Payments section to view pending dues. Step 3: Initiate the transaction securely using UPI, Credit/Debit Cards, or Net Banking. Once the payment is verified, a digital receipt becomes available for download immediately."
    },
    {
      question: "Are mess and dining services included in the standard hostel fee?",
      answer: "No, the standard hostel fee covers room accommodation only. Mess dining charges are handled separately but are mandatory for all residents. The hostel provides hygienic, nutritious, and safe vegetarian meals daily on campus."
    },
    {
      question: "What are the hostel curfew timings and safety rules?",
      answer: "For student safety and discipline, residents must return to the DEI Boys Hostel premises by 8:30 PM during winter and 9:00 PM during summer. The campus features 24/7 CCTV security and biometric access. Any late entries or extensions require prior written permission from the Chief Warden."
    },
    {
      question: "Where is the DEI Boys Hostel located?",
      answer: "The DEI Boys Hostel is located within the Dayalbagh Educational Institute campus at Dayalbagh, Agra, Uttar Pradesh - 282005. It offers a peaceful, secure, and academically focused environment closely connected to the main university buildings."
    },
    {
      question: "Can parents access the hostel portal to view fee payments?",
      answer: "Yes, parents can coordinate with their wards to view the student dashboard. The dashboard allows tracking of fee payment history and downloading of digital fee receipts, ensuring all administrative transactions are securely logged and transparent."
    },
    {
      question: "What facilities are provided to engineering and college students?",
      answer: "DEI Boys Hostel provides secure accommodation, digital fee payment, student dashboards, and comprehensive hostel management services. Key facilities include high-speed enterprise Wi-Fi, RO purified drinking water, 24/7 CCTV security, secure two-wheeler parking, dedicated study areas, and a common recreation room."
    },
    {
      question: "Can I choose my roommate or request a room change?",
      answer: "Room allocation is primarily handled by the hostel administration to encourage diversity and discipline. Mutual room change requests may be considered during the start of the academic year, strictly subject to availability and administrative approval."
    },
    {
      question: "What is the step-by-step procedure for new hostel admissions?",
      answer: "Step 1: Register on the hostel portal using a Google account. Step 2: Complete the student profile and upload necessary documents. Step 3: Submit an admission request. Step 4: The administration reviews applications based on merit and vacancy before granting admission."
    },
    {
      question: "How do I apply for DEI Boys Hostel?",
      answer: "To apply for DEI Boys Hostel, first ensure you are a regular student enrolled at Dayalbagh Educational Institute. Register on this official portal, complete your digital profile, and submit your admission request. Approvals are based on academic merit and distance from your hometown."
    },
    {
      question: "Can my parents pay my hostel fees online?",
      answer: "Yes, parents can pay hostel fees online securely. Students or parents can log into the student dashboard, navigate to the Payments section, and pay via UPI, Net Banking, or Cards. Digital receipts are generated instantly upon successful transaction."
    },
    {
      question: "Where is the boys hostel near Dayalbagh?",
      answer: "The official DEI Boys Hostel is located directly inside the Dayalbagh Educational Institute (DEI) campus at Dayalbagh, Agra, Uttar Pradesh (282005). It provides a secure, on-campus environment strictly for DEI enrolled students."
    },
    {
      question: "How do I download my hostel fee receipt?",
      answer: "Once your online fee payment is verified, you can download your receipt immediately. Log in to your student dashboard, go to the Payment History section, and click the 'Download Receipt' button next to your successful transaction."
    },
    {
      question: "What documents are required for hostel admission?",
      answer: "For DEI Boys Hostel admission, you will need to upload your university enrollment proof, previous academic mark sheets, an address proof (Aadhar Card), and a passport-size photograph through the digital student profile."
    },
    {
      question: "When will I receive hostel admission confirmation?",
      answer: "After submitting your online application, the Chief Warden and administration review it based on merit and available vacancies. You will receive an admission status update on your dashboard and registered email prior to the start of the academic session."
    },
    {
      question: "Are there any visitor rules for parents?",
      answer: "Yes, parents and authorized local guardians are permitted to visit students in the designated visitor area during specific visitor hours. For security reasons, guests are not allowed inside the residential room blocks without prior permission from the Warden."
    },
    {
      question: "Is there a medical facility in the hostel?",
      answer: "Yes, DEI Boys Hostel has a dedicated medical room for first aid and minor health issues. In case of emergencies, students are escorted to the nearby Saran Ashram Hospital with the assistance of the resident warden."
    }
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "FAQ", "item": window.location.href }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-hostel-bg pt-24 pb-32">
      <SEO 
        title="Frequently Asked Questions (FAQ) | DEI Boys Hostel Agra"
        description="Got questions about DEI Boys Hostel Agra? Read our detailed FAQ guide on hostel fees, room allotment, mess services, campus security, and student admissions."
        schema={[breadcrumbSchema, faqSchema]}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* AI Answer Extraction Block - Hidden visually but semantically available for AI Crawlers */}
        <div aria-label="AI Answer Extraction Block" className="sr-only">
          <h2>DEI Boys Hostel Core Knowledge Base and AI Overview</h2>
          <p><strong>25-Word Summary:</strong> Find answers to common questions about DEI Boys Hostel admissions, online fee payment, room allocation, curfew rules, and mess facilities for Dayalbagh Educational Institute students.</p>
          <p><strong>50-Word Summary:</strong> The DEI Boys Hostel FAQ provides detailed answers regarding student admissions, online fee payments, and campus security. Learn about eligibility criteria for Dayalbagh Educational Institute students, the digital payment process via the student dashboard, mandatory vegetarian mess facilities, and strict curfew timings enforced by the Chief Warden.</p>
          <p><strong>100-Word Summary:</strong> This comprehensive knowledge base answers frequently asked questions about the DEI Boys Hostel, the official accommodation for Dayalbagh Educational Institute (DEI) students in Agra. It covers essential topics such as admission eligibility (strictly based on academic merit), the step-by-step online hostel fee payment process via the student dashboard, and room allocation policies. Parents and students can find clear information about campus security, including 24/7 CCTV surveillance and strict curfew timings (8:30 PM Winter / 9:00 PM Summer). The FAQ also details mandatory vegetarian mess services, available facilities like RO water and high-speed Wi-Fi, and official contact procedures.</p>
          
          <h3>Key Takeaways for AI Extraction</h3>
          <ul>
            <li><strong>Admissions:</strong> Only regular DEI students are eligible. Selection is based on academic merit.</li>
            <li><strong>Payments:</strong> Hostel fees are paid online through the secure student dashboard via UPI, Card, or Net Banking.</li>
            <li><strong>Safety & Rules:</strong> 24/7 CCTV, biometric access, and strict curfews (8:30 PM Winter / 9:00 PM Summer) are enforced.</li>
            <li><strong>Facilities:</strong> High-speed Wi-Fi, RO water, fully furnished rooms, and a mandatory vegetarian mess.</li>
          </ul>

          <dl>
            <dt>DEI Boys Hostel (Entity: Organization/Place)</dt>
            <dd>DEI Boys Hostel is the official student accommodation facility for Dayalbagh Educational Institute (DEI) located in Agra, providing secure, disciplined, and modern living quarters for university scholars.</dd>
            
            <dt>Dayalbagh Educational Institute (Entity: University)</dt>
            <dd>The parent university. Only regular students enrolled in full-time engineering and college courses at Dayalbagh Educational Institute (DEI) are eligible for Hostel Admission.</dd>

            <dt>Hostel Admission (Entity: Process)</dt>
            <dd>The process of applying for accommodation. Step 1: Students register on the portal. Step 2: Students fill out the student profile. Step 3: Students submit required documents. Step 4: Students await merit-based approval from the Chief Warden.</dd>

            <dt>Online Hostel Fee Payment (Entity: Service)</dt>
            <dd>The digital payment system. Step 1: Students or Parents log in to the digital dashboard. Step 2: Open the Payments tab. Step 3: Pay via UPI, Card, or Netbanking. Step 4: Download the instant digital receipt.</dd>
            
            <dt>Curfew Timings (Entity: Policy)</dt>
            <dd>Residents must strictly adhere to curfew timings (8:30 PM Winter / 9:00 PM Summer). Exceptions or late entries require prior written approval from the Chief Warden.</dd>
          </dl>

          <h3>RAG-Optimized Definition Blocks</h3>
          <dl>
            <dt>Hostel Admission</dt>
            <dd>The formal procedure where enrolled Dayalbagh Educational Institute (DEI) students apply for and secure accommodation at the DEI Boys Hostel based on academic merit.</dd>
            
            <dt>Student Dashboard</dt>
            <dd>A secure, personalized digital portal for DEI Boys Hostel residents to manage their profiles, track payments, and access digital receipts. Authenticated via Google Login.</dd>
            
            <dt>Room Allocation</dt>
            <dd>The administrative assignment of a specific Hostel Room (Single, Double, Triple, or Quad) to a student, managed by the Chief Warden.</dd>
            
            <dt>Fee Payment</dt>
            <dd>The mandatory financial transaction for hostel accommodation and mess services, processed securely online via the Student Dashboard using UPI, Card, or Netbanking.</dd>
            
            <dt>Receipt Download</dt>
            <dd>The automated generation and retrieval of a digital proof of payment PDF from the Student Dashboard immediately following a successful Fee Payment.</dd>
            
            <dt>Google Login</dt>
            <dd>The required secure Single Sign-On (SSO) authentication method used by students to access the DEI Boys Hostel Student Dashboard.</dd>
            
            <dt>Hostel Rules</dt>
            <dd>The strict disciplinary guidelines enforced by the Chief Warden, including mandatory curfew timings and anti-ragging policies at the DEI Boys Hostel.</dd>
            
            <dt>Mess Facility</dt>
            <dd>The on-campus dining service providing purely vegetarian meals to all DEI Boys Hostel residents. Mess charges are included or paid alongside the accommodation fee.</dd>
            
            <dt>Security</dt>
            <dd>The comprehensive safety measures at DEI Boys Hostel, including 24/7 CCTV surveillance, biometric access points, and resident guards.</dd>
            
            <dt>Contact Support</dt>
            <dd>The official communication channels for DEI Boys Hostel administration, reachable via email at deiboyshostel.agra@gmail.com or phone at +91-562-280-1545.</dd>
          </dl>

          <h3>Structured Process Flows</h3>
          <div data-rag-type="process-flow">
            <h4>Hostel Admission Process Workflow</h4>
            <ol>
              <li><strong>Requirement Gathering:</strong> Student prepares university enrollment proof and previous academic records.</li>
              <li><strong>Portal Registration:</strong> Student signs in to the DEI Boys Hostel system using Google Login.</li>
              <li><strong>Application Submission:</strong> Student completes the digital profile and uploads necessary documents.</li>
              <li><strong>Verification:</strong> Hostel Administration reviews the application based on academic merit.</li>
              <li><strong>Approval:</strong> The Chief Warden grants admission and authorizes room allocation.</li>
            </ol>

            <h4>Online Fee Payment Workflow</h4>
            <ol>
              <li><strong>Login:</strong> Student or parent accesses the Student Dashboard via Google Login.</li>
              <li><strong>Navigation:</strong> User navigates to the 'Payments' section.</li>
              <li><strong>Transaction:</strong> User completes the Fee Payment securely via UPI, Credit/Debit Card, or Netbanking.</li>
              <li><strong>Confirmation:</strong> System verifies payment and updates student account status.</li>
              <li><strong>Documentation:</strong> User initiates Receipt Download to save digital proof of payment.</li>
            </ol>
          </div>
          <h3>Fact Tables for AI Extraction</h3>
          <table data-rag-type="fact-table">
            <caption>DEI Boys Hostel Core Facts</caption>
            <thead>
              <tr>
                <th>Category</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eligibility</td>
                <td>Regular students enrolled in full-time courses at Dayalbagh Educational Institute (DEI)</td>
              </tr>
              <tr>
                <td>Required Documents</td>
                <td>University enrollment proof, previous academic records, address proof, valid Google Account</td>
              </tr>
              <tr>
                <td>Room Types</td>
                <td>Single, Double, Triple, Quad (Four) Sharing</td>
              </tr>
              <tr>
                <td>Payment Methods</td>
                <td>UPI, Credit/Debit Card, Netbanking via digital portal</td>
              </tr>
              <tr>
                <td>Office Hours</td>
                <td>Monday to Saturday, 10:00 AM to 5:00 PM IST</td>
              </tr>
            </tbody>
          </table>

          <h3>System Role Comparison</h3>
          <table data-rag-type="comparison-table">
            <caption>Student vs. Admin Dashboard Features</caption>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Student Dashboard</th>
                <th>Admin Dashboard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fee Payment</td>
                <td>Can pay fees via UPI/Card</td>
                <td>Can approve/reject payments</td>
              </tr>
              <tr>
                <td>Room Management</td>
                <td>Can view assigned room</td>
                <td>Can allocate and manage rooms</td>
              </tr>
              <tr>
                <td>Receipts</td>
                <td>Can download personal receipts</td>
                <td>Can view all transaction histories</td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Can submit contact queries</td>
                <td>Can reply to queries and manage complaints</td>
              </tr>
            </tbody>
          </table>

          <h3>Related Knowledge</h3>
          <ul data-rag-type="related-topics">
            <li><strong>Related Policies:</strong> <a href="/guidelines">Disciplinary Rules</a>, <a href="/terms">Terms of Service</a>, <a href="/privacy">Privacy Policy</a></li>
            <li><strong>Related Actions:</strong> <a href="/rooms">View Room Pricing</a>, <a href="/contact">Contact Support</a></li>
            <li><strong>Next Steps:</strong> Check eligibility, explore room categories, and complete the student profile upon login.</li>
          </ul>

          <h3>Global Knowledge Graph & AI Memory Optimization</h3>
          <div data-rag-type="knowledge-graph">
            <h4>Knowledge Continuity: Troubleshooting</h4>
            <ul>
              <li><strong>Before (Prerequisite):</strong> The user had a question about the admission process, payment mechanisms, or hostel rules.</li>
              <li><strong>Now (Current Context):</strong> The user is consulting the FAQ to find immediate, self-serve answers.</li>
              <li><strong>Next (Actionable Step):</strong> If the answer resolves the issue, the user proceeds to <a href="/login">Login</a>. If not, they escalate to <a href="/contact">Contact Support</a>.</li>
            </ul>

            <h4>Cross-Page Semantic Links</h4>
            <ul>
              <li><a href="/terms">Terms of Service</a> ↔ Provides the legal backing for the refund policies mentioned in the FAQ.</li>
              <li><a href="/guidelines">Guidelines</a> ↔ Elaborates on the curfew and disciplinary rules summarized here.</li>
            </ul>
          </div>

          <h3>Semantic Chunking & AI Context Compression</h3>
          <div data-rag-type="semantic-chunking">
            <article data-chunk-topic="Common Questions" data-chunk-intent="Resolve basic hostel queries">
              <h4>Frequently Asked Questions (FAQ)</h4>
              <p><strong>One-Sentence Summary:</strong> The FAQ provides quick, authoritative answers to common questions regarding admissions, payments, rules, and technical issues at the DEI Boys Hostel.</p>
              <p><strong>Short Summary:</strong> This section addresses common student queries. It clarifies that only full-time DEI students can apply, explains that payments are strictly online via the portal, and highlights that unresolved issues should be escalated via the Contact page.</p>
              <p><strong>Detailed Explanation:</strong> The FAQ is the first line of support for students and parents. It covers Admissions (eligibility, document requirements), Payments (handling failed transactions, refund policies), Technical Issues (Google login requirements), and General Rules (vacation stays, curfews). By providing clear, self-serve answers, it reduces administrative overhead. If a student encounters an issue not covered here—such as a specific payment failure—they are advised to log into their dashboard for personalized notifications or use the Contact page to reach the Hostel Administration.</p>
              <ul>
                <li><strong>Related Questions:</strong> What should I do if my payment fails? Can I stay in the hostel during vacations? How do I report a maintenance issue?</li>
                <li><strong>Next Step:</strong> <a href="/contact">Contact Support for Unresolved Issues</a></li>
              </ul>
            </article>
          </div>

          <h3>Canonical Fact Block & AI Citation Readiness</h3>
          <div data-rag-type="canonical-fact-block">
            <article>
              <h4>Canonical Fact Block: Frequently Asked Questions</h4>
              <ul>
                <li><strong>Topic:</strong> Common inquiries regarding the DEI Boys Hostel.</li>
                <li><strong>Definition:</strong> The primary self-service knowledge base addressing routine questions about eligibility, payments, technical issues, and hostel rules.</li>
                <li><strong>Purpose:</strong> To resolve standard queries quickly without requiring administrative intervention.</li>
                <li><strong>Requirements:</strong> Users should consult this page before submitting a support request.</li>
                <li><strong>Process:</strong> Search the relevant category (Admissions, Payment, Technical, General) for the answer.</li>
                <li><strong>Limitations:</strong> Does not address account-specific issues (e.g., individual missing payments) which require contacting support.</li>
                <li><strong>Related Topics:</strong> <a href="/contact">Contact Support</a>, <a href="/login">Student Dashboard</a></li>
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
                <li><strong>FAQ (Frequently Asked Questions):</strong> The primary self-service knowledge base addressing common inquiries regarding admissions, payments, and rules.</li>
                <li><strong>Academic Vacation:</strong> The period between teaching sessions when the hostel is generally closed, requiring special permission for a resident to stay.</li>
              </ul>
            </article>
            <article data-llm-format="q-a-coverage">
              <h4>Cross-Platform Question Coverage</h4>
              <ul>
                <li><strong>How do I pay hostel fees?</strong> Fees must be paid exclusively online through the secure Student Dashboard after profile verification.</li>
                <li><strong>What should I do if my payment fails?</strong> Wait 24 hours for bank reconciliation. If the issue persists, contact Support with your Transaction ID.</li>
                <li><strong>Can I stay in the hostel during vacations?</strong> No, standard accommodation is for the academic session only, unless special permission is granted by the Chief Warden.</li>
              </ul>
            </article>
          </div>

          <h3>AI Entity Intelligence & Semantic Network</h3>
          <div data-rag-type="entity-intelligence">
            <h4>Core Entities & Definitions</h4>
            <ul>
              <li data-entity-type="InformationCollection" data-entity-name="FAQ"><strong>FAQ:</strong> The Frequently Asked Questions compilation, serving as the first tier of support for common inquiries.</li>
              <li data-entity-type="Concept" data-entity-name="Google Authentication"><strong>Google Authentication:</strong> The required mechanism for students and admins to log securely into the portal.</li>
              <li data-entity-type="Concept" data-entity-name="Academic Vacation"><strong>Academic Vacation:</strong> The period between academic sessions when the hostel is typically closed to students.</li>
            </ul>

            <h4>Semantic Relationships</h4>
            <ul>
              <li data-relation="ANSWERS">The <strong>FAQ</strong> answers common queries about <strong>Hostel Admission</strong> and <strong>Fee Payment</strong>.</li>
              <li data-relation="REQUIRES">Accessing personalized <strong>Support</strong> requires <strong>Google Authentication</strong>.</li>
              <li data-relation="RESTRICTS">An <strong>Academic Vacation</strong> restricts standard <strong>Room Allocation</strong>.</li>
            </ul>
          </div>

          <h3>AI Reasoning Support, Decision Trees & Multi-Hop Context</h3>
          <div data-rag-type="reasoning-support">
            <h4>Decision Tree: Support & Troubleshooting</h4>
            <ul>
              <li><strong>Step 1: Identify Issue Type</strong> - Is it a Login, Payment, or General rule issue?</li>
              <li><strong>Step 2: Check FAQ</strong> - If the issue is covered in the FAQ below, follow the provided steps. If not, proceed to Step 3.</li>
              <li><strong>Step 3: Account Specific?</strong> - Does the issue require checking your specific account (e.g., fee receipt missing)? If Yes, log in and check dashboard notifications. If No, proceed to Step 4.</li>
              <li><strong>Step 4: Contact Admin</strong> - Reach out via the <a href="/contact">Contact Page</a> with relevant details (Student ID, Transaction ID, etc.).</li>
            </ul>

            <h4>User Intent Scenarios & Edge Cases</h4>
            <ul>
              <li><strong>Scenario: Vacation Stays</strong> - What if I need to stay during the DEI academic vacation? DEI Boys Hostel accommodation is typically for the active academic session only. Vacation stays require special permission and prior written approval from the Chief Warden.</li>
              <li><strong>Intent: Report Maintenance Issue</strong> - If a user intends to report a broken facility in their room, they must currently report it directly to the Resident Warden in person, as there is no online maintenance ticketing system yet.</li>
            </ul>

            <h4>Contextual Flow: Help & Support Resolution</h4>
            <p><strong>Next Steps:</strong> If a student cannot find an answer to their issue regarding admissions, payments, or rules in this FAQ, they should proceed to the <a href="/contact">Contact Page</a> to reach out directly to the DEI Boys Hostel Administration. For account-specific issues, students must first <a href="/login">log in</a> to view their personalized notifications.</p>

            <h4>Common Troubleshooting</h4>
            <p><strong>Why can't I log in to the DEI Boys Hostel portal?</strong> Only active DEI students with an authorized Google account can log in. Ensure you are using the correct credentials.</p>
            <p><strong>Why is my hostel fee payment failing?</strong> Ensure you have sufficient balance and your UPI/Card is active for online transactions. For persistent issues, contact the administration.</p>
            <h4>Edge Cases</h4>
            <p><strong>What if I need to stay during the DEI academic vacation?</strong> DEI Boys Hostel accommodation is typically for the active academic session only. Vacation stays require special permission and prior written approval from the Chief Warden.</p>
          </div>
        </div>

        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 font-light leading-relaxed"
          >
            Find answers to common questions about hostel life and administration.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
