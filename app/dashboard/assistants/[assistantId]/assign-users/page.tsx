"use client";
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckIcon, UserPlusIcon, ArrowLeftIcon, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc, query, orderBy, limit, startAfter, updateDoc, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import ReactPaginate from 'react-paginate';
import '@/app/pagination.css';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function AssignUsersPage({ params }: { params: { assistantId: string } }) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    console.log(currentPage)
    const fetchData = async () => {
      try {
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt'),
          limit(pageSize),
          startAfter(currentPage * pageSize)
        );
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        const userQuery = query(
            collection(db, 'users'),
            orderBy('createdAt'),
          );
          const userSnapshot = await getDocs(userQuery);
        setUsers(usersData);
        setTotalPages(Math.ceil(userSnapshot.size / pageSize));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    try {
      setIsAssigning(true);
      
      // Save to Firestore
      const docRef = doc(db, 'assigned-users', params.assistantId)
      const assignedUsersDoc = await getDoc(docRef);
      if(assignedUsersDoc.exists()){
        const userData = {
            id: assignedUsersDoc.id,
            data:{...assignedUsersDoc.data()}
        }
        if(userData.data.userIds.length > 0){
            await updateDoc(docRef, {
                userIds: arrayUnion(...selectedUsers)
            })
        }
      }else{
        await setDoc(doc(db, 'assigned-users', params.assistantId), {
            userIds: selectedUsers,
            updatedAt: new Date()
        }, { merge: true });
      }
      router.push(`/dashboard/assistants`);
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-12 w-12 animate-spin text-blue-500"/></div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Assign Users to Assistant</h1>
        <Button 
          className="ml-auto"
          onClick={handleAssign}
          disabled={selectedUsers.length === 0 || isAssigning}
        >
          {isAssigning ? (
            <CheckIcon className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <UserPlusIcon className="h-4 w-4 mr-2" />
          )}
          Assign Selected ({selectedUsers.length})
        </Button>
      </div>

      <Table className='bg-white mb-10'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectedUsers.length === users.length}
                onCheckedChange={() => {
                  setSelectedUsers(prev => 
                    prev.length === users.length 
                      ? [] 
                      : users.map(user => user.id)
                  );
                }}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleCheckboxChange(user.id)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
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
      />
    </div>
  );
} 