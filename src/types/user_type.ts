import { DocumentSnapshot, Timestamp } from "firebase/firestore";

// Define the TypeScript interface for User data
export interface UserType {
  id?: string;        // Document ID
  role?: string;      // User role
  email?: string;     // Email address
  name?: string;      // Name
  phone?: string;      // Name
  foto?: string;       // User Photo
  lat?: number;       // User Photo
  lng?: number;       // User Photo
  area?: string;       // User Photo
}

// Convert a User object to Firestore-compatible format
export function toFirestoreUser(user: UserType): Record<string, any> {
  return {
    NAME: user.name,
    EMAIL: user.email,
    PHONE: user.phone,
    ROLE: user.role,
    FOTO: user.foto,
    LAT: user.lat,
    LNG: user.lng,
    AREA: user.area,
  };
}

// Convert a Firestore document snapshot to User
export function fromFirestoreUser(snapshot: DocumentSnapshot<any>): UserType {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    name: data.NAME,
    email: data.EMAIL,
    phone: data.PHONE,
    role: data.ROLE,
    foto: data.FOTO,
    lat: data.LAT,
    lng: data.LNG,
    area: data.AREA,
  };
}
