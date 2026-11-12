import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Bell, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Notification } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import SEO from '../components/SEO';

export default function Notifications() {
  const { studentProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentProfile) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Firestore composite queries with 'or' are not fully supported in old sdks without a lot of setup, 
        // so we'll fetch both and merge them, then sort
        const qAll = query(collection(db, 'notifications'), where('targetType', '==', 'all'));
        const qStudent = query(
          collection(db, 'notifications'), 
          where('targetType', '==', 'student'),
          where('targetUID', '==', studentProfile.uid)
        );

        const [docsAll, docsStudent] = await Promise.all([getDocs(qAll), getDocs(qStudent)]);
        
        const notifs: Notification[] = [];
        docsAll.forEach(doc => notifs.push({ id: doc.id, ...doc.data() } as Notification));
        docsStudent.forEach(doc => notifs.push({ id: doc.id, ...doc.data() } as Notification));
        
        // Sort by createdAt descending
        notifs.sort((a, b) => b.createdAt - a.createdAt);
        
        setNotifications(notifs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [studentProfile]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO 
        title="Student Notifications | DEI Boys Hostel Agra"
        description="Check your DEI Boys Hostel student notifications. Stay updated on payment requests, administrative announcements, and hostel events."
      />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h2>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <EmptyState 
            icon={Bell} 
            title="No new notifications" 
            description="You're all caught up! Check back later for updates."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(n => (
              <div key={n.id} className="p-6 hover:bg-gray-50 transition-colors flex gap-4">
                <div className={`p-3 rounded-full flex-shrink-0 ${n.isRead ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-lg font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                    {n.title}
                  </h4>
                  <p className="text-gray-600 mt-1">{n.message}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
