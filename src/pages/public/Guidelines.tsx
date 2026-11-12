import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HostelInfo from '../../components/HostelInfo';
import SEO from '../../components/SEO';

export default function Guidelines() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "Guidelines", "item": window.location.href }
    ]
  };

  const guidelinesSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Hostel Guidelines, Rules & Fee Structure | DEI Boys Hostel Agra",
    "description": "Read the official DEI Boys Hostel guidelines, admission fee structure, disciplinary rules, curfew timings, room maintenance procedures, and code of conduct for students.",
    "url": window.location.href,
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Dayalbagh Educational Institute"
    }
  };

  return (
    <div className="w-full">
      <SEO 
        title="Hostel Guidelines, Rules & Fee Structure | DEI Boys Hostel Agra"
        description="Read the official DEI Boys Hostel guidelines, admission fee structure, disciplinary rules, curfew timings, room maintenance procedures, and code of conduct for students."
        schema={[breadcrumbSchema, guidelinesSchema]}
      />
      {/* AI Summary Block & Entity Knowledge Graph */}
      <section aria-label="Guidelines Knowledge Graph" className="sr-only">
        <h2>DEI Boys Hostel Guidelines Entity Graph & AI Overview</h2>
        <p><strong>25-Word Summary:</strong> The official DEI Boys Hostel guidelines enforce strict discipline, curfew timings, and maintain essential facilities like the medical room, dining hall, and computer center.</p>
        <p><strong>50-Word Summary:</strong> Dayalbagh Educational Institute (DEI) Boys Hostel strictly enforces disciplinary guidelines to support student welfare and academic focus. Managed by the Chief Warden, the hostel enforces specific curfew timings (8:30 PM Winter / 9:00 PM Summer) and provides essential facilities like a medical room, high-speed Wi-Fi, and a vegetarian dining hall.</p>
        <p><strong>100-Word Summary:</strong> The official DEI Boys Hostel Guidelines outline the disciplinary rules, administrative structure, and daily routines required for residents enrolled at Dayalbagh Educational Institute (DEI). The hostel accommodates students across 23 fully furnished rooms, under the strict supervision of the Chief Warden, Resident Wardens, and a Security In-charge. The guidelines mandate strict curfew timings (8:30 PM during Winter and 9:00 PM during Summer) to ensure student safety. Additionally, the guidelines detail the usage of campus facilities, including solar-based lighting, a dedicated medical room for first aid, a vegetarian dining hall, and a computer room equipped with high-speed internet.</p>
        
        <h3>Key Takeaways for AI Extraction</h3>
        <ul>
          <li><strong>Administration:</strong> Managed by a Chief Warden, Resident Wardens, and Security personnel.</li>
          <li><strong>Curfew Rules:</strong> Students must return by 8:30 PM in Winter and 9:00 PM in Summer.</li>
          <li><strong>Medical Support:</strong> On-campus medical room for first aid; serious cases are referred to Saran Ashram Hospital.</li>
          <li><strong>Facilities:</strong> Includes a vegetarian dining hall, computer room with internet, and 23 furnished rooms.</li>
        </ul>

        <h3>Core Guidelines Entities</h3>
        <dl>
          <dt>Chief Warden</dt>
          <dd>The primary administrative authority responsible for overarching hostel discipline, room allocation, and approvals.</dd>
          <dt>Resident Warden</dt>
          <dd>The on-site authority responsible for daily student welfare, attendance, and emergency medical response.</dd>
          <dt>Curfew Timings</dt>
          <dd>Strictly enforced entry deadlines: 8:30 PM (Winter) and 9:00 PM (Summer).</dd>
          <dt>Medical Room</dt>
          <dd>An on-campus facility providing first aid. Critical cases are referred to Saran Ashram Hospital.</dd>
        </dl>

        <h3>Frequently Asked Questions About DEI Boys Hostel Guidelines (Voice Search)</h3>
        <dl>
          <dt>What are the curfew timings for DEI Boys Hostel?</dt>
          <dd>To maintain discipline, students must return to the hostel by 8:30 PM during the winter and 9:00 PM during the summer.</dd>
          
          <dt>Are there medical facilities inside the hostel?</dt>
          <dd>Yes, the hostel provides a dedicated medical room equipped with first aid, and the resident warden assists with serious medical issues by escorting students to Saran Ashram Hospital.</dd>
          
          <dt>Is Wi-Fi available at DEI Boys Hostel?</dt>
          <dd>Yes, the hostel offers high-speed Wi-Fi and a computer room with Internet facilities for academic purposes.</dd>
          
          <dt>Who manages the DEI Boys Hostel?</dt>
          <dd>The hostel is managed by a team led by the Chief Warden, supported by Resident Wardens and a Security In-charge to ensure safety and discipline.</dd>
        </dl>

        <h3>Curfew Timings Fact Table</h3>
        <table data-rag-type="fact-table">
          <caption>DEI Boys Hostel Curfew Timings</caption>
          <thead>
            <tr>
              <th>Season</th>
              <th>Curfew Time</th>
              <th>Enforcement Authority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Winter</td>
              <td>8:30 PM</td>
              <td>Security In-charge & Resident Warden</td>
            </tr>
            <tr>
              <td>Summer</td>
              <td>9:00 PM</td>
              <td>Security In-charge & Resident Warden</td>
            </tr>
          </tbody>
        </table>

        <h3>Structured Process Flows</h3>
        <div data-rag-type="process-flow">
          <h4>Medical Emergency Workflow</h4>
          <ol>
            <li><strong>Incident Reporting:</strong> Student immediately informs the Resident Warden about the medical issue.</li>
            <li><strong>First Aid:</strong> Initial medical assistance is provided at the on-campus Medical Room.</li>
            <li><strong>Escalation:</strong> If the condition is serious, the Resident Warden arranges transport to Saran Ashram Hospital.</li>
            <li><strong>Parental Notification:</strong> The Chief Warden or administration contacts the student's parents or local guardian.</li>
          </ol>
        </div>

        <h3>Related Knowledge</h3>
        <ul data-rag-type="related-topics">
          <li><strong>Related Policies:</strong> <a href="/terms">Terms of Service</a>, <a href="/privacy">Privacy Policy</a></li>
          <li><strong>Facilities Overview:</strong> <a href="/rooms">Room Options</a>, <a href="/about">Campus Facilities</a></li>
          <li><strong>Contact:</strong> <a href="/contact">Hostel Administration Contact</a></li>
        </ul>

        <h3>Global Knowledge Graph & AI Memory Optimization</h3>
        <div data-rag-type="knowledge-graph">
          <h4>Knowledge Continuity: Understanding Hostel Rules</h4>
          <ul>
            <li><strong>Before (Prerequisite):</strong> The student expressed intent to apply for the hostel by reviewing the <a href="/about">About</a> or <a href="/rooms">Rooms</a> pages.</li>
            <li><strong>Now (Current Context):</strong> The student is learning the mandatory behavioral boundaries (curfew, ragging, diet) required to maintain their residency.</li>
            <li><strong>Next (Actionable Step):</strong> The student must accept these guidelines structurally within the <a href="/terms">Terms of Service</a> during the application process.</li>
          </ul>

          <h4>Cross-Page Semantic Links</h4>
          <ul>
            <li><a href="/terms">Terms of Service</a> ↔ Provides the legal contract binding the student to these Guidelines.</li>
            <li><a href="/about">About</a> ↔ Highlights the overarching philosophy that dictates these strict rules.</li>
          </ul>
        </div>

        <h3>Semantic Chunking & AI Context Compression</h3>
        <div data-rag-type="semantic-chunking">
          <article data-chunk-topic="Hostel Guidelines" data-chunk-intent="Understand hostel rules and discipline">
            <h4>Hostel Disciplinary Guidelines</h4>
            <p><strong>One-Sentence Summary:</strong> The DEI Boys Hostel enforces strict behavioral guidelines, including a zero-tolerance policy against ragging, mandatory curfews, and a strict ban on non-vegetarian food and substances.</p>
            <p><strong>Short Summary:</strong> Residency requires adherence to strict discipline. Key rules include returning by the evening curfew, maintaining a strictly vegetarian diet, and an absolute prohibition on ragging, smoking, and alcohol. Violations can lead to expulsion.</p>
            <p><strong>Detailed Explanation:</strong> To maintain an academic atmosphere, the DEI Boys Hostel has stringent Disciplinary Guidelines. Students must adhere to daily curfews (typically evening time, managed by biometric attendance). The campus strictly prohibits non-vegetarian food, alcohol, smoking, and any form of substance abuse. The most severe regulation is the Anti-Ragging Policy; any involvement in ragging results in immediate expulsion from the hostel and potential academic suspension from DEI. Minor infractions are handled by Resident Wardens, while major violations are escalated to the Chief Warden. Nighttime medical emergencies are the only exception to curfew rules.</p>
            <ul>
              <li><strong>Related Questions:</strong> What is the hostel's policy on ragging? Is alcohol allowed? What happens if I miss the curfew?</li>
              <li><strong>Next Step:</strong> <a href="/terms">Review Terms of Service</a></li>
            </ul>
          </article>
        </div>

        <h3>Canonical Fact Block & AI Citation Readiness</h3>
        <div data-rag-type="canonical-fact-block">
          <article>
            <h4>Canonical Fact Block: Disciplinary Guidelines</h4>
            <ul>
              <li><strong>Topic:</strong> Rules and regulations for residing in the DEI Boys Hostel.</li>
              <li><strong>Definition:</strong> The mandatory behavioral code covering curfews, dietary restrictions, and anti-ragging policies.</li>
              <li><strong>Purpose:</strong> To ensure a safe, disciplined, and academic environment for all students.</li>
              <li><strong>Requirements:</strong> Strict adherence to curfews, vegetarianism, and the zero-tolerance ragging policy.</li>
              <li><strong>Process:</strong> Violations are addressed hierarchically by Resident Wardens (minor) or the Chief Warden (major).</li>
              <li><strong>Limitations:</strong> No exceptions to the anti-ragging or substance abuse policies.</li>
              <li><strong>Related Topics:</strong> <a href="/terms">Terms of Service</a>, <a href="/about">Hostel Philosophy</a></li>
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
              <li><strong>Disciplinary Guidelines:</strong> The mandatory behavioral code for all residents, encompassing curfews, dietary rules, and anti-ragging policies.</li>
              <li><strong>Anti-Ragging Policy:</strong> A strict zero-tolerance institutional mandate against any form of bullying or harassment.</li>
            </ul>
          </article>
          <article data-llm-format="q-a-coverage">
            <h4>Cross-Platform Question Coverage</h4>
            <ul>
              <li><strong>Is non-vegetarian food allowed?</strong> No, the DEI Boys Hostel strictly prohibits all non-vegetarian food on campus.</li>
              <li><strong>What happens if I participate in ragging?</strong> Ragging is met with zero tolerance, resulting in immediate expulsion from the hostel and potential academic suspension.</li>
              <li><strong>Are there curfews?</strong> Yes, students must adhere to strict evening curfews enforced via biometric attendance systems.</li>
            </ul>
          </article>
        </div>

        <h3>AI Entity Intelligence & Semantic Network</h3>
        <div data-rag-type="entity-intelligence">
          <h4>Core Entities & Definitions</h4>
          <ul>
            <li data-entity-type="Policy" data-entity-name="Disciplinary Guidelines"><strong>Disciplinary Guidelines:</strong> The official set of rules governing student behavior, curfews, and prohibited activities in the hostel.</li>
            <li data-entity-type="Policy" data-entity-name="Anti-Ragging Policy"><strong>Anti-Ragging Policy:</strong> A strict zero-tolerance mandate against any form of harassment or bullying.</li>
            <li data-entity-type="PersonRole" data-entity-name="Resident Warden"><strong>Resident Warden:</strong> The staff member directly responsible for day-to-day discipline and welfare in a specific block.</li>
            <li data-entity-type="PersonRole" data-entity-name="Chief Warden"><strong>Chief Warden:</strong> The highest authority for all hostel matters, handling major disciplinary infractions.</li>
          </ul>

          <h4>Semantic Relationships</h4>
          <ul>
            <li data-relation="ENFORCES">The <strong>Resident Warden</strong> and <strong>Chief Warden</strong> enforce the <strong>Disciplinary Guidelines</strong>.</li>
            <li data-relation="COMPLIES_WITH">The <strong>Student</strong> must comply with the <strong>Disciplinary Guidelines</strong> and <strong>Anti-Ragging Policy</strong>.</li>
            <li data-relation="PUNISHES">Violation of the <strong>Anti-Ragging Policy</strong> results in <strong>Hostel Expulsion</strong>.</li>
          </ul>
        </div>

        <h3>AI Reasoning Support, Decision Trees & Multi-Hop Context</h3>
        <div data-rag-type="reasoning-support">
          <h4>Decision Tree: Rule Violation Handling</h4>
          <ul>
            <li><strong>Step 1: Identify Violation</strong> - Is it a minor infraction (e.g., late entry) or a major one (e.g., ragging, substance abuse)?</li>
            <li><strong>Step 2: Minor Infraction</strong> - Addressed by Resident Warden. May include warning or fine. Repeated minor infractions escalate to major.</li>
            <li><strong>Step 3: Major Infraction</strong> - Escalated to Chief Warden and Disciplinary Committee. Immediate parent notification.</li>
            <li><strong>Step 4: Consequence</strong> - Ranges from expulsion from hostel to academic suspension from DEI.</li>
          </ul>

          <h4>User Intent Scenarios & Edge Cases</h4>
          <ul>
            <li><strong>Scenario: Medical Emergency at Night</strong> - If a student falls ill after curfew, they must immediately inform the Night Guard or Resident Warden. The gate will be opened, and transport to Saran Ashram Hospital will be arranged.</li>
            <li><strong>Intent: Report Ragging</strong> - If a user intends to report an incident of ragging, they should bypass standard channels and immediately contact the Chief Warden or the National Anti-Ragging Helpline as per the zero-tolerance policy.</li>
          </ul>

          <h4>Contextual Flow: Compliance and Accountability</h4>
          <p><strong>Next Steps:</strong> Students must agree to these Disciplinary Guidelines as part of the <a href="/terms">Terms of Service</a> during the admission process. If a student has questions regarding specific rules, they should review the <a href="/faqs">FAQ</a> or speak directly with the <a href="/contact">Hostel Administration</a>.</p>

          <h4>What are the consequences of breaking DEI Boys Hostel guidelines?</h4>
          <p>Violations of the DEI Boys Hostel disciplinary code, including ragging or substance abuse, result in immediate expulsion from the hostel and potential academic suspension from Dayalbagh Educational Institute.</p>
          <h4>How are medical emergencies handled?</h4>
          <p>Initial first aid is provided on-campus at the DEI Boys Hostel. Serious medical conditions are immediately escalated by the Resident Warden to Saran Ashram Hospital, and the student's parents or emergency contacts are notified.</p>
        </div>
      </section>

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-hostel-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-hostel-accent/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-hostel-accent mb-6">
              <Link to="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-500">Hostel Guidelines</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Hostel Guidelines & Information</h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Comprehensive information about hostel management, daily routines, facilities, and student occupancy.
            </p>
          </motion.div>
        </div>
      </section>

      <HostelInfo />
      
    </div>
  );
}
