import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './components/layouts/StudentLayout';
import AdminLayout from './components/layouts/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

// Eagerly loaded components (critical path)
import Home from './pages/Home';
import Login from './pages/Login';

// Lazy loaded public pages
const About = lazy(() => import('./pages/public/About'));
const Gallery = lazy(() => import('./pages/public/Gallery'));
const Rooms = lazy(() => import('./pages/public/Rooms'));
const Contact = lazy(() => import('./pages/public/Contact'));
const FAQ = lazy(() => import('./pages/public/FAQ'));
const Privacy = lazy(() => import('./pages/public/Privacy'));
const Terms = lazy(() => import('./pages/public/Terms'));
const Guidelines = lazy(() => import('./pages/public/Guidelines'));

// Lazy loaded student pages
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Payment = lazy(() => import('./pages/Payment'));
const PaymentHistory = lazy(() => import('./pages/PaymentHistory'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Profile = lazy(() => import('./pages/Profile'));
const PublicPage = lazy(() => import('./pages/PublicPage'));

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminStudents = lazy(() => import('./pages/admin/Students'));
const AdminRooms = lazy(() => import('./pages/admin/Rooms'));
const AdminPaymentRequests = lazy(() => import('./pages/admin/PaymentRequests'));
const AdminApprovedPayments = lazy(() => import('./pages/admin/ApprovedPayments'));
const AdminReceipts = lazy(() => import('./pages/admin/Receipts'));
const AdminGallery = lazy(() => import('./pages/admin/Gallery'));
const AdminAdmins = lazy(() => import('./pages/admin/Admins'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminFeeStructure = lazy(() => import('./pages/admin/FeeStructure'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminContactMessages = lazy(() => import('./pages/admin/ContactMessages'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hostel-accent"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-[100dvh] bg-hostel-bg text-hostel-text font-sans selection:bg-hostel-accent selection:text-white flex flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faqs" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/guidelines" element={<Guidelines />} />
                
                {/* Semi-Protected Route (Requires Auth, but NO Profile) */}
                <Route 
                  path="/complete-profile" 
                  element={
                    <ProtectedRoute requireProfile={false}>
                      <CompleteProfile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fully Protected Routes (Requires Auth AND Profile) */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <StudentLayout><Dashboard /></StudentLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment" 
                  element={
                    <ProtectedRoute>
                      <StudentLayout><Payment /></StudentLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment-history" 
                  element={
                    <ProtectedRoute>
                      <StudentLayout><PaymentHistory /></StudentLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute>
                      <StudentLayout><Notifications /></StudentLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <StudentLayout><Profile /></StudentLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <StudentLayout><PublicPage /></StudentLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/download-receipt" 
                  element={
                    <ProtectedRoute>
                      <StudentLayout><PublicPage /></StudentLayout>
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout>
                        <Routes>
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="students" element={<AdminStudents />} />
                          <Route path="rooms" element={<AdminRooms />} />
                          <Route path="fee-structure" element={<AdminFeeStructure />} />
                          <Route path="payment-requests" element={<AdminPaymentRequests />} />
                          <Route path="approved-payments" element={<AdminApprovedPayments />} />
                          <Route path="receipts" element={<AdminReceipts />} />
                          <Route path="reports" element={<AdminReports />} />
                          <Route path="gallery" element={<AdminGallery />} />
                          <Route path="settings" element={<AdminSettings />} />
                          <Route path="admins" element={<AdminAdmins />} />
                          <Route path="messages" element={<AdminContactMessages />} />
                          <Route path="*" element={<AdminDashboard />} />
                        </Routes>
                      </AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all */}
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
