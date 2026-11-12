import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { Mail, Trash2, CheckCircle2, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import { ContactMessage } from '../../types';

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Read'>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'contactMessages'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: ContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      setMessages(list);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), {
        status: 'Read'
      });
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, status: 'Read' } : msg));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status: 'Read' } : null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
      setMessages(prev => prev.filter(msg => msg.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      setDeletingId(null);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'All') return true;
    return msg.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-hostel-text">Contact Messages</h2>
          <p className="text-gray-500 text-sm mt-1">Manage user inquiries and feedback sent via the public contact form.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex gap-2 mb-4 border-b border-gray-100 pb-3">
              {(['All', 'Pending', 'Read'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    filter === tab
                      ? 'bg-hostel-accent/10 text-hostel-accent font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {tab} Messages
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hostel-accent"></div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <EmptyState
                icon={Mail}
                title="No messages found"
                description={`There are no ${filter.toLowerCase()} messages in the database.`}
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((msg) => (
                      <TableRow 
                        key={msg.id} 
                        className={`cursor-pointer transition-colors ${selectedMessage?.id === msg.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedMessage(msg)}
                      >
                        <TableCell className="font-light text-sm">
                          {new Date(msg.submittedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-gray-900">{msg.name}</div>
                          <div className="text-xs text-gray-500 font-light">{msg.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={msg.status === 'Pending' ? 'warning' : 'success'}>
                            {msg.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2 items-center">
                            {deletingId === msg.id ? (
                              <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-lg border border-red-100">
                                <span className="text-[10px] font-semibold text-red-700 px-1">Delete?</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDelete(msg.id!); }}
                                  className="px-2 py-1 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                                  className="px-2 py-1 bg-gray-500 text-white rounded-md text-xs font-bold hover:bg-gray-600 transition-colors cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <>
                                {msg.status === 'Pending' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id!); }}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                    title="Mark as Read"
                                  >
                                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setDeletingId(msg.id!); }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Message"
                                >
                                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                                </button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>

        {/* Selected Message Detail Panel */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <Card className="p-6 space-y-6 sticky top-6">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-900">Message Details</h3>
                <Badge variant={selectedMessage.status === 'Pending' ? 'warning' : 'success'}>
                  {selectedMessage.status}
                </Badge>
              </div>

              <div className="space-y-4 font-light text-sm text-gray-600 border-b border-gray-100 pb-4">
                <div>
                  <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider mb-1">From</span>
                  <div className="text-gray-900 font-semibold">{selectedMessage.name}</div>
                  <a href={`mailto:${selectedMessage.email}`} className="text-hostel-accent hover:underline flex items-center gap-1 mt-0.5">
                    {selectedMessage.email} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider mb-1">Date Sent</span>
                  <div className="flex items-center gap-1.5 text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(selectedMessage.submittedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-gray-500 block text-xs uppercase tracking-wider mb-2">Message Content</span>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed font-light text-sm max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {selectedMessage.status === 'Pending' && (
                  <Button
                    onClick={() => handleMarkAsRead(selectedMessage.id!)}
                    variant="outline"
                    className="flex-1"
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Mark Read
                  </Button>
                )}
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Regarding Your Inquiry at DEI Boys Hostel`}
                  className="flex-1"
                  onClick={() => {
                    if (selectedMessage.status === 'Pending') {
                      handleMarkAsRead(selectedMessage.id!);
                    }
                  }}
                >
                  <Button
                    className="w-full"
                    leftIcon={<MessageSquare className="w-4 h-4" />}
                    style={{ backgroundColor: '#3385b9' }}
                  >
                    Reply
                  </Button>
                </a>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-64 sticky top-6">
              <Mail className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm">Select a message from the list to view its complete details and compose a response.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
