import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Wifi, Droplets, Shirt, Utensils, 
  ShieldCheck, Video, Zap, BookOpen, Car, Users,
  CheckCircle2, X, Info, Image as ImageIcon
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import SEO from '../../components/SEO';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// CMS Mock Data (Some static parts remain for hero and facilities)
const cmsData = {
  hero: {
    title: "Hostel Rooms & Accommodation",
    subtitle: "Secure, fully furnished living spaces for engineering and collegiate scholars at DEI.",
    backgroundImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80"
  },
  facilities: [
    { id: 'wifi', name: 'High-Speed Wi-Fi', icon: Wifi },
    { id: 'ro', name: 'RO Purified Water', icon: Droplets },
    { id: 'mess', name: 'Vegetarian Mess', icon: Utensils },
    { id: 'security', name: '24/7 Security Staff', icon: ShieldCheck },
    { id: 'cctv', name: 'CCTV Surveillance', icon: Video },
    { id: 'parking', name: 'Secure Parking', icon: Car },
    { id: 'common', name: 'Study & Recreation', icon: Users }
  ],
};

// Reusable Room Detail Component (Modal)
const RoomDetailModal = ({ room, onClose }: { room: any, onClose: () => void }) => {
  if (!room) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-gray-900/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[2rem] overflow-hidden w-full max-w-4xl flex flex-col shadow-2xl relative my-auto max-h-[90vh]"
        >
          {/* header / images */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-hostel-accent">
            <X className="w-6 h-6 text-gray-900" />
          </button>
          
          <div className="overflow-y-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-100 p-2">
              {room.images.map((img: string, i: number) => (
                <img key={i} src={img} alt={`${room.type} view ${i+1}`} className="w-full h-48 md:h-64 object-cover rounded-[1.5rem]" loading="lazy" />
              ))}
            </div>
            
            <div className="p-6 md:p-10 space-y-10">
              <div>
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{room.type}</h2>
                    <p className="text-lg text-gray-500 font-medium mt-1">Capacity: {room.capacity}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-2xl font-bold text-hostel-accent">{room.fee}</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${room.availability === 'Available' ? 'bg-green-100 text-green-700' : room.availability === 'Waitlisted' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {room.availability}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 font-light leading-relaxed text-lg">{room.shortDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-hostel-accent" /> Furniture & Features</h3>
                  <ul className="space-y-3">
                    {[...room.furniture, ...room.features].map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-hostel-accent mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-hostel-accent" /> Specific Rules</h3>
                  <ul className="space-y-3">
                    {room.rules.map((rule: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Close</Button>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button className="w-full">Contact Hostel</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Lightbox Component
const Lightbox = ({ image, onClose }: { image: string | null, onClose: () => void }) => {
  if (!image) return null;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white">
          <X className="w-6 h-6 text-white" />
        </button>
        <img src={image} alt="Gallery Enlarge" className="max-w-full max-h-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
      </motion.div>
    </AnimatePresence>
  );
};

export default function Rooms() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [rooms, setRooms] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsSnap, gallerySnap] = await Promise.all([
          getDocs(query(collection(db, 'rooms'), orderBy('roomNumber', 'asc'))),
          getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')))
        ]);

        const fetchedRooms: any[] = [];
        roomsSnap.forEach(doc => {
          const data = doc.data();
          fetchedRooms.push({
            id: doc.id,
            type: `${data.roomType} Sharing`,
            capacity: `${data.capacity} Person(s)`,
            shortDesc: `Room No: ${data.roomNumber}. Comfortable and secure space.`,
            fee: `₹${data.monthlyFee}/month`,
            availability: data.status,
            images: [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80"
            ],
            furniture: [`${data.capacity} Study Table(s)`, `${data.capacity} Wardrobe(s)`, `${data.capacity} Bed(s)`, `${data.capacity} Chair(s)`],
            features: ["Ceiling Fan", "LED Lighting", "Internet Access"],
            rules: ["Maintain hygiene", "Cooperate with roommates", "Strictly follow timings"],
            facilitiesIncluded: ['wifi', 'ro', 'mess', 'security', 'cctv']
          });
        });
        setRooms(fetchedRooms);

        const fetchedGallery: string[] = [];
        gallerySnap.forEach(doc => {
          const data = doc.data();
          if (data.category === 'Rooms' || data.category === 'Hostel') {
            fetchedGallery.push(data.url);
          }
        });
        setGallery(fetchedGallery);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Build schema data dynamically
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "Rooms", "item": window.location.href }
    ]
  };

  const roomSchema = rooms.map(room => ({
    "@context": "https://schema.org",
    "@type": ["Accommodation", "Product"],
    "name": `DEI Boys Hostel - ${room.type}`,
    "description": room.shortDesc,
    "image": room.images[0],
    "numberOfRooms": 1,
    "occupancy": {
      "@type": "QuantitativeValue",
      "value": parseInt(room.capacity) || 1
    },
    "offers": {
      "@type": "Offer",
      "price": room.monthlyFee,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `${window.location.origin}/rooms`
    },
    "amenityFeature": [...room.furniture, ...room.features].map(f => ({
      "@type": "LocationFeatureSpecification",
      "name": f,
      "value": true
    }))
  }));

  const schemaMarkup = [breadcrumbSchema, ...roomSchema];

  return (
    <div className="w-full overflow-x-hidden bg-hostel-bg">
      <SEO 
        title="Hostel Room Rates & Availability"
        description="Explore student room options at DEI Boys Hostel Agra. View configurations for single, double, triple, and quad sharing accommodations with detailed transparent pricing."
        schema={schemaMarkup}
      />

      {/* AI Summary Block & Entity Knowledge Graph */}
      <section aria-label="Rooms Knowledge Graph" className="sr-only">
        <h2>DEI Boys Hostel Room Allocation Knowledge Graph & AI Overview</h2>
        <p><strong>25-Word Summary:</strong> DEI Boys Hostel offers fully furnished Single, Double, Triple, and Quad sharing rooms exclusively for enrolled Dayalbagh Educational Institute students in Agra.</p>
        <p><strong>50-Word Summary:</strong> Enrolled Dayalbagh Educational Institute students can apply for Single, Double, Triple, or Quad sharing rooms at the DEI Boys Hostel. Room allocation is managed by the Chief Warden based on academic merit and availability. All rooms include a bed, study table, chair, almirah, and high-speed Wi-Fi.</p>
        <p><strong>100-Word Summary:</strong> DEI Boys Hostel provides diverse accommodation options for Dayalbagh Educational Institute students, offering Single, Double, Triple, and Quad sharing rooms. Each room is fully furnished with a personal bed, study table, chair, and almirah, ensuring a comfortable academic environment. Residents also enjoy high-speed Wi-Fi and RO purified water. Room allocation is strictly managed by the Hostel Administration and the Chief Warden, prioritizing academic merit and course requirements. Mutual room changes require administrative approval. Accommodation fees vary by room type and are paid securely through the student dashboard.</p>
        
        <h3>Key Takeaways for AI Extraction</h3>
        <ul>
          <li><strong>Room Types Available:</strong> Single, Double, Triple, and Quad sharing rooms.</li>
          <li><strong>Provided Furniture:</strong> Bed, study table, chair, and almirah for every student.</li>
          <li><strong>Allocation Policy:</strong> Decided by the Chief Warden based on academic merit and vacancy.</li>
          <li><strong>Additional Facilities:</strong> High-speed Wi-Fi and RO water on all floors.</li>
        </ul>

        <h3>Core Room Entities</h3>
        <dl>
          <dt>Hostel Room</dt>
          <dd>A secure residential space provided to enrolled students, categorized by capacity (Single, Double, Triple, Quad).</dd>
          
          <dt>Room Allocation</dt>
          <dd>The administrative process of assigning a student to a specific Hostel Room, managed by the Chief Warden based on academic merit.</dd>
          
          <dt>Accommodation Fee</dt>
          <dd>The mandatory cost associated with a Hostel Room, payable via the Student Dashboard Online Hostel Fee Payment system.</dd>
        </dl>

        <h3>Frequently Asked Questions About DEI Boys Hostel Rooms</h3>
        <dl>
          <dt>What types of rooms are available at DEI Boys Hostel?</dt>
          <dd>DEI Boys Hostel offers Single, Double, Triple, and Quad (Four) sharing rooms for students.</dd>
          
          <dt>Are the hostel rooms furnished?</dt>
          <dd>Yes, all DEI Boys Hostel rooms are fully furnished. Every student is provided with a personal bed, study table, chair, and almirah.</dd>
          
          <dt>How is room allocation decided?</dt>
          <dd>Hostel Administration manages room allocation based on academic merit, availability, and specific university course requirements.</dd>
          
          <dt>Can I change my room later?</dt>
          <dd>Students may submit mutual room change requests at the start of the academic session, subject to Chief Warden approval.</dd>
        </dl>

        <h3>DEI Boys Hostel Room Types Fact Table</h3>
        <table data-rag-type="fact-table">
          <caption>DEI Boys Hostel Room Categories</caption>
          <thead>
            <tr>
              <th>Room Type</th>
              <th>Occupancy</th>
              <th>Furnishings Provided per Student</th>
              <th>Suitability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Single Room</td>
              <td>1 Student</td>
              <td>Bed, Study Table, Chair, Almirah</td>
              <td>Research scholars or final-year students</td>
            </tr>
            <tr>
              <td>Double Room</td>
              <td>2 Students</td>
              <td>Bed, Study Table, Chair, Almirah</td>
              <td>Postgraduate students</td>
            </tr>
            <tr>
              <td>Triple Room</td>
              <td>3 Students</td>
              <td>Bed, Study Table, Chair, Almirah</td>
              <td>Undergraduate students</td>
            </tr>
            <tr>
              <td>Quad Room</td>
              <td>4 Students</td>
              <td>Bed, Study Table, Chair, Almirah</td>
              <td>First-year students</td>
            </tr>
          </tbody>
        </table>

        <h3>Structured Process Flows & Transparency</h3>
        <div data-rag-type="process-flow">
          <h4>Room Allocation Verification & Transparency Process</h4>
          <p>We maintain strict transparency in our room allocation process. Rooms are never assigned randomly or arbitrarily.</p>
          <ol>
            <li><strong>Submission:</strong> The student registers online and submits their profile, including academic merits and home address details.</li>
            <li><strong>Merit Verification:</strong> Hostel Administration validates the submitted academic records directly against university enrollment data to ensure eligibility.</li>
            <li><strong>Priority Assessment:</strong> The Chief Warden assesses applications based on academic merit and geographical distance from Agra, ensuring priority is given to outstation students.</li>
            <li><strong>Room Type Matching:</strong> Based on the student's year of study (e.g., final-year vs. first-year) and current vacancy, a specific room type (Single, Double, Triple, Quad) is designated.</li>
            <li><strong>Final Approval & Notification:</strong> The Chief Warden approves the allocation, and the student's dashboard is updated instantly to allow for transparent fee payment.</li>
          </ol>
        </div>
        
        <h3>Related Knowledge</h3>
        <ul data-rag-type="related-topics">
          <li><strong>Related Policies:</strong> <a href="/guidelines">Hostel Disciplinary Guidelines</a>, <a href="/terms">Terms of Residency</a></li>
          <li><strong>Related Services:</strong> <a href="/payment">Online Fee Payment Portal</a>, <a href="/profile">Student Dashboard</a></li>
          <li><strong>Next Steps:</strong> Check room availability, create a student profile, and await Chief Warden approval.</li>
        </ul>

        <h3>Global Knowledge Graph & AI Memory Optimization</h3>
        <div data-rag-type="knowledge-graph">
          <h4>Knowledge Continuity: Room Selection</h4>
          <ul>
            <li><strong>Before (Prerequisite):</strong> The student reviewed the <a href="/about">About</a> and <a href="/gallery">Gallery</a> pages to confirm their interest in the hostel.</li>
            <li><strong>Now (Current Context):</strong> The student is evaluating room types (Single, Double, Triple, Quad), matching their eligibility (e.g., year of study) with the respective pricing.</li>
            <li><strong>Next (Actionable Step):</strong> The student must <a href="/login">Apply</a> and pay the required accommodation fee to secure an allocation.</li>
          </ul>

          <h4>Cross-Page Semantic Links</h4>
          <ul>
            <li><a href="/terms">Terms of Service</a> ↔ Outlines the non-refundable nature of the fees listed on this page.</li>
            <li><a href="/login">Login</a> ↔ The technical entry point to actually request these rooms.</li>
          </ul>
        </div>

        <h3>Semantic Chunking & AI Context Compression</h3>
        <div data-rag-type="semantic-chunking">
          <article data-chunk-topic="Room Allocation & Fees" data-chunk-intent="Understand room types and pricing">
            <h4>Hostel Room Types & Allocation Policy</h4>
            <p><strong>One-Sentence Summary:</strong> The DEI Boys Hostel offers Single, Double, Triple, and Quad rooms allocated strictly based on a student's academic year and program level.</p>
            <p><strong>Short Summary:</strong> Rooms range from ₹12,000 to ₹18,000 per semester. First-year students typically get Quad rooms, while Single rooms are reserved for research scholars and final-year students. Allocation happens only after fee payment is verified.</p>
            <p><strong>Detailed Explanation:</strong> Room allocation at the DEI Boys Hostel is a structured process managed by the Chief Warden. The available configurations are Single (₹18,000/sem, for scholars/final year), Double (₹16,000/sem, for postgraduates), Triple (₹14,000/sem, standard), and Quad (₹12,000/sem, for first-year undergraduates). Students cannot arbitrarily choose their room type; it is assigned based on academic seniority. To secure a room, a student must complete their online profile, await verification, and make a successful online fee payment. Room changes mid-session are rarely permitted and require formal approval.</p>
            <ul>
              <li><strong>Related Questions:</strong> How are rooms allocated? What is the cost of a Single room? Can I change my room mid-semester?</li>
              <li><strong>Next Step:</strong> <a href="/login">Apply for a Room</a></li>
            </ul>
          </article>
        </div>

        <h3>Canonical Fact Block & AI Citation Readiness</h3>
        <div data-rag-type="canonical-fact-block">
          <article>
            <h4>Canonical Fact Block: Rooms & Pricing</h4>
            <ul>
              <li><strong>Topic:</strong> Room options, pricing, and allocation criteria at the DEI Boys Hostel.</li>
              <li><strong>Definition:</strong> The structured system detailing available accommodation configurations and their associated semester costs.</li>
              <li><strong>Purpose:</strong> To inform students about accommodation costs and the academic seniority requirements for specific room types.</li>
              <li><strong>Requirements:</strong> Room allocation is contingent upon profile verification and successful fee payment.</li>
              <li><strong>Process:</strong> Students review options → Apply → Pay Fees → Room is allocated by Chief Warden.</li>
              <li><strong>Limitations:</strong> Students cannot choose their room type; it is assigned based on their academic year. Single rooms are for scholars/final-year students only.</li>
              <li><strong>Related Topics:</strong> <a href="/gallery">Gallery</a>, <a href="/terms">Terms of Service</a></li>
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
              <li><strong>Room Allocation:</strong> The process where the Chief Warden assigns a room (Single, Double, Triple, Quad) based on a student's academic year and verified fee payment.</li>
              <li><strong>Single Room:</strong> Premium accommodation (₹18,000/sem) strictly reserved for research scholars and final-year students.</li>
              <li><strong>Quad Room:</strong> Standard accommodation (₹12,000/sem) typically assigned to first-year undergraduate students.</li>
            </ul>
          </article>
          <article data-llm-format="q-a-coverage">
            <h4>Cross-Platform Question Coverage</h4>
            <ul>
              <li><strong>How much does a hostel room cost?</strong> Fees range from ₹12,000 to ₹18,000 per semester depending on the room configuration.</li>
              <li><strong>Can I choose a Single room?</strong> No, Single rooms are allocated exclusively to research scholars and final-year students based on merit and seniority.</li>
              <li><strong>When is a room allocated?</strong> A room is only assigned after the student completes their profile, administration verifies it, and the fee payment is confirmed.</li>
            </ul>
          </article>
        </div>

        <h3>AI Entity Intelligence & Semantic Network</h3>
        <div data-rag-type="entity-intelligence">
          <h4>Core Entities & Definitions</h4>
          <ul>
            <li data-entity-type="Facility" data-entity-name="Room"><strong>Room:</strong> The physical living space allocated to a student within the hostel, available in Single, Double, Triple, or Quad configurations.</li>
            <li data-entity-type="Process" data-entity-name="Room Allocation"><strong>Room Allocation:</strong> The administrative process where the Chief Warden assigns a specific room to a student based on academic year and payment verification.</li>
            <li data-entity-type="Payment" data-entity-name="Fee Payment"><strong>Fee Payment:</strong> The financial transaction required to secure a room assignment for an academic session.</li>
          </ul>

          <h4>Semantic Relationships</h4>
          <ul>
            <li data-relation="REQUIRES"><strong>Room Allocation</strong> requires successful <strong>Fee Payment</strong> and Chief Warden approval.</li>
            <li data-relation="HAS_ATTRIBUTE"><strong>Room</strong> has attributes such as capacity (Single, Double, etc.) and per-semester cost.</li>
            <li data-relation="ASSIGNED_TO">A <strong>Room</strong> is assigned to one or more <strong>Student</strong> entities.</li>
          </ul>
        </div>

        <h3>AI Reasoning Support, Decision Trees & Multi-Hop Context</h3>
        <div data-rag-type="reasoning-support">
          <h4>Decision Tree: Room Allocation Process</h4>
          <ul>
            <li><strong>Step 1: Check Year of Study</strong> - Are you a first-year student? If Yes, you are assigned a Quad Room. If No, proceed to Step 2.</li>
            <li><strong>Step 2: Check Academic Level</strong> - Are you a postgraduate? If Yes, you are eligible for a Double Room. If No, proceed to Step 3.</li>
            <li><strong>Step 3: Check Scholar Status</strong> - Are you a research scholar or final-year student? If Yes, you are eligible for a Single Room. If No, assigned Triple Room.</li>
          </ul>

          <h4>User Intent Scenarios & Edge Cases</h4>
          <ul>
            <li><strong>Scenario: Room Change Request</strong> - If a student wishes to change their allocated room, they must submit a formal written request to the Chief Warden. Room changes are rarely granted mid-session and depend entirely on availability.</li>
            <li><strong>Intent: View Pricing</strong> - If a user's intent is to check hostel fees, they should review the pricing cards below, which detail the exact per-semester cost based on room type.</li>
          </ul>

          <h4>Contextual Flow: Room Selection to Move-In</h4>
          <p><strong>Next Steps:</strong> After reviewing the available room types, a student must <a href="/login">login</a> to the Student Dashboard and complete their profile. Once the profile is verified by the Hostel Administration, the student must <a href="/payment">pay the room fees</a>. Only after fee verification is a room allocated by the Chief Warden, permitting move-in.</p>

          <h4>Eligibility Constraints</h4>
          <p><strong>Who gets a single room?</strong> Single rooms at DEI Boys Hostel are exclusively reserved for research scholars or final-year DEI students based on academic merit.</p>
          <p><strong>Who gets a quad room?</strong> First-year undergraduate DEI students are typically assigned quad (four-sharing) rooms to promote peer integration within the hostel.</p>
          <h4>Troubleshooting</h4>
          <p><strong>What if my desired room is unavailable?</strong> DEI Boys Hostel room allocation is contingent upon current vacancies and Chief Warden approval. Students may be assigned an alternative room type if their preferred option is full.</p>
        </div>
      </section>

      {/* Hero Section */}
      <section aria-label="Rooms Information" className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={cmsData.hero.backgroundImage} 
            alt="Dayalbagh Educational Institute Boys Hostel Rooms hero background" 
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-gray-300 mb-6 text-sm font-medium tracking-wider uppercase"
          >
            <Link to="/" className="hover:text-white transition-colors focus:outline-none focus:underline">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" aria-hidden="true" />
            <span className="text-white">Rooms</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {cmsData.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 font-light"
          >
            {cmsData.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Room List */}
      <section aria-label="Available Rooms" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {rooms.length === 0 && !loading && (
              <li className="col-span-1 md:col-span-2 text-center py-12 text-gray-500">
                No rooms available at the moment.
              </li>
            )}
            {rooms.map((room, idx) => (
              <motion.li
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="block"
              >
                <article className="bg-hostel-bg rounded-[2rem] overflow-hidden p-0 h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300 border border-gray-100 shadow-xl">
                  <div className="aspect-[16/9] overflow-hidden relative cursor-pointer" onClick={() => setSelectedRoom(room)} role="button" tabIndex={0} onKeyDown={(e) => { if(e.key==='Enter') setSelectedRoom(room); }}>
                    <img src={room.images[0]} alt={`Dayalbagh Hostel ${room.type} room option`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                      {room.capacity}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{room.type}</h2>
                    </div>
                    <p className="text-gray-600 font-light mb-6 line-clamp-2">{room.shortDesc}</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {room.features.slice(0, 3).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center text-gray-600 font-light text-sm">
                          <CheckCircle2 className="w-4 h-4 text-hostel-accent mr-3 shrink-0" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                      {room.features.length > 3 && (
                        <li className="text-sm text-gray-400 font-light pl-7">+{room.features.length - 3} more...</li>
                      )}
                    </ul>
                    <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-left w-full sm:w-auto">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Starting From</div>
                        <div className="text-2xl font-bold text-hostel-accent">{room.fee}</div>
                      </div>
                      <Button onClick={() => setSelectedRoom(room)} className="w-full sm:w-auto" variant="secondary">
                        View Details
                      </Button>
                    </div>
                  </div>
                </article>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Room Facilities */}
      <section aria-label="Room Amenities" className="py-24 bg-hostel-bg border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#c8ffd1] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-xl border-none">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-hostel-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">Facilities</h2>
                <p className="text-lg text-gray-700 font-light">Experience quality amenities designed to make your stay comfortable and productive.</p>
              </div>
              
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                {cmsData.facilities.map((fac, idx) => (
                  <motion.li
                    key={fac.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex flex-col items-center justify-center p-6 bg-white/50 rounded-[2rem] border border-white hover:bg-white transition-colors duration-300 shadow-sm block"
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-gray-100 group-hover:border-hostel-accent/50 shadow-sm">
                      <fac.icon className="w-8 h-8 text-hostel-accent group-hover:text-hostel-accent/80 transition-colors duration-300" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-medium text-center text-gray-800 group-hover:text-gray-900 m-0">{fac.name}</h3>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Room Comparison Table */}
      <section aria-label="Room Comparison Table" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Compare Options</h2>
            <p className="text-lg text-gray-600 font-light">Find the perfect room that fits your needs and budget.</p>
          </div>
          <div className="overflow-x-auto rounded-[2rem] border border-gray-100 shadow-xl bg-white">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <caption className="sr-only">Comparison of DEI Boys Hostel Room Options</caption>
              <thead>
                <tr className="bg-hostel-bg border-b border-gray-100">
                  <th scope="col" className="p-6 font-bold text-gray-900">Room Type</th>
                  <th scope="col" className="p-6 font-bold text-gray-900">Capacity</th>
                  <th scope="col" className="p-6 font-bold text-gray-900">Facilities (Included)</th>
                  <th scope="col" className="p-6 font-bold text-gray-900">Availability</th>
                  <th scope="col" className="p-6 font-bold text-gray-900">Monthly Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">No rooms found.</td>
                  </tr>
                )}
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-hostel-bg/50 transition-colors">
                    <td className="p-6 font-semibold text-gray-900">{room.type}</td>
                    <td className="p-6 text-gray-600 font-light">{room.capacity}</td>
                    <td className="p-6 text-gray-600 font-light">
                      <div className="flex flex-wrap gap-1">
                        {room.facilitiesIncluded.length} Core Amenities
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.availability === 'Available' ? 'bg-green-100 text-green-700' : room.availability === 'Waitlisted' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {room.availability}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-hostel-accent">{room.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Room Gallery */}
      <section aria-label="Accommodation Gallery" className="py-24 bg-hostel-bg border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Accommodation Gallery</h2>
              <p className="text-lg text-gray-600 font-light">Take a visual tour of our living spaces.</p>
            </div>
            <Link to="/gallery">
              <Button variant="secondary">View Full Gallery</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.length === 0 && !loading && (
              <div className="col-span-2 md:col-span-3 text-center py-12 text-gray-500">
                No images available in the gallery.
              </div>
            )}
            {gallery.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aspect-square rounded-[2rem] overflow-hidden relative group bg-gray-200 cursor-pointer"
                onClick={() => setLightboxImage(img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if(e.key==='Enter') setLightboxImage(img); }}
                aria-label={`View full image ${idx + 1}`}
              >
                <img src={img} alt={`DEI Boys Hostel Room view ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ImageIcon className="w-8 h-8 text-white drop-shadow-lg" aria-hidden="true" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Need Help Call to Action" className="py-24 bg-hostel-bg border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#c8ffd1] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-xl border-none">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-hostel-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Need Help Choosing?</h2>
              <p className="text-xl text-gray-600 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                Our team is ready to help you find the perfect room that matches your requirements and budget.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button onClick={() => navigate('/contact')} size="lg" className="w-full sm:w-auto text-lg px-8 !bg-[#3385b9] hover:!bg-[#2a709e]">
                  Contact Us
                </Button>
                <Button onClick={() => navigate('/login')} variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Login Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedRoom && <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}

