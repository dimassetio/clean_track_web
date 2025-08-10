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

function toFirestoreValue(value: any): any {
    return value === undefined ? null : value;
}

// Convert a User object to Firestore-compatible format
export function toFirestoreUser(user: UserType): Record<string, any> {
    return {
        NAME: toFirestoreValue(user.name),
        EMAIL: toFirestoreValue(user.email),
        PHONE: toFirestoreValue(user.phone),
        ROLE: toFirestoreValue(user.role),
        FOTO: toFirestoreValue(user.foto),
        LAT: toFirestoreValue(user.lat),
        LNG: toFirestoreValue(user.lng),
        AREA: toFirestoreValue(user.area),
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
