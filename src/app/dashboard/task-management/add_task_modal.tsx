'use client';

import { useEffect, useState } from "react";
import { getDocs, collection, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ReportType, fromFirestoreReport } from "@/types/report_type"; // make sure to define this interface

export default function AddTaskModal({ officer, onClose }: {
  officer: any,
  onClose: () => void
}) {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const q = query(collection(db, "reports"), where("STATUS", "==", "Pending"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => fromFirestoreReport(doc)) as [];
      setReports(data);
      setLoading(false);
    };

    fetchReports();
  }, []);

  const handleAssign = async () => {
    if (!selectedReport) return;
    const reportRef = doc(db, "reports", selectedReport.id!);
    await updateDoc(reportRef, {
      STATUS: "Not Started",
      OFFICER_ID: officer.userId,
      OFFICER_NAME: officer.name,
      ASSIGNED_AT: new Date(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Assign Task to Officer: {officer.name}</h2>

        {loading ? (
          <p>Loading reports...</p>
        ) : (

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`flex items-start gap-4 p-4 border rounded-md cursor-pointer transition-all duration-200 ${selectedReport?.id === report.id
                  ? "border-primary-3 bg-primary-1"
                  : "hover:border-primary-2"
                  }`}
              >
                {/* Reporter Photo */}
                <img
                  src={report.reporterPhoto || "/logo.png"}
                  alt={report.reporterName}
                  className="w-12 h-12 rounded-sm object-cover"
                />

                {/* Text Content */}
                <div className="flex flex-col">
                  <p className="font-semibold text-base">{report.reporterName}</p>
                  <p className="text-sm text-gray-600">{report.reporterDescription}</p>
                  <p className="text-xs text-gray-400">
                    {report.createdAt ? report.createdAt.toLocaleString("en", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }) : ""}
                  </p>
                  {/* <p className="text-xs text-gray-400 italic truncate max-w-xs">
                  {address}
                </p> */}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            disabled={!selectedReport}
            onClick={handleAssign}
            className="px-4 py-2 bg-primary-3 text-white rounded disabled:opacity-50"
          >
            Assign Task
          </button>
        </div>
      </div>
    </div>
  );
}
