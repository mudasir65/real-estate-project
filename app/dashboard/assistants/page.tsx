"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { UserPlusIcon, TrashIcon, Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, limit, startAfter, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface Assistant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function AssistantsPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<{id: string, email: string} | null>(null);
  const router = useRouter();

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'assistants'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assistant[];
      
      setAssistants(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error('Error fetching assistants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, [currentPage]);

  const handleDeleteClick = (assistantId: string, email: string) => {
    setSelectedAssistant({ id: assistantId, email });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAssistant) return;
    
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, 'assistants', selectedAssistant.id));
      const user = auth.currentUser;
      if (user) await deleteUser(user);
      await fetchAssistants();
    } catch (error) {
      console.error('Error deleting assistant:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedAssistant(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Assistants</h1>
        <Button asChild>
          <a href="/dashboard/assistants/create">
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Create Assistant
          </a>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assistants.map((assistant, index) => (
            <TableRow key={assistant.id}>
              <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
              <TableCell>{assistant.name}</TableCell>
              <TableCell>{assistant.phone}</TableCell>
              <TableCell>{assistant.email}</TableCell>
              <TableCell>{assistant.role}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/assistants/${assistant?.id}/assign-users`)}>
                  <UserPlusIcon className="h-4 w-4 mr-2"/>
                  Assign User
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(assistant.id, assistant.email)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <TrashIcon className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete {selectedAssistant?.email}?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 