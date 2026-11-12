import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User, signInWithPopup, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { googleProvider } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { StudentProfile, Admin } from '../types';

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  adminProfile: Admin | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      // Check for Admin and Student (by direct ID) concurrently first
      const adminRef = doc(db, 'admins', currentUser.uid);
      const studentDirectRef = doc(db, 'students', currentUser.uid);
      
      const [adminSnap, studentDirectSnap] = await Promise.all([
        getDoc(adminRef).catch(() => null),
        getDoc(studentDirectRef).catch(() => null)
      ]);

      if (adminSnap && adminSnap.exists()) {
        const adminData = { id: adminSnap.id, ...adminSnap.data() } as Admin;
        // Enforce super_admin rule
        if (currentUser.email === 'prashantgupta9258@gmail.com') {
          adminData.role = 'super_admin';
        } else {
          adminData.role = 'admin';
        }
        setAdminProfile(adminData);
        setStudentProfile(null);
        return;
      }

      // Auto-provision admin for specified email
      if (currentUser.email === 'prashantgupta9258@gmail.com') {
        const newAdmin: Admin = {
          id: currentUser.uid,
          uid: currentUser.uid,
          name: currentUser.displayName || 'Admin',
          email: currentUser.email,
          mobile: '',
          role: 'super_admin',
          photoURL: currentUser.photoURL || '',
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await setDoc(doc(db, 'admins', currentUser.uid), newAdmin);
        setAdminProfile(newAdmin);
        setStudentProfile(null);
        return;
      }

      setAdminProfile(null);

      // If student profile found directly by auth UID, use it
      if (studentDirectSnap && studentDirectSnap.exists()) {
        const studentData = { id: studentDirectSnap.id, ...studentDirectSnap.data() } as StudentProfile;
        setStudentProfile(studentData);
        return;
      }

      // If not found by direct ID, look up by email (in case pre-registered by admin with a random ID)
      const q = query(collection(db, 'students'), where('email', '==', currentUser.email));
      const querySnapshot = await getDocs(q).catch(() => null);

      if (querySnapshot && !querySnapshot.empty) {
        const studentDoc = querySnapshot.docs[0];
        const studentData = { id: studentDoc.id, ...studentDoc.data() } as StudentProfile;
        
        // Ensure UID is mapped
        if (studentData.uid !== currentUser.uid) {
           await updateDoc(studentDoc.ref, { uid: currentUser.uid });
           studentData.uid = currentUser.uid;
        }
        
        setStudentProfile(studentData);
      } else {
        // Quick final check if the doc was created concurrently during signup
        const docRef = doc(db, 'students', currentUser.uid);
        const secondSnap = await getDoc(docRef).catch(() => null);
        if (secondSnap && secondSnap.exists()) {
          const studentData = { id: secondSnap.id, ...secondSnap.data() } as StudentProfile;
          setStudentProfile(studentData);
          return;
        }

        // Auto-create student profile for testing purposes
        const newStudentData: Omit<StudentProfile, 'id'> = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          fullName: currentUser.displayName || 'New Student',
          photoURL: currentUser.photoURL || '',
          accountStatus: 'Active',
          profileCompleted: false,
          fatherName: 'Not Provided',
          mobileNumber: '',
          fatherMobileNumber: '',
          aadhaarNumber: '',
          rollNumberOrApplicationNumber: 'N/A',
          course: 'B.Tech',
          year: '1st Year',
          roomId: '',
          feePlanId: '',
          address: '',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await setDoc(docRef, newStudentData);
        setStudentProfile({ id: currentUser.uid, ...newStudentData } as StudentProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setStudentProfile(null);
      setAdminProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setLoading(true);
        setUser(currentUser);
        await fetchProfile(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setStudentProfile(null);
        setAdminProfile(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      
      // Determine role after fetchProfile, but we can just log a generic login 
      // or we can wait for fetchProfile. Since it happens via onAuthStateChanged,
      // it's easier to log the generic Google Sign-in.
      addDoc(collection(db, 'activityLogs'), {
        userUID: res.user.uid,
        role: 'unknown_at_login',
        action: 'LOG_IN',
        resource: 'auth',
        timestamp: Date.now()
      }).catch(console.error);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const signOut = async () => {
    if (user) {
      await addDoc(collection(db, 'activityLogs'), {
        userUID: user.uid,
        role: adminProfile ? 'admin' : (studentProfile ? 'student' : 'unknown'),
        action: 'LOG_OUT',
        resource: 'auth',
        timestamp: Date.now()
      });
    }
    await firebaseSignOut(auth);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const signUpWithEmail = async (emailStr: string, passwordStr: string, nameStr: string) => {
    const res = await createUserWithEmailAndPassword(auth, emailStr, passwordStr);
    await updateProfile(res.user, { displayName: nameStr });
    
    const newStudentData = {
      uid: res.user.uid,
      email: res.user.email || emailStr,
      fullName: nameStr,
      photoURL: res.user.photoURL || '',
      accountStatus: 'Active',
      profileCompleted: false,
      fatherName: 'Not Provided',
      mobileNumber: '',
      fatherMobileNumber: '',
      aadhaarNumber: '',
      rollNumberOrApplicationNumber: 'N/A',
      course: 'B.Tech',
      year: '1st Year',
      roomId: '',
      feePlanId: '',
      address: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await setDoc(doc(db, 'students', res.user.uid), newStudentData);
    setStudentProfile({ id: res.user.uid, ...newStudentData } as StudentProfile);
    
    await addDoc(collection(db, 'activityLogs'), {
      userUID: res.user.uid,
      role: 'student',
      action: 'SIGN_UP',
      resource: 'auth',
      timestamp: Date.now()
    }).catch(console.error);
  };

  const signInWithEmail = async (emailStr: string, passwordStr: string) => {
    const res = await signInWithEmailAndPassword(auth, emailStr, passwordStr);
    await addDoc(collection(db, 'activityLogs'), {
      userUID: res.user.uid,
      role: 'unknown_at_login',
      action: 'LOG_IN',
      resource: 'auth',
      timestamp: Date.now()
    }).catch(console.error);
  };

  const sendResetEmail = async (emailStr: string) => {
    await sendPasswordResetEmail(auth, emailStr);
  };

  const isAdmin = !!adminProfile;

  return (
    <AuthContext.Provider value={{ 
      user, 
      studentProfile, 
      adminProfile, 
      isAdmin, 
      loading, 
      signInWithGoogle, 
      signOut, 
      refreshProfile,
      signUpWithEmail,
      signInWithEmail,
      sendResetEmail
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
