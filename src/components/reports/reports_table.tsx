import { ReportType } from "@/types/report_type";
import Loading from "../loading";
import { FaCheck, FaHourglassHalf, FaTimes } from "react-icons/fa";
import Link from "next/link";

type ReportsTableProps = {
  data: ReportType[];
  loading: boolean;
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

export default function ReportsTable({ data, loading }: ReportsTableProps) {
  if (loading) return <Loading />;

  return (
    <table className="min-w-full text-sm text-left">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Area</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Created At</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
              No reports found.
            </td>
          </tr>
        ) : (
          data.map((report) => {
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
                <td className="px-4 py-2">
                  <Link href={`/dashboard/reports/${report.id}`}>
                    <button className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded text-xs">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
