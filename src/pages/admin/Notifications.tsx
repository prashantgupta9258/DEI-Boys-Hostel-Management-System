import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Plus, Trash2, Bell } from 'lucide-react';
import { Notification } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyState } from '../../components/ui/EmptyState';

export default function AdminNotifications() {
  const { adminProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNotificationId, setDeletingNotificationId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetType: 'all' as 'all' | 'student' | 'admin',
    targetUID: '',
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const docs = await getDocs(q);
      const notifs: Notification[] = [];
      docs.forEach(doc => {
        notifs.push({ id: doc.id, ...doc.data() } as Notification);
      });
      setNotifications(notifs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        ...formData,
        isRead: false,
        createdAt: Date.now()
      });
      
      setShowForm(false);
      setFormData({
        title: '',
        message: '',
        targetType: 'all',
        targetUID: '',
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert('Failed to send notification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingNotificationId(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      setDeletingNotificationId(null);
      fetchNotifications();
    } catch (err) {
      console.error(err);
      alert('Failed to delete notification.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Notifications</h2>
          <p className="text-gray-500 text-sm mt-1">Send announcements and alerts.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
            New Notification
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 bg-gray-50/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Send Notification</h3>
            
            <div className="space-y-4">
              <Input 
                type="text"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-hostel-accent focus:ring-hostel-accent sm:text-sm border p-3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select 
                    name="targetType"
                    value={formData.targetType}
                    onChange={handleInputChange}
                    className="w-full h-[46px] rounded-xl border-gray-300 shadow-sm focus:border-hostel-accent focus:ring-hostel-accent sm:text-sm bg-white border px-3"
                  >
                    <option value="all">All Users</option>
                    <option value="student">Specific Student</option>
                    <option value="admin">All Admins</option>
                  </select>
                </div>
                {formData.targetType === 'student' && (
                  <Input 
                    type="text"
                    label="Student UID / Email"
                    name="targetUID"
                    value={formData.targetUID}
                    onChange={handleInputChange}
                    required
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <EmptyState 
            icon={Bell} 
            title="No Notifications" 
            description="You haven't sent any notifications yet."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notification</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map(n => (
                <TableRow key={n.id}>
                  <TableCell>
                    <div className="font-bold text-gray-900">{n.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-md">{n.message}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info" className="capitalize">
                      {n.targetType} {n.targetType === 'student' && `(${n.targetUID})`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{new Date(n.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleTimeString()}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {deletingNotificationId === n.id ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => confirmDelete(n.id!)}
                          className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingNotificationId(null)}
                          className="px-2 py-1 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <Button size="sm" variant="danger" onClick={() => handleDelete(n.id!)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
