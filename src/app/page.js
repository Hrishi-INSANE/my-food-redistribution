'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) return;

    if (role === null) {
      router.replace('/role-selection');
    } else if (role === 'donor') {
      router.replace('/donor-dashboard');
    } else if (role === 'recipient') {
      router.replace('/marketplace');
    }
  }, [user, role, loading, router]);

  // 🔥 Prevent flicker before redirect
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      
      <h1 className="text-4xl font-black mb-4 text-center">
        Food Redistribution
      </h1>

      <p className="text-gray-500 mb-8 text-center max-w-md">
        Reduce waste. Help people. Connect donors with those in need.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-black text-white rounded-xl font-bold"
        >
          Login
        </button>

        <button
          onClick={() => router.push('/signup')}
          className="px-6 py-3 border border-gray-300 rounded-xl font-bold"
        >
          Sign Up
        </button>
      </div>
    </main>
  );
}