'use client';
import DashboardLayout from "@/components/dashboard_layout";
import { ReactNode } from "react";

export default function DashboardGroupLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
