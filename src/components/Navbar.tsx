import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, User, Menu, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import logo from '../assets/logoBase64';

export default function Navbar() {
  const { user, signOut, studentProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Hide on dashboard/admin routes
  const isHidden = location.pathname.startsWith('/dashboard') || 
      location.pathname.startsWith('/payment') || 
      location.pathname.startsWith('/notifications') || 
      location.pathname.startsWith('/profile') || 
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/complete-profile');

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isHidden) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled || location.pathname !== '/'
        ? 'bg-hostel-secondary/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
        : 'bg-transparent'
    }`}>
      <nav aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white p-0 rounded-full shadow-sm group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center w-12 h-12 border border-gray-100">
                <img src={logo} alt="DEI Logo" className="w-full h-full object-cover object-center" />
              </div>
              <span className="font-bold text-xl tracking-tight text-hostel-accent">DEI BOYS HOSTEL</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-hostel-accent' : 'text-gray-500 hover:text-hostel-accent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="flex items-center gap-4 ml-4 pl-6 border-l border-gray-200/50">
              {user ? (
                <div className="flex items-center gap-4">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 text-sm font-medium text-hostel-accent hover:text-hostel-accent/80 transition-colors"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to={studentProfile ? "/dashboard" : "/complete-profile"}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-hostel-accent transition-colors"
                    >
                      <User className="h-4 w-4" />
                      {studentProfile ? 'Profile' : 'Complete Profile'}
                    </Link>
                  )}
                </div>
              ) : (
                <Button onClick={() => navigate('/login')} size="sm">
                  Login Portal
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-hostel-accent transition-colors p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-gray-200/50 bg-hostel-secondary overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-hostel-accent hover:bg-gray-100/50 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                {user ? (
                  <div className="space-y-2">
                    {isAdmin ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-hostel-accent hover:bg-gray-100/50 rounded-xl transition-colors"
                        >
                          <ShieldAlert className="h-5 w-5" />
                          Dashboard
                        </Link>
                    ) : (
                        <Link
                          to={studentProfile ? "/dashboard" : "/complete-profile"}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:text-hostel-accent hover:bg-gray-100/50 rounded-xl transition-colors"
                        >
                          <User className="h-5 w-5" />
                          {studentProfile ? 'Profile' : 'Complete Profile'}
                        </Link>
                    )}
                  </div>
                ) : (
                  <Button onClick={() => { navigate('/login'); setIsOpen(false); }} className="w-full mt-2">
                    Login Portal
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </header>
  );
}
