import { DocumentSnapshot, GeoPoint, Timestamp } from "firebase/firestore";
import { UserType } from "./user_type";

export class ReportType {
  id?: string;
  status?: string;
  reporterId?: string;
  reporterName?: string;
  reporterLocation?: GeoPoint;
  area?: string;
  address?: string;
  officerId?: string;
  officerName?: string;
  reporterDescription?: string;
  reporterPhoto?: string;
  officerBeforePhoto?: string;
  officerProgressPhoto?: string[];
  officerLastLocation?: GeoPoint;
  officerNote?: string;
  taskDuration?: number;
  createdAt?: Date;
  assignedAt?: Date;
  startedAt?: Date;
  doneAt?: Date;
  updatedAt?: Date;

  reporter?: UserType;
  officer?: UserType;

  static fromFirestore(snapshot: DocumentSnapshot): ReportType {
    const data = snapshot.data() || {};

    return {
      id: snapshot.id,
      status: data.STATUS,
      reporterId: data.REPORTER_ID,
      reporterName: data.REPORTER_NAME,
      reporterLocation: data.REPORTER_LOCATION as GeoPoint,
      area: data.AREA,
      address: data.ADDRESS,
      officerId: data.OFFICER_ID,
      officerName: data.OFFICER_NAME,
      reporterDescription: data.REPORTER_DESCRIPTION,
      reporterPhoto: data.REPORTER_PHOTO,
      officerBeforePhoto: data.OFFICER_BEFORE_PHOTO,
      officerProgressPhoto: data.OFFICER_PROGRESS_PHOTO ?? [],
      officerLastLocation: data.OFFICER_LAST_LOCATION as GeoPoint,
      officerNote: data.OFFICER_NOTE,
      taskDuration: data.TASK_DURATION,
      createdAt: data.CREATED_AT instanceof Timestamp ? data.CREATED_AT.toDate() : data.CREATED_AT,
      assignedAt: data.ASSIGNED_AT instanceof Timestamp ? data.ASSIGNED_AT.toDate() : data.ASSIGNED_AT,
      startedAt: data.STARTED_AT instanceof Timestamp ? data.STARTED_AT.toDate() : data.STARTED_AT,
      doneAt: data.DONE_AT instanceof Timestamp ? data.DONE_AT.toDate() : data.DONE_AT,
      updatedAt: data.UPDATED_AT instanceof Timestamp ? data.UPDATED_AT.toDate() : data.UPDATED_AT,
    };
  }

  static toFirestore(report: ReportType): Record<string, any> {
    return {
      STATUS: report.status,
      REPORTER_ID: report.reporterId,
      REPORTER_NAME: report.reporterName,
      REPORTER_LOCATION: report.reporterLocation,
      AERA: report.area,
      ADDRESS: report.address,
      OFFICER_ID: report.officerId,
      OFFICER_NAME: report.officerName,
      REPORTER_DESCRIPTION: report.reporterDescription,
      REPORTER_PHOTO: report.reporterPhoto,
      OFFICER_BEFORE_PHOTO: report.officerBeforePhoto,
      OFFICER_PROGRESS_PHOTO: report.officerProgressPhoto ?? [],
      OFFICER_LAST_LOCATION: report.officerLastLocation,
      OFFICER_NOTE: report.officerNote,
      TASK_DURATION: report.taskDuration,
      CREATED_AT: report.createdAt ?? new Date(),
      ASSIGNED_AT: report.assignedAt ?? null,
      STARTED_AT: report.startedAt ?? null,
      DONE_AT: report.doneAt ?? null,
      UPDATED_AT: report.updatedAt ?? new Date(),
    };
  }
}


// Convert a ReportType object to Firestore-compatible format
export function toFirestoreReport(report: ReportType): Record<string, any> {
  return {
    STATUS: report.status,
    REPORTER_ID: report.reporterId,
    REPORTER_NAME: report.reporterName,
    REPORTER_LOCATION: report.reporterLocation,
    AERA: report.area,
    OFFICER_ID: report.officerId,
    OFFICER_NAME: report.officerName,
    REPORTER_DESCRIPTION: report.reporterDescription,
    REPORTER_PHOTO: report.reporterPhoto,
    OFFICER_BEFORE_PHOTO: report.officerBeforePhoto,
    OFFICER_PROGRESS_PHOTO: report.officerProgressPhoto ?? [],
    OFFICER_LAST_LOCATION: report.officerLastLocation,
    OFFICER_NOTE: report.officerNote,
    TASK_DURATION: report.taskDuration,
    CREATED_AT: report.createdAt ?? new Date(),
    ASSIGNED_AT: report.assignedAt ?? null,
    STARTED_AT: report.startedAt ?? null,
    DONE_AT: report.doneAt ?? null,
    UPDATED_AT: report.updatedAt ?? new Date(),
  };
}

// Convert a Firestore document snapshot to ReportType
export function fromFirestoreReport(snapshot: DocumentSnapshot<any>): ReportType {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    status: data.STATUS,
    reporterId: data.REPORTER_ID,
    reporterName: data.REPORTER_NAME,
    reporterLocation: data.REPORTER_LOCATION as GeoPoint,
    area: data.AREA,
    officerId: data.OFFICER_ID,
    officerName: data.OFFICER_NAME,
    reporterDescription: data.REPORTER_DESCRIPTION,
    reporterPhoto: data.REPORTER_PHOTO,
    officerBeforePhoto: data.OFFICER_BEFORE_PHOTO,
    officerProgressPhoto: data.OFFICER_PROGRESS_PHOTO ?? [],
    officerLastLocation: data.OFFICER_LAST_LOCATION as GeoPoint,
    officerNote: data.OFFICER_NOTE,
    taskDuration: data.TASK_DURATION,
    createdAt: data.CREATED_AT instanceof Timestamp ? data.CREATED_AT.toDate() : data.CREATED_AT,
    assignedAt: data.ASSIGNED_AT instanceof Timestamp ? data.ASSIGNED_AT.toDate() : data.ASSIGNED_AT,
    startedAt: data.STARTED_AT instanceof Timestamp ? data.STARTED_AT.toDate() : data.STARTED_AT,
    doneAt: data.DONE_AT instanceof Timestamp ? data.DONE_AT.toDate() : data.DONE_AT,
    updatedAt: data.UPDATED_AT instanceof Timestamp ? data.UPDATED_AT.toDate() : data.UPDATED_AT,
  };
}
