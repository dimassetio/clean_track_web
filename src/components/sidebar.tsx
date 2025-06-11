'use client';

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
  MdDashboard,
  MdReport,
  MdTask,
  MdAnalytics,
  MdPerson,
  MdLogout,
  MdGroup,
} from "react-icons/md";
import clsx from "clsx";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: MdDashboard },
    { label: "Reports", href: "/dashboard/reports", icon: MdReport },
    { label: "Task Management", href: "/dashboard/task-management", icon: MdTask },
    { label: "Analytics", href: "/dashboard/analytics", icon: MdAnalytics },
    { label: "Users", href: "/dashboard/users", icon: MdGroup },
    { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
  ];

  const handleLogOut = async () => {
    if (confirm("Are you sure to log out from this app?")) {
      await signOut(auth);
      redirect('/login');
    }
  }

  return (
    <nav>
      <ul>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href} className="mx-4 my-2 rounded-lg">
              <Link
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 p-3 rounded-lg transition-colors",
                  isActive ? "bg-primary-1 text-primary-4" : "hover:bg-primary-1"
                )}
              >
                <div
                  className={clsx(
                    "p-2 rounded-md",
                    isActive ? "bg-primary-2" : "bg-primary-1 hover:bg-primary-2"
                  )}
                >
                  <Icon size={24} />
                </div>
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          );
        })}

        {/* Logout Action */}
        <li onClick={() => handleLogOut()} className="p-3 hover:bg-primary-1 cursor-pointer flex gap-2 items-center mx-4 my-2 rounded-lg">
          <div className="p-2 rounded-md hover:bg-primary-2 bg-primary-1">
            <MdLogout size={24} />
          </div>
          {!isSidebarCollapsed && "Sign Out"}
        </li>
      </ul>
    </nav>
  );
}
