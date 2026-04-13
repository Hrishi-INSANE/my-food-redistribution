'use client';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Utensils, HeartHandshake } from 'lucide-react';

export default function RoleSelection() {
  const { user } = useAuth();
  const router = useRouter();

const selectRole = async (role) => {
  try {
    // 1. Save to Firestore [cite: 211, 215]
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: role,
      createdAt: new Date()
    });
    
    // 2. Hard refresh to force the app to see the new role 
    window.location.href = role === 'donor' ? '/' : '/marketplace'; 
  } catch (error) {
    console.error("Error saving role:", error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How would you like to help?</h1>
        <p className="text-gray-500 mb-12 text-lg">Select your primary role to get started.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Donor Option */}
          <button 
            onClick={() => selectRole('donor')}
            className="group bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-green-500 transition-all text-left"
          >
            <div className="bg-green-100 text-green-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Utensils size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">I am a Donor</h3>
            <p className="text-gray-500">I want to list surplus food from my restaurant or store.</p>
          </button>

          {/* Recipient Option */}
          <button 
            onClick={() => selectRole('recipient')}
            className="group bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-blue-500 transition-all text-left"
          >
            <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <HeartHandshake size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">I am a Recipient</h3>
            <p className="text-gray-500">I am looking for food donations for myself or an organization.</p>
          </button>
        </div>
      </div>
    </div>
  );
}