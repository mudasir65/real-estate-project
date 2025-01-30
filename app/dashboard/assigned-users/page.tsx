"use client";
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, getCountFromServer, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import ReactPaginate from 'react-paginate';

interface Assistant {
  id: string;
  name: string;
  email: string;
}

export default function AssignedUsersPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchAssistants = async () => {
      const countSnapshot = await getCountFromServer(collection(db, 'assistants'));
      setTotalPages(Math.ceil(countSnapshot.data().count / pageSize));
      
      const q = query(
        collection(db, 'assistants'),
        orderBy('createdAt'),
        limit(pageSize),
        startAfter(currentPage * pageSize)
      );
      try {
        const querySnapshot = await getDocs(q);
        const assistantsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Assistant[];
        setAssistants(assistantsData);
      } catch (error) {
        console.error('Error fetching assistants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, [currentPage]);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assistants.map((assistant) => (
            <TableRow key={assistant.id}>
              <TableCell>{assistant.name}</TableCell>
              <TableCell>{assistant.email}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/assigned-users/${assistant.id}`)}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Show Users
                </Button>
              </TableCell>
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