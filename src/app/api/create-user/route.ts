import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, ...userData } = body;

    // 1. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // 2. Add to Firestore
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      // ...userData,
      // email,
      // uid: userRecord.uid
      ID: userRecord.uid,
      EMAIL: email,
      NAME: userData.name,
      PHONE: userData.phone,
      ROLE: userData.role,
      LAT: userData.lat,
      LNG: userData.lng,
      AREA: userData.area,
      IS_ACTIVE: true,
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
