import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Admin } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyState } from '../../components/ui/EmptyState';
import { Shield } from 'lucide-react';

export default function AdminAdmins() {
  const { adminProfile } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'admin' as 'admin' | 'super_admin',
    isActive: true,
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'admins'));
      const docs = await getDocs(q);
      const adminList: Admin[] = [];
      docs.forEach(doc => {
        adminList.push({ id: doc.id, ...doc.data() } as Admin);
      });
      setAdmins(adminList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminProfile?.role !== 'super_admin') {
      console.warn("Only Super Admins can manage admins.");
      return;
    }
    
    try {
      if (editingId) {
        // Prevent changing email and role on edit
        const { email, role, ...updateData } = formData;
        await updateDoc(doc(db, 'admins', editingId), {
          ...updateData,
          updatedAt: Date.now()
        });
      } else {
        await addDoc(collection(db, 'admins'), {
          ...formData,
          role: 'admin', // Force role to be admin for new creations
          uid: `pending_${Date.now()}`, // Would be linked on actual auth signup
          photoURL: '',
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
      setShowForm(false);
      setEditingId(null);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      console.error('Error saving admin');
    }
  };

  const handleEdit = (admin: Admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      role: admin.role,
      isActive: admin.isActive
    });
    setEditingId(admin.id!);
    setShowForm(true);
  };

  const handleDelete = async (admin: Admin) => {
    setError(null);
    if (adminProfile?.role !== 'super_admin') {
      setError("Only Super Admins can delete admins.");
      return;
    }
    if (admin.id === adminProfile?.id) {
      setError("You cannot delete your own account.");
      return;
    }
    if (admin.role === 'super_admin' || admin.email === 'prashantgupta9258@gmail.com') {
      setError("You cannot delete a Super Admin account.");
      return;
    }
    
    setDeletingAdminId(admin.id!);
  };

  const confirmDelete = async () => {
    if (!deletingAdminId) return;
    
    try {
      await deleteDoc(doc(db, 'admins', deletingAdminId));
      fetchAdmins();
    } catch (err: any) {
      console.error("Error deleting admin:", err);
      setError(`Failed to delete admin: ${err.message || err}`);
    } finally {
      setDeletingAdminId(null);
    }
  };

  if (adminProfile?.role !== 'super_admin') {
    return (
      <div className="p-8">
        <EmptyState icon={Shield} title="Access Denied" description="You must be a Super Admin to view this page." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Administrators</h2>
          <p className="text-gray-500 text-sm mt-1">Manage admin access and roles.</p>
        </div>
        {!showForm && (
          <Button onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              email: '',
              mobile: '',
              role: 'admin',
              isActive: true,
            });
            setShowForm(true);
          }} leftIcon={<Plus className="w-4 h-4" />}>
            Add Admin
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 bg-gray-50/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Admin' : 'Add Admin'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                type="text"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input 
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={!!editingId}
                className={editingId ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}
              />
              <Input 
                type="tel"
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select 
                  name="role"
                  value="admin"
                  onChange={handleInputChange}
                  className="w-full h-[46px] rounded-xl border-gray-300 shadow-sm focus:border-hostel-accent focus:ring-hostel-accent sm:text-sm bg-gray-100 cursor-not-allowed border px-3 text-gray-500"
                  required
                  disabled
                >
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="focus:ring-hostel-accent h-4 w-4 text-hostel-accent border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active Account
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Admin' : 'Save Admin'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b border-red-100 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No admins found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="font-bold text-gray-900">{admin.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{admin.email}</div>
                    <div className="text-sm text-gray-500">{admin.mobile}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'super_admin' ? 'info' : 'default'}>
                      {admin.role ? admin.role.replace('_', ' ') : 'admin'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.isActive ? 'success' : 'danger'}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(admin)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {admin.role !== 'super_admin' && admin.email !== 'prashantgupta9258@gmail.com' && (
                        <Button 
                          size="sm" 
                          variant="danger" 
                          onClick={() => handleDelete(admin)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {deletingAdminId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this admin account? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeletingAdminId(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
