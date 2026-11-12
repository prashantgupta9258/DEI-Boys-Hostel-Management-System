import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, TrendingUp, IndianRupee, Users, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Payment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminReports() {
  const { adminProfile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [todayCollection, setTodayCollection] = useState(0);
  const [monthlyCollection, setMonthlyCollection] = useState(0);
  const [yearlyCollection, setYearlyCollection] = useState(0);
  const [totalCollection, setTotalCollection] = useState(0);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'payments'));
      const docs = await getDocs(q);
      const all: Payment[] = [];
      docs.forEach(doc => {
        all.push({ id: doc.id, ...doc.data() } as Payment);
      });
      setPayments(all);
      calculateStats(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const calculateStats = (all: Payment[]) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const monthStr = todayStr.slice(0, 7);
    const yearStr = todayStr.slice(0, 4);

    let t = 0, m = 0, y = 0, total = 0;

    all.forEach(p => {
      const amt = Number(p.amount) || 0;
      total += amt;
      if (p.paymentDate === todayStr) t += amt;
      if (p.paymentDate.startsWith(monthStr)) m += amt;
      if (p.paymentDate.startsWith(yearStr)) y += amt;
    });

    setTodayCollection(t);
    setMonthlyCollection(m);
    setYearlyCollection(y);
    setTotalCollection(total);
  };

  const exportExcel = () => {
    if (payments.length === 0) {
      alert("No approved payments to export.");
      return;
    }
    
    const dataToExport = payments.map(p => ({
      'Student Name': p.studentName,
      'Father Name': p.fatherName,
      'Mobile Number': p.mobileNumber,
      'Course': p.course,
      'Year': p.year,
      'Room Number': p.roomNumber,
      'Fee Month': p.feeMonth,
      'Fee Year': p.feeYear,
      'Amount': p.amount,
      'Transaction ID': p.transactionId,
      'Payment Date': p.paymentDate,
      'Payment Time': p.paymentTime,
      'Verification Date': new Date(p.verificationDate).toLocaleString()
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Collection Report");
    XLSX.writeFile(wb, "Hostel_Collection_Report.xlsx");
    
    addDoc(collection(db, 'activityLogs'), {
      userUID: adminProfile?.uid,
      role: adminProfile?.role,
      action: 'EXPORTED_EXCEL',
      resource: 'reports',
      timestamp: Date.now()
    }).catch(console.error);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">View collection statistics and export data.</p>
        </div>
        <Button onClick={exportExcel} leftIcon={<Download className="w-4 h-4" />}>
          Export Full Excel Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <IndianRupee className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Today's Collection</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{todayCollection}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">This Month</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{monthlyCollection}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">This Year</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{yearlyCollection}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Lifetime</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalCollection}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Basic Graph Placeholder or Table */}
      <Card className="p-6 h-64 flex items-center justify-center bg-gray-50 border-dashed">
         <div className="text-center text-gray-400">
           <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
           <p>Collection Graph Placeholder</p>
         </div>
      </Card>
    </div>
  );
}
