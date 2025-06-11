// hooks/useReports.ts

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Filters } from "@/components/reports/filter_bar";
import { ReportType } from "@/types/report_type";

const PAGE_SIZE = 10;

export default function useReports(filters: Filters) {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [pageSnapshots, setPageSnapshots] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  const fetchReports = async (page: number) => {
    setLoading(true);
    let baseQuery = query(collection(db, "reports"), orderBy("CREATED_AT", "desc"));

    if (filters.status) {
      baseQuery = query(baseQuery, where("STATUS", "==", filters.status));
    }

    if (filters.date) {
      const selectedDate = new Date(filters.date);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
      baseQuery = query(
        baseQuery,
        where("CREATED_AT", ">=", startOfDay),
        where("CREATED_AT", "<=", endOfDay)
      );
    }

    let finalQuery = baseQuery;

    if (page > 1 && pageSnapshots[page - 2]) {
      finalQuery = query(baseQuery, startAfter(pageSnapshots[page - 2]), limit(PAGE_SIZE));
    } else {
      finalQuery = query(baseQuery, limit(PAGE_SIZE));
    }

    const snapshot = await getDocs(finalQuery);
    const newDocs = snapshot.docs.map((doc) => ReportType.fromFirestore(doc)) as ReportType[];

    if (snapshot.docs.length > 0) {
      const newPageSnapshots = [...pageSnapshots];
      newPageSnapshots[page - 1] = snapshot.docs[snapshot.docs.length - 1];
      setPageSnapshots(newPageSnapshots);
      setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
    }

    setReports(newDocs);
    setCurrentPage(page);
    setLoading(false);
  };

  useEffect(() => {
    setPageSnapshots([]);
    fetchReports(1);
  }, [filters]);

  return {
    reports,
    loading,
    currentPage,
    goToPage: fetchReports,
    hasPrevPage: currentPage > 1,
    hasNextPage: reports.length === PAGE_SIZE,
  };
}
