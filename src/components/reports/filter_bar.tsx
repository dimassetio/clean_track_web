"use client";

export type Filters = {
  status: string;
  date: string | null;
  area: string;
};

type FilterBarProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Not Started", value: "Not Started" },
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "Done", value: "Done" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {/* Status Dropdown */}
      <div className="w-full">
        {/* <label className="block text-sm font-medium text-gray-700 mb-1">Status</label> */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="w-full border px-3 py-2  h-10 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="w-full">
        {/* <label className="block text-sm font-medium text-gray-700 mb-1">Date</label> */}
        <input
          type="date"
          value={filters.date ?? ""}
          onChange={(e) => onChange({ ...filters, date: e.target.value })}
          className="w-full border px-3 py-2  h-10 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Area Search */}
      <div className="w-full">
        {/* <label className="block text-sm font-medium text-gray-700 mb-1">Search by Area</label> */}
        <input
          type="text"
          value={filters.area}
          onChange={(e) => onChange({ ...filters, area: e.target.value })}
          placeholder="Search by Area"
          className="w-full border px-3 py-2  h-10 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
