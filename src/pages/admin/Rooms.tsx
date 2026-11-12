import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { Room, StudentProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRooms() {
  const { adminProfile } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Non-AC',
    capacity: 2,
    monthlyFee: 0,
    status: 'Available'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsSnap, studentsSnap] = await Promise.all([
        getDocs(query(collection(db, 'rooms'), orderBy('roomNumber', 'asc'))),
        getDocs(query(collection(db, 'students')))
      ]);
      
      const roomsList: Room[] = [];
      roomsSnap.forEach((doc) => {
        roomsList.push({ id: doc.id, ...doc.data() } as Room);
      });
      
      const studentsList: StudentProfile[] = [];
      studentsSnap.forEach((doc) => {
        studentsList.push({ id: doc.id, ...doc.data() } as StudentProfile);
      });
      
      setRooms(roomsList);
      setStudents(studentsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'rooms', editingId), {
          ...formData,
        });
        
        await addDoc(collection(db, 'activityLogs'), {
          userUID: adminProfile?.uid,
          role: adminProfile?.role,
          action: 'UPDATED_ROOM',
          resource: 'rooms',
          resourceId: editingId,
          timestamp: Date.now()
        });
      } else {
        const docRef = await addDoc(collection(db, 'rooms'), {
          ...formData,
          occupied: 0,
          available: formData.capacity,
          students: [],
        });
        
        await addDoc(collection(db, 'activityLogs'), {
          userUID: adminProfile?.uid,
          role: adminProfile?.role,
          action: 'CREATED_ROOM',
          resource: 'rooms',
          resourceId: docRef.id,
          timestamp: Date.now()
        });
      }
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error saving room');
    }
  };

  const handleEdit = (room: Room) => {
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity,
      monthlyFee: room.monthlyFee,
      status: room.status
    });
    setEditingId(room.id!);
    setShowForm(true);
  };

  const handleDelete = async (room: Room) => {
    const occupants = getOccupants(room.id!);
    if (occupants.length > 0 || room.occupied > 0) {
      alert('Cannot delete a room that is currently occupied.');
      return;
    }
    setDeletingRoomId(room.id!);
  };

  const confirmDelete = async (roomId: string) => {
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
      setDeletingRoomId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete room.');
    }
  };

  const getOccupants = (roomId: string) => {
    return students.filter(s => s.roomId === roomId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Room Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage hostel rooms, capacity, and assignments.</p>
        </div>
        {!showForm && (
          <Button onClick={() => {
            setEditingId(null);
            setFormData({
              roomNumber: '',
              roomType: 'Non-AC',
              capacity: 2,
              monthlyFee: 0,
              status: 'Available'
            });
            setShowForm(true);
          }} leftIcon={<Plus className="w-4 h-4" />}>
            Create New Room
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 bg-gray-50/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Room' : 'Create Room'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                type="text"
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select 
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full h-[46px] rounded-xl border-gray-300 shadow-sm focus:border-hostel-accent focus:ring-hostel-accent sm:text-sm bg-white border px-3"
                  required
                >
                  <option value="Non-AC">Non-AC</option>
                  <option value="AC">AC</option>
                  <option value="Cooler">Cooler</option>
                </select>
              </div>
              <Input 
                type="number"
                label="Capacity"
                name="capacity"
                value={formData.capacity || ''}
                onChange={handleInputChange}
                min="1" max="10"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full h-[46px] rounded-xl border-gray-300 shadow-sm focus:border-hostel-accent focus:ring-hostel-accent sm:text-sm bg-white border px-3"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Room' : 'Save Room'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : rooms.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No rooms found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Details</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Occupants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map(room => {
                const occupants = getOccupants(room.id!);
                const occupiedCount = occupants.length;
                const availableCount = room.capacity - occupiedCount;
                
                return (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div className="font-bold text-lg text-gray-900">{room.roomNumber}</div>
                      <div className="text-sm text-gray-500">{room.roomType}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{occupiedCount} / {room.capacity}</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">{availableCount} available</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {occupants.length > 0 ? occupants.map(s => (
                          <div key={s.id} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md w-fit">
                            {s.fullName} ({s.rollNumberOrApplicationNumber})
                          </div>
                        )) : <span className="text-sm text-gray-400">Empty</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={room.status === 'Available' ? 'success' : 'warning'}>
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {deletingRoomId === room.id ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => confirmDelete(room.id!)}
                            className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeletingRoomId(null)}
                            className="px-2 py-1 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => handleEdit(room)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={occupiedCount > 0 ? "secondary" : "danger"} 
                            onClick={() => handleDelete(room)}
                            disabled={occupiedCount > 0}
                            title={occupiedCount > 0 ? "Cannot delete occupied room" : "Delete room"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
