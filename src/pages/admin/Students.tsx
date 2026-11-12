import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Download, Plus, X, Trash2 } from 'lucide-react';
import { StudentProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx';

import { Room, FeeStructure } from '../../types';

export default function AdminStudents() {
  const { adminProfile } = useAuth();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    mobileNumber: '',
    fatherMobileNumber: '',
    email: '',
    aadhaarNumber: '',
    rollNumberOrApplicationNumber: '',
    course: '',
    year: '',
    roomId: '',
    address: '',
    feePlanId: '',
    accountStatus: 'Active',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsSnap, roomsSnap, feesSnap] = await Promise.all([
        getDocs(query(collection(db, 'students'))),
        getDocs(query(collection(db, 'rooms'))),
        getDocs(query(collection(db, 'feeStructures')))
      ]);
      
      const studentsList: StudentProfile[] = [];
      studentsSnap.forEach(doc => studentsList.push({ id: doc.id, ...doc.data() } as StudentProfile));
      
      const roomsList: Room[] = [];
      roomsSnap.forEach(doc => roomsList.push({ id: doc.id, ...doc.data() } as Room));
      
      const feesList: FeeStructure[] = [];
      feesSnap.forEach(doc => feesList.push({ id: doc.id, ...doc.data() } as FeeStructure));
      
      setStudents(studentsList);
      setRooms(roomsList);
      setFeeStructures(feesList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const studentData = {
        uid: '', // Will be set when student logs in
        ...formData,
        photoURL: '',
        profileCompleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const docRef = await addDoc(collection(db, 'students'), studentData);
      
      await addDoc(collection(db, 'activityLogs'), {
        userUID: adminProfile?.uid || 'admin',
        role: adminProfile?.role || 'admin',
        action: 'CREATED_STUDENT',
        resource: 'students',
        resourceId: docRef.id,
        timestamp: Date.now()
      });
      
      setShowAddModal(false);
      setFormData({
        fullName: '',
        fatherName: '',
        mobileNumber: '',
        fatherMobileNumber: '',
        email: '',
        aadhaarNumber: '',
        rollNumberOrApplicationNumber: '',
        course: '',
        year: '',
        roomId: '',
        address: '',
        feePlanId: '',
        accountStatus: 'Active',
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteDoc(doc(db, 'students', studentId));
      
      await addDoc(collection(db, 'activityLogs'), {
        userUID: adminProfile?.uid || 'admin',
        role: adminProfile?.role || 'admin',
        action: 'DELETED_STUDENT',
        resource: 'students',
        resourceId: studentId,
        timestamp: Date.now()
      });
      
      setDeletingStudentId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete student');
    }
  };

  const exportExcel = () => {
    if (students.length === 0) return;
    const dataToExport = students.map(s => {
      const room = rooms.find(r => r.id === s.roomId);
      const fee = feeStructures.find(f => f.id === s.feePlanId);
      return {
        'Full Name': s.fullName,
        'Email': s.email,
        'Roll Number': s.rollNumberOrApplicationNumber,
        'Course': s.course,
        'Year': s.year,
        'Room': room ? room.roomNumber : 'Unassigned',
        'Fee Plan': fee ? `${fee.feeMonth} ${fee.feeYear}` : 'None',
        'Status': s.accountStatus,
        'Profile Complete': (s.profileCompleted && s.roomId) ? 'Yes' : 'No'
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Hostel_Students.xlsx");
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumberOrApplicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Students Directory</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and view all enrolled hostel students.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="secondary" onClick={exportExcel} leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>Add Student</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search students by name, roll number, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="mb-0"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading students...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">No students found.</TableCell>
              </TableRow>
            ) : filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-hostel-accent/10 text-hostel-accent flex items-center justify-center font-bold text-xs overflow-hidden">
                      {student.photoURL ? (
                        <img src={student.photoURL} alt={student.fullName} className="w-full h-full object-cover" />
                      ) : (
                        student.fullName ? student.fullName.charAt(0).toUpperCase() : '?'
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block">{student.fullName}</span>
                      <span className="text-xs text-gray-500">{student.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{student.rollNumberOrApplicationNumber}</TableCell>
                <TableCell className="text-gray-500">{student.course} ({student.year})</TableCell>
                <TableCell className="font-medium">
                  {rooms.find(r => r.id === student.roomId)?.roomNumber || 'Unassigned'}
                </TableCell>
                <TableCell>
                  <Badge variant={student.accountStatus === 'Active' ? 'success' : 'danger'}>
                    {student.accountStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={(student.profileCompleted && student.roomId) ? 'success' : 'warning'}>
                    {(student.profileCompleted && student.roomId) ? 'Complete' : 'Incomplete'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {deletingStudentId === student.id ? (
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => handleDeleteStudent(student.id!)}
                        className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeletingStudentId(null)}
                        className="px-2 py-1 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeletingStudentId(student.id!)}
                        title="Delete Student"
                      >
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-xl font-bold">Add New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input required name="fullName" value={formData.fullName} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <Input required type="email" name="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
                  <Input required name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <Input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Mobile Number *</label>
                  <Input required type="tel" name="fatherMobileNumber" value={formData.fatherMobileNumber} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number *</label>
                  <Input required name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll / Application Number *</label>
                  <Input required name="rollNumberOrApplicationNumber" value={formData.rollNumberOrApplicationNumber} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                  <select required name="course" value={formData.course} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white">
                    <option value="">Select Course</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="BBA">BBA</option>
                    <option value="MBA">MBA</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select required name="year" value={formData.year} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white">
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Assignment *</label>
                  <select required name="roomId" value={formData.roomId} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white">
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>{room.roomNumber} ({room.roomType})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Plan *</label>
                  <select required name="feePlanId" value={formData.feePlanId} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white">
                    <option value="">Select Fee Plan</option>
                    {feeStructures.map(fee => (
                      <option key={fee.id} value={fee.id}>{fee.feeMonth} {fee.feeYear} - ₹{fee.monthlyFee}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Status *</label>
                  <select required name="accountStatus" value={formData.accountStatus} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Student'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
