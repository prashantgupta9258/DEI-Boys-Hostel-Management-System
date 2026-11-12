import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function CompleteProfile() {
  const { user, studentProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    mobileNumber: studentProfile?.mobileNumber || '',
    address: studentProfile?.address || '',
    fatherName: studentProfile?.fatherName === 'Not Provided' ? '' : studentProfile?.fatherName || '',
    fatherMobileNumber: studentProfile?.fatherMobileNumber || '',
    rollNumberOrApplicationNumber: studentProfile?.rollNumberOrApplicationNumber === 'N/A' ? '' : studentProfile?.rollNumberOrApplicationNumber || '',
    course: studentProfile?.course || '',
    year: studentProfile?.year || '',
    roomId: studentProfile?.roomId || (studentProfile as any)?.roomNumber || '',
  });

  useEffect(() => {
    if (studentProfile) {
      setFormData({
        mobileNumber: studentProfile.mobileNumber || '',
        address: studentProfile.address || '',
        fatherName: studentProfile.fatherName === 'Not Provided' ? '' : studentProfile.fatherName || '',
        fatherMobileNumber: studentProfile.fatherMobileNumber || '',
        rollNumberOrApplicationNumber: studentProfile.rollNumberOrApplicationNumber === 'N/A' ? '' : studentProfile.rollNumberOrApplicationNumber || '',
        course: studentProfile.course || '',
        year: studentProfile.year || '',
        roomId: studentProfile.roomId || (studentProfile as any).roomNumber || '',
      });
    }
  }, [studentProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !studentProfile || !studentProfile.id) return;

    setLoading(true);
    setError('');

    try {
      // Save profile data to Firestore
      const updateData = {
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        fatherName: formData.fatherName,
        fatherMobileNumber: formData.fatherMobileNumber,
        rollNumberOrApplicationNumber: formData.rollNumberOrApplicationNumber,
        course: formData.course,
        year: formData.year,
        roomId: formData.roomId,
        profileCompleted: true,
        updatedAt: Date.now(),
      };

      const docRef = doc(db, 'students', studentProfile.id);
      await updateDoc(docRef, updateData);
      
      await addDoc(collection(db, 'activityLogs'), {
        userUID: user.uid,
        role: 'student',
        action: 'COMPLETED_STUDENT_PROFILE',
        resource: 'students',
        resourceId: studentProfile.id,
        timestamp: Date.now()
      });

      // Refresh context and redirect
      await refreshProfile();
      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!studentProfile) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-hostel-bg">
        <p className="text-gray-500">Loading your profile information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-hostel-bg py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Complete Admission Profile | DEI Boys Hostel Agra"
        description="Complete your student profile for the DEI Boys Hostel. Enter your academic and personal details to process your admission."
      />
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-gray-600">Please provide your details to access the student profile.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm rounded-3xl overflow-hidden border border-gray-100"
        >
          {error && (
            <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" value={studentProfile.fullName} readOnly className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-hostel-bg text-gray-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={studentProfile.email} readOnly className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-hostel-bg text-gray-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
                <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Mobile Number *</label>
                <input required type="tel" name="fatherMobileNumber" value={formData.fatherMobileNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roll / Application Number *</label>
                <input required type="text" name="rollNumberOrApplicationNumber" value={formData.rollNumberOrApplicationNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                <input required type="text" name="course" value={formData.course} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <input required type="text" name="year" value={formData.year} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                <input required type="text" name="roomId" value={formData.roomId} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Fee Plan</label>
                <input type="text" value={(studentProfile as any).feePlan || studentProfile.feePlanId || 'Not Assigned'} readOnly className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-hostel-bg text-gray-500 outline-none" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
              <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"></textarea>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving Profile...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
