// app/dashboard-layout.tsx
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
        <nav>
          <ul>
            <li className="p-3 hover:bg-primary-1 cursor-pointer flex gap-2 items-center mx-4 my-2 rounded-lg bg-primary-1 text-primary-3">
              <div className="p-2 rounded-md hover:bg-primary-2 bg-primary-1">
                <MdDashboard size={24} />
              </div>
              {!isSidebarCollapsed && 'Dashboard'}
            </li>
            <li className="p-3 hover:bg-primary-1 cursor-pointer flex gap-2 items-center mx-4 my-2 rounded-lg">
              <div className="p-2 rounded-md hover:bg-primary-2 bg-primary-1">
                <MdReport size={24} />
              </div>
              {!isSidebarCollapsed && 'Reports'}
            </li>
            <Link href="/task-management" passHref>
              <li className="p-3 hover:bg-primary-1 cursor-pointer flex gap-2 items-center mx-4 my-2 rounded-lg">
                <div className="p-2 rounded-md hover:bg-primary-2 bg-primary-1">
                  <MdTask size={24} />
                </div>
                {!isSidebarCollapsed && 'Task Management'}
              </li>
            </Link>
            <li className="p-3 hover:bg-primary-1 cursor-pointer flex gap-2 items-center mx-4 my-2 rounded-lg">
              <div className="p-2 rounded-md hover:bg-primary-2 bg-primary-1">
                <MdAnalytics size={24} />
              </div>
              {!isSidebarCollapsed && 'Analytics'}
            </li>
            <li className="p-3 hover:bg-primary-1 cursor-pointer flex gap-2 items-center mx-4 my-2 rounded-lg">
              <div className="p-2 rounded-md hover:bg-primary-2 bg-primary-1">
                <MdPerson size={24} />
              </div>
              {!isSidebarCollapsed && 'Profile'}
            </li>
            <li className="p-3 hover:bg-primary-1 cursor-pointer flex gap-2 items-center mx-4 my-2 rounded-lg">
              <div className="p-2 rounded-md hover:bg-primary-2 bg-primary-1">
                <MdLogout size={24} />
              </div>
              {!isSidebarCollapsed && 'Sign Out'}
            </li>
          </ul>

        </nav>
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
