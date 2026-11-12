import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { db } from '../../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { Users, Building, CreditCard, Wallet, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import SEO from '../../components/SEO';

export default function AdminDashboard() {
  const { adminProfile } = useAuth();
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    rejectedPayments: 0,
    todayCollection: 0,
    monthlyCollection: 0,
    currentMonthPending: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsSnap, roomsSnap, requestsSnap, paymentsSnap] = await Promise.all([
          getDocs(query(collection(db, 'students'))),
          getDocs(query(collection(db, 'rooms'))),
          getDocs(query(collection(db, 'paymentRequests'))),
          getDocs(query(collection(db, 'payments')))
        ]);

        let totalStudents = 0, activeStudents = 0, inactiveStudents = 0;
        studentsSnap.forEach(doc => {
          totalStudents++;
          if (doc.data().accountStatus === 'Active') activeStudents++;
          else inactiveStudents++;
        });

        let totalRooms = 0, occupiedRooms = 0, availableRooms = 0;
        roomsSnap.forEach(doc => {
          totalRooms++;
          const data = doc.data();
          const cap = data.capacity || 0;
          const occ = (data.students || []).length;
          if (occ > 0) occupiedRooms++;
          availableRooms += (cap - occ);
        });

        let pendingPayments = 0, approvedPayments = 0, rejectedPayments = 0;
        requestsSnap.forEach(doc => {
          const status = doc.data().status;
          if (status === 'Pending') pendingPayments++;
          else if (status === 'Approved') approvedPayments++;
          else if (status === 'Rejected') rejectedPayments++;
        });

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const monthStr = todayStr.slice(0, 7);

        let todayCollection = 0, monthlyCollection = 0;
        paymentsSnap.forEach(doc => {
          const data = doc.data();
          if (data.paymentDate === todayStr) todayCollection += data.amount;
          if (data.paymentDate.startsWith(monthStr)) monthlyCollection += data.amount;
        });

        setStatsData({
          totalStudents,
          activeStudents,
          inactiveStudents,
          totalRooms,
          occupiedRooms,
          availableRooms,
          pendingPayments,
          approvedPayments,
          rejectedPayments,
          todayCollection,
          monthlyCollection,
          currentMonthPending: 0 // Mocked for now
        });

      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { name: 'Total Students', value: statsData.totalStudents, icon: Users, change: `${statsData.activeStudents} Active`, changeType: 'neutral' },
    { name: 'Occupied Rooms', value: statsData.occupiedRooms, icon: Building, change: `${statsData.availableRooms} Beds Avail`, changeType: 'neutral' },
    { name: 'Pending Payments', value: statsData.pendingPayments, icon: CreditCard, change: 'Needs Review', changeType: 'warning' },
    { name: 'Monthly Collection', value: `₹${statsData.monthlyCollection}`, icon: Wallet, change: `Today: ₹${statsData.todayCollection}`, changeType: 'increase' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SEO 
        title="Admin Dashboard | DEI Boys Hostel Agra"
        description="Hostel administration dashboard. Manage students, rooms, and fee payments for DEI Boys Hostel."
      />
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <stat.icon className="w-6 h-6 text-hostel-accent" />
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                stat.changeType === 'increase' ? 'bg-green-50 text-green-700 border border-green-200' :
                stat.changeType === 'warning' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-hostel-text">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
