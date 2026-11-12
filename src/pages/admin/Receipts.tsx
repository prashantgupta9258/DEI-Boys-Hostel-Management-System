import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { FileText, Download } from 'lucide-react';
import { Payment } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';
import { downloadPDF } from '../../utils/download';

export default function AdminReceipts() {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start">
        <h2 className="text-2xl font-bold text-hostel-text">Generated Receipts</h2>
        <p className="text-gray-500 text-sm mt-1">View and download generated fee receipts.</p>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : payments.length === 0 ? (
          <EmptyState 
            icon={FileText} 
            title="No Receipts" 
            description="No receipts have been generated yet."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No</TableHead>
                <TableHead>Student Details</TableHead>
                <TableHead>Fee Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900 font-mono">REC-{payment.id?.slice(0, 8).toUpperCase()}</div>
                    <div className="text-xs text-gray-500">{new Date(payment.verificationDate).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{payment.studentName}</div>
                    <div className="text-xs text-gray-500">{payment.roomNumber} | {payment.course}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{payment.feeMonth} {payment.feeYear}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-hostel-text">₹{payment.amount}</div>
                  </TableCell>
                   <TableCell className="text-right">
                     {payment.receiptPDFUrl ? (
                       <button 
                         onClick={() => downloadPDF(payment.receiptPDFUrl, `Receipt_${payment.studentName.replace(/\s+/g, '_')}_${payment.feeMonth}_${payment.feeYear}`)}
                         className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                       >
                         <Download className="w-4 h-4" />
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
