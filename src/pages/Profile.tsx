import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import SEO from '../components/SEO';

export default function Profile() {
  const { studentProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    rollNumberOrApplicationNumber: studentProfile?.rollNumberOrApplicationNumber || '',
    course: studentProfile?.course || '',
    year: studentProfile?.year || '',
    roomId: studentProfile?.roomId || (studentProfile as any)?.roomNumber || '',
    address: studentProfile?.address || ''
  });

  if (!studentProfile) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProfile.id) return;

    setLoading(true);
    setError('');

    try {
      const docRef = doc(db, 'students', studentProfile.id);
      await updateDoc(docRef, {
        rollNumberOrApplicationNumber: formData.rollNumberOrApplicationNumber,
        course: formData.course,
        year: formData.year,
        roomId: formData.roomId,
        address: formData.address,
        updatedAt: Date.now()
      });

      await refreshProfile();
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setFormData({
      rollNumberOrApplicationNumber: studentProfile.rollNumberOrApplicationNumber || '',
      course: studentProfile.course || '',
      year: studentProfile.year || '',
      roomId: studentProfile.roomId || (studentProfile as any)?.roomNumber || '',
      address: studentProfile.address || ''
    });
  };

  return (
    <div className="bg-hostel-bg py-12 px-4 sm:px-6 lg:px-8 h-full">
      <SEO 
        title="Student Profile | DEI Boys Hostel Agra"
        description="Manage your DEI Boys Hostel student profile. Update your contact details, course information, and view room allocation."
      />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Profile Settings
          </h2>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} leftIcon={<Edit2 className="w-4 h-4" />}>
              Edit Profile
            </Button>
          )}
        </div>
        
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          {error && (
            <div className="mb-6 bg-red-50 p-4 border border-red-100 flex items-center gap-3 text-red-700 rounded-xl">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
              <img src={studentProfile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile.fullName)}`} alt="Profile" className="w-24 h-24 rounded-full object-cover bg-gray-100 border-2 border-gray-200" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{studentProfile.fullName}</h3>
                <p className="text-gray-500">{studentProfile.email}</p>
              </div>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Roll / Application Number</label>
                    <input 
                      required 
                      type="text" 
                      name="rollNumberOrApplicationNumber" 
                      value={formData.rollNumberOrApplicationNumber} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <input 
                      required 
                      type="text" 
                      name="course" 
                      value={formData.course} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input 
                      required 
                      type="text" 
                      name="year" 
                      value={formData.year} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <input 
                      required 
                      type="text" 
                      name="roomId" 
                      value={formData.roomId} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                  <textarea 
                    required 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    rows={3} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex gap-4 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={loading} leftIcon={<X className="w-4 h-4" />}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Father's Name</p>
                  <p className="text-gray-900 font-medium">{studentProfile.fatherName || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Father's Mobile</p>
                  <p className="text-gray-900 font-medium">{studentProfile.fatherMobileNumber || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Mobile Number</p>
                  <p className="text-gray-900 font-medium">{studentProfile.mobileNumber || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Roll / Application Number</p>
                  <p className="text-gray-900 font-medium">{studentProfile.rollNumberOrApplicationNumber || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Room Number</p>
                  <p className="text-gray-900 font-medium">{studentProfile.roomId || (studentProfile as any)?.roomNumber || 'Not Assigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Course & Year</p>
                  <p className="text-gray-900 font-medium">{studentProfile.course || 'N/A'} - {studentProfile.year ? `Year ${studentProfile.year}` : 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 mb-1">Full Address</p>
                  <p className="text-gray-900 font-medium whitespace-pre-wrap">{studentProfile.address || 'Not Provided'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
