'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginEmail, googleSignIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginEmail(email, password);
      router.replace('/');
    } catch (error) {
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      router.replace('/');
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 p-4">
      <div className="w-full max-w-md">

        {/* Header (fix empty feel) */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
          FoodShare
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Reduce waste. Help people.
        </p>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full border border-gray-200">
          
          <h2 className="text-xl font-bold mb-2 text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Login to continue
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
              {loading ? "Checking..." : "Login"}
            </button>
          </form>

          <div className="my-6 text-center text-gray-500 text-sm">OR</div>

          {/* ✅ FIXED GOOGLE BUTTON */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl font-semibold text-gray-800 hover:bg-gray-100 transition"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-green-600 font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}