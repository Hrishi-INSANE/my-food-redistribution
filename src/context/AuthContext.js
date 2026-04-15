'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {getDoc , doc} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword, // New Tool
  signInWithEmailAndPassword    // New Tool
} from 'firebase/auth';

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const signupEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const loginEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
    if (authUser) {
      setUser(authUser);
      // Fetch role immediately
      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      } else {
        setRole(null);
      }
    } else {
      setUser(null);
      setRole(null);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, []);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, googleSignIn, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);