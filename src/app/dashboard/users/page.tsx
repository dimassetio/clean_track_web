'use client';

import { deleteUser, getAllUsers } from '@/lib/api';
import { UserType } from '@/types/user_type';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function UserIndexPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = roleFilter === 'All'
    ? users
    : users.filter(user => user.role === roleFilter);

  const getRoleClass = (role?: string) => {
    switch (role) {
      case 'User':
        return 'bg-green-100 text-green-700';
      case 'Officer':
        return 'bg-yellow-100 text-yellow-700';
      case 'Administrator':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleDelete = async (user: UserType) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        if (user.id!) {
          await deleteUser(user.id!);
          toast.success("User deleted successfully");
          getUsers();
        } else {
          toast.error("User id not found");
        }
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Filter by role */}
        <div className="flex justify-between items-center mb-4">
          <div className="">
            <label className="mr-2 font-medium">Filter by Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border px-3 py-2 rounded-md"
            >
              <option value="All">All</option>
              <option value="User">User</option>
              <option value="Officer">Officer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <Link href={'/dashboard/users/add'} className="bg-primary-3 text-white p-2 px-4 rounded-lg hover:bg-primary-4" >Add User</Link>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (<tr>
                <td colSpan={5} className="border border-gray-300 px-4 py-2 text-center items-center justify-center">
                  Loading..
                </td>
              </tr>) :
                filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.foto ?? '/logo.png'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 border">{user.email}</td>
                      <td className="py-2 px-4 border">{user.phone}</td>
                      <td className="py-2 px-4 border capitalize">
                        <span className={`rounded-full p-1 px-3 text-sm font-medium ${getRoleClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2 justify-center">
                        <Link
                          href={`/dashboard/users/${user.id}/edit`}
                          className="bg-blue-100 rounded p-3 text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(user)}
                          className="bg-red-100 rounded text-red-500 p-3 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
