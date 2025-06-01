import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserType, fromFirestoreUser } from "@/types/user_type";

export async function signInAndGetUser(email: string, password: string) {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Fetch user document from Firestore
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = fromFirestoreUser(userDoc);

      console.log(userData)
      if (userData.role !== "Administrator") {
        throw new Error("Access denied: not an Admin.");
      }

      return {
        authUser: userCredential.user,
        firestoreUser: userData,
      };
    } else {
      throw new Error("User document not found.");
      // handle non-existing user
    }
  } catch (error) {
    throw new Error(`Sign-in failed: ${error}`);
  }
}
