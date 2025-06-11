"use client";

import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import { useState } from 'react';
import { BiMenuAltLeft } from 'react-icons/bi';
import { MdAnalytics, MdDashboard, MdLogout, MdPerson, MdReport, MdTask } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserMenu from './user_menu';
import Link from 'next/link';
import Sidebar from './sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { userType } = useAuth();


  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-green-50 ">
      {/* Sidebar */}
      <aside
        className={`${isSidebarCollapsed ? 'w-24' : 'w-64'
          } bg-white  shadow-md transition-width duration-300`}
      >
        <div className="p-4 flex items-center gap-2 justify-center">
          <Image
            src="/logo.png"
            alt="Logo Clean Track"
            width={40}
            height={40}
            priority
          />
          <h1 className={`text-xl text-center font-semibold ${isSidebarCollapsed && 'hidden'}`}>
            Clean Track
          </h1>
        </div>
        <hr className="border-t-2 border-gray-300 m-4" />
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between bg-white p-4 shadow ml-0">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md hover:text-primary-2 focus:outline-none focus:ring  ${isSidebarCollapsed ? 'text-primary-3' : ''}`}
          >
            <BiMenuAltLeft size={32} />
          </button>
          <UserMenu />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <ToastContainer />
          {children}
        </main>
      </div>
    </div>
  );
}
