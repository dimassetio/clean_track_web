'use client';

import FilterBar, { Filters } from "@/components/reports/filter_bar";
import ReportsTable from "@/components/reports/reports_table";
import useReports from "@/hooks/use_reports";
import { useState } from "react";

export default function ReportsPage() {
  const [filters, setFilters] = useState<Filters>({
    status: "",
    date: null,
    area: "",
  });

  const { reports, loading, currentPage, goToPage, hasNextPage, hasPrevPage } = useReports(filters);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <FilterBar filters={filters} onChange={setFilters} />
      <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
        <div className="flex justify-between items-center pb-6">
          <h3 className="font-semibold text-lg">All Reports</h3>
        </div>
        <ReportsTable data={reports} loading={loading} />
        <div className="flex justify-end mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!hasPrevPage}
            className="px-4 py-2 text-sm bg-gray-200 rounded  border border-gray-300 mx-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 text-sm bg-gray-200 rounded  border border-gray-300 mx-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
