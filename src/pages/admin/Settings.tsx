import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { QrCode, Upload, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { compressImage } from '../../utils/imageCompression';
import { uploadWithTimeout } from '../../utils/uploadHelper';

export default function AdminSettings() {
  const { adminProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [upiQRCodeURL, setUpiQRCodeURL] = useState('');
  const [newQRFile, setNewQRFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().upiQRCodeURL) {
          setUpiQRCodeURL(docSnap.data().upiQRCodeURL);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQRFile) return;
    
    setSaving(true);
    setSuccess(false);
    
    try {
      const compressedQR = await compressImage(newQRFile);

      // Upload QR Image
      let url = '';
      try {
        const storageRef = ref(storage, `settings/upiQRCode_${Date.now()}_${compressedQR.name}`);
        url = await uploadWithTimeout(storageRef, compressedQR, 800);
      } catch (storageErr) {
        console.warn('Firebase Storage timed out or failed, falling back to Base64:', storageErr);
        url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedQR);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });
      }
      
      // Save to Settings
      const docRef = doc(db, 'settings', 'global');
      await setDoc(docRef, { upiQRCodeURL: url }, { merge: true });
      
      await addDoc(collection(db, 'activityLogs'), {
        userUID: adminProfile?.uid,
        role: adminProfile?.role,
        action: 'UPDATED_QR_CODE',
        resource: 'settings',
        timestamp: Date.now()
      });
      
      setUpiQRCodeURL(url);
      setNewQRFile(null);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to upload QR Code.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-hostel-text">System Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage global application settings and configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Payment QR Code</h3>
              <p className="text-sm text-gray-500">Upload the official UPI QR for fee collection.</p>
            </div>
          </div>
          
          <form onSubmit={handleSaveQR} className="space-y-6">
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 relative overflow-hidden">
              {newQRFile ? (
                <div className="text-center">
                  <p className="font-medium text-hostel-text mb-2">{newQRFile.name}</p>
                  <p className="text-xs text-gray-500">Ready to upload</p>
                </div>
              ) : upiQRCodeURL ? (
                <img src={upiQRCodeURL} alt="Current QR" className="w-48 h-48 object-contain" />
              ) : (
                <div className="text-center text-gray-400">
                  <QrCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No QR Code configured</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-hostel-accent transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                {newQRFile ? 'Change File' : 'Select QR Image'}
                <input 
                  type="file" 
                  className="sr-only" 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewQRFile(e.target.files[0]);
                    }
                  }} 
                />
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!newQRFile || saving}
              leftIcon={saving ? undefined : <Save className="w-4 h-4" />}
            >
              {saving ? 'Uploading...' : 'Save QR Code'}
            </Button>
            
            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">QR Code updated successfully.</p>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
