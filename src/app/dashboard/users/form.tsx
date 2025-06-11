'use client';

import { LoadingSpinner } from '@/components/loading';
import { UserType } from '@/types/user_type';
import React, { useState, useEffect } from 'react';

interface Props {
  initialData?: UserType;
  onSubmit: (data: UserType) => void;
  isLoading: boolean;
}

const UserForm: React.FC<Props> = ({ initialData, onSubmit, isLoading }) => {
  const [form, setForm] = useState<UserType>({
    name: '',
    email: '',
    phone: '',
    role: '',
    foto: '',
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md space-y-4">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full border px-3 py-2 rounded"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Role</option>
        <option value="User">User</option>
        <option value="Officer">Officer</option>
        <option value="Administrator">Administrator</option>
      </select>

      <button type="submit" className={`${isLoading ? 'bg-gray-200' : 'bg-primary-3'} text-white px-4 py-2 rounded`}>
        {isLoading ? <LoadingSpinner /> : form.id ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
};

export default UserForm;
