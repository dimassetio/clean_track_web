import { initializeApp, getApps, getApp, } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD69jTm-nZpPDJNqdAKhKFV_dggkDXCFI4",
  authDomain: "clean-tracker-c3760.firebaseapp.com",
  projectId: "clean-tracker-c3760",
  storageBucket: "clean-tracker-c3760.firebasestorage.app",
  messagingSenderId: "153690740288",
  appId: "1:153690740288:web:5e6a8230c454afdc90f1a5",
  measurementId: "G-V6SCP3GGDZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app);

export {app, auth, db, storage, firebaseConfig}

