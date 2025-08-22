import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { ReportType } from "@/types/report_type";
import { UserType, fromFirestoreUser, toFirestoreUser } from "@/types/user_type";
import { sendPasswordResetEmail } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export async function getReportDetail(id: string) {
  const docRef = doc(db, "reports", id); // ✅ modular syntax
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return ReportType.fromFirestore(docSnap);
}

export async function getAllAreas() {
  const colQuery = query(collection(db, "areas"), orderBy("name"));
  const snapshot = await getDocs(colQuery)

  return snapshot.docs.map((doc) => doc.id) as string[];
}

export async function getGroupedReportCounts() {
  const reportsRef = collection(db, "reports");

  const [pendingSnap, ongoingSnap, doneSnap] = await Promise.all([
    getCountFromServer(query(reportsRef, where("STATUS", "in", ["Pending"]))),
    getCountFromServer(query(reportsRef, where("STATUS", "in", ["Not Started", "Processing"]))),
    getCountFromServer(query(reportsRef, where("STATUS", "in", ["Done"]))),
  ]);

  return {
    pending: pendingSnap.data().count,
    ongoing: ongoingSnap.data().count,
    done: doneSnap.data().count,
  };
}

export async function getLatestReports(count: number) {
  const reportsRef = collection(db, "reports");

  const snapshot = await getDocs(query(reportsRef, orderBy("CREATED_AT", "desc"), limit(count)));

  const reports = snapshot.docs.map((doc) => ReportType.fromFirestore(doc)) as ReportType[];

  return reports;
}

export async function getAllUsers() {
  const userRef = collection(db, 'users');
  const snapshot = await getDocs(query(userRef, orderBy("NAME", "desc")));

  const users = snapshot.docs.map((doc) => fromFirestoreUser(doc));

  return users;
}

export async function getAllOfficer() {
  const userRef = collection(db, 'users');
  const snapshot = await getDocs(query(userRef, where("ROLE", "==", "Officer")));

  const users = snapshot.docs.map((doc) => fromFirestoreUser(doc));

  return users;
}

export async function getUserDetail(id: string) {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return fromFirestoreUser(docSnap);
}

export async function updateUserDetail(id: string, data: UserType) {
  const docRef = doc(db, "users", id);

  try {
    await updateDoc(docRef, toFirestoreUser(data));
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}

export async function updateProfile(id: string, data: any) {
  const docRef = doc(db, "users", id);

  try {
    if (data.foto && data.foto instanceof File) {
      // Upload foto ke Firebase Storage
      const storageRef = ref(storage, `users/${id}/${data.foto.name}`);
      await uploadBytes(storageRef, data.foto);

      // Dapatkan URL download foto
      const fotoUrl = await getDownloadURL(storageRef);

      // Ganti data.foto dengan URL
      data.FOTO = fotoUrl;

    }
    // Hapus properti foto yang masih berupa File agar tidak error saat updateDoc
    delete data.foto;

    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}


export async function addUser(data: UserType) {
  try {
    const docRef = await addDoc(collection(db, "users"), toFirestoreUser(data));
    return docRef.id; // returns the auto-generated ID
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
}

// export async function createUserServer(email: string, password: string, data: UserType) {
//   try {
//     // 1. Create user in Firebase Authentication via Admin SDK
//     const userRecord = await adminAuth.createUser({
//       email,
//       password,
//     });
//     const uid = userRecord.uid;

//     // 2. Create Firestore document with same UID
//     await setDoc(doc(db, "users", uid), toFirestoreUser(data));

//     return { success: true, uid };
//   } catch (error) {
//     console.error("Error creating user on server:", error);
//     return { success: false, error };
//   }
// }

export async function deleteUser(id: string) {
  try {
    const docRef = doc(db, "users", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}

export async function sendResetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Reset password error:', error.message);
    return { success: false, error: error.message };
  }
}
