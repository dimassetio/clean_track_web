"use client";

import AnalyticsFilterBar from "@/components/analytics/analytics_filter";
import { useReportAnalytics } from "@/hooks/use_analytics";
import { useState } from "react";
import { FaCheckCircle, FaClock, FaMapMarkedAlt, FaRegFileAlt, FaSpinner, FaUserCheck } from "react-icons/fa";
import * as XLSX from "xlsx";

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  });

  const [selectedArea, setSelectedArea] = useState('');

  const { data: areaAnalyticsMap, loading } = useReportAnalytics(filters);

  const selectedData = areaAnalyticsMap[selectedArea];

  function exportAnalyticsToExcel() {
    const rows = Object.entries(areaAnalyticsMap)
      .filter(([area]) => area !== "")
      .map(([area, stats]) => ({
        Area: area,
        "Total Task": stats.totalReports,
        "Completion Rate (%)": stats.completionRate,
        "Average Duration (mins)": stats.avgTaskDuration,
        "Assigned Cleaners": Object.values(stats.activeCleaners).join(", "),
      }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");

    XLSX.writeFile(workbook, "analytics-report.xlsx");
  }

  const loadingSpinner = <FaSpinner className="animate-spin text-primary-3 text-2xl" />;

  return <div className="p-4 space-y-6">
    <h1 className="text-2xl font-semibold">Performance & Analytics</h1>
    <AnalyticsFilterBar
      filters={
        {
          area: selectedArea,
          startDate: filters.startDate,
          endDate: filters.endDate,
        }
      }
      onAreaChange={(data) => setSelectedArea(data.area)}
      onPeriodChange={(data) => setFilters(data)}
      onExport={() => exportAnalyticsToExcel()}
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {/* Total Reports */}
      <div className="w-full bg-white rounded-lg shadow p-4">
        <div className="mb-2 flex items-center gap-3 text-gray-700">
          <FaRegFileAlt className="w-5 h-5 text-primary-3" />
          <p className="font-medium text-gray-500 text-sm">Total Reports</p>
        </div>
        <p className="font-semibold text-gray-800 text-2xl">{loading ? loadingSpinner : (selectedData ? selectedData.totalReports : '0')}</p>
      </div>

      {/* Completion Rate */}
      <div className="w-full bg-white rounded-lg shadow p-4">
        <div className="mb-2 flex items-center gap-3 text-gray-700">
          <FaCheckCircle className="w-5 h-5 text-green-500" />
          <p className="font-medium text-gray-500 text-sm">Completion Rate</p>
        </div>
        <p className="font-semibold text-gray-800 text-2xl">{loading ? loadingSpinner : (selectedData ? `${selectedData.completionRate}%` : '0%')}</p>
      </div>

      {/* Average Task Duration */}
      <div className="w-full bg-white rounded-lg shadow p-4">
        <div className="mb-2 flex items-center gap-3 text-gray-700">
          <FaClock className="w-5 h-5 text-yellow-500" />
          <p className="font-medium text-gray-500 text-sm">Avg Task Duration</p>
        </div>
        <p className="font-semibold text-gray-800 text-2xl">{loading ? loadingSpinner : (selectedData ? `${selectedData.avgTaskDuration} mins` : '-')}</p>
      </div>

      {/* Active Cleaners */}
      <div className="w-full bg-white rounded-lg shadow p-4">
        <div className="mb-2 flex items-center gap-3 text-gray-700">
          <FaUserCheck className="w-5 h-5 text-blue-500" />
          <p className="font-medium text-gray-500 text-sm">Active Cleaners</p>
        </div>
        <p className="font-semibold text-gray-800 text-2xl">{loading ? loadingSpinner : (selectedData ? Object.keys(selectedData.activeCleaners).length : '-')}</p>
      </div>
    </div>
    <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
      <div className="flex justify-between items-center pb-6">
        <h3 className="font-semibold text-lg">Detailed Analytic Data</h3>
      </div>
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Area</th>
            <th className="px-4 py-2">Total Task</th>
            <th className="px-4 py-2">Completion Rate</th>
            <th className="px-4 py-2">Average Duration</th>
            <th className="px-4 py-2">Assigned Cleaner</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(areaAnalyticsMap)
            .filter(([area]) => area !== "")
            .map(([area, stats]) => (
              <tr key={area} className="border-t">
                <td className="px-4 py-2">{area}</td>
                <td className="px-4 py-2">{stats.totalReports}</td>
                <td className="px-4 py-2">{stats.completionRate}%</td>
                <td className="px-4 py-2">{stats.avgTaskDuration} mins</td>
                <td className="px-4 py-2">{Object.values(stats.activeCleaners).join(", ")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
}