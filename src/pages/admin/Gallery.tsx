import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trash2, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { compressImage } from '../../utils/imageCompression';
import { uploadWithTimeout } from '../../utils/uploadHelper';

interface GalleryImage {
  id?: string;
  url: string;
  category: string;
  createdAt: number;
}

export default function AdminGallery() {
  const { adminProfile } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('Hostel');
  const categories = ['Hostel', 'Rooms', 'Facilities', 'Events'];
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const docs = await getDocs(q);
      const imgList: GalleryImage[] = [];
      docs.forEach(doc => {
        imgList.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      setImages(imgList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    try {
      const compressedFile = await compressImage(file);

      let url = '';
      try {
        const fileRef = ref(storage, `gallery/${Date.now()}_${compressedFile.name}`);
        url = await uploadWithTimeout(fileRef, compressedFile, 800);
      } catch (storageErr) {
        console.warn('Firebase Storage timed out or failed, falling back to Base64:', storageErr);
        url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });
      }
      
      const docRef = await addDoc(collection(db, 'gallery'), {
        url,
        category,
        createdAt: Date.now()
      });
      
      await addDoc(collection(db, 'activityLogs'), {
        userUID: adminProfile?.uid,
        role: adminProfile?.role,
        action: 'UPLOADED_GALLERY_IMAGE',
        resource: 'gallery',
        resourceId: docRef.id,
        timestamp: Date.now()
      });
      
      fetchImages();
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img: GalleryImage) => {
    try {
      setDeletingId(null);
      // 1. Delete from Firestore first
      await deleteDoc(doc(db, 'gallery', img.id!));
      
      // 2. Try deleting from Storage if possible, without blocking Firestore deletion success
      if (img.url && img.url.includes('firebasestorage')) {
        try {
          const fileRef = ref(storage, img.url);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.error('Failed to delete file from Firebase Storage:', storageErr);
        }
      }

      // 3. Log Activity
      await addDoc(collection(db, 'activityLogs'), {
        userUID: adminProfile?.uid || 'unknown',
        role: adminProfile?.role || 'admin',
        action: 'DELETED_GALLERY_IMAGE',
        resource: 'gallery',
        resourceId: img.id,
        timestamp: Date.now()
      }).catch(console.error);
      
      fetchImages();
    } catch (err) {
      console.error('Failed to delete gallery image from database:', err);
      alert('Failed to delete image: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Gallery Management</h2>
          <p className="text-gray-500 text-sm mt-1">Upload and manage hostel photos by category.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white text-sm font-medium"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="relative overflow-hidden inline-block">
            <Button disabled={uploading} leftIcon={<Upload className="w-4 h-4" />}>
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {categories.map(cat => {
          const catImages = images.filter(i => i.category === cat);
          if (catImages.length === 0) return null;
          
          return (
            <div key={cat} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-2">{cat}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {catImages.map(img => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200">
                    <img src={img.url} alt="Gallery" className="w-full h-full object-cover animate-fade-in" />
                    
                    {deletingId === img.id ? (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-2 text-center z-20">
                        <p className="text-white text-xs font-semibold mb-2">Delete photo?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(img)}
                            className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2.5 py-1 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-2 right-2 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setDeletingId(img.id!)}
                          className="p-2 bg-white/95 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-md border border-gray-100 cursor-pointer"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {images.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">No images uploaded yet.</div>
        )}
      </div>
    </div>
  );
}
