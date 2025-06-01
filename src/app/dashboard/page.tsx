'use client';

import DashboardLayout from "@/components/dashboard_layout";
import Loading from "@/components/loading";
import { useAuth } from "@/lib/auth-context";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, userType, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <>
        <div className="flex justify-between py-6 p-4 mb-4 items-end">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-xl">
              Clean Track Dashboard Admin
            </h1>
            <p className="text-gray-600 font-medium">Welcome, {userType?.name}</p>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}
