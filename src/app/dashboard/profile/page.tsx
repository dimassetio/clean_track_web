"use client";

import Loading from '@/components/loading';
import { useAuth } from '@/lib/auth-context';
import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { userType, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (userType) {
      setName(userType.name || '');
      setEmail(userType.email || '');
      setPhone(userType.phone || '');
      setRole(userType.role || '');
    }
  }, [userType]);

  if (loading) return <Loading />;

  return (
    <div className="p-4 bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        </div>

        {/* Name and Email */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                readOnly
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm text-gray-600">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
              readOnly
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <input
              type="text"
              value={role}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Admin"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
