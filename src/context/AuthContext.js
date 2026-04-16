'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Email Signup
  const signupEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Email Login
  const loginEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Google Login (works for both login + signup)
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // ✅ Logout
  const logOut = () => signOut(auth);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
    try {
      if (authUser) {
        setUser(authUser);

        const userRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: authUser.email,
            role: null,
            createdAt: serverTimestamp()
          });
          setRole(null);
        } else {
          setRole(userDoc.data().role ?? null);
        }

      } else {
        setUser(null);
        setRole(null);
      }

    } catch (error) {
      console.error("Firestore error:", error);

      // 🔥 IMPORTANT FALLBACK
      setRole(null); // prevents infinite loading
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading, 
        setRole,// ✅ expose loading (important)
        signupEmail,
        loginEmail,
        googleSignIn,
        logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);