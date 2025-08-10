'use client';

import MapPicker from '@/components/google_map';
import { LoadingSpinner } from '@/components/loading';
import { UserType } from '@/types/user_type';
import React, { useState, useEffect } from 'react';

interface Props {
  initialData?: UserType;
  onSubmit: (data: UserType & { password?: string, email?: string }) => Promise<void>;
  isLoading: boolean;
}

const UserForm: React.FC<Props> = ({ initialData, onSubmit, isLoading }) => {
  const [form, setForm] = useState<UserType & { password?: string, lat?: number, lng?: number, area?: string }>({
    name: '',
    email: '',
    phone: '',
    role: '',
    foto: '',
    password: '',
    lat: undefined,
    lng: undefined,
    area: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        password: '', // do not populate password on edit
      });
      disableEmail = true;
    } else {
      disableEmail = false;

    }
  }, [initialData]);

  useEffect(() => {
    if (form.role === 'Officer' && form.lat === undefined && form.lng === undefined) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setForm(prev => ({ ...prev, lat: latitude, lng: longitude }));
          },
          error => {
            console.warn('Geolocation error:', error);
            // Optionally fallback to a default location (e.g., Jakarta)
            setForm(prev => ({ ...prev, lat: -6.2, lng: 106.8 }));
          }
        );
      }
    }
  }, [form.role]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  let disableEmail = false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if editing, remove password so we don't accidentally send empty password
    if (initialData) {
      const { password, ...rest } = form;
      onSubmit(rest);
    } else {
      onSubmit(form);
    }
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
        readOnly={disableEmail}
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

      {/* Only show password field when adding */}
      {!initialData && (
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          required
        />
      )}

      {form.role == 'Officer' && (
        <div className="space-y-4">
          <input
            type="text"
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="Area Name"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex gap-4">
            <input
              type="text"
              name="lat"
              value={form.lat}
              onChange={handleChange}
              placeholder="Latitude"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              name="lng"
              value={form.lng}
              onChange={handleChange}
              placeholder="Longitude"
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="h-64 w-full">
            {/* {form.lat !== undefined && form.lng !== undefined && ( */}
            <MapPicker
              lat={form.lat ?? -6.2}
              lng={form.lng ?? 106.8}
              onSelect={(lat, lng) => setForm(prev => ({ ...prev, lat, lng }))}
            />
            {/* )} */}
          </div>
        </div>
      )}
      <button
        type="submit"
        className={`${isLoading ? 'bg-gray-200' : 'bg-primary-3'} text-white px-4 py-2 rounded`}
      >
        {isLoading ? <LoadingSpinner /> : initialData ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
};

export default UserForm;
