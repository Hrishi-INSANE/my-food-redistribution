'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { user, googleSignIn } = useAuth();
  const router = useRouter();

  // If the user is already logged in, kick them to the dashboard
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await googleSignIn();
      router.push('/'); // Send them home after success
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
        <div className="mb-6 inline-flex p-4 bg-blue-50 text-blue-600 rounded-full">
          <LogIn size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Join the community and start saving food today.</p>
        
        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}