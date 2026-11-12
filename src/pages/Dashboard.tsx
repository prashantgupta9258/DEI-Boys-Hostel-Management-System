import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { CreditCard, FileText, Building, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Payment, Notification } from '../types';
import SEO from '../components/SEO';

export default function Dashboard() {
  const { studentProfile } = useAuth();
  const [recentPayment, setRecentPayment] = useState<Payment | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  
  useEffect(() => {
    if (!studentProfile) return;

    const fetchData = async () => {
      try {
        // Fetch recent payment
        const pQuery = query(
          collection(db, 'payments'),
          where('studentUID', '==', studentProfile.uid)
        );
        const pDocs = await getDocs(pQuery);
        if (!pDocs.empty) {
          const payments = pDocs.docs.map(d => ({ id: d.id, ...d.data() } as Payment));
          payments.sort((a, b) => b.createdAt - a.createdAt);
          setRecentPayment(payments[0]);
        }

        // Fetch unread notifications
        const nQueryAll = query(
          collection(db, 'notifications'),
          where('targetType', '==', 'all')
        );
        const nQueryStudent = query(
          collection(db, 'notifications'),
          where('targetType', '==', 'student'),
          where('targetUID', '==', studentProfile.uid)
        );
        
        const [allDocs, studentDocs] = await Promise.all([
          getDocs(nQueryAll),
          getDocs(nQueryStudent)
        ]);

        let unread = 0;
        allDocs.forEach(d => { if (!d.data().isRead) unread++; });
        studentDocs.forEach(d => { if (!d.data().isRead) unread++; });
        
        setUnreadNotifications(unread);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [studentProfile]);

  if (!studentProfile) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <SEO 
        title="Student Dashboard | DEI Boys Hostel Agra"
        description="Access your DEI Boys Hostel student dashboard. View room allocation, pay fees, track payment history, and check hostel announcements."
      />
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-hostel-accent to-[#1a365d] rounded-[2rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Welcome back, {studentProfile.fullName.split(' ')[0]}!</h2>
          <p className="text-blue-100 text-lg max-w-xl">
            You are enrolled in {studentProfile.course}, Year {studentProfile.year}. 
            Your room allocation is {studentProfile.roomId || 'Pending'}.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Stats/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="bg-green-50 p-4 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Account Status</p>
            <p className="text-xl font-bold text-hostel-text capitalize">{studentProfile.accountStatus || 'Active'}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Recent Payment</p>
            <p className="text-xl font-bold text-hostel-text">
              {recentPayment ? `₹${recentPayment.amount}` : '₹0.00'}
            </p>
            {recentPayment && (
              <p className="text-xs text-gray-500 mt-1">{recentPayment.feeMonth} {recentPayment.feeYear}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="bg-orange-50 p-4 rounded-2xl">
            <Building className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Room Number</p>
            <p className="text-xl font-bold text-hostel-text">{studentProfile.roomId || studentProfile.roomNumber || 'Not Assigned'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
