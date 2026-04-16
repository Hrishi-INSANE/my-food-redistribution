'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Utensils, LogOut, User, LayoutDashboard, Store } from 'lucide-react';

export default function Navbar() {
  const { user, logOut, role, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.replace('/'); // 🔥 go to entry
  };

  // 🔥 Prevent flicker before auth loads
  if (loading) return null;

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-green-600 text-xl italic">
        <Utensils size={24} />
        <span>FoodShare</span>
      </div>
      
      {/* ROLE-AWARE NAV */}
      <div className="flex gap-8 font-medium text-gray-600">

        {role === 'donor' && (
          <Link href="/donor-dashboard" className="flex items-center gap-2 hover:text-green-600">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        )}
        
        {role === 'recipient' && (
          <Link href="/marketplace" className="flex items-center gap-2 hover:text-green-600">
            <Store size={18} />
            Marketplace
          </Link>
        )}

        {role === 'donor' && (
          <Link href="/marketplace" className="hover:text-green-600">
            View Listings
          </Link>
        )}
      </div>

      {/* USER SECTION */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <User size={18} className="text-gray-400" />
              
              <div className="flex flex-col leading-none text-left">
                <span className="text-xs font-bold text-gray-700 capitalize">
                  {role || 'User'}
                </span>

                <span className="text-[10px] text-gray-400 font-medium">
                  {user.displayName || user.email}
                </span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
            </button>

          </div>
        ) : (
          <Link href="/login">
            <button className="bg-green-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-700">
              Sign In
            </button>
          </Link>
        )}
      </div>

    </nav>
  );
}