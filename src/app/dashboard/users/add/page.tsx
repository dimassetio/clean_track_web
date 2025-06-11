'use client';


import { useRouter } from 'next/navigation';
import UserForm from '../form';
import { UserType } from '@/types/user_type';
import { useState } from 'react';

export default function AddUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleAdd = async (data: UserType) => {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/users');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Add New User</h1>
      <UserForm onSubmit={handleAdd} isLoading={loading} />
    </div>
  );
}
