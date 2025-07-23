"use client";

import { getAllAreas } from "@/lib/api";
import { useEffect, useState } from "react";

export type AnalyticsFilters = {
  area: string;
  startDate: Date;
  endDate: Date;
};

type AnalyticsFilterProps = {
  filters: AnalyticsFilters;
  onAreaChange: (filters: { area: string }) => void;
  onPeriodChange: (filters: { startDate: Date; endDate: Date }) => void;
  onExport: (format?: string) => void;
};

export default function AnalyticsFilterBar({
  filters,
  onAreaChange,
  onPeriodChange,
  onExport,
}: AnalyticsFilterProps) {
  const [areas, setAreas] = useState<string[]>([]);

  const monthValue = `${filters.startDate.getFullYear()}-${String(
    filters.startDate.getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    getAllAreas().then((value) => setAreas(value));
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month] = e.target.value.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1); // exclusive end (start of next month)
    onPeriodChange({ startDate, endDate });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onAreaChange({ area: e.target.value });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 justify-between">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Area Dropdown */}
        <select
          value={filters.area}
          onChange={handleAreaChange}
          className="border px-3 py-2 h-10 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Areas</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        {/* Month Picker */}
        <input
          type="month"
          value={monthValue}
          onChange={handleDateChange}
          className="border px-3 py-2 h-10 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Export Button */}
      <div className="flex gap-4">

        <button
          onClick={() => onExport('pdf')}
          className="bg-green-600 text-white px-4 py-2 h-10 rounded-md hover:bg-green-700 transition"
        >
          Export to PDF
        </button>
        <button
          onClick={() => onExport('excel')}
          className="bg-green-600 text-white px-4 py-2 h-10 rounded-md hover:bg-green-700 transition"
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}
