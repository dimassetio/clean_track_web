'use client';

import Loading from "@/components/loading";
import { useAuth } from "@/lib/auth-context";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth()
  if (loading) {
    return <Loading />
  }
  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-70"></div>
      </div>
    </>
  );
}
