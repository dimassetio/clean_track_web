'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserDetail, updateUserDetail } from '@/lib/api';
import { UserType } from '@/types/user_type';
import UserForm from '../../form';
import { toast } from 'react-toastify';

export default function EditUserPage() {
  const [userData, setUserData] = useState<UserType | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserDetail(`${id}`);
      setUserData(res);
    };
    fetchUser();
  }, [id]);

  const handleEdit = async (data: UserType) => {
    if (userData?.id) {
      try {
        setLoading(true);
        await updateUserDetail(userData.id, data);
        router.push('/dashboard/users');
        toast.success('User updated successfully!');
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || 'Failed to update user.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit User</h1>
      <UserForm initialData={userData} onSubmit={handleEdit} isLoading={loading} />
    </div>
  );
}
