'use client';

import { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { userType } = useAuth();
  const router = useRouter();

  // Toggle popup menu
  const toggleMenu = () => {
    setOpen(!open);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sign Out function
  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <div
        className="flex items-center space-x-4 mx-4 cursor-pointer"
        onClick={toggleMenu}
      >
        <div className="w-10 h-10 rounded-full bg-primary-1 flex items-center justify-center">
          <FaUserCircle size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{userType?.name}</span>
          <span className="text-xs text-gray-500">{userType?.email}</span>
        </div>
        <FaCaretDown />
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
