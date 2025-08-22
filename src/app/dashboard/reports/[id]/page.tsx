'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaBroom, FaBrush, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaRegFileAlt, FaStickyNote, FaUserCircle, FaUserEdit } from "react-icons/fa";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReportType } from '@/types/report_type';
import { getDurationString } from '@/helpers/formatter';
import { UserType, fromFirestoreUser } from '@/types/user_type';
import { getAllOfficer } from '@/lib/api';
import { toast } from 'react-toastify';


export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [report, setReport] = useState<ReportType | null>(null);
  const [openChangeModal, setOpenChangeModal] = useState<boolean>(false);
  const [officers, setOfficers] = useState<UserType[]>([]);
  const getOfficers = async () => {
    try {
      // setLoading(true);
      const response = await getAllOfficer();
      console.log(response);
      setOfficers(response);
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  }
  useEffect(() => {
    getOfficers();
  }, []);
  useEffect(() => {
    const fetchReport = async () => {
      const docRef = doc(db, 'reports', params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const reportData = ReportType.fromFirestore(docSnap);
        // Fetch related user data in parallel
        const [reporterSnap, officerSnap] = await Promise.all([
          reportData.reporterId ? getDoc(doc(db, 'users', reportData.reporterId)) : Promise.resolve(null),
          reportData.officerId ? getDoc(doc(db, 'users', reportData.officerId)) : Promise.resolve(null),
        ]);

        if (reporterSnap && reporterSnap.exists()) {
          reportData.reporter = fromFirestoreUser(reporterSnap);
        }

        if (officerSnap && officerSnap.exists()) {
          reportData.officer = fromFirestoreUser(officerSnap);
        }
        setReport(reportData);
      }
    };
    fetchReport();
  }, [params.id]);

  const updateOfficer = async (selectedOfficer: UserType) => {
    console.log("a");
    if (!report) return;
    console.log("b");
    const reportRef = doc(db, "reports", report?.id!);
    console.log("c");
    setReport({
      ...report,
      officer: selectedOfficer,
      officerId: selectedOfficer.id,
      officerName: selectedOfficer.name,
    });
    await updateDoc(reportRef, {
      OFFICER_ID: selectedOfficer.id,
      OFFICER_NAME: selectedOfficer.name,
      ASSIGNED_AT: new Date(),
    });
    console.log("d");
    toast("Officer Updated Successfully!");
  };

  if (!report) return <div className="p-4">Loading...</div>;

  const statusColor = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Done: 'bg-green-100 text-green-800',
    Canceled: 'bg-red-100 text-red-800',
  }[report.status ?? ''] || 'bg-gray-100 text-gray-800';

  return (
    <div className="p-4 space-y-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center hover:text-primary-3 bg-white shadow rounded-md px-6 py-2"
      >
        <FaArrowLeft className="w-5 h-5 mr-1" />
        Back to Reports
      </button>

      {/* Main Card */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Column 1: User Info */}
        <div className="w-full md:w-1/2 lg:w-2/3">
          {/* Avatar & Info */}
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-1 flex items-center justify-center">
              <FaUserCircle size={28} />
            </div>
            {/* <Image
              src={'/avatar.png'}
              alt="Avatar"
              width={64}
              height={64}
              className="rounded-full object-cover"
            /> */}
            <div>
              <p className="font-semibold text-lg">{report.reporterName}</p>
              <p className="text-gray-500 text-sm">{report.reporter?.email}</p>
            </div>
          </div>

          {/* Status & Date */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className={`px-3 py-1 rounded-full font-medium ${statusColor}`}>
              {report.status}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <FaCalendarAlt className="w-4 h-4" />
              {(report.createdAt)?.toLocaleString()}
            </span>
          </div>

          {
            report.doneAt && (
              <div className="flex items-center gap-3 text-sm mt-2 md:mt-3">
                <FaCalendarAlt className="w-4 h-4 text-primary-3" />
                <span className='text-gray-500'>
                  Completed At: {(report.doneAt)?.toLocaleString()}
                </span>
              </div>
            )
          }

          {/* Address */}
          <div className="my-4 md:my-6 flex items-center gap-3 text-gray-700">
            <FaMapMarkerAlt className="w-4 h-4 text-primary-3" />
            <span>{report.address}</span>
          </div>

          {/* Description */}
          <div className="mb-4 md:mb-6 flex items-center gap-3 text-gray-700">
            <FaRegFileAlt className="w-4 h-4 text-primary-3" />
            <div>
              <p className="font-medium text-gray-500 text-sm">Description</p>
              <p className="text-gray-800">{report.reporterDescription}</p>
            </div>
          </div>
          {report.officerId &&
            <div className="bg-primary-1 shadow rounded-lg p-4 flex flex-col gap-4 relative">
              {/* Header with action button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-700 font-semibold">
                  <FaBroom className="w-5 h-5 text-primary-3" />
                  <span>Assigned Cleaner</span>
                </div>
                <button
                  onClick={() => { setOpenChangeModal(true) }}
                  disabled={!!report.startedAt}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium shadow
                      ${report.startedAt
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary-3 text-white hover:bg-primary-2 active:scale-95 transition"}
                  `}
                >
                  <FaUserEdit className="w-4 h-4" />
                  Change
                </button>
              </div>

              {/* Cleaner Info */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-1 flex items-center justify-center">
                  <FaUserCircle size={28} />
                </div>
                <div>
                  <p className="font-semibold text-lg">{report.officerName}</p>
                  <p className="text-gray-500 text-sm">{report.officer?.email}</p>
                </div>
              </div>

              {/* Assigned & Duration */}
              <div className="flex items-center gap-3 text-sm">
                <FaCalendarAlt className="w-4 h-4 text-primary-3" />
                <span className='text-gray-500'>
                  Assigned At: {(report.assignedAt)?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center gap-3 text-sm">
                <span className='text-gray-500 flex items-center gap-3'>
                  <FaCalendarAlt className="w-4 h-4 text-primary-3" />
                  Task Started At: {(report.startedAt)?.toLocaleString()}
                </span>
                {report.startedAt && report.doneAt &&
                  <span className='text-gray-500 flex items-center gap-3'>
                    <FaClock className="w-4 h-4 text-primary-3" />
                    Task Duration: {getDurationString(report.startedAt, report.doneAt)}
                  </span>
                }
              </div>

              {/* Officer's Note */}
              <div className="flex items-center gap-3 text-gray-700">
                <FaStickyNote className="w-4 h-4 text-primary-3" />
                <div>
                  <p className="font-medium text-gray-500 text-sm">{`Cleaner's Note`}</p>
                  <p className="text-gray-800">{report.officerNote}</p>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Column 2: Photo + Map */}
        <div className="space-y-4 w-full md:w-1/2 lg:w-1/3">
          {/* Reporter Photo with Overlay Label */}
          <div className="relative w-full h-60 rounded-lg overflow-hidden shadow">
            <Image
              src={report.reporterPhoto || '/logo.png'}
              alt="Reporter"
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2 bg-white/80 text-sm text-gray-700 px-3 py-1 rounded-full shadow">
              {`Reporter's Photo`}
            </div>
          </div>

          {/* Embedded Google Map */}
          {report.reporterLocation && (
            <div className="w-full h-60 rounded-lg overflow-hidden shadow">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${report.reporterLocation.latitude},${report.reporterLocation.longitude}&z=16&output=embed`}
              />
            </div>
          )}

          {
            report.officerBeforePhoto &&
            <div className="relative w-full h-60 rounded-lg overflow-hidden shadow">
              <Image
                src={report.officerBeforePhoto || '/placeholder.jpg'}
                alt="Reporter"
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/80 text-sm text-gray-700 px-3 py-1 rounded-full shadow">
                {`Officer's Initial Photo`}
              </div>
            </div>}

          {Array.isArray(report.officerProgressPhoto) && report.officerProgressPhoto.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.officerProgressPhoto.map((photoUrl: string, index: number) => (
                <div key={index} className="relative w-full h-60 rounded-lg overflow-hidden shadow">
                  <Image
                    src={photoUrl || '/placeholder.jpg'}
                    alt={`Progress Photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/80 text-sm text-gray-700 px-3 py-1 rounded-full shadow">
                    Progress Photo {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {openChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Select Cleaner</h2>

            {/* List of officers */}
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
              {officers.map((officer: any) => (
                <div
                  key={officer.id}
                  className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 shadow-sm"
                >
                  {/* Leading: avatar */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-1 flex items-center justify-center">
                      <FaUserCircle size={24} className="text-gray-600" />
                    </div>
                    {/* Title + Subtitle */}
                    <div>
                      <p className="font-semibold text-gray-800">{officer.name}</p>
                      <p className="text-gray-500 text-sm">{officer.area}</p>
                    </div>
                  </div>

                  {/* Trailing: assign button */}
                  <button
                    onClick={async () => {
                      // TODO: API untuk assign officer ke report
                      await updateOfficer(officer);
                      setOpenChangeModal(false);
                    }}
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary-3 text-white hover:bg-primary-2 active:scale-95 transition"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setOpenChangeModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
