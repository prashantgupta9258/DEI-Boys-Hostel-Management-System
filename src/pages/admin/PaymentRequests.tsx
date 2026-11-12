import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { CheckCircle2, XCircle, Download, FileText, ImageIcon } from 'lucide-react';
import { PaymentRequest, Payment } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { uploadWithTimeout } from '../../utils/uploadHelper';

export default function AdminPaymentRequests() {
  const { adminProfile } = useAuth();
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [filter, setFilter] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'paymentRequests'), where('status', '==', filter));
      const docs = await getDocs(q);
      const reqs: PaymentRequest[] = [];
      docs.forEach(doc => {
        reqs.push({ id: doc.id, ...doc.data() } as PaymentRequest);
      });
      setRequests(reqs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const generatePDF = async (payment: PaymentRequest, paymentId: string): Promise<string> => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.text("DEI BOYS HOSTEL", 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text("Fee Payment Receipt", 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Receipt No: REC-${paymentId.slice(0, 8).toUpperCase()}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 50);
    
    doc.line(20, 55, 190, 55);
    
    // Student Details
    doc.text(`Student Name: ${payment.studentName}`, 20, 65);
    doc.text(`Father Name: ${payment.fatherName}`, 20, 75);
    doc.text(`Course: ${payment.course} (Year ${payment.year})`, 20, 85);
    doc.text(`Room Number: ${payment.roomNumber}`, 140, 65);
    doc.text(`Mobile: ${payment.mobileNumber}`, 140, 75);
    
    doc.line(20, 90, 190, 90);
    
    // Payment Details
    doc.text(`Fee Period: ${payment.feeMonth} ${payment.feeYear}`, 20, 100);
    doc.text(`Amount Paid: Rs. ${payment.amount}`, 20, 110);
    doc.text(`Transaction ID: ${payment.transactionId}`, 20, 120);
    doc.text(`Payment Date: ${payment.paymentDate} ${payment.paymentTime}`, 20, 130);
    
    doc.line(20, 135, 190, 135);
    
    // Footer
    doc.text("Authorized Signatory", 140, 160);
    doc.text("(System Generated Receipt)", 105, 280, { align: 'center' });
    
    // Return base64 data URL
    const pdfBlob = doc.output('blob');
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleApprove = async (request: PaymentRequest) => {
    if (!request.id) return;
    setProcessing(request.id);
    try {
      // Create a unique ID for the payment
      const paymentRef = doc(collection(db, 'payments'));
      
      // Generate PDF
      const pdfUrl = await generatePDF(request, paymentRef.id);
      
      const paymentData: Payment = {
        studentUID: request.studentUID,
        studentName: request.studentName,
        fatherName: request.fatherName,
        mobileNumber: request.mobileNumber,
        course: request.course,
        year: request.year,
        roomNumber: request.roomNumber,
        feeMonth: request.feeMonth,
        feeYear: request.feeYear,
        amount: request.amount,
        transactionId: request.transactionId,
        paymentDate: request.paymentDate,
        paymentTime: request.paymentTime,
        verificationDate: Date.now(),
        receiptPDFUrl: pdfUrl,
        createdAt: Date.now()
      };
      
      // Save Payment
      await setDoc(paymentRef, paymentData);
      
      // Update Request Status
      await updateDoc(doc(db, 'paymentRequests', request.id), {
        status: 'Approved',
        verifiedAt: Date.now(),
        verifiedBy: adminProfile?.uid
      });
      
      // Log Activity
      await addDoc(collection(db, 'activityLogs'), {
        userUID: adminProfile?.uid,
        role: adminProfile?.role,
        action: 'APPROVED_PAYMENT',
        resource: 'payments',
        resourceId: paymentRef.id,
        timestamp: Date.now()
      });

      // Also update student profile feeStatus if needed.
      // (Skipping complex feeStatus logic here, but could be set to "paid")
      
      await fetchPayments();
    } catch (err) {
      console.error(err);
      alert('Failed to approve payment.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (request: PaymentRequest) => {
    if (!request.id) return;
    setProcessing(request.id);
    try {
      await updateDoc(doc(db, 'paymentRequests', request.id), {
        status: 'Rejected',
        verifiedAt: Date.now(),
        verifiedBy: adminProfile?.uid
      });
      
      await addDoc(collection(db, 'activityLogs'), {
        userUID: adminProfile?.uid,
        role: adminProfile?.role,
        action: 'REJECTED_PAYMENT',
        resource: 'paymentRequests',
        resourceId: request.id,
        timestamp: Date.now()
      });
      
      await fetchPayments();
    } catch (err) {
      console.error(err);
      alert('Failed to reject payment.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Payment Requests</h2>
          <p className="text-gray-500 text-sm mt-1">Review and manage fee payment requests.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {(['Pending', 'Approved', 'Rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === status ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : requests.length === 0 ? (
          <EmptyState 
            icon={FileText} 
            title={`No ${filter} Payments`} 
            description={`There are no ${filter.toLowerCase()} payment requests.`}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Fee Period</TableHead>
                <TableHead>Amount & Txn</TableHead>
                <TableHead>Screenshot</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{request.studentName}</div>
                    <div className="text-xs text-gray-500">Room: {request.roomNumber} | {request.course} {request.year}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{request.feeMonth} {request.feeYear}</div>
                    <div className="text-xs text-gray-500">{request.paymentDate}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-hostel-text">₹{request.amount}</div>
                    <div className="text-xs font-mono text-gray-500" title={request.transactionId}>
                      {request.transactionId.slice(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.paymentScreenshotURL ? (
                      <a href={request.paymentScreenshotURL} target="_blank" rel="noreferrer" className="text-hostel-accent hover:underline flex items-center gap-1 text-sm">
                        <ImageIcon className="w-4 h-4" /> View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No File</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleApprove(request)}
                          disabled={processing === request.id}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleReject(request)}
                          disabled={processing === request.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <Badge variant={request.status === 'Approved' ? 'success' : 'danger'}>
                        {request.status}
                      </Badge>
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
