import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ReportType } from "@/types/report_type";

export type AnalyticsFilters = {
  startDate: Date;
  endDate: Date;
};

export type AnalyticsData = {
  totalReports: number;
  completionRate: number;
  avgTaskDuration: number;
  activeCleaners: Record<string, string>;
};

export function useReportAnalytics(filters: AnalyticsFilters) {
  const [data, setData] = useState<Record<string, AnalyticsData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);

      const reportsRef = collection(db, "reports");
      const q = query(
        reportsRef,
        where("CREATED_AT", ">=", Timestamp.fromDate(filters.startDate)),
        where("CREATED_AT", "<", Timestamp.fromDate(filters.endDate))
      );

      const snapshot = await getDocs(q);
      const allReports = snapshot.docs.map((doc) => ReportType.fromFirestore(doc));

      const areaMap: Record<string, ReportType[]> = {};

      for (const report of allReports) {
        const area = report.area || "Unknown";
        if (!areaMap[area]) {
          areaMap[area] = [];
        }
        areaMap[area].push(report);
      }

      // Calculate analytics per area
      const analytics: Record<string, AnalyticsData> = {};
      for (const [area, reports] of Object.entries(areaMap)) {
        analytics[area] = calculateAnalytics(reports);
      }

      // Also calculate for all data combined as key ""
      analytics[""] = calculateAnalytics(allReports);

      setData(analytics);
      setLoading(false);
    };

    const calculateAnalytics = (reports: ReportType[]): AnalyticsData => {
      let total = reports.length;
      let completed = 0;
      let totalDuration = 0;
      const cleaners: Record<string, string> = {};

      for (const report of reports) {
        if (report.status === "Done" && report.startedAt && report.doneAt) {
          const duration =
            (report.doneAt.getTime() - report.startedAt.getTime()) / 60000;
          totalDuration += duration;
          completed++;
        }
        if (report.officerId && report.officerName) {
          cleaners[report.officerId!] = report.officerName!;
        }
      }

      const completionRate = total ? (completed / total) * 100 : 0;
      const avgDuration = completed ? totalDuration / completed : 0;

      return {
        totalReports: total,
        completionRate: +completionRate.toFixed(2),
        avgTaskDuration: +avgDuration.toFixed(1),
        activeCleaners: cleaners,
      };
    };

    fetchAnalytics();
  }, [filters]);

  return { data, loading };
}
