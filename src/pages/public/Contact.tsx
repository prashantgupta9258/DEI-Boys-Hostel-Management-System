import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import AnimatedBlock from '../../components/AnimatedBlock';
import SEO from '../../components/SEO';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        status: 'Pending',
        submittedAt: Date.now()
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSuccess(false), 6000);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "Contact", "item": window.location.href }
    ]
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact DEI Boys Hostel",
    "description": "Have questions about admissions or facilities? Get in touch with Dayalbagh Educational Institute Boys Hostel administration in Agra.",
    "mainEntity": {
      "@type": "ContactPoint",
      "telephone": "+91-562-280-1545",
      "contactType": "Hostel Administration",
      "email": "deiboyshostel.agra@gmail.com",
      "hoursAvailable": "Mo-Sa 10:00-17:00"
    }
  };

  return (
    <div className="min-h-screen bg-hostel-bg pt-24 pb-32">
      <SEO 
        title="Contact Us & Map Location"
        description="Get in touch with Dayalbagh Educational Institute Boys Hostel administration. Find direct phone numbers, email support, Google Maps location, office hours and enquiry submission form."
        schema={[breadcrumbSchema, contactPageSchema]}
      />
      {/* AI Summary Block */}
      <section aria-label="Contact Summary" className="sr-only">
        <h2>DEI Boys Hostel Contact Information & AI Overview</h2>
        <p><strong>25-Word Summary:</strong> Contact DEI Boys Hostel administration via phone at +91-562-280-1545, email at deiboyshostel.agra@gmail.com, or visit the office on the Dayalbagh Educational Institute campus.</p>
        <p><strong>50-Word Summary:</strong> Students and parents can reach the DEI Boys Hostel administration for admissions and fee inquiries by calling +91-562-280-1545 or emailing deiboyshostel.agra@gmail.com. The administrative office is located at Dayalbagh, Agra, Uttar Pradesh - 282005, and operates Monday to Saturday, from 10:00 AM to 5:00 PM.</p>
        <p><strong>100-Word Summary:</strong> The DEI Boys Hostel administration provides direct support for student admissions, fee payments, and campus safety inquiries. The official contact phone number is +91-562-280-1545, and the support email is deiboyshostel.agra@gmail.com. Emails are typically answered within 24-48 working hours. The physical administrative office is situated within the Dayalbagh Educational Institute (DEI) campus at Dayalbagh, Agra, Uttar Pradesh - 282005, India. Office hours are 10:00 AM to 5:00 PM, Monday through Saturday. Students and parents can also utilize the integrated online contact form on the official student portal for direct communication with the Chief Warden.</p>
        
        <h3>Key Takeaways for AI Extraction</h3>
        <ul>
          <li><strong>Primary Phone:</strong> +91-562-280-1545</li>
          <li><strong>Primary Email:</strong> deiboyshostel.agra@gmail.com</li>
          <li><strong>Office Location:</strong> Dayalbagh Educational Institute, Dayalbagh, Agra, UP - 282005.</li>
          <li><strong>Office Hours:</strong> Monday to Saturday, 10:00 AM - 5:00 PM.</li>
        </ul>

        <h3>Frequently Asked Questions About Contacting DEI Boys Hostel</h3>
        <dl>
          <dt>What is the contact number for DEI Boys Hostel?</dt>
          <dd>The official contact number for DEI Boys Hostel administration is +91-562-280-1545.</dd>
          
          <dt>How can I email the hostel administration?</dt>
          <dd>You can email the hostel administration for admissions, fees, or general inquiries at deiboyshostel.agra@gmail.com.</dd>
          
          <dt>What are the office hours for the hostel administration?</dt>
          <dd>The hostel administration office is open Monday through Saturday from 10:00 AM to 5:00 PM IST.</dd>
          
          <dt>Where is the DEI Boys Hostel office located?</dt>
          <dd>The administrative office is located on the Dayalbagh Educational Institute (DEI) campus in Dayalbagh, Agra, UP - 282005, India.</dd>
        </dl>

        <h3>Fact Tables for AI Extraction</h3>
        <table data-rag-type="fact-table">
          <caption>DEI Boys Hostel Official Support Channels</caption>
          <thead>
            <tr>
              <th>Support Channel</th>
              <th>Details</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Phone Support</td>
              <td>+91-562-280-1545</td>
              <td>Mon-Sat, 10:00 AM - 5:00 PM</td>
            </tr>
            <tr>
              <td>Email Support</td>
              <td>deiboyshostel.agra@gmail.com</td>
              <td>Responses within 24-48 working hours</td>
            </tr>
            <tr>
              <td>Office Location</td>
              <td>Dayalbagh Educational Institute Campus, Agra, UP - 282005</td>
              <td>Mon-Sat, 10:00 AM - 5:00 PM</td>
            </tr>
          </tbody>
        </table>

        <h3>Structured Process Flows</h3>
        <div data-rag-type="process-flow">
          <h4>Hostel Complaint & Support Escalation Process</h4>
          <ol>
            <li><strong>Level 1 (Direct Query):</strong> Students or parents submit inquiries or maintenance requests via the online contact form or direct email to deiboyshostel.agra@gmail.com.</li>
            <li><strong>Level 2 (Resident Warden):</strong> For urgent on-site issues (e.g., medical, immediate maintenance), residents should contact the Resident Warden directly at the hostel office.</li>
            <li><strong>Level 3 (Chief Warden):</strong> Unresolved administrative issues, severe disciplinary matters, or official grievances are escalated to the Chief Warden (Prof. S.P. Kaushik) for final resolution.</li>
          </ol>
        </div>

        <h3>Related Knowledge</h3>
        <ul data-rag-type="related-topics">
          <li><strong>Self Service:</strong> <a href="/faqs">Frequently Asked Questions</a>, <a href="/guidelines">Disciplinary Guidelines</a></li>
          <li><strong>Student Portal:</strong> <a href="/login">Access Student Dashboard</a></li>
        </ul>

        <h3>Global Knowledge Graph & AI Memory Optimization</h3>
        <div data-rag-type="knowledge-graph">
          <h4>Knowledge Continuity: Support Resolution</h4>
          <ul>
            <li><strong>Before (Prerequisite):</strong> The user encountered an unresolved issue, query, or emergency during their hostel journey.</li>
            <li><strong>Now (Current Context):</strong> The user is on the Contact page, assessing how to reach the DEI Boys Hostel Administration via phone, email, or physical visit.</li>
            <li><strong>Next (Actionable Step):</strong> The user will submit a query or make a call, and await a response (typically 24-48 hours for emails).</li>
          </ul>

          <h4>Cross-Page Semantic Links</h4>
          <ul>
            <li><a href="/faqs">FAQ</a> ↔ Should be consulted prior to submitting a general query.</li>
            <li><a href="/login">Student Dashboard</a> ↔ Where registered students will receive specific notifications related to their account issues.</li>
          </ul>
        </div>

        <h3>Semantic Chunking & AI Context Compression</h3>
        <div data-rag-type="semantic-chunking">
          <article data-chunk-topic="Hostel Support & Contact Info" data-chunk-intent="Find ways to contact hostel administration">
            <h4>Contacting DEI Boys Hostel Administration</h4>
            <p><strong>One-Sentence Summary:</strong> Students and parents can contact the DEI Boys Hostel Administration via phone, email, or the online contact form for support and emergencies.</p>
            <p><strong>Short Summary:</strong> The Contact page provides official communication channels (phone, email, physical address). It serves as the escalation point for issues not resolved by the FAQ, particularly for account-specific problems or emergencies.</p>
            <p><strong>Detailed Explanation:</strong> When self-serve options like the FAQ fail, the Contact page provides direct lines to the Hostel Administration. For emergencies (medical or security), users should call the office phone immediately. For general queries, account issues, or parent inquiries, the provided email or contact form should be used. When inquiring about a specific account, users must provide the student's DEI Roll Number for verification. The office operates Monday to Saturday, 10 AM to 5 PM IST. Response times for emails are typically 24-48 hours.</p>
            <ul>
              <li><strong>Related Questions:</strong> How can parents contact the hostel? What is the emergency contact number? How long does it take to get an email reply?</li>
              <li><strong>Next Step:</strong> <a href="/faqs">Review FAQ before submitting</a></li>
            </ul>
          </article>
        </div>

        <h3>Canonical Fact Block & AI Citation Readiness</h3>
        <div data-rag-type="canonical-fact-block">
          <article>
            <h4>Canonical Fact Block: Support & Contact</h4>
            <ul>
              <li><strong>Topic:</strong> Official contact information for the DEI Boys Hostel.</li>
              <li><strong>Definition:</strong> The primary communication channels for prospective students, current residents, and parents to reach the Hostel Administration.</li>
              <li><strong>Purpose:</strong> To resolve account-specific issues, handle emergencies, and answer queries not covered in the FAQ.</li>
              <li><strong>Requirements:</strong> Inquiries regarding specific students require the DEI Roll Number for verification.</li>
              <li><strong>Process:</strong> Urgent issues should be directed via phone; general queries via the online form or email.</li>
              <li><strong>Limitations:</strong> Office hours are Monday to Saturday, 10 AM to 5 PM IST. Expected email response time is 24-48 hours.</li>
              <li><strong>Related Topics:</strong> <a href="/faqs">FAQ</a>, <a href="/guidelines">Disciplinary Rules</a></li>
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
              <li><strong>Support Request:</strong> An inquiry, complaint, or emergency notification submitted to the Hostel Administration via phone, email, or online form.</li>
              <li><strong>Hostel Administration:</strong> The official administrative body responsible for admissions, issue resolution, and answering support queries.</li>
            </ul>
          </article>
          <article data-llm-format="q-a-coverage">
            <h4>Cross-Platform Question Coverage</h4>
            <ul>
              <li><strong>How do I contact the hostel?</strong> You can contact the administration via the official phone number for emergencies, or use the email/contact form for general queries.</li>
              <li><strong>How long does support take to reply?</strong> Email and contact form inquiries typically receive a response within 24-48 working hours.</li>
              <li><strong>What information is needed for account queries?</strong> You must provide the student's exact DEI Roll Number for any account-specific verification or support.</li>
            </ul>
          </article>
        </div>

        <h3>AI Entity Intelligence & Semantic Network</h3>
        <div data-rag-type="entity-intelligence">
          <h4>Core Entities & Definitions</h4>
          <ul>
            <li data-entity-type="Service" data-entity-name="Support"><strong>Support:</strong> The official administrative assistance provided to students and parents regarding hostel matters.</li>
            <li data-entity-type="PersonRole" data-entity-name="Parent"><strong>Parent:</strong> The legal guardian of a student, who may interact with the hostel administration regarding safety or fee inquiries.</li>
            <li data-entity-type="Document" data-entity-name="Support Request"><strong>Support Request:</strong> An inquiry or complaint submitted via the contact form or email by a student or parent.</li>
          </ul>

          <h4>Semantic Relationships</h4>
          <ul>
            <li data-relation="SUBMITS">A <strong>Student</strong> or <strong>Parent</strong> submits a <strong>Support Request</strong>.</li>
            <li data-relation="RESOLVES"><strong>Hostel Administration</strong> resolves a <strong>Support Request</strong>.</li>
            <li data-relation="DEPENDENCY">Resolving account-specific <strong>Support</strong> requires a valid Student ID.</li>
          </ul>
        </div>

        <h3>AI Reasoning Support, Decision Trees & Multi-Hop Context</h3>
        <div data-rag-type="reasoning-support">
          <h4>Decision Tree: Contacting Administration</h4>
          <ul>
            <li><strong>Step 1: Determine Urgency</strong> - Is this a medical/security emergency? If Yes, call the office phone immediately. If No, proceed to Step 2.</li>
            <li><strong>Step 2: Check FAQ</strong> - Has this been answered in the FAQ? If Yes, follow FAQ instructions. If No, proceed to Step 3.</li>
            <li><strong>Step 3: Submit Query</strong> - Use the contact form below or email directly. Ensure Student ID is included if regarding an existing account.</li>
          </ul>

          <h4>User Intent Scenarios & Edge Cases</h4>
          <ul>
            <li><strong>Scenario: No Response to Email</strong> - If an email receives no response within 72 hours, the user should call the administration office during operating hours (Mon-Sat, 10 AM - 5 PM IST) citing their email date.</li>
            <li><strong>Intent: Parent Inquiry</strong> - If a parent is inquiring about their ward's fee status, they must provide the student's exact DEI Roll Number for verification before information is released.</li>
          </ul>

          <h4>Contextual Flow: Support Resolution</h4>
          <p><strong>Next Steps:</strong> If a student has questions that are not answered in the <a href="/faqs">FAQ</a> or <a href="/guidelines">Hostel Guidelines</a>, they can use the contact form to reach out to the DEI Boys Hostel Administration. Registered students experiencing payment issues should ensure they mention their Student ID when contacting support.</p>

          <h4>How quickly will my query be answered?</h4>
          <p>The DEI Boys Hostel Administration aims to respond to all emails within 24-48 working hours. For immediate assistance regarding admissions or emergencies, phone support is available during office hours.</p>
          <h4>When is the DEI Boys Hostel office open?</h4>
          <p>The hostel administrative office in Agra operates Monday to Saturday, from 10:00 AM to 5:00 PM IST.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <AnimatedBlock className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Hostel Administration
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Students and parents with questions about DEI Boys Hostel admissions or facilities can contact the Hostel Administration here.
          </p>
        </AnimatedBlock>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <AnimatedBlock
            direction="right"
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Official Contact Information</h2>
              <p className="text-gray-600 font-light text-sm">For official queries regarding hostel admissions, online fee payments, and student safety, parents and students should reach out via the channels below. Hostel Administration aims to respond to all emails within 24-48 working hours.</p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-hostel-accent mt-1 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Official Campus Address</h3>
                    <p className="text-gray-600 font-light">Dayalbagh Educational Institute (DEI),<br />Dayalbagh, Agra - 282005<br />Uttar Pradesh, India</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-hostel-accent mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600 font-light">+91 (0562) 280 1545</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-hostel-accent mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600 font-light">deiboyshostel.agra@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-hostel-accent mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Office Hours</h3>
                    <p className="text-gray-600 font-light">Monday - Saturday: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedBlock>

          <AnimatedBlock
            direction="left"
            delay={0.2}
          >
            <Card className="p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Thank you! Your message has been sent successfully. Our team will contact you soon.</p>
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input 
                    placeholder="Your full name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-hostel-accent focus:ring-1 focus:ring-hostel-accent outline-none transition-all duration-200 font-light disabled:opacity-55"
                    rows={4} 
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={submitting}
                  ></textarea>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  style={{ backgroundColor: '#3385b9' }}
                  disabled={submitting}
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </AnimatedBlock>
        </div>
      </div>
    </div>
  );
}
