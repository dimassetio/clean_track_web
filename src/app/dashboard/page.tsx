'use client';

import Loading, { LoadingSpinner } from "@/components/loading";
import { Filters } from "@/components/reports/filter_bar";
import ReportsTable from "@/components/reports/reports_table";
import useReports from "@/hooks/use_reports";
import { getGroupedReportCounts, getLatestReports } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { ReportType } from "@/types/report_type";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFileAlt, FaSpinner, FaCheckCircle, FaBell, FaHourglassHalf, FaCheck, FaTimes } from "react-icons/fa";

export default function Home() {
  const { user, userType, loading } = useAuth()

  const filters = {
    status: "",
    date: null,
    area: "",
  };

  function getStatusStyles(status: string) {
    switch (status) {
      case "Processing":
        return { icon: <FaHourglassHalf className="text-yellow-600" />, color: "bg-yellow-100 text-yellow-800" };
      case "Done":
        return { icon: <FaCheck className="text-green-600" />, color: "bg-green-100 text-green-800" };
      default:
        return { icon: <FaTimes className="text-red-600" />, color: "bg-red-100 text-red-800" };
    }
  }

  const [data, setData] = useState({
    pending: 0,
    ongoing: 0,
    done: 0,
  });

  const [reports, setReports] = useState<ReportType[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const getData = async () => {
    try {
      setDataLoading(true);
      const res = await getGroupedReportCounts();
      setData(res);
      const resReports = await getLatestReports(10);
      setReports(resReports);
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  if (loading) return <Loading />

  if (!loading && !user) {
    redirect('/login');
  }

  return (
    <div className="">
      <div className="flex justify-between py-6 p-4 mb-4 items-end">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-xl">
            Welcome, {userType?.name}!
          </h1>
          <p className="text-gray-600 font-medium">Here's an overview of your reports and tasks </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* New Reports */}
        <div className="w-full bg-red-500 rounded-lg shadow pl-1">
          <div className="w-full bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-500 text-sm">New Reports</p>
              <p className="font-semibold text-gray-800 text-2xl">{dataLoading ? <LoadingSpinner /> : data.pending}</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
              <FaBell className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="w-full bg-yellow-500 rounded-lg shadow pl-1">
          <div className="w-full bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-500 text-sm">In Progress</p>
              <p className="font-semibold text-gray-800 text-2xl">{dataLoading ? <LoadingSpinner /> : data.ongoing}</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100">
              <FaSpinner className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="w-full bg-green-500 rounded-lg shadow pl-1">
          <div className="w-full bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-500 text-sm">Completed</p>
              <p className="font-semibold text-gray-800 text-2xl">{dataLoading ? <LoadingSpinner /> : data.done} </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
              <FaCheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>
      {/* REPORTS */}
      <div className="overflow-x-auto rounded-lg shadow bg-white p-4 mt-6">
        <div className="flex justify-between items-center pb-6">
          <h3 className="font-semibold text-lg">Latest Reports</h3>
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Area</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                const { icon, color } = getStatusStyles(report.status ?? '');
                return (
                  <tr key={report.id} className="border-t">
                    <td className="px-4 py-2 font-mono text-gray-600">{report.id?.slice(0, 4)}...</td>
                    <td className="px-4 py-2">{report.area}</td>
                    <td className="px-4 py-2">{report.reporterDescription}</td>
                    <td className="px-4 py-2">
                      {new Date(report.createdAt as Date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                        {icon}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div >
  );
}
