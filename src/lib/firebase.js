// 1. Import the specific tools we need from the "firebase" package you installed
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 2. This is your project's "ID Card". It tells Google which database to talk to.
const firebaseConfig = {
  apiKey: "AIzaSyBVdqV7mYm-HAed4YIQ9wjMrOF7zi-2GtA",
  authDomain: "foodshare-cda96.firebaseapp.com",
  projectId: "foodshare-cda96",
  storageBucket: "foodshare-cda96.firebasestorage.app",
  messagingSenderId: "296725914605",
  appId: "1:296725914605:web:835a61b71fa83fc3ccbde4"
};

// 3. This starts the connection "engine"
const app = initializeApp(firebaseConfig);

// 4. This specifically starts the "Database" part of the engine and exports it
// so our other files (like the Form) can use it.
export const db = getFirestore(app);
export const auth = getAuth(app);