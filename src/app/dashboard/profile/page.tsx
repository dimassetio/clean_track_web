"use client";

import Loading, { LoadingSpinner } from '@/components/loading';
import { updateProfile } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { userType, loading } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  // State untuk foto baru & preview
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  useEffect(() => {
    if (userType) {
      setName(userType.name || '');
      setEmail(userType.email || '');
      setPhone(userType.phone || '');
      setRole(userType.role || '');
      // Jika ada foto url, set preview awal
      setPhotoPreview(userType.foto || '/logo.png');
    }
  }, [userType]);

  if (loading) return <Loading />;

  // Handle ketika user pilih file gambar baru
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userType?.id) {
      try {
        setIsLoading(true);

        const data: any = {
          NAME: name,
          PHONE: phone,
        };

        if (photoFile) {
          data.foto = photoFile;
        }

        await updateProfile(userType.id, data);

        toast.success('Profile updated successfully!');
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || 'Failed to update profile.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleEdit} className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={photoPreview || '/logo.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-2"
          />

          <label
            htmlFor="photo-upload"
            className="cursor-pointer bg-primary-3 text-white px-4 py-2 rounded shadow hover:bg-primary-4 transition"
          >
            Choose Photo
          </label>

          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          {photoFile && (
            <p className="mt-2 text-sm text-gray-700 truncate max-w-xs">{photoFile.name}</p>
          )}
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

          <button
            type="submit"
            disabled={isLoading}
            className={`${isLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary-3'} text-white px-4 py-2 rounded`}
          >
            {isLoading ? <LoadingSpinner /> : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
