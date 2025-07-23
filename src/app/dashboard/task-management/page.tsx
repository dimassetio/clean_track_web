'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import Loading from '@/components/loading';
import DashboardLayout from '@/components/dashboard_layout';
import AddTaskModal from './add_task_modal';
import { redirect } from 'next/navigation';

interface OfficerTaskSummary {
  userId: string;
  name: string;
  totalToday: number;
  completed: number;
  inProcess: number;
  lastCompletedAt: Timestamp | null;
  lastArea: String;
  area: String;
  lat: number | null;
  lng: number | null;
}

export default function TaskManagementPage() {
  const { loading, user } = useAuth();
  const [data, setData] = useState<OfficerTaskSummary[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const openAssignTaskModal = (user: any) => {
    setSelectedOfficer(user);
  };

  const closeAssignTaskModal = (shouldReload = false) => {
    setSelectedOfficer(null);
    if (shouldReload) {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      redirect('/login');
      return;
    }

    async function fetchData() {
      setLoadingData(true);

      // Get officers
      const userQuery = query(collection(db, 'users'), where('ROLE', '==', 'Officer'));
      const userSnap = await getDocs(userQuery);

      // Prepare date boundaries for today
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const results: OfficerTaskSummary[] = [];

      for (const userDoc of userSnap.docs) {
        const userId = userDoc.id;
        const name = userDoc.data().NAME || '-';
        const area = userDoc.data().AREA || '-';
        const lat = userDoc.data().LAT || null;
        const lng = userDoc.data().LNG || null;

        // Query tasks for this user created today
        const tasksQuery = query(
          collection(db, 'reports'),
          where('OFFICER_ID', '==', userId),
          where('ASSIGNED_AT', '>=', Timestamp.fromDate(startOfDay)),
          where('ASSIGNED_AT', '<', Timestamp.fromDate(endOfDay)),
        );
        const tasksSnap = await getDocs(tasksQuery);

        const tasks = tasksSnap.docs.map(doc => doc.data());

        // Count statuses
        const totalToday = tasks.length;
        const completed = tasks.filter(t => t.STATUS === 'Done').length;
        const inProcess = tasks.filter(t => t.STATUS === 'Processing').length;

        // Get last completed task
        const completedTasks = tasks
          .filter(t => t.STATUS === 'Done' && t.DONE_AT)
          .sort((a, b) => b.DONE_AT.seconds - a.DONE_AT.seconds);

        // const lastCompletedTask = completedTasks.length > 0 ?  completedTasks[0] : null;
        const lastCompletedAt = completedTasks.length > 0 ? completedTasks[0].DONE_AT : null;
        const lastArea = completedTasks.length > 0 ? completedTasks[0].AREA : '-';
        results.push({
          userId,
          name,
          totalToday,
          completed,
          inProcess,
          lastCompletedAt,
          lastArea,
          area,
          lat,
          lng,
        });
      }

      setData(results);
      setLoadingData(false);
    }

    fetchData();
  }, [user]);

  if (loading || loadingData) return <Loading />;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Task Management</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Officer Name</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Area</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Total Tasks Today</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Completed Tasks</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Tasks In Process</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Last Completed Task</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No officers found or no tasks available today.
              </td>
            </tr>
          )}
          {data.map((officer) => (
            <tr key={officer.userId} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{officer.name}</td>
              <td className="border border-gray-300 px-4 py-2">{officer.area}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{officer.totalToday}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{officer.completed}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{officer.inProcess}</td>
              <td className="border border-gray-300 px-4 py-2">
                {officer.lastCompletedAt
                  ? new Date(officer.lastCompletedAt.seconds * 1000).toLocaleString()
                  : '-'}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => openAssignTaskModal(officer)}
                  className="bg-primary-3 hover:bg-primary-4 text-white px-3 py-1 rounded-md text-sm"
                >
                  Add Task
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOfficer && (
        <AddTaskModal officer={selectedOfficer} onClose={closeAssignTaskModal} />
      )}
    </div>

  );
}
