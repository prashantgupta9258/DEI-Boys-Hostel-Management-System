import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

export default function PublicPage() {
  const location = useLocation();
  const pageTitle = location.pathname.substring(1).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Page';

  return (
    <div className="min-h-screen bg-hostel-bg flex items-center justify-center">
      <SEO 
        title={`${pageTitle} | DEI Boys Hostel Agra`}
        description={`View information about ${pageTitle} at DEI Boys Hostel.`}
      />
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">{pageTitle}</h1>
        <p className="text-gray-500 text-lg">This page is under construction.</p>
      </div>
    </div>
  );
}
