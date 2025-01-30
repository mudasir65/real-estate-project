"use client";
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ReactPaginate from 'react-paginate';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function AssistantUsersPage({ params }: { params: { assistantId: string } }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const assignedDoc = await getDoc(doc(db, 'assigned-users', params.assistantId));
        if (assignedDoc.exists()) {
          const userIds: string[] = assignedDoc.data().userIds || [];
          const usersData = await Promise.all(
            userIds.map(async (userId) => {
              const userDoc = await getDoc(doc(db, 'users', userId));
              return { id: userId, ...userDoc.data() } as User;
            })
          );
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching assigned users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, [params.assistantId]);

  // Client-side pagination for array
  const paginatedUsers = users.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        Back
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-end mt-4'>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={({ selected }) => setCurrentPage(selected)}
        pageRangeDisplayed={5}
        pageCount={2}
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