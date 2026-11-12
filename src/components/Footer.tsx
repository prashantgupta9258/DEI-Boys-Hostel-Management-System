import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../assets/logoBase64';

export default function Footer() {
  const location = useLocation();

  if (location.pathname.startsWith('/dashboard') || 
      location.pathname.startsWith('/payment') || 
      location.pathname.startsWith('/notifications') || 
      location.pathname.startsWith('/profile') || 
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/complete-profile')
  ) {
    return null;
  }

  return (
    <footer aria-label="Site Footer" className="bg-hostel-accent text-white py-16 border-t border-hostel-accent/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-0 rounded-full flex items-center justify-center w-12 h-12 overflow-hidden shadow-sm border border-white/10">
                <img src={logo} alt="DEI Logo" className="w-full h-full object-cover object-center" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">DEI BOYS HOSTEL</span>
            </div>
            <p className="text-gray-300 font-light leading-relaxed">
              Experience a safe, and academically enriching living environment designed specifically for scholars of Dayalbagh Educational Institute.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Visit our Facebook page" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Visit our Twitter profile" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Visit our Instagram page" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Visit our LinkedIn profile" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/gallery" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/rooms" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">Rooms</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/login" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">Student Login</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/faqs" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/guidelines" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">Hostel Guidelines</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <address className="not-italic">
            <h3 className="font-semibold text-lg mb-6">Official Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gray-400" />
                <span className="leading-relaxed">Dayalbagh Educational Institute (DEI),<br />Dayalbagh, Agra, Uttar Pradesh - 282005<br />India</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 shrink-0 text-gray-400" />
                <a href="tel:+915622801545" className="hover:text-white transition-colors">+91-562-280-1545</a>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 shrink-0 text-gray-400" />
                <a href="mailto:deiboyshostel.agra@gmail.com" className="hover:text-white transition-colors">deiboyshostel.agra@gmail.com</a>
              </li>
            </ul>
          </address>
        </div>
        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm space-y-2">
          <p>&copy; {new Date().getFullYear()} Dayalbagh Educational Institute Boys Hostel, Agra. All rights reserved.</p>
          <p className="text-xs text-gray-500">Official student administration portal for DEI university accommodation.</p>
        </div>
      </div>
    </footer>
  );
}
