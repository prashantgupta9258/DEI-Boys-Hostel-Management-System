import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  schema?: object | object[];
}

export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/logo.jpg',
  schema
}: SEOProps) {
  const currentUrl = canonical || window.location.href;
  const fullTitle = `${title} | DEI Boys Hostel Agra`;

  useEffect(() => {
    // 1. Title
    document.title = fullTitle;

    // Helper to get or create element
    const getOrCreateMeta = (attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
      return element;
    };

    // 2. Meta Description
    getOrCreateMeta('name', 'description', description);

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 4. Open Graph Tags
    getOrCreateMeta('property', 'og:title', fullTitle);
    getOrCreateMeta('property', 'og:description', description);
    getOrCreateMeta('property', 'og:url', currentUrl);
    getOrCreateMeta('property', 'og:type', ogType);
    getOrCreateMeta('property', 'og:image', ogImage);

    // 5. Twitter Card Tags
    getOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    getOrCreateMeta('name', 'twitter:title', fullTitle);
    getOrCreateMeta('name', 'twitter:description', description);
    getOrCreateMeta('name', 'twitter:image', ogImage);

    // 6. JSON-LD Schema
    const existingScript = document.getElementById('seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Global Organization Entity for AI Search & Knowledge Graph
    const globalOrganizationSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": `${window.location.origin}/#organization`,
      "name": "DEI Boys Hostel",
      "alternateName": "Dayalbagh Educational Institute Boys Hostel",
      "url": window.location.origin,
      "logo": "/logo.jpg",
      "description": "The official student accommodation and hostel management system for Dayalbagh Educational Institute in Agra.",
      "parentOrganization": {
        "@type": "CollegeOrUniversity",
        "@id": "https://www.dei.ac.in/#organization",
        "name": "Dayalbagh Educational Institute",
        "alternateName": "DEI Agra",
        "location": "Agra, Uttar Pradesh, India"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Dayalbagh",
        "addressLocality": "Agra",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "282005",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-562-280-1545",
        "contactType": "Hostel Administration",
        "email": "deiboyshostel.agra@gmail.com",
        "availableLanguage": ["English", "Hindi"]
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Hostel Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Student Accommodation"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Mess Facility"
            }
          }
        ]
      },
      "member": [
        {
          "@type": "Person",
          "jobTitle": "Chief Warden"
        },
        {
          "@type": "Person",
          "jobTitle": "Resident Warden"
        }
      ]
    };

    const finalSchema = schema ? 
      (Array.isArray(schema) ? [globalOrganizationSchema, ...schema] : [globalOrganizationSchema, schema]) 
      : globalOrganizationSchema;

    const script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(finalSchema);
    document.head.appendChild(script);

    // Cleanup on unmount (or when values change)
    return () => {
      // We don't necessarily have to strip everything, but removing schemas is clean
      const cleanupScript = document.getElementById('seo-jsonld');
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };
  }, [fullTitle, description, currentUrl, ogType, ogImage, schema]);

  return null; // Side-effect only component
}
