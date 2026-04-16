'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signupEmail, googleSignIn } = useAuth();
  const router = useRouter();

  // 🔹 Email Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await signupEmail(email, password);

      // 🔥 Centralized routing
      router.replace('/');

    } catch (err) {
      alert("Signup failed: " + err.message);
    }
  };

  // 🔹 Google Signup
  const handleGoogleSignup = async () => {
    try {
      await googleSignIn();

      // 🔥 Same flow as login
      router.replace('/');

    } catch (err) {
      alert("Google signup failed: " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">

        {/* Header */}
        <h1 className="text-3xl font-black text-gray-900 text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Join and start redistributing food
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-900 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-100"></span>
          </div>
          <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase">
            Or
          </span>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}