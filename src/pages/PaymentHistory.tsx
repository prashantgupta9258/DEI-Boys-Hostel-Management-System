import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FileText, Download, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { downloadPDF } from '../utils/download';
import SEO from '../components/SEO';

export default function PaymentHistory() {
  const { studentProfile } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!studentProfile) return;
      try {
        const history: any[] = [];
        
        // Fetch approved payments
        const approvedQ = query(
          collection(db, 'payments'),
          where('studentUID', '==', studentProfile.uid)
        );
        const approvedDocs = await getDocs(approvedQ);
        approvedDocs.forEach(doc => {
          history.push({ id: doc.id, ...doc.data(), status: 'Approved' });
        });

        // Fetch pending/rejected requests
        const requestsQ = query(
          collection(db, 'paymentRequests'),
          where('studentUID', '==', studentProfile.uid)
        );
        const requestsDocs = await getDocs(requestsQ);
        requestsDocs.forEach(doc => {
          const data = doc.data();
          if (data.status !== 'Approved') { // Approved ones are moved to payments collection
            history.push({ id: doc.id, ...data });
          }
        });
        
        // Sort by date (descending)
        history.sort((a, b) => b.submittedAt - a.submittedAt);
        setPayments(history);
      } catch (err) {
        console.error("Error fetching payment history:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [studentProfile]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Payment History</h2>
        <Card className="p-6"><Skeleton className="h-24 w-full" /></Card>
        <Card className="p-6"><Skeleton className="h-24 w-full" /></Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO 
        title="Payment History | DEI Boys Hostel Agra"
        description="View your DEI Boys Hostel payment history. Download fee receipts and track the status of your online payments."
      />
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Payment History</h2>
      
      {payments.length === 0 ? (
        <Card>
          <EmptyState 
            icon={FileText} 
            title="No Payment Records" 
            description="You haven't made any payment requests yet." 
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map(payment => (
            <Card key={payment.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-hostel-accent/30 transition-colors">
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                  payment.status === 'Approved' ? 'bg-green-50 text-green-600' :
                  payment.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                }`}>
                  {payment.status === 'Approved' ? <CheckCircle2 className="w-6 h-6" /> :
                   payment.status === 'Pending' ? <Clock className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{payment.feeMonth} {payment.feeYear}</h3>
                    <Badge variant={
                      payment.status === 'Approved' ? 'success' :
                      payment.status === 'Pending' ? 'warning' : 'danger'
                    }>
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Amount: <span className="font-medium text-gray-900">₹{payment.amount}</span></p>
                    <p>Transaction ID: <span className="font-mono text-gray-900">{payment.transactionId}</span></p>
                    <p>Date: {payment.paymentDate} at {payment.paymentTime}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full sm:w-auto text-right flex sm:block justify-end">
                {payment.status === 'Approved' && payment.receiptPDFUrl && (
                  <Button 
                    variant="outline" 
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => downloadPDF(payment.receiptPDFUrl, `Receipt_${payment.studentName?.replace(/\s+/g, '_') || 'student'}_${payment.feeMonth}_${payment.feeYear}`)}
                  >
                    Receipt
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
