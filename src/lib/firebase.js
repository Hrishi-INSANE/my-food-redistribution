// Import Firebase core + services
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBVdqV7mYm-HAed4YIQ9wjMrOF7zi-2GtA",
  authDomain: "foodshare-cda96.firebaseapp.com",
  projectId: "foodshare-cda96",
  storageBucket: "foodshare-cda96.firebasestorage.app",
  messagingSenderId: "296725914605",
  appId: "1:296725914605:web:835a61b71fa83fc3ccbde4"
};

// ✅ Prevent multiple app initialization (important for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);