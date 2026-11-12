import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Shield, Wifi, Coffee, MapPin, 
  Droplets, Wind, Zap, BookOpen, Car, Users,
  CheckCircle2, ChevronDown,
  Building2, Award
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import AnimatedBlock from '../components/AnimatedBlock';
import SEO from '../components/SEO';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [roomsList, setRoomsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsSnap, gallerySnap] = await Promise.all([
          getDocs(query(collection(db, 'rooms'), orderBy('roomNumber', 'asc'), limit(4))),
          getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(4)))
        ]);

        const fetchedRooms: any[] = [];
        roomsSnap.forEach(doc => {
          const data = doc.data();
          fetchedRooms.push({
            id: doc.id,
            title: `${data.roomType} Sharing`,
            price: `₹${data.monthlyFee}/month`,
            desc: `Comfortable ${data.capacity} person room.`,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80"
          });
        });
        setRoomsList(fetchedRooms);

        const fetchedGallery: string[] = [];
        gallerySnap.forEach(doc => {
          fetchedGallery.push(doc.data().url);
        });
        setGalleryImages(fetchedGallery);
      } catch(err) {
        console.error("Error fetching homepage data:", err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Students Housed', value: '500+', icon: Users },
    { label: 'Rooms Available', value: '250+', icon: Building2 },
    { label: 'Years of Excellence', value: '70+', icon: Award },
    { label: 'Hostel Facilities', value: '6+', icon: Shield }
  ];

  const facilities = [
    { icon: Wifi, title: 'High-Speed Wi-Fi', desc: 'Unlimited enterprise-grade internet for seamless academic research and study.' },
    { icon: Shield, title: '24×7 Campus Security', desc: 'Round-the-clock biometric access control and CCTV surveillance for complete safety.' },
    { icon: Droplets, title: 'RO Drinking Water', desc: 'Purified RO drinking water coolers installed on every floor for student health.' },
    { icon: Coffee, title: 'Nutritious Mess Service', desc: 'Hygienic, healthy, and freshly prepared vegetarian meals served daily in the dining hall.' },
    { icon: Car, title: 'Secure Parking', desc: 'Designated, safe, and secure parking space for student two-wheelers.' },
    { icon: Users, title: 'Student Common Room', desc: 'Recreation area with television, daily newspapers, and indoor games to unwind.' }
  ];

  const features = [
    "Secure & Disciplined Environment",
    "High-Speed Internet for Scholars",
    "Prime Location Near Dayalbagh Campus",
    "Transparent Online Fee Payment System"
  ];

  const faqs = [
    {
      question: "What is the admission process for DEI Boys Hostel?",
      answer: "Step 1: Students must register on the DEI Boys Hostel portal. Step 2: Complete the student profile. Step 3: Await administrative review. Admission is strictly based on academic merit and distance from the applicant's hometown. Only regular students enrolled at Dayalbagh Educational Institute (DEI) are eligible."
    },
    {
      question: "How can parents or students pay the hostel fee online?",
      answer: "The DEI Boys Hostel provides a secure online fee payment system. Students must log in to their dashboard, view pending dues, and securely pay accommodation and mess fees using UPI, NetBanking, or Cards. Digital receipts are instantly generated for transparent record-keeping."
    },
    {
      question: "Is the mess fee included in the standard hostel fee?",
      answer: "No, the primary hostel fee covers only the room accommodation. Mess charges are billed separately but are mandatory for all residents. The DEI Boys Hostel mess provides hygienic and timely vegetarian meals."
    },
    {
      question: "How safe is the student accommodation at DEI Boys Hostel?",
      answer: "DEI Boys Hostel prioritizes student safety. The campus features 24/7 CCTV surveillance, biometric entry/exit gates, and round-the-clock security personnel to ensure a secure environment for all enrolled scholars."
    },
    {
      question: "Are there any curfew timings for hostel residents?",
      answer: "Yes, to maintain a disciplined academic atmosphere, DEI Boys Hostel residents must return to the hostel premises by 8:30 PM during the winter season and 9:00 PM during the summer season. Extensions require Chief Warden approval."
    },
    {
      question: "What facilities are provided in the DEI Boys Hostel rooms?",
      answer: "Each DEI Boys Hostel room is fully furnished with a bed, study table, chair, and personal almirah for each student. Shared facilities include high-speed Wi-Fi, RO purified water, and clean washrooms."
    }
  ];

  return (
    <div className="w-full overflow-x-hidden">
      <SEO 
        title="DEI Boys Hostel Agra | Secure Student Accommodation & Fee Portal"
        description="Official DEI Boys Hostel portal for Dayalbagh Educational Institute scholars. Secure student accommodation in Agra, online fee payment, admission process, and 24x7 security."
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["Hostel", "LocalBusiness", "EducationalOrganization"],
              "@id": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/#organization",
              "name": "Dayalbagh Educational Institute Boys Hostel",
              "alternateName": "DEI Boys Hostel Agra",
              "url": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/",
              "logo": "/logo.jpg",
              "image": [
                "/logo.jpg",
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
              ],
              "description": "Student hostel and residence accommodation at Dayalbagh Educational Institute, Agra, designed specifically for academic focus, safety, and modern living.",
              "parentOrganization": {
                "@type": "EducationalOrganization",
                "name": "Dayalbagh Educational Institute",
                "url": "https://www.dei.ac.in"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Dayalbagh",
                "addressLocality": "Agra",
                "addressRegion": "Uttar Pradesh",
                "postalCode": "282005",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "27.2152",
                "longitude": "78.0052"
              },
              "telephone": "+91-562-280-1545",
              "email": "deiboyshostel.agra@gmail.com",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "09:00",
                  "closes": "17:00"
                }
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-562-280-1545",
                "contactType": "Hostel Administration Support",
                "email": "deiboyshostel.agra@gmail.com",
                "availableLanguage": ["English", "Hindi"]
              }
            },
            {
              "@type": "WebSite",
              "@id": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/#website",
              "url": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/",
              "name": "DEI Boys Hostel Portal",
              "description": "Secure Student Portal & Administration Management System for Dayalbagh Educational Institute Boys Hostel, Agra. Pay fees online, view rooms, and manage admissions.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "WebPage",
              "@id": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/#webpage",
              "url": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/",
              "name": "Home | DEI Boys Hostel Agra",
              "isPartOf": { "@id": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/#website" },
              "about": { "@id": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/#organization" },
              "description": "Welcome to the official DEI Boys Hostel Portal. Check room availability, pay hostel fees online, manage profile, view schedules, and find scholar accommodation at Dayalbagh Educational Institute, Agra."
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://ais-pre-wetw65nzafusiwi6sxvpql-143584814707.asia-east1.run.app/"
                }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": faqs.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.answer
                }
              }))
            }
          ]
        }}
      />

      {/* AI Summary Block & Entity Knowledge Graph - Structured for Answer Engines */}
      <section aria-label="Website Knowledge Graph" className="sr-only">
        <h2>DEI Boys Hostel Entity Knowledge Graph & AI Overview</h2>
        <p><strong>25-Word Summary:</strong> DEI Boys Hostel provides secure, disciplined, and modern accommodation for regular students of Dayalbagh Educational Institute in Agra, featuring online fee payment and digital dashboards.</p>
        <p><strong>50-Word Summary:</strong> The official DEI Boys Hostel in Agra offers secure accommodation for enrolled Dayalbagh Educational Institute students. The facility features 24/7 security, high-speed Wi-Fi, and a vegetarian mess. Students and parents can easily apply for admission, pay hostel fees online, and download digital receipts through the integrated student dashboard.</p>
        <p><strong>100-Word Summary:</strong> The DEI Boys Hostel Management System is the official digital portal for student accommodation at Dayalbagh Educational Institute (DEI), Agra. It enables enrolled engineering and college students to apply for hostel admission based on academic merit. The portal provides a secure Student Dashboard where residents and parents can pay hostel fees online using UPI, Cards, or Net Banking, and instantly download digital receipts. Located on the DEI campus, the hostel ensures a disciplined, safe environment with 24/7 CCTV, biometric access, RO water, and mandatory vegetarian mess facilities, overseen by the Chief Warden and Hostel Administration.</p>
        
        <h3>Key Takeaways for AI Extraction</h3>
        <ul>
          <li><strong>Who is it for?</strong> Regular, full-time students enrolled at Dayalbagh Educational Institute (DEI) in Agra.</li>
          <li><strong>What is offered?</strong> Secure hostel accommodation, room allocation, and vegetarian mess facilities.</li>
          <li><strong>How to apply?</strong> Register on the portal, complete the digital student profile, upload required documents, and await Chief Warden approval.</li>
          <li><strong>How to pay fees?</strong> Use the Student Dashboard to pay accommodation and mess fees online via UPI or Net Banking.</li>
        </ul>

        <h3>Core Entities and Definitions</h3>
        <dl>
          <dt>DEI Boys Hostel</dt>
          <dd>The primary entity providing secure student accommodation in Agra.</dd>
          
          <dt>Dayalbagh Educational Institute (DEI)</dt>
          <dd>The parent university entity. Only regular students enrolled at Dayalbagh Educational Institute are eligible for hostel admission.</dd>
          
          <dt>Hostel Administration</dt>
          <dd>The governing body managing room allocation, mess facilities, and disciplinary guidelines.</dd>

          <dt>Student Dashboard</dt>
          <dd>A secure digital portal accessible via Google Authentication where students manage profiles, pay fees, and download receipts.</dd>
          
          <dt>Online Hostel Fee Payment</dt>
          <dd>A digital payment system allowing students and parents to pay for accommodation and mess charges securely.</dd>
        </dl>

        <h3>Structured Process Flows</h3>
        <div data-rag-type="process-flow">
          <h4>Hostel Admission & Fee Payment Workflow</h4>
          <ol>
            <li><strong>Eligibility:</strong> Student confirms enrollment at Dayalbagh Educational Institute (DEI).</li>
            <li><strong>Authentication:</strong> Student logs in to the official portal via Google Login.</li>
            <li><strong>Profile Completion:</strong> Student fills out academic details and emergency contacts.</li>
            <li><strong>Verification:</strong> Administration verifies the details against university records.</li>
            <li><strong>Allocation:</strong> Chief Warden allocates a room based on merit and vacancy.</li>
            <li><strong>Payment:</strong> Student securely pays the hostel fee online through the Student Dashboard.</li>
            <li><strong>Confirmation:</strong> Student downloads the digital fee receipt from the portal.</li>
          </ol>
        </div>

        <h3>System Role Comparison</h3>
        <table data-rag-type="comparison-table">
          <caption>Student vs. Admin Capabilities</caption>
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
              <td>Can pay fees and download receipts</td>
              <td>Can view all transactions and approve payments</td>
            </tr>
            <tr>
              <td>Profile Management</td>
              <td>Can manage own profile and documents</td>
              <td>Can view all student profiles and allocate rooms</td>
            </tr>
            <tr>
              <td>System Settings</td>
              <td>No access</td>
              <td>Can configure fee structures and manage admins</td>
            </tr>
          </tbody>
        </table>

        <h3>Related Knowledge</h3>
        <ul data-rag-type="related-topics">
          <li><strong>Facilities:</strong> <a href="/rooms">Room Types</a>, <a href="/gallery">Campus Gallery</a></li>
          <li><strong>Guidelines:</strong> <a href="/guidelines">Hostel Rules</a>, <a href="/terms">Terms of Service</a></li>
        </ul>

        <h3>Global Knowledge Graph & AI Memory Optimization</h3>
        <div data-rag-type="knowledge-graph">
          <h4>Knowledge Continuity: The Hostel Journey</h4>
          <ul>
            <li><strong>Before (Prerequisite):</strong> A prospective applicant must secure admission to Dayalbagh Educational Institute (DEI) before seeking hostel accommodation.</li>
            <li><strong>Now (Current Context):</strong> The student is on the Home Page of the DEI Boys Hostel portal, exploring facilities, guidelines, and the application process.</li>
            <li><strong>Next (Actionable Step):</strong> The student should navigate to <a href="/login">Login</a> to authenticate via Google and access the Student Dashboard to complete their profile.</li>
          </ul>

          <h4>Cross-Page Semantic Links</h4>
          <ul>
            <li><a href="/about">About</a> ↔ Connects to foundational philosophy and facilities overview.</li>
            <li><a href="/rooms">Rooms</a> ↔ Connects to physical room types and accommodation fees.</li>
            <li><a href="/guidelines">Guidelines</a> ↔ Connects to mandatory behavioral and disciplinary expectations.</li>
          </ul>
        </div>

        <h3>Semantic Chunking & AI Context Compression</h3>
        <div data-rag-type="semantic-chunking">
          <article data-chunk-topic="Hostel Overview" data-chunk-intent="Understand DEI Boys Hostel">
            <h4>DEI Boys Hostel Overview</h4>
            <p><strong>One-Sentence Summary:</strong> DEI Boys Hostel provides official, secure accommodation for full-time male students of Dayalbagh Educational Institute in Agra.</p>
            <p><strong>Short Summary:</strong> The hostel offers a disciplined residential environment with vegetarian dining, strict curfews, and 24/7 security. Admission requires full-time enrollment at DEI and completion of an online application.</p>
            <p><strong>Detailed Explanation:</strong> The Dayalbagh Educational Institute (DEI) Boys Hostel serves as the primary residential facility for outstation male students. Managed by the Chief Warden, the hostel enforces strict institutional values, including mandatory vegetarianism and a zero-tolerance anti-ragging policy. Students apply through this online portal, uploading required documents for verification. Upon approval, they pay fees online and are allocated rooms based on academic seniority. The ecosystem is designed to foster a safe, academically focused environment.</p>
            <ul>
              <li><strong>Related Questions:</strong> Who can apply to the DEI Boys Hostel? What are the core rules of the hostel? How do I start the application process?</li>
              <li><strong>Next Step:</strong> <a href="/login">Apply via Student Dashboard</a></li>
            </ul>
          </article>
        </div>

        <h3>Canonical Fact Block & AI Citation Readiness</h3>
        <div data-rag-type="canonical-fact-block">
          <article>
            <h4>Canonical Fact Block: DEI Boys Hostel Management System</h4>
            <ul>
              <li><strong>Topic:</strong> Official digital management portal for DEI Boys Hostel.</li>
              <li><strong>Definition:</strong> The DEI Boys Hostel Management System is the official platform for student admission, fee payment, and accommodation management for male students at Dayalbagh Educational Institute, Agra.</li>
              <li><strong>Purpose:</strong> To streamline the hostel admission process, ensure secure online fee transactions, and enforce institutional guidelines transparently.</li>
              <li><strong>Requirements:</strong> Users must be enrolled as full-time regular students at DEI and authenticate via an institutional or verified Google account.</li>
              <li><strong>Process:</strong> Registration → Document Verification → Online Fee Payment → Room Allocation.</li>
              <li><strong>Limitations:</strong> Outstation students are prioritized. Local Agra residents are generally not eligible for accommodation.</li>
              <li><strong>Related Topics:</strong> <a href="/about">Facilities</a>, <a href="/rooms">Room Allocation</a>, <a href="/guidelines">Disciplinary Rules</a></li>
              <li><strong>Source Authority:</strong> DEI Boys Hostel Administration, Dayalbagh Educational Institute, Agra.</li>
              <li><strong>Last Reviewed:</strong> July 2026</li>
            </ul>
          </article>
        </div>

        <h3>Multi-LLM Compatibility & Cross-Platform AI Understanding</h3>
        <div data-rag-type="multi-llm">
          <article data-llm-format="universal-definition">
            <h4>Universal Definitions & Consistent Terminology</h4>
            <ul>
              <li><strong>Hostel Admission:</strong> The official procedure for full-time DEI students to secure accommodation, requiring profile creation, document verification, and fee payment.</li>
              <li><strong>Student Dashboard:</strong> The secure, Google-authenticated portal where residents manage their profile, pay fees, and view notices.</li>
              <li><strong>Payment Verification:</strong> The administrative review confirming that online fee transactions match institutional records before room allocation.</li>
            </ul>
          </article>
          <article data-llm-format="q-a-coverage">
            <h4>Cross-Platform Question Coverage</h4>
            <ul>
              <li><strong>Who can apply?</strong> Only full-time, regular male students enrolled at the Dayalbagh Educational Institute (DEI) in Agra.</li>
              <li><strong>How do I apply?</strong> Complete the online application via the Student Dashboard after authenticating with a Google account.</li>
              <li><strong>Which documents are required?</strong> Aadhar Card, College ID, and the most recent College Fee Receipt.</li>
            </ul>
          </article>
        </div>

        <h3>AI Entity Intelligence & Semantic Network</h3>
        <div data-rag-type="entity-intelligence">
          <h4>Core Entities & Definitions</h4>
          <ul>
            <li data-entity-type="Organization" data-entity-name="DEI Boys Hostel"><strong>DEI Boys Hostel:</strong> The primary residential facility for male students of Dayalbagh Educational Institute, providing accommodation, mess, and security.</li>
            <li data-entity-type="Organization" data-entity-name="Dayalbagh Educational Institute"><strong>Dayalbagh Educational Institute (DEI):</strong> The parent university located in Agra, Uttar Pradesh, India.</li>
            <li data-entity-type="PersonRole" data-entity-name="Student"><strong>Student:</strong> A full-time, regular enrolled individual at DEI who applies for or resides in the hostel.</li>
            <li data-entity-type="PersonRole" data-entity-name="Hostel Administration"><strong>Hostel Administration:</strong> The governing body (Chief Warden, Resident Wardens) responsible for managing admissions, rooms, and discipline.</li>
            <li data-entity-type="Process" data-entity-name="Hostel Admission"><strong>Hostel Admission:</strong> The multi-step process involving profile creation, document verification, and room allocation.</li>
          </ul>

          <h4>Semantic Relationships</h4>
          <ul>
            <li data-relation="DEPENDENCY"><strong>Admission</strong> requires <strong>Documents</strong> (Aadhar, College ID, Fee Receipt).</li>
            <li data-relation="HIERARCHY"><strong>Dayalbagh Educational Institute</strong> (Parent Organization) → <strong>DEI Boys Hostel</strong> (Child Organization).</li>
            <li data-relation="WORKFLOW"><strong>Approved Admission</strong> enables <strong>Fee Payment</strong>, which leads to <strong>Room Allocation</strong>.</li>
            <li data-relation="RESPONSIBILITY"><strong>Hostel Administration</strong> manages <strong>Room Allocation</strong> and <strong>Discipline</strong>.</li>
          </ul>
        </div>

        <h3>AI Reasoning Support, Decision Trees & Multi-Hop Context</h3>
        <div data-rag-type="reasoning-support">
          <h4>Decision Tree: Hostel Application Process</h4>
          <ul>
            <li><strong>Step 1: Check Eligibility</strong> - Are you a full-time, regular DEI student? If Yes, proceed to Step 2. If No, you are ineligible.</li>
            <li><strong>Step 2: Apply & Submit Documents</strong> - Have you submitted all required documents online? If Yes, wait for verification. If No, application is marked Incomplete.</li>
            <li><strong>Step 3: Verification</strong> - Is your application approved by Hostel Administration? If Yes, proceed to Fee Payment. If No (Pending/Rejected), check dashboard for remarks or contact Support.</li>
            <li><strong>Step 4: Fee Payment</strong> - Did your online payment succeed? If Yes, wait for payment verification. If No (Failed), retry payment or check FAQ.</li>
            <li><strong>Step 5: Room Allocation</strong> - Once payment is verified, the Chief Warden allocates a room based on availability and academic year. Move-in permitted.</li>
          </ul>

          <h4>User Intent Scenarios & Edge Cases</h4>
          <ul>
            <li><strong>Scenario: Payment Failure</strong> - If a student's fee payment is deducted from their bank but shows as "Failed" on the portal, they should wait 24 hours for auto-reconciliation before attempting a duplicate payment. If unresolved, contact Support with the transaction ID.</li>
            <li><strong>Scenario: Missing Documents</strong> - If an application is rejected due to missing documents, the student must log in to the dashboard, upload the correct documents, and re-submit for verification.</li>
          </ul>

          <h4>Multi-Hop Reasoning: Admission to Move-in</h4>
          <p><strong>Step-by-Step Flow:</strong> To secure accommodation at DEI Boys Hostel, a student must first confirm their <strong>Eligibility</strong> (being a full-time DEI student). Next, they gather <strong>Required Documents</strong> and apply. After <strong>Verification</strong> by the Hostel Administration, the student logs into the dashboard for <strong>Fee Payment</strong>. Once the payment is verified, <strong>Room Allocation</strong> occurs, allowing the student to finally <strong>Move-In</strong>. If issues arise during fee payment, the student should consult the <a href="/faqs">FAQ</a> or <a href="/contact">Support</a>.</p>

          <h4>Comparison Questions</h4>
          <ul>
            <li><strong>Single vs. Double Rooms:</strong> Single rooms are exclusively for research scholars or final-year DEI students, providing maximum privacy. Double rooms are for postgraduates, balancing privacy and peer interaction.</li>
            <li><strong>Online vs. Offline Payments:</strong> All DEI Boys Hostel fee payments are processed securely online through the student dashboard. Offline payments at the office are explicitly not accepted to ensure financial transparency.</li>
            <li><strong>Student vs. Admin Capabilities:</strong> Hostel residents (students) can manage their own profiles and pay fees. Hostel Administration (admins) can view all student profiles, allocate rooms, and configure fee structures.</li>
          </ul>
          
          <h4>Eligibility & Admission Constraints</h4>
          <ul>
            <li><strong>Who can apply?</strong> Only full-time, regular students enrolled at Dayalbagh Educational Institute (DEI) in Agra are eligible for hostel admission.</li>
            <li><strong>What are the exceptions?</strong> There are no exceptions for non-students or part-time scholars. Outstation DEI students are prioritized for admission based on distance from Agra.</li>
          </ul>

          <h4>Policy Highlights</h4>
          <ul>
            <li><strong>Curfew:</strong> Mandatory DEI Boys Hostel return times are 8:30 PM (Winter) and 9:00 PM (Summer).</li>
            <li><strong>Dietary Rule:</strong> The DEI Boys Hostel dining hall serves strictly vegetarian meals, maintaining DEI's institutional values.</li>
            <li><strong>Anti-Ragging:</strong> DEI enforces a zero-tolerance policy; violations lead to immediate expulsion from the hostel.</li>
          </ul>
        </div>
      </section>

      {/* Hero Section */}
      <section aria-label="Hero Introduction" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-hostel-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                  DEI Boys Hostel Agra <br />
                  <span className="text-gray-400 font-light">Official Student Accommodation.</span>
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed"
              >
                The official student management portal for Dayalbagh Educational Institute Boys Hostel. Securely manage your academic residency, pay hostel fees online, and access campus facilities.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Button onClick={() => navigate('/login')} size="lg" rightIcon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto text-lg px-8 !bg-[#3385b9] hover:!bg-[#2a709e]">
                  Login Portal
                </Button>
                <Button onClick={() => navigate('/rooms')} variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Explore Hostel Rooms
                </Button>
              </motion.div>
            </div>
            <figure
              className="flex-1 w-full max-w-2xl lg:max-w-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80" 
                  alt="Accommodations at DEI Boys Hostel in Agra"
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-black/10"></div>
              </motion.div>
            </figure>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section aria-label="Key Statistics" className="py-24 bg-hostel-bg border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <AnimatedBlock 
                key={idx}
                delay={idx * 0.15}
                className="h-full"
              >
                <li className="h-full block">
                  <Card className="h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-transparent hover:border-gray-100 group bg-white flex flex-col items-center text-center !p-3 sm:!p-6 md:!p-8">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-hostel-bg rounded-2xl flex items-center justify-center mb-3 sm:mb-6 group-hover:bg-hostel-accent/10 transition-colors">
                      <stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-hostel-accent" aria-hidden="true" />
                    </div>
                    <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-3">{stat.value}</div>
                    <div className="text-gray-600 font-light text-[11px] sm:text-sm leading-relaxed">{stat.label}</div>
                  </Card>
                </li>
              </AnimatedBlock>
            ))}
          </ul>
        </div>
      </section>

      {/* Facilities Section */}
      <section aria-label="Hostel Facilities & Amenities" className="py-24 bg-hostel-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hostel Facilities & Amenities</h2>
            <p className="text-lg text-gray-600 font-light">Everything engineering and college students need for a comfortable and focused academic life in Agra.</p>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {facilities.map((fac, idx) => (
              <AnimatedBlock
                key={idx}
                delay={idx * 0.15}
                className="h-full"
              >
                <li className="h-full block">
                  <Card className="h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-transparent hover:border-gray-100 group bg-white !p-3 sm:!p-6 md:!p-8">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-hostel-bg rounded-2xl flex items-center justify-center mb-3 sm:mb-6 group-hover:bg-hostel-accent/10 transition-colors">
                      <fac.icon className="w-5 h-5 sm:w-7 sm:h-7 text-hostel-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">{fac.title}</h3>
                    <p className="text-gray-600 font-light text-[11px] sm:text-sm leading-relaxed">{fac.desc}</p>
                  </Card>
                </li>
              </AnimatedBlock>
            ))}
          </ul>
        </div>
      </section>

      {/* Room Types */}
      <section aria-label="Student Rooms & Accommodation" className="py-24 bg-hostel-bg border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Student Rooms & Accommodation</h2>
              <p className="text-lg text-gray-600 font-light">Choose the perfect hostel room near Dayalbagh that suits your academic lifestyle and budget.</p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/rooms')}>View All Rooms</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roomsList.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">No rooms to display.</div>
            ) : roomsList.map((room, idx) => (
              <AnimatedBlock
                key={room.id || idx}
                delay={idx * 0.15}
                className="h-full"
              >
                <article className="bg-white rounded-2xl p-0 overflow-hidden h-full flex flex-col group hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-gray-100">
                  <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                    <img src={room.image} alt={`Room option: ${room.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                      {room.price}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{room.title}</h3>
                    <p className="text-gray-600 font-light text-sm mb-6 flex-1 leading-relaxed">{room.desc}</p>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/rooms')}>View Details</Button>
                  </div>
                </article>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section aria-label="Hostel Life & Campus Gallery" className="py-24 bg-hostel-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hostel Life & Campus Gallery</h2>
            <p className="text-lg text-gray-600 font-light mb-8">Take a glimpse into the secure student life and daily activities at DEI Boys Hostel.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {galleryImages.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">No images to display.</div>
            ) : galleryImages.map((img, idx) => (
              <AnimatedBlock
                key={idx}
                delay={idx * 0.15}
                className="aspect-square rounded-2xl overflow-hidden relative group bg-gray-200"
              >
                <img src={img} alt={`DEI Boys Hostel Campus Activity ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
              </AnimatedBlock>
            ))}
          </div>
          <div className="text-center">
            <Button variant="secondary" size="lg" style={{ backgroundColor: '#ffffff' }} onClick={() => navigate('/gallery')}>View Full Gallery</Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section aria-label="Why Choose DEI Boys Hostel" className="py-24 bg-hostel-bg border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <AnimatedBlock 
              direction="right"
              className="flex-1 space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose DEI Boys Hostel?</h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                We go beyond providing a place to stay. As the official student residence for Dayalbagh Educational Institute, our focus is on creating a holistic environment that supports your academic goals, ensures complete safety, and simplifies administration with our digital student dashboard.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-hostel-accent shrink-0" aria-hidden="true" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </AnimatedBlock>
            <AnimatedBlock 
              direction="left"
              delay={0.2}
              className="flex-1 w-full"
            >
              <figure className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative bg-gray-100">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" alt="Students studying together in a collaborative environment" className="w-full h-full object-cover" loading="lazy" />
              </figure>
            </AnimatedBlock>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-label="Frequently Asked Questions (FAQ)" className="py-24 bg-hostel-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions (FAQ)</h2>
            <p className="text-lg text-gray-600 font-light">Find quick answers about hostel admission, online fee payments, and facilities.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <AnimatedBlock 
                key={idx}
                delay={idx * 0.15}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-hostel-accent"
                  aria-expanded={openFaq === idx}
                >
                  <h3 className="font-semibold text-gray-900 text-lg pr-8 m-0">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
                </div>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section aria-label="Call to Action" className="py-24 bg-hostel-bg border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedBlock className="bg-[#c8ffd1] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-xl border-none">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-hostel-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Ready for Secure <br className="hidden md:block"/> Student Accommodation?</h2>
              <p className="text-xl text-gray-600 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our community of scholars and take your academic journey to the next level with our transparent administration and safe living environment in Agra.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button onClick={() => navigate('/login')} size="lg" className="w-full sm:w-auto text-lg px-8 !bg-[#3385b9] hover:!bg-[#2a709e]">
                  Login to Portal
                </Button>
                <Button onClick={() => navigate('/contact')} variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Contact Us
                </Button>
              </div>
            </div>
          </AnimatedBlock>
        </div>
      </section>
    </div>
  );
}
