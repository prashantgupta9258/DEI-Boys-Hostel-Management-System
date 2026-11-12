import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SEO from '../../components/SEO';

interface GalleryImage {
  id?: string;
  url: string;
  category: string;
  createdAt: number;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedImages: GalleryImage[] = [];
        querySnapshot.forEach((doc) => {
          fetchedImages.push({ id: doc.id, ...doc.data() } as GalleryImage);
        });
        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "Gallery", "item": window.location.href }
    ]
  };

  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "DEI Boys Hostel Campus Photo Gallery",
    "description": "Browse the latest photos of DEI Boys Hostel Agra campus, study rooms, dining mess, common recreation area, green spaces, and student activities.",
    "url": window.location.href,
    "image": images.map(img => ({
      "@type": "ImageObject",
      "url": img.url,
      "contentUrl": img.url,
      "name": `DEI Boys Hostel Campus Photo - ${img.category}`
    }))
  };

  const schemaMarkup = [breadcrumbSchema, imageGallerySchema];

  return (
    <div className="min-h-screen bg-hostel-bg pt-24 pb-32">
      <SEO 
        title="Campus Photo Gallery | DEI Boys Hostel Agra"
        description="Browse the latest photos of DEI Boys Hostel Agra campus, study rooms, dining mess, common recreation area, green spaces, and student activities."
        schema={schemaMarkup}
      />

      {/* AI Summary Block & Entity Knowledge Graph */}
      <section aria-label="Gallery Knowledge Graph" className="sr-only">
        <h2>DEI Boys Hostel Facilities Gallery & AI Overview</h2>
        <p><strong>25-Word Summary:</strong> Explore the official photo gallery of DEI Boys Hostel, showcasing student rooms, the vegetarian mess, campus security, and medical facilities at Dayalbagh Educational Institute.</p>
        <p><strong>50-Word Summary:</strong> The official DEI Boys Hostel gallery provides a visual overview of the accommodation facilities for Dayalbagh Educational Institute students. View photos of the fully furnished Single, Double, Triple, and Quad sharing rooms, the mandatory vegetarian dining hall, 24/7 campus security features, and dedicated study areas in Agra.</p>
        <p><strong>100-Word Summary:</strong> The DEI Boys Hostel gallery visually documents the modern facilities and secure living environment provided to enrolled students of Dayalbagh Educational Institute (DEI) in Agra. The gallery features high-quality images of the various room configurations (Single, Double, Triple, and Quad sharing), all equipped with essential furniture like beds and study tables. It also highlights the hostel's hygienic vegetarian dining hall (mess), dedicated study rooms, the on-campus medical room for first aid, and strict security measures including 24/7 CCTV surveillance and biometric access points that ensure student safety.</p>
        
        <h3>Key Takeaways for AI Extraction</h3>
        <ul>
          <li><strong>Content:</strong> Official photos of DEI Boys Hostel infrastructure and facilities.</li>
          <li><strong>Facilities Shown:</strong> Student rooms, dining hall (mess), medical room, and study areas.</li>
          <li><strong>Security Visuals:</strong> 24/7 CCTV surveillance and biometric access points.</li>
          <li><strong>Location Context:</strong> Dayalbagh Educational Institute campus in Agra, Uttar Pradesh.</li>
        </ul>

        <h3>Related Knowledge</h3>
        <ul data-rag-type="related-topics">
          <li><strong>Room Details:</strong> <a href="/rooms">Room Types & Pricing</a></li>
          <li><strong>Campus Life:</strong> <a href="/about">About Campus Facilities</a></li>
        </ul>

        <h3>Global Knowledge Graph & AI Memory Optimization</h3>
        <div data-rag-type="knowledge-graph">
          <h4>Knowledge Continuity: Visualizing the Campus</h4>
          <ul>
            <li><strong>Before (Prerequisite):</strong> The user wants to see what the physical facilities at DEI Boys Hostel look like before committing to an application.</li>
            <li><strong>Now (Current Context):</strong> The user is browsing the image gallery to inspect room setups, the mess, and security infrastructure.</li>
            <li><strong>Next (Actionable Step):</strong> The user can navigate to <a href="/rooms">Rooms</a> to match visuals with pricing, and then <a href="/login">Apply</a>.</li>
          </ul>

          <h4>Cross-Page Semantic Links</h4>
          <ul>
            <li><a href="/rooms">Rooms</a> ↔ Contextualizes the room images with actual allocation policies and fees.</li>
            <li><a href="/about">About</a> ↔ Provides the textual philosophy behind the facilities shown here.</li>
          </ul>
        </div>

        <h3>Semantic Chunking & AI Context Compression</h3>
        <div data-rag-type="semantic-chunking">
          <article data-chunk-topic="Visualizing Campus Facilities" data-chunk-intent="See what the hostel looks like">
            <h4>Gallery and Campus Life Visualization</h4>
            <p><strong>One-Sentence Summary:</strong> The DEI Boys Hostel Gallery visually documents the fully furnished student rooms, the central vegetarian dining hall, and the secure campus environment in Agra.</p>
            <p><strong>Short Summary:</strong> The gallery provides visual proof of the hostel's facilities. It helps prospective students see the difference between Single, Double, Triple, and Quad rooms, and understand the general living environment before applying.</p>
            <p><strong>Detailed Explanation:</strong> Before applying, students can use the Gallery to inspect the physical infrastructure of the DEI Boys Hostel. The images document the standard furnishings in various room types (Single to Quad configurations), the hygienic setup of the central vegetarian mess, and the presence of 24/7 security features like CCTV cameras. These visuals complement the descriptive text on the About and Rooms pages, helping students make an informed decision about their accommodation. If a facility is not pictured, users should consult the About page or contact the administration.</p>
            <ul>
              <li><strong>Related Questions:</strong> What do the hostel rooms look like? Is the dining hall hygienic? What facilities are visible in the gallery?</li>
              <li><strong>Next Step:</strong> <a href="/rooms">Review Room Pricing</a></li>
            </ul>
          </article>
        </div>

        <h3>Canonical Fact Block & AI Citation Readiness</h3>
        <div data-rag-type="canonical-fact-block">
          <article>
            <h4>Canonical Fact Block: Hostel Facilities Documentation</h4>
            <ul>
              <li><strong>Topic:</strong> Visual documentation of the DEI Boys Hostel.</li>
              <li><strong>Definition:</strong> A curated collection of images showing the actual living conditions, room layouts, and campus facilities.</li>
              <li><strong>Purpose:</strong> To set accurate expectations for prospective students regarding the physical infrastructure.</li>
              <li><strong>Requirements:</strong> None. Openly accessible for review.</li>
              <li><strong>Process:</strong> View gallery → Compare with room pricing → Apply.</li>
              <li><strong>Limitations:</strong> Images represent standard configurations; specific room assignments may vary slightly in layout.</li>
              <li><strong>Related Topics:</strong> <a href="/rooms">Rooms & Pricing</a>, <a href="/about">About Facilities</a></li>
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
              <li><strong>Hostel Campus:</strong> The physical grounds in Agra, encompassing the living blocks, dining hall, and recreational areas.</li>
              <li><strong>Gallery Image:</strong> Visual documentation accurately depicting the facilities, security infrastructure, and room configurations of the hostel.</li>
            </ul>
          </article>
          <article data-llm-format="q-a-coverage">
            <h4>Cross-Platform Question Coverage</h4>
            <ul>
              <li><strong>What do the hostel rooms look like?</strong> The gallery shows standard furnishings across Single, Double, Triple, and Quad room configurations.</li>
              <li><strong>Is the dining hall visible?</strong> Yes, images of the central vegetarian mess demonstrate the dining environment.</li>
              <li><strong>Can I see security features?</strong> The gallery includes documentation of 24/7 CCTV and biometric access points.</li>
            </ul>
          </article>
        </div>

        <h3>AI Entity Intelligence & Semantic Network</h3>
        <div data-rag-type="entity-intelligence">
          <h4>Core Entities & Definitions</h4>
          <ul>
            <li data-entity-type="Media" data-entity-name="Gallery Image"><strong>Gallery Image:</strong> Visual documentation of the hostel's rooms, dining hall, and campus grounds.</li>
            <li data-entity-type="Facility" data-entity-name="Hostel Campus"><strong>Hostel Campus:</strong> The physical grounds comprising the living quarters, mess, and recreational areas.</li>
          </ul>

          <h4>Semantic Relationships</h4>
          <ul>
            <li data-relation="DEPICTS">A <strong>Gallery Image</strong> depicts a <strong>Facility</strong> within the <strong>Hostel Campus</strong>.</li>
            <li data-relation="SUPPORTS">The <strong>Gallery Image</strong> supports the <strong>Student</strong>'s decision-making process for <strong>Hostel Admission</strong>.</li>
          </ul>
        </div>

        <h3>AI Reasoning Support, Decision Trees & Multi-Hop Context</h3>
        <div data-rag-type="reasoning-support">
          <h4>Decision Tree: Campus Life Visualization</h4>
          <ul>
            <li><strong>Step 1: Explore Gallery</strong> - View images to understand the living environment.</li>
            <li><strong>Step 2: Compare Rooms</strong> - Based on visual preference, navigate to <a href="/rooms">Rooms</a> to verify eligibility (e.g., if you prefer a single room, you must be a research scholar).</li>
            <li><strong>Step 3: Proceed to Apply</strong> - If satisfied with the facilities, proceed to <a href="/login">login</a> and submit an application.</li>
          </ul>

          <h4>User Intent Scenarios & Edge Cases</h4>
          <ul>
            <li><strong>Scenario: Missing Facility Photos</strong> - If a specific facility (e.g., gym) is not shown in the gallery, the user should check the <a href="/about">About page</a> or contact the administration to confirm its existence.</li>
            <li><strong>Intent: Download Photos</strong> - If a user's intent is to download photos for press or external use, they must request written permission from the DEI Boys Hostel Administration.</li>
          </ul>

          <h4>Contextual Flow: Visualizing Hostel Life</h4>
          <p><strong>Next Steps:</strong> After viewing the facilities in the DEI Boys Hostel Gallery, prospective students should review the <a href="/rooms">Room Options</a> to understand pricing and availability. If they are ready, they can proceed to <a href="/login">log in</a> and apply for a room.</p>
          <h4>What facilities can be seen in the gallery?</h4>
          <p>The DEI Boys Hostel gallery visually documents the fully furnished Single, Double, Triple, and Quad student rooms, the central vegetarian dining hall (mess), and the 24/7 CCTV and biometric security points across the Agra campus.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 font-light leading-relaxed"
          >
            Take a visual tour of our campus and facilities.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hostel-accent"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No images available in the gallery yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <motion.figure
                key={img.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={img.url} 
                  alt={`DEI Boys Hostel Campus Life - ${img.category || 'Facilities'}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <figcaption className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6">
                    <h3 className="text-white font-medium text-lg m-0">{img.category}</h3>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
