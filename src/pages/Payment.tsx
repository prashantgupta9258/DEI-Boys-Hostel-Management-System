import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { CreditCard, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FeeStructure } from '../types';
import { compressImage } from '../utils/imageCompression';
import { uploadWithTimeout } from '../utils/uploadHelper';
import SEO from '../components/SEO';

export default function Payment() {
  const { studentProfile } = useAuth();
  
  const [upiQRCode, setUpiQRCode] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [availableFees, setAvailableFees] = useState<FeeStructure[]>([]);
  const [selectedFeeId, setSelectedFeeId] = useState('');
  
  const [feeAmount, setFeeAmount] = useState(0);
  const [feeMonth, setFeeMonth] = useState('');
  const [feeYear, setFeeYear] = useState('');
  
  const [transactionId, setTransactionId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentTime, setPaymentTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));
  const [declaration, setDeclaration] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings for QR
        const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
        if (settingsDoc.exists() && settingsDoc.data().upiQRCodeURL) {
          setUpiQRCode(settingsDoc.data().upiQRCodeURL);
        }

        if (!studentProfile) return;
        setRoomNumber(studentProfile.roomId || studentProfile.roomNumber || '');

        // Fetch active fee structures
        const feeQuery = query(collection(db, 'feeStructures'), where('isActive', '==', true));
        const feeDocs = await getDocs(feeQuery);
        const allFees: FeeStructure[] = [];
        feeDocs.forEach(d => allFees.push({ id: d.id, ...d.data() } as FeeStructure));

        // Fetch student's existing approved payments
        const pQuery = query(collection(db, 'payments'), where('studentUID', '==', studentProfile.uid));
        const pDocs = await getDocs(pQuery);
        const paidSet = new Set();
        pDocs.forEach(d => {
          const data = d.data();
          paidSet.add(`${data.feeMonth}-${data.feeYear}`);
        });
        
        // Fetch pending requests to avoid double submission
        const prQuery = query(collection(db, 'paymentRequests'), where('studentUID', '==', studentProfile.uid), where('status', '==', 'Pending'));
        const prDocs = await getDocs(prQuery);
        prDocs.forEach(d => {
          const data = d.data();
          paidSet.add(`${data.feeMonth}-${data.feeYear}`);
        });

        const pendingFees = allFees.filter(f => !paidSet.has(`${f.feeMonth}-${f.feeYear}`));
        setAvailableFees(pendingFees);
        
        if (pendingFees.length > 0) {
          const first = pendingFees[0];
          setSelectedFeeId(first.id!);
          setFeeMonth(first.feeMonth);
          setFeeYear(first.feeYear);
          setFeeAmount(first.monthlyFee + (first.securityDeposit || 0) + (first.lateFee || 0));
        }
      } catch (err) {
        console.error("Error fetching payment info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Update time every minute just in case, but static is fine for form init.
  }, [studentProfile]);

  const handleFeeSelection = (id: string) => {
    setSelectedFeeId(id);
    const fee = availableFees.find(f => f.id === id);
    if (fee) {
      setFeeMonth(fee.feeMonth);
      setFeeYear(fee.feeYear);
      setFeeAmount(fee.monthlyFee + (fee.securityDeposit || 0) + (fee.lateFee || 0));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!studentProfile) {
      setError('User not authenticated.');
      return;
    }
    if (!selectedFeeId) {
      setError('No fee period selected.');
      return;
    }
    if (!roomNumber.trim()) {
      setError('Room Number is required.');
      return;
    }
    if (!transactionId.trim()) {
      setError('Transaction ID is required.');
      return;
    }
    if (!declaration) {
      setError('You must accept the declaration.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // 1. Check for duplicate Transaction ID (restricted to current student's records due to security rules)
      const trQuery = query(
        collection(db, 'paymentRequests'), 
        where('studentUID', '==', studentProfile.uid),
        where('transactionId', '==', transactionId)
      );
      const trDocs = await getDocs(trQuery);
      if (!trDocs.empty) {
        throw new Error('This Transaction ID has already been used by you.');
      }
      
      const pTrQuery = query(
        collection(db, 'payments'), 
        where('studentUID', '==', studentProfile.uid),
        where('transactionId', '==', transactionId)
      );
      const pTrDocs = await getDocs(pTrQuery);
      if (!pTrDocs.empty) {
        throw new Error('This Transaction ID has already been used in an approved payment by you.');
      }

      // 2. Check if student already has Approved payment for same Month & Year
      const approvedQuery = query(
        collection(db, 'payments'), 
        where('studentUID', '==', studentProfile.uid),
        where('feeMonth', '==', feeMonth),
        where('feeYear', '==', feeYear)
      );
      const approvedDocs = await getDocs(approvedQuery);
      if (!approvedDocs.empty) {
        throw new Error(`You already have an approved payment for ${feeMonth} ${feeYear}.`);
      }

      // No screenshot upload is needed as requested by user
      const screenshotUrl = '';

      // 4. Save Payment Request
      const docRef = await addDoc(collection(db, 'paymentRequests'), {
        studentUID: studentProfile.uid || '',
        studentName: studentProfile.fullName || '',
        fatherName: studentProfile.fatherName || 'Not Provided',
        mobileNumber: studentProfile.mobileNumber || '',
        course: studentProfile.course || 'B.Tech',
        year: studentProfile.year || '1st Year',
        roomNumber: roomNumber ? roomNumber.trim() : '',
        feeMonth: feeMonth || '',
        feeYear: feeYear || '',
        amount: Number(feeAmount) || 0,
        transactionId: transactionId ? transactionId.trim() : '',
        paymentDate: paymentDate || '',
        paymentTime: paymentTime || '',
        paymentScreenshotURL: screenshotUrl || '',
        status: 'Pending',
        submittedAt: Date.now()
      });

      await addDoc(collection(db, 'activityLogs'), {
        userUID: studentProfile.uid,
        role: 'student',
        action: 'SUBMITTED_PAYMENT',
        resource: 'paymentRequests',
        resourceId: docRef.id,
        timestamp: Date.now()
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!studentProfile) return null;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Card className="p-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Request Submitted!</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Your payment request has been sent to the admin for verification. 
            You can check the status in your Payment History.
          </p>
          <Button onClick={() => window.location.href = '/payment-history'} size="lg">
            View Payment History
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <SEO 
        title="Hostel Fee Payment | DEI Boys Hostel Agra"
        description="Pay your DEI Boys Hostel accommodation and mess fees securely online via UPI. Upload your payment receipt for instant verification."
      />
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostel Fee Payment</h1>
        <p className="text-gray-500">Scan the QR code below to pay using any UPI app.</p>
      </div>

      {availableFees.length === 0 && !loading ? (
        <Card className="p-8 text-center text-gray-500">
           <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
           <p className="text-xl font-bold text-gray-900">All caught up!</p>
           <p>You have no pending fees at the moment.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <Card className="p-8 flex flex-col items-center justify-center bg-gray-50/50">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Scan & Pay</h3>
            {loading ? (
              <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
            ) : upiQRCode ? (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <img src={upiQRCode} alt="UPI QR Code" className="w-64 h-64 object-contain" />
              </div>
            ) : (
               <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 mb-6">
                 No QR Available
               </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Fee Amount</p>
              <p className="text-4xl font-bold text-hostel-text">₹{feeAmount}</p>
            </div>
          </Card>

          {/* Payment Form Section */}
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Verify Payment</h3>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Pending Fee Month</label>
                <select 
                  className="w-full h-[46px] rounded-xl border-gray-300 shadow-sm focus:border-hostel-accent focus:ring-hostel-accent sm:text-sm bg-white border px-3"
                  value={selectedFeeId}
                  onChange={(e) => handleFeeSelection(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Month</option>
                  {availableFees.map(f => (
                    <option key={f.id} value={f.id}>{f.feeMonth} {f.feeYear} - ₹{f.monthlyFee + (f.securityDeposit || 0) + (f.lateFee || 0)}</option>
                  ))}
                </select>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Student Name" value={studentProfile.fullName || ''} disabled />
                 <Input label="Mobile Number" value={studentProfile.mobileNumber || ''} disabled />
               </div>
 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Father Name" value={studentProfile.fatherName || ''} disabled />
                 <Input 
                   label="Room Number" 
                   value={roomNumber} 
                   onChange={(e) => setRoomNumber(e.target.value)} 
                   placeholder="Enter Room Number"
                   required 
                 />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Course" value={studentProfile.course || ''} disabled />
                 <Input label="Year" value={studentProfile.year || ''} disabled />
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Fee Month" value={feeMonth} disabled />
                <Input label="Fee Year" value={feeYear} disabled />
              </div>

              <Input label="Fee Amount (₹)" value={feeAmount} disabled />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  type="date" 
                  label="Payment Date" 
                  value={paymentDate}
                  disabled
                />
                <Input 
                  type="time" 
                  label="Payment Time" 
                  value={paymentTime}
                  disabled
                />
              </div>

              <Input 
                label="Transaction ID (UTR)" 
                value={transactionId} 
                onChange={(e) => setTransactionId(e.target.value)} 
                placeholder="Enter 12-digit UPI Ref Number"
                required 
              />

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="declaration"
                    type="checkbox"
                    checked={declaration}
                    onChange={(e) => setDeclaration(e.target.checked)}
                    className="focus:ring-hostel-accent h-4 w-4 text-hostel-accent border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="declaration" className="font-medium text-gray-700">
                    Declaration
                  </label>
                  <p className="text-gray-500">I confirm that all payment information submitted is correct.</p>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Payment Request'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

