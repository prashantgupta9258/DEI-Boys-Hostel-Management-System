import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, addDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Download, FileText } from 'lucide-react';
import { Payment } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { downloadPDF } from '../../utils/download';

export default function AdminApprovedPayments() {
  const { adminProfile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const docs = await getDocs(q);
      const pList: Payment[] = [];
      docs.forEach(doc => {
        pList.push({ id: doc.id, ...doc.data() } as Payment);
      });
      setPayments(pList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const exportExcel = () => {
    if (payments.length === 0) return;
    
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
    XLSX.utils.book_append_sheet(wb, ws, "Approved Payments");
    XLSX.writeFile(wb, "Hostel_Payments_Report.xlsx");
    
    addDoc(collection(db, 'activityLogs'), {
      userUID: adminProfile?.uid,
      role: adminProfile?.role,
      action: 'EXPORTED_EXCEL',
      resource: 'payments',
      timestamp: Date.now()
    }).catch(console.error);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Approved Payments</h2>
          <p className="text-gray-500 text-sm mt-1">View and export all verified payments.</p>
        </div>
        <Button onClick={exportExcel} leftIcon={<Download className="w-4 h-4" />}>
          Export Excel
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : payments.length === 0 ? (
          <EmptyState 
            icon={FileText} 
            title="No Approved Payments" 
            description="No payments have been approved yet."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Fee Period</TableHead>
                <TableHead>Amount & Txn</TableHead>
                <TableHead>Verified At</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{payment.studentName}</div>
                    <div className="text-xs text-gray-500">Room: {payment.roomNumber} | {payment.course} {payment.year}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{payment.feeMonth} {payment.feeYear}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-hostel-text">₹{payment.amount}</div>
                    <div className="text-xs font-mono text-gray-500">{payment.transactionId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{new Date(payment.verificationDate).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.receiptPDFUrl ? (
                      <button 
                        onClick={() => downloadPDF(payment.receiptPDFUrl, `Receipt_${payment.studentName.replace(/\s+/g, '_')}_${payment.feeMonth}_${payment.feeYear}`)}
                        className="text-hostel-accent hover:underline flex items-center justify-end gap-1 text-sm ml-auto cursor-pointer font-medium"
                      >
                        <FileText className="w-4 h-4" /> Download
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
