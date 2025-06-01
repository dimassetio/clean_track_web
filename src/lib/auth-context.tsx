'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { UserType, fromFirestoreUser } from '@/types/user_type';

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setUserType: (data: UserType | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = fromFirestoreUser(docSnap);
            setUserType(userData);
          } else {
            setUserType(null);
          }
          setLoading(false);
        });

        // Clean up Firestore listener when user logs out
        return () => {
          unsubscribeUserDoc();
        };
      } else {
        setUserType(null);
        setLoading(false);
      }
    });

    // Clean up Auth listener
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userType, loading, setUser, setUserType }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
