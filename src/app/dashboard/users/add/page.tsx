'use client';


import { useRouter } from 'next/navigation';
import UserForm from '../form';
import { UserType } from '@/types/user_type';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleAdd = async (data: UserType & { email?: string, password?: string }) => {
    const { email, password, ...rest } = data;
    try {
      setLoading(true);
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to create user');
      router.push('/dashboard/users');
      toast.success('User updated successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Add New User</h1>
      <UserForm onSubmit={handleAdd} isLoading={loading} />
    </div>
  );
}
