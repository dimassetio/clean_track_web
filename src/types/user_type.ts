import { DocumentSnapshot, Timestamp } from "firebase/firestore";

// Define the TypeScript interface for User data
export interface UserType {
  id?: string;        // Document ID
  role?: string;      // User role
  email?: string;     // Email address
  name?: string;      // Name
  foto?: string;       // User Photo
}

// Convert a User object to Firestore-compatible format
export function toFirestoreUser(user: UserType): Record<string, any> {
  return {
    NAME: user.name,
    EMAIL: user.email,
    ROLE: user.role,
    FOTO: user.foto,
  };
}

// Convert a Firestore document snapshot to User
export function fromFirestoreUser(snapshot: DocumentSnapshot<any>): UserType {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    name: data.NAME,
    email: data.EMAIL,
    role: data.ROLE,
    foto: data.FOTO,
  };
}
