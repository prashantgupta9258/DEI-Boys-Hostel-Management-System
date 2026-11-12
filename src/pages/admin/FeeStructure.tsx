import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, doc, orderBy, deleteDoc } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Plus, Edit2, Check, X, Trash2 } from 'lucide-react';
import { FeeStructure } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminFeeStructure() {
  const { adminProfile } = useAuth();
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingFeeId, setDeletingFeeId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    feeMonth: 'January',
    feeYear: new Date().getFullYear().toString(),
    monthlyFee: 0,
    securityDeposit: 0,
    lateFee: 0,
    dueDate: '',
    isActive: true,
    description: ''
  });

  const fetchFees = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'feeStructures'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const feeList: FeeStructure[] = [];
      querySnapshot.forEach((doc) => {
        feeList.push({ id: doc.id, ...doc.data() } as FeeStructure);
      });
      setFees(feeList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'feeStructures', editingId), {
          ...formData,
          updatedAt: Date.now()
        });
        
        await addDoc(collection(db, 'activityLogs'), {
          userUID: adminProfile?.uid,
          role: adminProfile?.role,
          action: 'UPDATED_FEE_STRUCTURE',
          resource: 'feeStructures',
          resourceId: editingId,
          timestamp: Date.now()
        });
      } else {
        const docRef = await addDoc(collection(db, 'feeStructures'), {
          ...formData,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        
        await addDoc(collection(db, 'activityLogs'), {
          userUID: adminProfile?.uid,
          role: adminProfile?.role,
          action: 'CREATED_FEE_STRUCTURE',
          resource: 'feeStructures',
          resourceId: docRef.id,
          timestamp: Date.now()
        });
      }
      setShowForm(false);
      setEditingId(null);
      fetchFees();
    } catch (err) {
      console.error(err);
      alert('Error saving fee structure');
    }
  };

  const handleEdit = (fee: FeeStructure) => {
    setFormData({
      feeMonth: fee.feeMonth,
      feeYear: fee.feeYear,
      monthlyFee: fee.monthlyFee,
      securityDeposit: fee.securityDeposit,
      lateFee: fee.lateFee,
      dueDate: fee.dueDate,
      isActive: fee.isActive,
      description: fee.description
    });
    setEditingId(fee.id!);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeletingFeeId(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'feeStructures', id));
      setDeletingFeeId(null);
      fetchFees();
    } catch (err) {
      console.error(err);
      alert('Failed to delete fee structure.');
    }
  };

  const toggleStatus = async (fee: FeeStructure) => {
    if (fee.id) {
      await updateDoc(doc(db, 'feeStructures', fee.id), {
        isActive: !fee.isActive,
        updatedAt: Date.now()
      });
      fetchFees();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Fee Structure</h2>
          <p className="text-gray-500 text-sm mt-1">Manage monthly fees and due dates.</p>
        </div>
        {!showForm && (
          <Button onClick={() => {
            setEditingId(null);
            setFormData({
              feeMonth: 'January',
              feeYear: new Date().getFullYear().toString(),
              monthlyFee: 0,
              securityDeposit: 0,
              lateFee: 0,
              dueDate: '',
              isActive: true,
              description: ''
            });
            setShowForm(true);
          }} leftIcon={<Plus className="w-4 h-4" />}>
            Create New Fee Session
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 bg-gray-50/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit' : 'Create'} Fee Session</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fee Month</label>
                <select 
                  name="feeMonth"
                  value={formData.feeMonth}
                  onChange={handleInputChange}
                  className="w-full h-[46px] rounded-xl border-gray-300 shadow-sm focus:border-hostel-accent focus:ring-hostel-accent sm:text-sm bg-white border px-3"
                  required
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <Input 
                type="number"
                label="Fee Year"
                name="feeYear"
                value={formData.feeYear}
                onChange={handleInputChange}
                min="2020" max="2030"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                type="number"
                label="Monthly Hostel Fee (₹)"
                name="monthlyFee"
                value={formData.monthlyFee || ''}
                onChange={handleInputChange}
                required
              />
              <Input 
                type="number"
                label="Security Deposit (₹) (Optional)"
                name="securityDeposit"
                value={formData.securityDeposit || ''}
                onChange={handleInputChange}
              />
              <Input 
                type="number"
                label="Late Fee (₹) (Optional)"
                name="lateFee"
                value={formData.lateFee || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                type="date"
                label="Due Date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
              <div className="flex items-center mt-8">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="focus:ring-hostel-accent h-4 w-4 text-hostel-accent border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (Visible to Students)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-hostel-accent focus:ring-hostel-accent sm:text-sm border p-3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Session' : 'Save Session'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : fees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No fee structures found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Fee Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map(fee => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{fee.feeMonth} {fee.feeYear}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-hostel-text">₹{fee.monthlyFee}</div>
                    {(fee.securityDeposit > 0 || fee.lateFee > 0) && (
                       <div className="text-xs text-gray-500">
                         {fee.securityDeposit > 0 && `Sec: ₹${fee.securityDeposit} `}
                         {fee.lateFee > 0 && `Late: ₹${fee.lateFee}`}
                       </div>
                    )}
                  </TableCell>
                  <TableCell>{fee.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={fee.isActive ? 'success' : 'default'} className="cursor-pointer" onClick={() => toggleStatus(fee)}>
                      {fee.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {deletingFeeId === fee.id ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => confirmDelete(fee.id!)}
                          className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingFeeId(null)}
                          className="px-2 py-1 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(fee)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(fee.id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
