"use client";
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, getCountFromServer, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import DeleteConfirmation from '@/components/ui/delete-confirmation';
import ReactPaginate from 'react-paginate';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      const countSnapshot = await getCountFromServer(collection(db, 'users'));
      setTotalPages(Math.ceil(countSnapshot.data().count / pageSize));
      
      const q = query(
        collection(db, 'users'),
        orderBy('createdAt'),
        limit(pageSize),
        startAfter(currentPage * pageSize)
      );
      try {
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleDelete = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(user => user.id !== userId));
      setDeleteUserId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteUserId(user.id)}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmation
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
        onConfirm={() => deleteUserId && handleDelete(deleteUserId)}
      />

<div className='flex justify-end mt-4'>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={({ selected }) => setCurrentPage(selected)}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< Previous"
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
        className="flex justify-end" // Add this line
        />
      </div>
    </div>
  );
} 